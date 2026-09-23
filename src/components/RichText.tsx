import { Fragment, type ReactNode } from "react";

// Renders the small inline markup used in content/*.ts:
//   **bold**   _italic_   [[x]] cipher letter   \n line break
const TOKEN = /(\*\*[^*]+\*\*|_[^_]+_|\[\[[^\]]+\]\]|\n)/g;

function renderInline(text: string): ReactNode[] {
  return text.split(TOKEN).map((part, i) => {
    if (!part) return null;
    if (part === "\n") return <br key={i} />;
    if (part.startsWith("**")) return <strong key={i}>{renderInline(part.slice(2, -2))}</strong>;
    if (part.startsWith("[[")) return <span key={i} className="cipher">{part.slice(2, -2)}</span>;
    if (part.startsWith("_") && part.length > 2) return <em key={i}>{renderInline(part.slice(1, -1))}</em>;
    return <Fragment key={i}>{part}</Fragment>;
  });
}

export function RichText({ text }: { text: string }) {
  return <>{renderInline(text)}</>;
}
