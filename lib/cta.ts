export const CTA = {
  scan: "https://app.mplannerpro.com/abce1ffefc/chat?pg=dea8573397",
  calendly: "https://calendly.com/daveivery/sit_down",
  gapAudit: "https://ownly-gap-audit.vercel.app/",
  dreams: "https://dreamsscore.biz/?refid=AA3946",
  credit: "https://ownly-business-credit-builder.vercel.app/",
} as const;

/** Hosts whose pages are frame-friendly. Anything else opens as a new tab. */
export const FRAME_FRIENDLY_HOSTS: ReadonlyArray<string> = [
  "app.mplannerpro.com",
  "ownly-gap-audit.vercel.app",
  "ownly-business-credit-builder.vercel.app",
  "ownly-web-studio.vercel.app",
  "dreamsscore.biz",
  "campbellwa.com",
  "venice50kchallenge.com",
  "calendly.com",
];
