// Code #2 lives in the page source as an HTML comment (view-source / devtools only).
const COMMENT = `
  ADID internal // do not publish
  The coordinates are on the postcard.
  If they ask for the word, it is POSTCARD.
`;

export function SourceComment() {
  return <div hidden dangerouslySetInnerHTML={{ __html: `<!--${COMMENT}-->` }} />;
}
