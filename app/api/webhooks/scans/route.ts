/**
 * Scan completion webhook → Base44 Scan + Contact upsert
 *
 * One route for all 3 scan types. Caller posts scan_type in body:
 *   - 'business_credit_builder' (ownly-business-credit-builder.vercel.app)
 *   - 'ai_gap_audit'             (ownly-gap-audit.vercel.app)
 *   - 'find_my_money'            (app.mplannerpro.com chat embed)
 *
 * Verify shared SCAN_WEBHOOK_SECRET header. Upsert Contact, create Scan.
 */
import { NextRequest, NextResponse } from "next/server";
import { base44 } from "../../../../lib/base44";

export const runtime = "nodejs";

const ALLOWED_TYPES = new Set(["business_credit_builder", "ai_gap_audit", "find_my_money"]);

function isAuthorized(req: NextRequest): boolean {
  const expected = process.env.SCAN_WEBHOOK_SECRET;
  if (!expected) return true;
  const got = req.headers.get("x-webhook-secret");
  return got === expected;
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const payload = (await req.json().catch(() => ({}))) as Record<string, unknown>;

  const scanType = String(payload.scan_type ?? "");
  if (!ALLOWED_TYPES.has(scanType)) {
    return NextResponse.json({ ok: false, error: `unknown scan_type: ${scanType}` }, { status: 400 });
  }

  const email = String(payload.email ?? "");
  const phone = String(payload.phone ?? "");
  const name = String(payload.name ?? "");
  const business = String(payload.business ?? "");
  const score = typeof payload.score === "number" ? payload.score : undefined;
  const completed = String(payload.completed_at ?? new Date().toISOString());
  const partnerRecs = Array.isArray(payload.partner_recommendations)
    ? (payload.partner_recommendations as string[])
    : [];
  const raw = payload.raw_results ? JSON.stringify(payload.raw_results) : undefined;

  if (!email && !phone && !name) {
    return NextResponse.json({ ok: true, note: "no identifiable lead" });
  }

  // Contact upsert
  const tagMap: Record<string, string> = {
    business_credit_builder: "ownly_scan_business_credit",
    ai_gap_audit: "ownly_scan_gap_audit",
    find_my_money: "ownly_scan_find_my_money",
  };
  const c = await base44.findOrCreateContact({
    name,
    business,
    email,
    phone,
    tags: ["ownly_source_scan", tagMap[scanType]],
  });

  await base44.createEntity("Scan", {
    contact_id: c.contactId ?? undefined,
    contact_name: name || email || "Unknown",
    business,
    scan_type: scanType,
    completed_at: completed,
    score,
    partner_recommendations: partnerRecs,
    follow_up_status: "pending",
    raw_results: raw,
  });

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ ok: true, route: "/api/webhooks/scans", types: [...ALLOWED_TYPES] });
}
