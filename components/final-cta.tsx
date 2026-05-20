"use client";

import Image from "next/image";
import CtaButton from "./cta-button";
import { CTA } from "@/lib/cta";

export default function FinalCta() {
  return (
    <section
      id="final-cta"
      className="relative section"
      style={{
        background: "var(--paper-warm)",
        borderTop: "1px solid var(--hairline)",
        borderBottom: "1px solid var(--hairline)",
        overflow: "hidden",
      }}
    >
      <Image
        src="/venice/cta-backdrop.avif"
        alt=""
        fill
        sizes="100vw"
        priority={false}
        style={{ objectFit: "cover", opacity: 0.55, zIndex: 0 }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(245,241,232,0.65) 0%, rgba(245,241,232,0.45) 50%, rgba(245,241,232,0.85) 100%)",
          zIndex: 1,
        }}
      />

      <div className="container-narrow text-center relative" style={{ zIndex: 2 }}>
        <span className="eyebrow no-rule">THE WAGER, RESTATED</span>

        <h2 className="font-display mt-8" style={{ fontSize: "clamp(40px, 6vw, 72px)" }}>
          So — are you <em>in?</em>
        </h2>

        <div className="mt-12">
          <CtaButton href={CTA.scan} variant="primary" trackEvent="final_primary">
            I&apos;ll take the 15 minutes →
          </CtaButton>
        </div>

        <p className="meta-mono mt-10">
          <span className="star-ornament">★</span> Coffee&apos;s on me if I lose. Venice merchants only.
        </p>
      </div>
    </section>
  );
}
