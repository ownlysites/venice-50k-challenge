export default function DaveStrip() {
  return (
    <section
      id="dave"
      className="section-tight"
      style={{
        background: "var(--paper-warm)",
        borderTop: "1px solid var(--hairline)",
        borderBottom: "1px solid var(--hairline)",
      }}
    >
      <div className="container-narrow text-center">
        <span className="eyebrow no-rule">A NOTE FROM THE TABLE</span>

        <blockquote
          className="font-display mt-8"
          style={{
            fontStyle: "italic",
            fontSize: "clamp(22px, 2.4vw, 30px)",
            lineHeight: 1.4,
            color: "var(--ink)",
          }}
        >
          &ldquo;I&apos;m Dave Ivery. NFEC Certified Financial Education Instructor. AI Consultant. Based in
          Venice. I built Ownly ONCE so the credits, capital, and AI that big businesses already use would
          be available to the ones I see in the parking lot every morning. This wager is how I prove it
          works — on my own neighbors first.&rdquo;
        </blockquote>

        <hr className="hairline mt-10 mx-auto" style={{ maxWidth: 80 }} />

        <p className="meta-mono mt-6">
          — DAVE IVERY <span className="star-ornament">·</span> OWNLY ONCE LLC <span className="star-ornament">·</span> david@ownly1nce.com <span className="star-ornament">·</span> 941-277-9876
        </p>
      </div>
    </section>
  );
}
