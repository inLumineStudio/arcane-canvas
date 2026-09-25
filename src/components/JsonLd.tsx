// Renders structured data (see lib/structured-data.ts) as a JSON-LD script. "<" is escaped
// so text coming from content (titles, summaries) can never close the script tag early.
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
