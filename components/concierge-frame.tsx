"use client";

import { useEffect, useState, useCallback } from "react";
import { FRAME_FRIENDLY_HOSTS } from "@/lib/cta";

type FrameState = { open: boolean; url: string | null; title: string };

export default function ConciergeFrame() {
  const [state, setState] = useState<FrameState>({ open: false, url: null, title: "" });
  const [toast, setToast] = useState<{ url: string } | null>(null);

  const close = useCallback(() => setState((s) => ({ ...s, open: false })), []);

  const handleClick = useCallback(
    (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest?.("[data-frame='modal']") as
        | HTMLAnchorElement
        | null;
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }

      const friendly = FRAME_FRIENDLY_HOSTS.some(
        (h) => url.hostname === h || url.hostname.endsWith("." + h),
      );

      e.preventDefault();

      if (friendly) {
        setState({
          open: true,
          url: url.toString(),
          title: target.getAttribute("data-track") ?? "Ownly ONCE",
        });
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("ownly:frame-open", { detail: { href: url.toString() } }),
          );
        }
      } else {
        window.open(url.toString(), "_blank", "noopener,noreferrer");
        setToast({ url: url.toString() });
        setTimeout(() => setToast(null), 4500);
      }
    },
    [],
  );

  useEffect(() => {
    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true } as never);
  }, [handleClick]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    if (state.open) {
      window.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [state.open, close]);

  return (
    <>
      {/* MODAL FRAME */}
      {state.open && state.url && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Ownly ONCE concierge frame"
          className="fixed inset-0 z-50 flex items-stretch justify-center"
          style={{ background: "rgba(15, 31, 57, 0.72)", backdropFilter: "blur(6px)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div
            className="relative w-full h-full md:m-6 md:rounded-2xl overflow-hidden"
            style={{
              background: "var(--paper-cream)",
              border: "1px solid var(--hairline)",
              maxWidth: 1280,
            }}
          >
            <div
              className="flex items-center justify-between"
              style={{
                height: 52,
                padding: "0 20px",
                borderBottom: "1px solid var(--hairline)",
                background: "var(--paper-cream)",
              }}
            >
              <span className="meta-mono">
                <span className="star-ornament">★</span> OWNLY ONCE <span className="star-ornament">·</span> CONCIERGE
              </span>
              <button
                onClick={close}
                aria-label="Close"
                className="btn-secondary"
                style={{ padding: "6px 14px", fontSize: 12 }}
              >
                Close ×
              </button>
            </div>
            <iframe
              src={state.url}
              title="Ownly ONCE — Concierge"
              className="w-full"
              style={{ height: "calc(100% - 52px)", border: 0, background: "var(--paper-cream)" }}
              allow="clipboard-read; clipboard-write; payment; camera; microphone"
              loading="eager"
            />
          </div>
        </div>
      )}

      {/* TOAST FOR NEW-TAB FALLBACK */}
      {toast && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 hairline-frame"
          style={{
            background: "var(--paper-cream)",
            padding: "14px 18px",
            borderRadius: "var(--radius-sm)",
            maxWidth: 320,
            boxShadow: "0 14px 40px rgba(15,31,57,0.18)",
          }}
        >
          <p className="meta-mono" style={{ color: "var(--gold-dark)", marginBottom: 6 }}>
            <span className="star-ornament">★</span> OPENED IN A NEW TAB
          </p>
          <p style={{ fontSize: 14, color: "var(--ink)", lineHeight: 1.5 }}>
            We opened this in a new tab so it loads correctly. Your Venice wager is still waiting here.
          </p>
        </div>
      )}
    </>
  );
}
