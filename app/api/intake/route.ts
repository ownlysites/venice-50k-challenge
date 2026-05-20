import { NextRequest, NextResponse } from "next/server";

/**
 * Venice $50K Wager — intake handler.
 *
 * Wiring (all integrations are best-effort; missing envs log a warning and continue):
 *   - DBC contact create (POST /contacts) — tags: ownly_venice_50k, ownly_source_landing
 *       env: DBC_PIT_TOKEN, DBC_LOCATION_ID
 *   - Quo SMS to Dave (OpenPhone-derived API) — env: QUO_API_KEY, QUO_FROM_NUMBER, OWNLY_DAVE_PHONE
 *   - Confirmation email — env: RESEND_API_KEY
 *
 * On success returns { ok: true, next: <chat URL> } so the client redirects the user.
 */

export const runtime = "nodejs";

type IntakeBody = {
  name?: string;
  email?: string;
  phone?: string;
  business?: string;
  city?: string;
  source?: string;
};

const SCAN_REDIRECT = "https://app.mplannerpro.com/abce1ffefc/chat?pg=69539a14a3";

function digits(s?: string) {
  return (s ?? "").replace(/[^\d+]/g, "");
}

function toE164(phone?: string) {
  if (!phone) return "";
  const d = digits(phone);
  if (d.startsWith("+")) return d;
  if (d.length === 10) return `+1${d}`;
  if (d.length === 11 && d.startsWith("1")) return `+${d}`;
  return d.startsWith("+") ? d : `+${d}`;
}

export async function POST(req: NextRequest) {
  let body: IntakeBody;
  try {
    body = (await req.json()) as IntakeBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim().toLowerCase();
  const business = (body.business ?? "").trim();
  const phone = toE164(body.phone);
  const city = (body.city ?? "Venice").trim() || "Venice";
  const source = (body.source ?? "venice50kchallenge.com").trim();

  if (!name || !email || !business) {
    return NextResponse.json(
      { ok: false, error: "Name, email, and business are required." },
      { status: 422 },
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Invalid email." }, { status: 422 });
  }

  const firstName = name.split(/\s+/)[0];
  const lastName = name.split(/\s+/).slice(1).join(" ") || "—";

  const tasks: Promise<unknown>[] = [];

  // ─── DBC contact create ────────────────────────────────────────────────
  if (process.env.DBC_PIT_TOKEN && process.env.DBC_LOCATION_ID) {
    tasks.push(
      fetch("https://services.leadconnectorhq.com/contacts/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.DBC_PIT_TOKEN}`,
          Version: "2021-07-28",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          locationId: process.env.DBC_LOCATION_ID,
          firstName,
          lastName,
          email,
          phone,
          companyName: business,
          city,
          state: "FL",
          source,
          tags: ["ownly_venice_50k", "ownly_source_landing"],
        }),
      })
        .then(async (r) => {
          if (!r.ok) console.error("[intake] DBC contact failed", r.status, await r.text());
        })
        .catch((err) => console.error("[intake] DBC contact threw", err)),
    );
  } else {
    console.warn("[intake] DBC env missing — skipping contact create");
  }

  // ─── Quo SMS to Dave (OpenPhone-derived REST schema) ─────────────────
  // Auth: `Authorization: <KEY>` (no Bearer). Endpoint: api.openphone.com/v1/messages
  // Payload: { from, to: ["+1..."], content: "..." }
  if (process.env.QUO_API_KEY && process.env.OWNLY_DAVE_PHONE && process.env.QUO_FROM_NUMBER) {
    const sms = `NEW VENICE WAGER · ${name} · ${business} · ${phone || "no phone"} · ${email}`;
    tasks.push(
      fetch("https://api.openphone.com/v1/messages", {
        method: "POST",
        headers: {
          Authorization: process.env.QUO_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.QUO_FROM_NUMBER,
          to: [process.env.OWNLY_DAVE_PHONE],
          content: sms,
        }),
      })
        .then(async (r) => {
          if (!r.ok) console.error("[intake] Quo SMS failed", r.status, await r.text());
        })
        .catch((err) => console.error("[intake] Quo SMS threw", err)),
    );
  } else {
    console.warn("[intake] Quo env missing — skipping SMS to Dave");
  }

  // ─── Confirmation email (Resend) ──────────────────────────────────────
  if (process.env.RESEND_API_KEY) {
    tasks.push(
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Dave Ivery <david@ownly1nce.com>",
          to: email,
          reply_to: "david@ownly1nce.com",
          subject: "The Venice wager — your 15 minutes is held.",
          html: `<div style="font-family:Georgia,serif;font-size:18px;line-height:1.6;color:#0F1F39;max-width:560px;margin:0 auto;padding:32px 24px;background:#FDFCF8;">
            <p style="font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.22em;color:#8B7044;">★ THE VENICE WAGER · CONFIRMED</p>
            <h1 style="font-family:Georgia,serif;font-weight:500;font-size:36px;line-height:1.1;margin:24px 0 8px;">Your fifteen minutes <em style="color:#B8965A;">is held.</em></h1>
            <hr style="border:0;height:1px;background:rgba(184,150,90,0.35);margin:24px 0;" />
            <p>${firstName},</p>
            <p>Thanks for taking the dare. We&rsquo;ll run the diagnostic on <strong>${business}</strong> in the next 48 hours and surface every credit, funding line, expense leak, and AI move we can find.</p>
            <p>If we can&rsquo;t surface at least $50,000 you didn&rsquo;t already know about — your next coffee in Venice is on me.</p>
            <p style="margin-top:32px;">— Dave Ivery</p>
            <p style="font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.18em;color:#5A6B82;text-transform:uppercase;">OWNLY ONCE LLC · 941-277-9876 · DAVID@OWNLY1NCE.COM</p>
          </div>`,
        }),
      })
        .then(async (r) => {
          if (!r.ok) console.error("[intake] Resend failed", r.status, await r.text());
        })
        .catch((err) => console.error("[intake] Resend threw", err)),
    );
  } else {
    console.warn("[intake] RESEND_API_KEY missing — skipping confirmation email");
  }

  await Promise.allSettled(tasks);

  return NextResponse.json({ ok: true, next: SCAN_REDIRECT });
}
