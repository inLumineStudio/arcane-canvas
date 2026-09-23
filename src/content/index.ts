import { en } from "./en";

// Widen the `as const` literals so translations only have to match the shape, not the text.
type Widen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly Widen<U>[]
    : { readonly [K in keyof T]: Widen<T[K]> };

export type Dictionary = Widen<typeof en>;

const dictionaries = { en } satisfies Record<string, Dictionary>;

export type Locale = keyof typeof dictionaries;
export const defaultLocale: Locale = "en";

export function getDictionary(locale: Locale = defaultLocale): Dictionary {
  return dictionaries[locale];
}
