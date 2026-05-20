export default function WagerStrip() {
  return (
    <section
      id="wager"
      className="section-tight"
      style={{
        background: "var(--paper-warm)",
        borderTop: "1px solid var(--hairline)",
        borderBottom: "1px solid var(--hairline)",
      }}
    >
      <div className="container-narrow text-center">
        <span className="eyebrow no-rule">THE WAGER</span>

        <h2 className="font-display mt-6">Here&apos;s how the bet works.</h2>

        <p
          className="mt-8 mx-auto"
          style={{
            fontSize: 18,
            lineHeight: 1.7,
            color: "var(--ink)",
            maxWidth: 620,
          }}
        >
          You give me 15 minutes. I run our diagnostic on your business — the same one we use for SMB owners
          across Florida. If I can&apos;t surface{" "}
          <em>at least $50,000</em> you didn&apos;t know was there — in tax credits, in unused funding,
          in expenses leaking out — I&apos;ll buy your coffee at any Venice cafe next Saturday. That&apos;s the whole deal.
        </p>

        <hr className="hairline mt-12 mx-auto" style={{ maxWidth: 280 }} />

        <ul
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 meta-mono"
          style={{ color: "var(--ink)" }}
        >
          <li>
            <span className="star-ornament">★</span> NO LOGIN
          </li>
          <li className="hidden sm:block" style={{ width: 1, height: 16, background: "var(--hairline)" }} />
          <li>
            <span className="star-ornament">★</span> NO CREDIT CARD
          </li>
          <li className="hidden sm:block" style={{ width: 1, height: 16, background: "var(--hairline)" }} />
          <li>
            <span className="star-ornament">★</span> 15 MINUTES, MAX
          </li>
        </ul>
      </div>
    </section>
  );
}
