export default function EditorialHeader() {
  return (
    <header
      className="sticky top-0 z-30 backdrop-blur-md"
      style={{ background: "rgba(253, 252, 248, 0.78)", borderBottom: "1px solid var(--hairline)" }}
    >
      <div className="container-editorial flex items-center justify-between" style={{ height: 56 }}>
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="font-display"
            style={{
              fontStyle: "italic",
              color: "var(--gold)",
              fontSize: 22,
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            OO
          </span>
          <span className="meta-mono" style={{ color: "var(--ink)" }}>
            Ownly ONCE
          </span>
        </div>
        <span className="meta-mono hidden sm:inline">
          VENICE EDITION <span className="star-ornament">★</span> VOL.I <span className="star-ornament">★</span> NO.01 <span className="star-ornament">★</span> MMXXVI
        </span>
        <span className="meta-mono sm:hidden">VENICE <span className="star-ornament">★</span> NO.01</span>
      </div>
    </header>
  );
}
