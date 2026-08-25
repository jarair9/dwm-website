export function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Distinct Mineral World",
    description:
      "A curated digital auction house for rare minerals and gemstones.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    sameAs: [],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/specimens?q={search_term_string}`,
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
