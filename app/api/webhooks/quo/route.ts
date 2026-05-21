/**
 * Quo (OpenPhone) inbound SMS webhook → Base44 Interaction
 *
 * Quo signs each payload with HMAC-SHA256 (header: openphone-signature).
 * Header format: "hmac;1;<timestamp>;<base64-digest>"
 * Signing key = QUO_SIGNING_KEY (base64-encoded, returned at webhook creation).
 * Digest input = `${timestamp}.${rawBody}`.
 */
import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { base44 } from "../../../../lib/base44";

export const runtime = "nodejs";

function verifyQuoSignature(rawBody: string, header: string | null): boolean {
  if (!process.env.QUO_SIGNING_KEY) return true;
  if (!header) return false;
  const parts = header.split(";");
  if (parts.length < 4) return false;
  const [scheme, , ts, providedDigest] = parts;
  if (scheme !== "hmac") return false;
  const signedData = `${ts}.${rawBody}`;
  const keyBuf = Buffer.from(process.env.QUO_SIGNING_KEY, "base64");
  const expected = crypto.createHmac("sha256", keyBuf).update(signedData).digest("base64");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(providedDigest));
  } catch {
    return false;
  }
}

interface QuoEvent {
  id?: string;
  type?: string;
  data?: {
    object?: {
      id?: string;
      from?: string;
      to?: string | string[];
      body?: string;
      text?: string;
      createdAt?: string;
      direction?: string;
    };
  };
}

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const sig = req.headers.get("openphone-signature");
  if (!verifyQuoSignature(raw, sig)) {
    return NextResponse.json({ ok: false, error: "bad signature" }, { status: 401 });
  }

  const evt = JSON.parse(raw || "{}") as QuoEvent;
  const obj = evt.data?.object ?? {};
  const eventType = String(evt.type ?? "");

  const direction = String(obj.direction ?? "").toLowerCase() === "outgoing" || eventType.includes("sent") ? "outbound" : "inbound";
  const phone = direction === "inbound" ? String(obj.from ?? "") : Array.isArray(obj.to) ? String(obj.to[0] ?? "") : String(obj.to ?? "");
  const body = String(obj.body ?? obj.text ?? "");
  const occurred = String(obj.createdAt ?? new Date().toISOString());

  if (!phone) {
    return NextResponse.json({ ok: true, note: "no phone in payload" });
  }

  const c = await base44.findOrCreateContact({
    phone,
    tags: ["ownly_source_quo_sms"],
  });

  await base44.createEntity("Interaction", {
    contact_id: c.contactId ?? undefined,
    channel: "quo_sms",
    direction,
    summary: body.slice(0, 140),
    content: body,
    occurred_at: occurred,
    is_unread: direction === "inbound",
  });

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ ok: true, service: "ownly-base44-ingest", route: "/api/webhooks/quo" });
}
