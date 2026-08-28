export function JsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://distinctmineralworld.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Distinct Mineral World",
    description:
      "A curated digital auction house for rare minerals and gemstones.",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    sameAs: [],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/minerals?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
