"use client";

import Script from "next/script";

/**
 * Apollo.io visitor-ID tracker.
 *
 * Set NEXT_PUBLIC_APOLLO_ID in .env.local with your Apollo account ID
 * (the digits at the end of the standard Apollo embed script URL).
 *
 * Without that env, this component renders nothing and never blocks the build.
 */
export default function ApolloTracker() {
  const id = process.env.NEXT_PUBLIC_APOLLO_ID;
  if (!id) return null;
  return (
    <Script
      id="apollo-tracker"
      strategy="afterInteractive"
      src={`https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache=${Date.now()}&v=2&account_id=${id}`}
    />
  );
}
