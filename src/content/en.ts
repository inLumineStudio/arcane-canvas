// All user-facing copy lives here so other locales can be added later
// (copy this file to it.ts, translate, and register it in ./index.ts).
// Lorem ipsum marks copy that is still waiting for the final EN text (brief §8.2).
//
// Inline markup supported by <RichText>: **bold**, _italic_, and [[x]] for cipher letters
// (the letters of a hidden code, rendered with a barely different tint).

export const en = {
  meta: {
    siteName: "Arcane Canvas",
    homeTitle: "Arcane Canvas — Games, stories and sound from the dark",
    homeDescription:
      "Arcane Canvas is an independent creative studio. We make ORISON, a narrative game, and SILENTIUM, a horror fiction podcast.",
    aboutTitle: "About — Arcane Canvas",
    aboutDescription:
      "Arcane Canvas is one person making narrative games, audio fiction and printed things. All human-made.",
    orisonTitle: "ORISON — Arcane Canvas",
    orisonDescription:
      "The last unwatched place on the internet ran on a well hidden machine. You found the machine. Now it wants to talk.",
    silentiumTitle: "SILENTIUM — Arcane Canvas",
    silentiumDescription:
      "A solo-narrator horror fiction podcast. A Vatican linguist translates an impossible language that appears only at the moment of death.",
  },

  nav: {
    home: "Home",
    about: "About",
    orison: "ORISON",
    silentium: "SILENTIUM",
    contact: "Contact",
    skipToContent: "Skip to content",
    menu: "Menu",
    close: "Close",
  },

  buttons: {
    more: "More",
    steam: "Steam",
    spotify: "Spotify",
    contact: "Contact",
    wishlist: "Wishlist on Steam",
    listen: "Listen on Spotify",
    watchTrailer: "Watch the trailer",
    pressKit: "Press kit",
  },

  footer: {
    rights: "All rights reserved.",
    note: "All writing, art and audio are human-made.",
    follow: "Follow",
    press: "Press",
  },

  home: {
    hero: {
      // Words that ride the logo's galaxy ring
      orbit: ["games", "podcasts", "print", "stories", "sound"],
      logoAlt: "Arcane Canvas",
    },
    statement: {
      // Big type, one line per entry. [[x]] is not used here.
      lines: ["One person.", "Games,", "podcasts", "& other", "dark things."],
      intro:
        "Arcane Canvas is a one-person studio making narrative games, audio fiction and small printed things. Everything is written, drawn and recorded by hand. Lorem ipsum dolor sit amet.",
      aboutLink: "About the studio",
    },
    products: {
      title: "Current work",
      orison: {
        kind: "A narrative game for PC",
        name: "ORISON",
        status: "Free demo, December 2026",
        description:
          "The last unwatched place on the internet ran on a well hidden machine. The website promised that nothing you sent could be traced back to you, and it kept that promise while governments tore the network apart looking for it. You found the machine. Now it wants to talk.",
        mediaLabel: "Play the ORISON trailer",
      },
      silentium: {
        kind: "A horror fiction podcast",
        name: "SILENTIUM",
        status: "New case every month",
        description:
          "Vatican linguist Father Tommaso Lanza investigates deaths for the Custodia Ultimae Vocis, trying to translate an ancient, impossible language that appears only at the moment of death.",
        mediaAlt: "SILENTIUM cover art: a pale hand reaching out while shadowed hands close in from above.",
      },
    },
    contact: {
      title: "Say hello.",
      text: "Collaborations, questions, or just a message. Lorem ipsum dolor sit amet, every email gets read.",
      pressLabel: "Press & creators",
    },
  },

  about: {
    // Arcane Canvas is one person: the page reads as a letter from the developer.
    // The first paragraphs adapt the "About the developer" text from the ORISON Steam page.
    letter: {
      title: "Arcane Canvas is one person.",
      paragraphs: [
        "I write, design and build everything you find here: the games, the stories, the sounds, even the little printed things that end up in people's pockets.",
        "ORISON is the first game I made, and I poured everything I had into it. It is a game about humanity and feelings. My only wish is that by playing it you'll discover something new about yourself, or remember someone you thought you had lost.",
        "SILENTIUM started as a way to keep telling stories between one build and the next. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
        "No generative AI, anywhere. Every word, drawing and note is made by a person, and that person is usually me, very late at night.",
      ],
      signoff: "Please, remember you are not alone in this world.",
      signature: "Name Surname", // TBD: the developer's name, or a pen name
      portraitAlt: "Photo placeholder: the developer's desk",
      portraitCaption: "where ORISON happened (photo TBD)",
    },
    works: {
      title: "Things I've made",
      items: [
        { year: "2026", title: "ORISON", kind: "Narrative game for PC", status: "Free demo in December", href: "/orison" },
        { year: "2025", title: "SILENTIUM", kind: "Horror fiction podcast", status: "A new case every month", href: "/silentium" },
        { year: "2026", title: "ORISON mini CD", kind: "Print & NFC promo object", status: "", href: null },
      ],
    },
    press: {
      title: "Press & creators",
      text: "Trailer, screenshots, key art and logos for ORISON are in the press kit. For interviews, keys or anything else, write to the press address.",
      orisonKit: "ORISON press kit",
    },
    hello: "Or just say hello:",
  },

  orison: {
    hero: {
      tagline: "Humanity awaits.",
      status: "Free demo · December 2026",
      wordmarkAlt: "ORISON",
    },
    intro: {
      file: "README.TXT",
      // Cipher letters spell a terminal code (see src/content/easter-eggs.ts).
      text:
        "The last [[u]]nwatched place on the i[[n]]ternet ran on a well hidden machine. People sent it [[w]]hat they couldn't say [[a]]nywhere else, and i[[t]] kept everything safe while governments tore the network apart looking for it. You found the ma[[c]]hine. Now it wants to talk. **T[[h]]ere are no right answ[[e]]rs to pick in there**, only what you [[d]]o.",
    },
    // Rendered as the game's own HELP output
    features: {
      window: "COMMAND PROMPT",
      command: "HELP",
      items: [
        { cmd: "READ", text: "letters, diaries, recordings, photographs, last words" },
        { cmd: "RUN", text: "commands: dates, passwords and hidden entries" },
        { cmd: "DEFEND", text: "the machine when the deletion programs arrive" },
        { cmd: "WATCH", text: "ORISON. It is watching you too" },
      ],
      footer: "Some commands may exist.",
    },
    clips: {
      file: "TRAILER.WEBM",
      caption: "Clips from the Steam trailer. Muted, looping.",
      placeholderNote: "Placeholder montage from screenshots: swap with the re-encoded Steam trailer clips.",
    },
    gallery: {
      folder: "C:\\ORISON\\SCREENS",
      count: "6 file(s)",
      alts: [
        "The ORISON desktop: a vast eye made of dots stares out from a black screen.",
        "A folder of submissions open on the ORISON desktop.",
        "The CURIO browser and a command prompt listing system commands.",
        "An old-style operating system window showing a file record. Filed under KEEPER.LNK.",
        "A document open in the ORISON notepad.",
        "The ORISON desktop with several windows open.",
      ],
    },
    press: {
      label: "Press & creators:",
      text: "trailer, screenshots, key art and logos in one folder.",
    },
    cta: {
      title: "The machine is waiting.",
      text: "Wishlist ORISON on Steam to get notified when the free demo opens.",
    },
    monitorLabel: "ARCANE CANVAS · ORISON-17",
    gyroPrompt: "Tap to let it see you",
  },

  terminal: {
    title: "ORISON:\\>",
    intro: [
      "ORISON System [Version 1.00.0001]",
      "(c) Arcane Canvas. All rights reserved.",
      "",
      "Type HELP for a list of commands.",
    ],
    prompt: "C:\\Users\\guest>",
    inputLabel: "Terminal input",
    help: [
      "HELP       displays this reference",
      "CODES      lists the files you have unlocked",
      "CLEAR      clears the screen",
      "WHOAMI     returns the current user",
      "",
      "Anything else is read as an access code.",
    ],
    whoami: "guest (unverified)",
    unknown: "ACCESS DENIED. The code is not recognized.",
    empty: "No files unlocked yet.",
    alreadyUnlocked: "File already unlocked.",
    granted: "ACCESS GRANTED",
    hint: "Codes are hidden on this page. Look closer.",
  },

  glitch: {
    // Content after the glitch is TBD with Marco (brief §8.1). Placeholder copy below.
    title: "YOU WERE NOT SUPPOSED TO CLICK THAT",
    body: "Lorem ipsum dolor sit amet. This panel will reveal something only curious visitors get to see. Content to be defined.",
    close: "Close connection",
  },

  silentium: {
    hero: {
      tagline: "Some words are only spoken once.",
      coverAlt: "SILENTIUM cover art",
    },
    format: {
      title: "A case file, read aloud.",
      text:
        "Each episode documents a new case. Father Tommaso Lanza, a Vatican linguist working for the Custodia Ultimae Vocis, investigates deaths where an impossible language appears at the very last moment. Religious horror, psychological thriller, dark fantasy.",
      facts: [
        { label: "Theme", value: "Cosmic and religious horror" },
        { label: "Voice", value: "Solo narrator. Lorem ipsum (host name TBD)" },
        { label: "Cadence", value: "One episode a month" },
        { label: "Length", value: "15 to 35 minutes" },
      ],
      forFansOf: "For fans of The Magnus Archives, Archive 81 and The White Vault.",
    },
    episodes: {
      title: "Case files",
      intro: "Pick an episode to play it here. No account needed.",
      nowPlaying: "Now playing",
      play: "Play",
      minutes: "min",
      playerTitle: "Spotify player",
      showFallback: "Episode link pending: playing the full show instead.",
    },
    cta: {
      title: "Follow the show.",
      text: "New case files every month on Spotify.",
    },
  },
} as const;

