/**
 * Quo (OpenPhone) inbound SMS webhook → Base44 Interaction
 *
 * Quo posts incoming messages here. We:
 *   1. Verify shared secret header (X-Webhook-Secret == QUO_WEBHOOK_SECRET)
 *   2. Find or create Contact by phone
 *   3. Create Interaction { channel: 'quo_sms', direction, summary, content, occurred_at, is_unread: true }
 *
 * Returns 200 always (after auth). Webhook providers retry on non-2xx,
 * so we never block on Base44 latency or errors.
 */
import { NextRequest, NextResponse } from "next/server";
import { base44 } from "../../../../lib/base44";

export const runtime = "nodejs";

function isAuthorized(req: NextRequest): boolean {
  const expected = process.env.QUO_WEBHOOK_SECRET;
  if (!expected) return true; // dev mode: accept all until secret set
  const got = req.headers.get("x-webhook-secret") ?? req.headers.get("x-quo-signature");
  return got === expected;
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const payload = (await req.json().catch(() => ({}))) as Record<string, unknown>;

  // Best-guess Quo payload shape (verify against real Quo webhook docs):
  //   { id, type: 'message.received'|'message.sent', from, to, body, createdAt, contact? }
  const direction = String(payload.type || "").includes("sent") ? "outbound" : "inbound";
  const phone = String(payload.from ?? "");
  const body = String(payload.body ?? "");
  const occurred = String(payload.createdAt ?? new Date().toISOString());
  const externalId = String(payload.id ?? "");

  if (!phone) {
    return NextResponse.json({ ok: true, note: "no phone in payload" });
  }

  // Find/create contact
  const c = await base44.findOrCreateContact({
    phone,
    name: (payload.contact as { name?: string } | undefined)?.name,
    tags: ["ownly_source_quo_sms"],
  });

  // Log interaction
  await base44.createEntity("Interaction", {
    contact_id: c.contactId ?? undefined,
    channel: "quo_sms",
    direction,
    summary: body.slice(0, 140),
    content: body,
    occurred_at: occurred,
    is_unread: direction === "inbound",
  });
  void externalId;

  return NextResponse.json({ ok: true });
}

export async function GET() {
  // Quo's webhook setup pings GET for verification on some configs
  return NextResponse.json({ ok: true, service: "ownly-base44-ingest", route: "/api/webhooks/quo" });
}
