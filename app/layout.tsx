import type { Metadata, Viewport } from "next";
import { Inter, Cormorant_Garamond, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ConciergeFrame from "@/components/concierge-frame";
import ApolloTracker from "@/components/apollo-tracker";
import StructuredData from "@/components/structured-data";
import IntakeGate from "@/components/intake-gate";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const SITE_URL = "https://venice50kchallenge.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "The Venice $50K Wager — I'll bet we find you $50,000 hiding in your business.",
  description:
    "A 15-minute editorial diagnostic for Venice / Sarasota / North Port FL business owners. No card. No login. If we can't find $50K, your next coffee is on me. — Dave Ivery, Ownly ONCE LLC.",
  applicationName: "Venice $50K Challenge",
  authors: [{ name: "Dave Ivery", url: "https://ownly1nce.com" }],
  keywords: [
    "Venice FL business funding",
    "small business tax credits Florida",
    "FICA tip credit Venice",
    "Sarasota business consultant",
    "North Port small business",
    "Dave Ivery Ownly ONCE",
    "Find $50K hidden business money",
    "Florida SMB AI consultant",
  ],
  openGraph: {
    title: "The Venice $50K Wager",
    description:
      "I bet we find you at least $50,000 hiding in your business. 15 minutes. No card. No login. — Dave Ivery, Ownly ONCE.",
    url: SITE_URL,
    siteName: "Ownly ONCE",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Venice $50K Wager",
    description:
      "I bet we find you at least $50,000 hiding in your business — Dave Ivery, Ownly ONCE.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
  other: {
    "geo.region": "US-FL",
    "geo.placename": "Venice, Florida",
    "geo.position": "27.0998;-82.4543",
    ICBM: "27.0998, -82.4543",
  },
};

export const viewport: Viewport = {
  themeColor: "#FDFCF8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <StructuredData />
        <ApolloTracker />
        <IntakeGate />
        {children}
        <ConciergeFrame />
      </body>
    </html>
  );
}
