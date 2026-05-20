export default function FooterColophon() {
  const year = new Date().getFullYear();
  return (
    <footer
      className="ink-surface"
      style={{ paddingTop: 64, paddingBottom: 48 }}
    >
      <div className="container-editorial">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <span
              className="font-display"
              style={{ fontStyle: "italic", color: "var(--gold-soft)", fontSize: 28 }}
            >
              OO
            </span>
            <p className="meta-mono mt-2" style={{ color: "var(--paper-cream)" }}>
              OWNLY ONCE LLC <span className="star-ornament">·</span> VENICE FL
            </p>
            <p className="mt-4" style={{ color: "var(--paper-cream)", opacity: 0.75, maxWidth: 340 }}>
              Editorial diagnostics for the merchants of Venice, Sarasota, and North Port. Founded 2026.
            </p>
          </div>

          <div>
            <span className="meta-mono" style={{ color: "var(--gold-soft)" }}>CONTACT</span>
            <ul className="mt-4 space-y-2" style={{ color: "var(--paper-cream)", opacity: 0.85 }}>
              <li>
                <a href="mailto:david@ownly1nce.com" className="hover:text-[color:var(--gold-soft)]">
                  david@ownly1nce.com
                </a>
              </li>
              <li>
                <a href="tel:+19412779876" className="hover:text-[color:var(--gold-soft)]">
                  941-277-9876
                </a>
              </li>
              <li>Venice, Florida</li>
            </ul>
          </div>

          <div>
            <span className="meta-mono" style={{ color: "var(--gold-soft)" }}>FRAMEWORKS</span>
            <ul className="mt-4 space-y-2" style={{ color: "var(--paper-cream)", opacity: 0.85, fontSize: 14 }}>
              <li>F.A.C.T. <span className="star-ornament">·</span> Find · Add · Create · Track</li>
              <li>4 Legs of Bankability</li>
              <li>20-Point Lender Compliance Grid</li>
              <li>13 Funding Paths</li>
              <li>12-Step Path</li>
            </ul>
          </div>
        </div>

        <hr className="hairline mt-12" style={{ background: "rgba(212,184,122,0.18)" }} />

        <div className="mt-8 flex flex-col md:flex-row justify-between gap-4">
          <p className="meta-mono" style={{ color: "var(--paper-cream)", opacity: 0.7 }}>
            <span className="star-ornament">★</span> WAGER VALID IN VENICE / SARASOTA / NORTH PORT FL THROUGH 2026-08-31 <span className="star-ornament">·</span> LIMIT ONE PER BUSINESS
          </p>
          <p className="meta-mono" style={{ color: "var(--paper-cream)", opacity: 0.7 }}>
            © {year} OWNLY ONCE LLC <span className="star-ornament">·</span> VOL.I <span className="star-ornament">·</span> NO.01 <span className="star-ornament">·</span> MMXXVI
          </p>
        </div>
      </div>
    </footer>
  );
}
