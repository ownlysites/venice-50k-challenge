import { NextRequest, NextResponse } from "next/server";

/**
 * INTAKE STUB
 *
 * Wires:
 *   - DBC contact create (POST /contacts) — tags: ownly_venice_50k, ownly_source_landing
 *       env: DBC_PIT_TOKEN, DBC_LOCATION_ID (DBC = DREAMS Business Cloud / GHL whitelabel)
 *   - Quo SMS to Dave — env: QUO_API_KEY, QUO_FROM_NUMBER, OWNLY_DAVE_PHONE
 *   - Confirmation email (transactional) — env: RESEND_API_KEY or SMTP_*
 *
 * For now this logs, no-ops integrations when env missing, and returns 200.
 * Drop in real wiring after first deploy.
 */

type IntakeBody = {
  name?: string;
  email?: string;
  phone?: string;
  business?: string;
  city?: string;
  source?: string;
};

export async function POST(req: NextRequest) {
  let body: IntakeBody;
  try {
    body = (await req.json()) as IntakeBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { name, email, phone, business, city } = body;
  if (!name || !email || !business) {
    return NextResponse.json({ ok: false, error: "Missing required fields." }, { status: 422 });
  }

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
        },
        body: JSON.stringify({
          locationId: process.env.DBC_LOCATION_ID,
          firstName: name.split(" ")[0],
          lastName: name.split(" ").slice(1).join(" ") || "—",
          email,
          phone: phone ?? "",
          companyName: business,
          city: city ?? "Venice",
          state: "FL",
          source: "venice50kchallenge.com",
          tags: ["ownly_venice_50k", "ownly_source_landing"],
        }),
      }).catch((err) => console.error("DBC contact create failed", err)),
    );
  } else {
    console.log("[intake] DBC env missing — skipping contact create");
  }

  // ─── Quo SMS to Dave ──────────────────────────────────────────────────
  if (process.env.QUO_API_KEY && process.env.OWNLY_DAVE_PHONE) {
    const sms = `NEW VENICE WAGER — ${name}, ${business}, ${phone ?? "no phone"}`;
    tasks.push(
      fetch("https://api.quo.com/messages", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.QUO_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: process.env.OWNLY_DAVE_PHONE,
          from: process.env.QUO_FROM_NUMBER ?? process.env.OWNLY_DAVE_PHONE,
          body: sms,
        }),
      }).catch((err) => console.error("Quo SMS failed", err)),
    );
  } else {
    console.log("[intake] Quo env missing — skipping SMS to Dave");
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
          subject: "The Venice wager — your 15-minute slot is held.",
          html: `<div style="font-family:Georgia,serif;font-size:18px;line-height:1.6;color:#0F1F39;max-width:560px;margin:0 auto;padding:32px 24px;background:#FDFCF8;">
            <p style="font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.22em;color:#8B7044;">★ THE VENICE WAGER · CONFIRMED</p>
            <h1 style="font-family:Georgia,serif;font-weight:500;font-size:36px;line-height:1.1;margin:24px 0 8px;">Your fifteen minutes <em style="color:#B8965A;">is held.</em></h1>
            <hr style="border:0;height:1px;background:rgba(184,150,90,0.35);margin:24px 0;" />
            <p>${name.split(" ")[0]},</p>
            <p>Thanks for taking the dare. We&rsquo;ll run the diagnostic on <strong>${business}</strong> in the next 48 hours and surface every credit, funding line, expense leak, and AI move we can find.</p>
            <p>If we can&rsquo;t surface at least $50,000 you didn&rsquo;t already know about — your next coffee in Venice is on me.</p>
            <p style="margin-top:32px;">— Dave Ivery</p>
            <p style="font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.18em;color:#5A6B82;text-transform:uppercase;">OWNLY ONCE LLC · 941-277-9876 · DAVID@OWNLY1NCE.COM</p>
          </div>`,
        }),
      }).catch((err) => console.error("Resend email failed", err)),
    );
  } else {
    console.log("[intake] RESEND_API_KEY missing — skipping confirmation email");
  }

  await Promise.allSettled(tasks);

  return NextResponse.json({
    ok: true,
    next: "https://app.mplannerpro.com/abce1ffefc/chat?pg=69539a14a3",
  });
}
