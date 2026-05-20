"use client";

import { useCallback, useEffect, useState } from "react";
import { CTA } from "@/lib/cta";

/**
 * Intake gate — intercepts clicks on the scan CTA (data-frame=modal + href=CTA.scan),
 * captures name/email/phone/business/city, POSTs /api/intake, then redirects to the
 * scan URL returned by the server (mplannerpro chat).
 *
 * Mounts BEFORE ConciergeFrame in layout.tsx so its capture-phase listener fires first
 * and stops propagation, preventing the iframe modal from opening with no lead capture.
 *
 * Calendly / gap-audit / credit / dreams CTAs continue to flow into ConciergeFrame
 * because they don't match the scan URL.
 */
export default function IntakeGate() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = useCallback((e: MouseEvent) => {
    const target = (e.target as HTMLElement | null)?.closest?.(
      "[data-frame='modal']",
    ) as HTMLAnchorElement | null;
    if (!target) return;
    const href = target.getAttribute("href");
    if (!href) return;
    if (href !== CTA.scan) return; // only gate the scan CTA

    e.preventDefault();
    e.stopImmediatePropagation();
    setError(null);
    setOpen(true);
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true } as never);
  }, [handleClick]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !submitting) setOpen(false);
    }
    if (open) {
      window.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, submitting]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      business: String(fd.get("business") || "").trim(),
      city: String(fd.get("city") || "").trim() || "Venice",
      source: "venice50kchallenge.com",
    };

    try {
      const r = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await r.json().catch(() => ({}))) as {
        ok?: boolean;
        next?: string;
        error?: string;
      };
      if (!r.ok || !data.ok) {
        setError(data.error || "Something went wrong. Try again or call 941-277-9876.");
        setSubmitting(false);
        return;
      }
      // Redirect to scan
      window.location.href = data.next || CTA.scan;
    } catch (err) {
      console.error("[intake-gate] submit failed", err);
      setError("Connection failed. Try again or call 941-277-9876.");
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="intake-title"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(15,31,57,0.78)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !submitting) setOpen(false);
      }}
    >
      <div
        style={{
          background: "var(--paper-cream, #FDFCF8)",
          color: "var(--ink, #0F1F39)",
          maxWidth: 540,
          width: "100%",
          borderRadius: "var(--radius, 8px)",
          padding: "36px 32px",
          boxShadow:
            "0 32px 64px rgba(15,31,57,0.35), inset 0 0 0 1px rgba(184,150,90,0.4)",
          fontFamily: "Georgia, serif",
          position: "relative",
          maxHeight: "94vh",
          overflowY: "auto",
        }}
      >
        <button
          type="button"
          onClick={() => !submitting && setOpen(false)}
          aria-label="Close"
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            width: 36,
            height: 36,
            borderRadius: 18,
            border: "1px solid rgba(15,31,57,0.15)",
            background: "transparent",
            color: "var(--ink, #0F1F39)",
            cursor: "pointer",
            fontSize: 20,
            lineHeight: 1,
          }}
        >
          ×
        </button>

        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.22em",
            color: "#8B7044",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          ★ The Venice Wager · 15 minutes
        </p>
        <h2
          id="intake-title"
          style={{
            fontFamily: "var(--font-cormorant, Georgia), Georgia, serif",
            fontWeight: 500,
            fontSize: "clamp(28px, 4.2vw, 34px)",
            lineHeight: 1.1,
            margin: "12px 0 6px",
          }}
        >
          Tell me where to send the receipt.
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.55, color: "#5A6B82", margin: "0 0 22px" }}>
          We capture this so I can text and email you the findings. No marketing list. No card.
        </p>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 14 }}>
          <Field label="Your name *" name="name" required autoComplete="name" />
          <Field label="Email *" name="email" type="email" required autoComplete="email" />
          <Field label="Mobile (for the text)" name="phone" type="tel" autoComplete="tel" placeholder="941-555-0123" />
          <Field label="Business name *" name="business" required autoComplete="organization" />
          <Field label="City" name="city" defaultValue="Venice" autoComplete="address-level2" />

          {error && (
            <p style={{ color: "#A52A2A", fontFamily: "Inter, sans-serif", fontSize: 14, margin: 0 }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{
              marginTop: 6,
              padding: "16px 28px",
              background: submitting ? "#8B7044" : "#0F1F39",
              color: "#FDFCF8",
              border: "1px solid #B8965A",
              borderRadius: "var(--radius, 4px)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              cursor: submitting ? "wait" : "pointer",
              transition: "background 0.18s ease",
            }}
          >
            {submitting ? "Holding your slot…" : "Take the dare →"}
          </button>

          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10.5,
              letterSpacing: "0.14em",
              color: "#8B7044",
              textTransform: "uppercase",
              margin: 0,
              textAlign: "center",
            }}
          >
            No card · No login · 15 minutes
          </p>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
  defaultValue,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <label style={{ display: "block" }}>
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10.5,
          letterSpacing: "0.18em",
          color: "#5A6B82",
          textTransform: "uppercase",
          display: "block",
          marginBottom: 6,
        }}
      >
        {label}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "12px 14px",
          fontFamily: "Inter, sans-serif",
          fontSize: 16,
          background: "rgba(255,255,255,0.6)",
          border: "1px solid rgba(15,31,57,0.18)",
          borderRadius: "var(--radius, 4px)",
          color: "#0F1F39",
          outline: "none",
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "#B8965A")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(15,31,57,0.18)")}
      />
    </label>
  );
}
