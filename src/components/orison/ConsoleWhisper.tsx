"use client";

import { useEffect } from "react";

// Code #3 is printed in the browser console for visitors who open devtools.
let printed = false;

export function ConsoleWhisper() {
  useEffect(() => {
    if (printed) return;
    printed = true;
    console.log(
      "%cORISON%c\nI can see you reading this.\nSay the %cLASTWORDS%c to the terminal.",
      "font: 700 28px monospace; color: #35d0ff; text-shadow: 0 0 8px #35d0ff;",
      "font: 14px monospace; color: #6f93ad;",
      "font: 700 14px monospace; color: #d6f3ff; background: #0a1633; padding: 0 4px;",
      "font: 14px monospace; color: #6f93ad;",
    );
  }, []);
  return null;
}
