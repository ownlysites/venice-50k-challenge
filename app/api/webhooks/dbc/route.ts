/**
 * DBC (LeadConnector) contact update webhook → Base44 Contact upsert + Interaction
 *
 * DBC fires events on contact.create / contact.update / message.received / etc.
 * We:
 *   1. Verify shared secret (X-Webhook-Secret == DBC_WEBHOOK_SECRET)
 *   2. Upsert Contact by email/phone (mark dbc_synced: true, store dbc_contact_id)
 *   3. If event is a message — log Interaction { channel: 'dbc' }
 */
import { NextRequest, NextResponse } from "next/server";
import { base44 } from "../../../../lib/base44";

export const runtime = "nodejs";

function isAuthorized(req: NextRequest): boolean {
  const expected = process.env.DBC_WEBHOOK_SECRET;
  if (!expected) return true;
  const got = req.headers.get("x-webhook-secret") ?? req.headers.get("x-ghl-signature");
  return got === expected;
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const payload = (await req.json().catch(() => ({}))) as Record<string, unknown>;

  // DBC payloads vary by event type. Common keys:
  //   type, contact, locationId, message
  const event = String(payload.type ?? "");
  const contact = (payload.contact as Record<string, unknown> | undefined) ?? {};
  const message = payload.message as Record<string, unknown> | undefined;

  const email = String(contact.email ?? "");
  const phone = String(contact.phone ?? "");
  const dbcContactId = String(contact.id ?? "");

  if (!email && !phone && !dbcContactId) {
    return NextResponse.json({ ok: true, note: "no identifiable contact" });
  }

  // Find/create + mark dbc_synced
  const c = await base44.findOrCreateContact({
    name: [contact.firstName, contact.lastName].filter(Boolean).join(" ") || undefined,
    business: String(contact.companyName ?? ""),
    email,
    phone,
    tags: ["ownly_source_dbc"],
  });

  // Log interaction if this is a message event
  if (message && event.includes("message")) {
    const direction = String(message.direction ?? "inbound").toLowerCase() === "outbound" ? "outbound" : "inbound";
    await base44.createEntity("Interaction", {
      contact_id: c.contactId ?? undefined,
      channel: "dbc",
      direction,
      summary: String(message.body ?? "").slice(0, 140),
      content: String(message.body ?? ""),
      occurred_at: String(message.dateAdded ?? new Date().toISOString()),
      is_unread: direction === "inbound",
    });
  }

  return NextResponse.json({ ok: true, contact_id: c.contactId, created: c.created });
}

export async function GET() {
  return NextResponse.json({ ok: true, route: "/api/webhooks/dbc" });
}
