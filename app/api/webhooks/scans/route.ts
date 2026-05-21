import { NextRequest, NextResponse } from "next/server";
import { base44, findOrCreateContact } from "../../../../lib/base44";

export const runtime = "nodejs";

const SCAN_TYPES = ["business_credit_builder", "ai_gap_audit", "find_my_money"] as const;
type ScanType = (typeof SCAN_TYPES)[number];

function isAuthorized(req: NextRequest): boolean {
  const expected = process.env.SCAN_WEBHOOK_SECRET;
  if (!expected) return true;
  const got = req.headers.get("x-webhook-secret") ?? "";
  return got === expected;
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

  const scan_type = body.scan_type as ScanType;
  if (!SCAN_TYPES.includes(scan_type)) {
    return NextResponse.json({ ok: false, error: "invalid scan_type" }, { status: 400 });
  }

  const email = (body.email as string) ?? undefined;
  const phone = (body.phone as string) ?? undefined;
  const name = (body.name as string) ?? undefined;
  const business = (body.business as string) ?? undefined;

  // DEBUG: log Base44 key state
  console.log("[scans] base44.ready():", base44.ready(), "key len:", (process.env.BASE44_API_KEY || "").length);

  const contact = await findOrCreateContact({
    name,
    business,
    email,
    phone,
    tags: ["ownly_source_scan", `ownly_scan_${scan_type}`],
  });
  console.log("[scans] contact result:", JSON.stringify(contact));

  const scan = await base44.createEntity("Scan", {
    scan_type,
    contact_id: contact.contactId,
    contact_name: name,
    business,
    score: body.score,
    partner_recommendations: body.partner_recommendations ?? [],
    completed_at: body.completed_at ?? new Date().toISOString(),
    raw_results: body.raw_results,
    follow_up_status: "pending",
    external_id: (body.external_id as string) ?? "",
  });
  console.log("[scans] scan result:", JSON.stringify(scan));

  return NextResponse.json({ ok: true, debug: { ready: base44.ready(), contact: contact.error, scan: scan.error, status: scan.status } });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    route: "/api/webhooks/scans",
    types: SCAN_TYPES,
  });
}
