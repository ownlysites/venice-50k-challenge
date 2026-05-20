import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "The Venice $50K Wager — Ownly ONCE";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#FDFCF8",
          color: "#0F1F39",
          padding: "72px 80px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ color: "#B8965A", fontStyle: "italic", fontSize: 44 }}>OO</span>
            <span style={{ fontSize: 18, letterSpacing: "0.18em", color: "#5A6B82", textTransform: "uppercase" }}>
              Ownly ONCE
            </span>
          </div>
          <span style={{ fontSize: 14, letterSpacing: "0.22em", color: "#8B7044", textTransform: "uppercase" }}>
            ★ VENICE EDITION · VOL.I · NO.01 · MMXXVI
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <span style={{ fontSize: 16, letterSpacing: "0.22em", color: "#8B7044", textTransform: "uppercase" }}>
            ★ A WAGER FROM DAVE IVERY · VENICE FL
          </span>
          <div style={{ fontSize: 88, fontWeight: 500, lineHeight: 1.05, letterSpacing: "-0.01em" }}>
            I bet we find you <span style={{ color: "#B8965A", fontStyle: "italic" }}>$50,000</span>
            <br /> hiding in your business.
          </div>
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 22,
              color: "#5A6B82",
              maxWidth: 880,
              fontStyle: "italic",
            }}
          >
            15 minutes. No card. No login. If we can&rsquo;t — your next coffee is on me.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(184,150,90,0.35)",
            paddingTop: 20,
            fontSize: 13,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#5A6B82",
          }}
        >
          <span>VENICE50KCHALLENGE.COM</span>
          <span>941-277-9876 · DAVID@OWNLY1NCE.COM</span>
        </div>
      </div>
    ),
    size,
  );
}
