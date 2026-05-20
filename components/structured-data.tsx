const SITE_URL = "https://venice50kchallenge.com";

const data = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}#org`,
      name: "Ownly ONCE LLC",
      url: SITE_URL,
      logo: `${SITE_URL}/og.png`,
      sameAs: ["https://ownly1nce.com"],
      founder: {
        "@type": "Person",
        name: "Dave Ivery",
        jobTitle: "NFEC CFEI · AI Consultant",
        email: "david@ownly1nce.com",
        telephone: "+1-941-277-9876",
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+1-941-277-9876",
          contactType: "customer service",
          areaServed: ["US-FL"],
          availableLanguage: ["English"],
        },
      ],
    },
    {
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}#business`,
      name: "Ownly ONCE — Venice $50K Wager",
      url: SITE_URL,
      image: `${SITE_URL}/og.png`,
      telephone: "+1-941-277-9876",
      email: "david@ownly1nce.com",
      priceRange: "$$",
      areaServed: [
        { "@type": "City", name: "Venice", containedInPlace: { "@type": "AdministrativeArea", name: "Florida" } },
        { "@type": "City", name: "Sarasota", containedInPlace: { "@type": "AdministrativeArea", name: "Florida" } },
        { "@type": "City", name: "North Port", containedInPlace: { "@type": "AdministrativeArea", name: "Florida" } },
      ],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Venice",
        addressRegion: "FL",
        addressCountry: "US",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 27.0998,
        longitude: -82.4543,
      },
    },
    {
      "@type": "Offer",
      "@id": `${SITE_URL}#offer`,
      name: "The Venice $50K Wager — 15-minute Found-Money Diagnostic",
      description:
        "A free 15-minute diagnostic for Venice, Sarasota, and North Port FL business owners. If we cannot surface at least $50,000 in tax credits, funding lines, expense leaks, or AI ROI, your next coffee in Venice is on us.",
      url: SITE_URL,
      price: "0",
      priceCurrency: "USD",
      eligibleRegion: "US-FL",
      validThrough: "2026-08-31",
      seller: { "@id": `${SITE_URL}#org` },
      availability: "https://schema.org/InStock",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      url: SITE_URL,
      name: "Venice $50K Challenge",
      publisher: { "@id": `${SITE_URL}#org` },
    },
  ],
};

export default function StructuredData() {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
