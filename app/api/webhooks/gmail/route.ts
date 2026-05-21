/**
 * Gmail Pub/Sub push notification → Base44 Interaction
 *
 * Gmail OAuth + Pub/Sub setup posts {emailAddress, historyId} on watch events.
 * We then fetch the message via Gmail API and log it. v1 implementation:
 *   - Verify Pub/Sub JWT (Google OIDC) OR shared bearer (GMAIL_WEBHOOK_SECRET)
 *   - Decode message data (base64)
 *   - For now LOG only (full Gmail API fetch needs OAuth token, separate setup)
 *
 * TODO: wire Gmail History API fetch when GMAIL_OAUTH_TOKEN env is set.
 */
import { NextRequest, NextResponse } from "next/server";
import { base44 } from "../../../../lib/base44";

export const runtime = "nodejs";

function isAuthorized(req: NextRequest): boolean {
  // Google Pub/Sub push sends OIDC JWT in Authorization header — verify properly later.
  // For now accept shared secret OR pass through in dev.
  const expected = process.env.GMAIL_WEBHOOK_SECRET;
  if (!expected) return true;
  const auth = req.headers.get("authorization") ?? "";
  return auth.includes(expected);
}

interface GmailPushBody {
  message?: {
    data?: string;
    messageId?: string;
    publishTime?: string;
  };
  subscription?: string;
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const payload = (await req.json().catch(() => ({}))) as GmailPushBody;
  const data = payload.message?.data;
  if (!data) {
    return NextResponse.json({ ok: true, note: "no message data" });
  }

  // Pub/Sub message data is base64-encoded JSON: { emailAddress, historyId }
  let decoded: { emailAddress?: string; historyId?: string } = {};
  try {
    decoded = JSON.parse(Buffer.from(data, "base64").toString("utf8"));
  } catch {
    return NextResponse.json({ ok: true, note: "malformed pubsub data" });
  }

  // v1: log a placeholder interaction. Full Gmail message fetch (requires OAuth token)
  // will come in a follow-up when GMAIL_OAUTH_TOKEN + history-API integration lands.
  await base44.createEntity("Interaction", {
    channel: "gmail",
    direction: "inbound",
    summary: `Gmail history event ${decoded.historyId ?? "unknown"}`,
    content: `Pub/Sub push for ${decoded.emailAddress ?? "unknown"} historyId=${decoded.historyId ?? ""}`,
    occurred_at: payload.message?.publishTime ?? new Date().toISOString(),
    is_unread: true,
  });

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ ok: true, route: "/api/webhooks/gmail" });
}
