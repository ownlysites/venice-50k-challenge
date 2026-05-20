import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://venice50kchallenge.com/sitemap.xml",
    host: "https://venice50kchallenge.com",
  };
}
