// ORISON easter eggs (brief §4). Codes are compared as SHA-256 hashes so the list of valid
// codes isn't readable from the bundle. This is obfuscation, not security: if an unlock ever
// has to stay truly secret, move validation to a server endpoint (brief §7).
//
// Where each code is hidden:
//   1. text     - cipher letters in the ORISON intro paragraph (content/en.ts, orison.intro)
//   2. source   - an HTML comment in the page markup (components/orison/SourceComment.tsx)
//   3. console  - a message printed in the browser console (components/orison/ConsoleWhisper.tsx)
//   4. asset    - the alt text of screenshot #4 (content/en.ts, orison.gallery.alts)
//
// Unlock payloads are placeholders: what each code reveals is TBD with Marco (brief §8.1).

export type EasterEgg = {
  hash: string;
  file: string;
  lines: string[];
};

export const easterEggs: EasterEgg[] = [
  {
    hash: "b9e540919db17d4d23bd9edbd7f2bb2e6aa47861bd5dcdcd5cfacfb902d43da3",
    file: "SUBMISSION_0001.TXT",
    lines: ["Lorem ipsum dolor sit amet, consectetur adipiscing elit.", "[content TBD]"],
  },
  {
    hash: "4634763f3a363fdd9899626e49a0a52cbc44e334f3cc476ae380da3413a036a6",
    file: "POSTCARD.JPG",
    lines: ["Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", "[content TBD]"],
  },
  {
    hash: "a69cf9d6d3bde021cb475601a862dfde7cfaa9c7eb7273631baf51d33277170f",
    file: "LAST_WORDS.WAV",
    lines: ["Ut enim ad minim veniam, quis nostrud exercitation ullamco.", "[content TBD]"],
  },
  {
    hash: "6f69809004ded26949d3c72420728006bff48dfc891b2a26c521b19eaeee1d50",
    file: "KEEPER.LNK",
    lines: ["Duis aute irure dolor in reprehenderit in voluptate velit esse.", "[content TBD]"],
  },
];

// Codes are case-insensitive and ignore surrounding spaces.
export async function hashCode(input: string): Promise<string> {
  const data = new TextEncoder().encode(input.trim().toUpperCase());
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}
