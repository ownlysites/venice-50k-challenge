/**
 * Calendly webhook → Base44 SitDown
 *
 * Calendly fires invitee.created / invitee.canceled events. We:
 *   1. Verify Calendly Webhook Signing Key (HMAC-SHA256 over raw body)
 *   2. Find/create Contact by invitee email
 *   3. Create or update SitDown { prospect_name, business, scheduled_at, calendly_event_id, status }
 *
 * Webhook subscription must be created via Calendly API once with the signing key.
 * Endpoint: POST /webhook_subscriptions (events: invitee.created, invitee.canceled)
 */
import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { base44 } from "../../../../lib/base44";

export const runtime = "nodejs";

function verifyCalendly(rawBody: string, header: string | null): boolean {
  const key = process.env.CALENDLY_WEBHOOK_SIGNING_KEY;
  if (!key || !header) return !key; // no key set = dev/passthrough mode
  // Calendly signature header format: "t=<ts>,v1=<sig>"
  const parts = Object.fromEntries(header.split(",").map((kv) => kv.split("=") as [string, string]));
  const t = parts.t;
  const v1 = parts.v1;
  if (!t || !v1) return false;
  const signed = `${t}.${rawBody}`;
  const expected = crypto.createHmac("sha256", key).update(signed).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(v1), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const sig = req.headers.get("calendly-webhook-signature");
  if (!verifyCalendly(raw, sig)) {
    return NextResponse.json({ ok: false, error: "invalid signature" }, { status: 401 });
  }

  const payload = (() => {
    try {
      return JSON.parse(raw) as Record<string, unknown>;
    } catch {
      return {} as Record<string, unknown>;
    }
  })();

  const event = String(payload.event ?? "");
  const data = (payload.payload as Record<string, unknown> | undefined) ?? {};
  const invitee = (data.invitee as Record<string, unknown> | undefined) ?? data;
  const scheduledEvent = (data.scheduled_event as Record<string, unknown> | undefined) ?? {};

  const email = String(invitee.email ?? "");
  const name = String(invitee.name ?? "");
  const scheduledAt = String(scheduledEvent.start_time ?? data.scheduled_at ?? "");
  const eventUri = String(scheduledEvent.uri ?? data.uri ?? "");
  const calendlyEventId = eventUri.split("/").pop() ?? eventUri;

  if (!email && !calendlyEventId) {
    return NextResponse.json({ ok: true, note: "no identifiable invitee or event" });
  }

  // Find/create contact
  const c = await base44.findOrCreateContact({
    name,
    email,
    tags: ["ownly_source_calendly", "ownly_6fsd_booked"],
  });

  const status = event.includes("canceled") ? "cancelled" : "scheduled";

  // Try to find existing SitDown by calendly_event_id
  const existing = await base44.queryEntity<{ id: string }>("SitDown", { calendly_event_id: calendlyEventId }, 1);

  if (existing.ok && existing.data?.entities?.[0]?.id) {
    // TODO: Base44 update endpoint pattern (PATCH /entities/SitDown/{id}). For v1 we just log.
    return NextResponse.json({ ok: true, note: "sitdown already exists", id: existing.data.entities[0].id });
  }

  await base44.createEntity("SitDown", {
    prospect_name: name || email || "Unknown",
    scheduled_at: scheduledAt,
    contact_id: c.contactId ?? undefined,
    status,
    calendly_event_id: calendlyEventId,
  });

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ ok: true, route: "/api/webhooks/calendly" });
}
