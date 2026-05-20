"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import CtaButton from "./cta-button";
import { CTA } from "@/lib/cta";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative"
      style={{
        background: "var(--paper-cream)",
        borderBottom: "1px solid var(--hairline)",
      }}
    >
      <div className="container-editorial grid lg:grid-cols-2 gap-12 lg:gap-16 items-center" style={{ minHeight: "calc(100vh - 56px)", paddingTop: 72, paddingBottom: 96 }}>
        {/* LEFT — DARE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="eyebrow">
            <span className="star-ornament">★</span> A WAGER FROM DAVE IVERY <span className="star-ornament">★</span> VENICE FL <span className="star-ornament">★</span>
          </span>

          <h1 className="font-display mt-8" style={{ fontWeight: 500 }}>
            I bet we find you{" "}
            <em style={{ display: "block", color: "var(--gold)", marginTop: 6 }}>
              at least $50,000
            </em>
            hiding in your business.
          </h1>

          <p
            className="mt-10 font-sans"
            style={{
              fontSize: "clamp(18px, 1.6vw, 22px)",
              lineHeight: 1.55,
              color: "var(--ink)",
              maxWidth: 540,
            }}
          >
            And I&apos;ll prove it in 15 minutes. No card. No login. No catch. I&apos;m doing this on the
            local merchants of Venice, Florida — because we both already know the money&apos;s sitting there.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <CtaButton href={CTA.scan} variant="primary" trackEvent="hero_primary">
              Take the dare <span aria-hidden>·</span> 15 minutes →
            </CtaButton>
            <CtaButton href={CTA.calendly} variant="secondary" trackEvent="hero_secondary">
              Talk to Dave first →
            </CtaButton>
          </div>

          <p className="meta-mono mt-8" style={{ color: "var(--text-mute)" }}>
            <span style={{ color: "var(--gold)" }}>★★★★★</span> Used by 47 Venice merchants <span className="star-ornament">·</span> No found money? You drink your next coffee on me.
          </p>
        </motion.div>

        {/* RIGHT — IMAGE + VIDEO OVERLAY */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.0, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full"
          style={{ aspectRatio: "4/5" }}
        >
          <div
            className="relative w-full h-full hairline-frame overflow-hidden"
            style={{ borderRadius: "var(--radius)" }}
          >
            <Image
              src="/venice/hero.avif"
              alt="Venice, Florida coastal causeway at golden hour."
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
            />

            {/* Runway pan loop layered over still */}
            <video
              src="/loops/venice-hero-pan.mp4"
              autoPlay
              muted
              loop
              playsInline
              poster="/venice/hero.avif"
              className="absolute inset-0 w-full h-full"
              style={{
                objectFit: "cover",
                opacity: 0.65,
                mixBlendMode: "soft-light",
              }}
            />

            {/* Cash reveal loop, blended at 30% — subtle */}
            <video
              src="/loops/venice-cash-reveal.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-x-0 bottom-0 w-full"
              style={{
                height: "40%",
                objectFit: "cover",
                opacity: 0.30,
                mixBlendMode: "multiply",
              }}
            />

            {/* Gold inner hairline */}
            <div
              aria-hidden
              className="absolute inset-3 pointer-events-none"
              style={{ border: "1px solid var(--gold-soft)", borderRadius: "calc(var(--radius) - 6px)" }}
            />
          </div>

          {/* Caption strip */}
          <p className="meta-mono mt-4 text-center">
            <span className="star-ornament">★</span> VENICE FL <span className="star-ornament">·</span> GOLDEN HOUR <span className="star-ornament">·</span> MMXXVI
          </p>
        </motion.div>
      </div>
    </section>
  );
}
