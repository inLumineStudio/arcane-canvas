// All user-facing copy lives here so other locales can be added later
// (copy this file to it.ts, translate, and register it in ./index.ts).
// Lorem ipsum marks copy that is still waiting for the final EN text (brief §8.2).
//
// Inline markup supported by <RichText>: **bold**, _italic_, and [[x]] for cipher letters
// (the letters of a hidden code, rendered with a barely different tint).

export const en = {
  meta: {
    siteName: "Arcane Canvas",
    homeTitle: "Arcane Canvas - Games, stories and sound from the dark",
    // Descriptions stay under ~160 characters: longer ones get cut in search results and previews
    homeDescription:
      "Arcane Canvas is a one-person studio making dark things by hand: ORISON, a narrative game for PC, and SILENTIUM, a horror fiction podcast.",
    aboutTitle: "About - Arcane Canvas",
    aboutDescription:
      "Arcane Canvas is one person making narrative games, audio fiction and printed things. All human-made.",
    orisonTitle: "ORISON - Arcane Canvas",
    orisonDescription:
      "A narrative game for PC. The last unwatched place on the internet ran on a well hidden machine. You found it. Now it wants to talk. Free demo, December 2026.",
    silentiumTitle: "SILENTIUM - Arcane Canvas",
    silentiumDescription:
      "A horror fiction podcast. Vatican linguist Father Tommaso Lanza translates an impossible language spoken only at the moment of death. New case every month.",
    notFoundTitle: "Page not found - Arcane Canvas",
    // Alt text of the link-preview images in public/og
    ogAlt: {
      home: "Arcane Canvas: the crystal A with its galaxy ring, next to the words One person. Games, podcasts & other dark things.",
      orison: "ORISON: a pixel-art eye above the game's wordmark.",
      silentium: "SILENTIUM: a pale hand reaching out in red light. Some words are only spoken once.",
    },
  },

  // /privacy. Describes what the site really does (keep it in sync if analytics, forms or
  // new embeds are ever added). {email} becomes a link to the contact address.
  // Draft by the agency: to be reviewed by whoever handles the client's legal side.
  privacy: {
    metaTitle: "Privacy - Arcane Canvas",
    metaDescription: "What this site does with your data: hosting logs, no analytics, YouTube and Spotify only on request, email.",
    title: "Privacy",
    intro:
      "This site is a showcase. It has no accounts, no forms and no newsletter, and it sets no cookies of its own. This is everything it does with data, in plain words.",
    updated: "Last updated: 24 September 2026",
    sections: [
      {
        title: "Who is responsible",
        paragraphs: [
          "The data controller is Marco D'Antino. Arcane Canvas is the name of his work, not a company. For anything about your data, write to {email}.",
        ],
        links: [],
      },
      {
        title: "Hosting and server logs",
        paragraphs: [
          "The site is hosted by Vercel Inc. (USA). Like any web server, it receives some technical data with each request: your IP address, browser and device type, the page requested and the time. This is needed to deliver the pages and keep them secure (legitimate interest, art. 6(1)(f) GDPR).",
          "These logs are kept only for the short period set by Vercel and are not used to identify or profile visitors. Transfers to the USA rely on the EU-U.S. Data Privacy Framework and on Vercel's standard contractual clauses.",
        ],
        links: [{ label: "Vercel privacy policy", key: "vercel" }],
      },
      {
        title: "Analytics and cookies",
        paragraphs: [
          "The site uses no analytics, no advertising and no tracking of any kind, and it sets no cookies of its own. Fonts and images are served from this site, not from third parties.",
          "On the ORISON page, the terminal remembers the codes you unlock in your browser's local storage. That stays on your device, is never sent anywhere, and goes away when you clear your browser data.",
        ],
        links: [],
      },
      {
        title: "YouTube (ORISON trailer)",
        paragraphs: [
          "The trailer is played by YouTube (Google Ireland Ltd.). Nothing is loaded from YouTube until you press play: before that you only see a picture stored on this site. When you press play, the video loads from youtube-nocookie.com, and from then on Google may process your IP address and set cookies under its own policy.",
        ],
        links: [{ label: "Google privacy policy", key: "google" }],
      },
      {
        title: "Spotify (SILENTIUM player)",
        paragraphs: [
          "The episode player on the SILENTIUM page comes from Spotify AB (Sweden). It is loaded only when you press “Load the Spotify player”; from then on Spotify may process your data and set cookies under its own policy. You can always open the episodes on Spotify instead.",
          "The episode list and the transcripts are fetched by this site's server from Spotify and GitHub. No data about you is part of those requests.",
        ],
        links: [{ label: "Spotify privacy policy", key: "spotify" }],
      },
      {
        title: "Email",
        paragraphs: [
          "If you write to hello@ or press@thearcanecanvas.com, your address and your message are used only to reply to you, and kept for as long as the conversation needs. The mailboxes are hosted by Aruba S.p.A. (Italy).",
        ],
        links: [{ label: "Aruba privacy policy", key: "aruba" }],
      },
      {
        title: "Other sites",
        paragraphs: [
          "Links to Steam, Instagram, TikTok, Bluesky, YouTube, Spotify and other services take you to their sites, which have their own privacy policies.",
        ],
        links: [],
      },
      {
        title: "Your rights",
        paragraphs: [
          "You can ask to access, correct or delete your data, to limit its use or to object to it, by writing to {email}. You can also lodge a complaint with the Italian data protection authority, the Garante per la protezione dei dati personali.",
        ],
        links: [{ label: "Garante per la protezione dei dati personali", key: "garante" }],
      },
    ],
  },

  // The 404 page: a wall of eyes that follow the visitor
  notFound: {
    code: "404",
    title: "This page isn't here.",
    text: "But you are. And they've noticed.",
    home: "Back to the home page",
  },

  nav: {
    home: "Home",
    projects: "Projects",
    about: "About",
    orison: "ORISON",
    silentium: "SILENTIUM",
    contact: "Contact",
    skipToContent: "Skip to content",
    menu: "Menu",
    close: "Close",
  },

  buttons: {
    // Every label names where it leads: no bare "More", "Steam" or "Spotify" (Lighthouse
    // flags generic link text)
    exploreOrison: "Explore ORISON",
    exploreSilentium: "Explore SILENTIUM",
    listenNow: "Listen now",
    contact: "Contact",
    wishlist: "Wishlist on Steam",
    listen: "Listen on Spotify",
    watchTrailer: "Watch the trailer",
    pressKit: "Press kit",
  },

  footer: {
    // Arcane Canvas is not a legal entity yet, so the copyright holder is the person
    owner: "Marco D'Antino / Arcane Canvas",
    rights: "All rights reserved.",
    privacy: "Privacy",
    note: "All writing, art and audio are human-made.",
    follow: "Follow",
    press: "Press",
    builtBy: "Built by",
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
      title: "Projects",
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
      signature: "Marco D'Antino",
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
    clips: {
      file: "TRAILER.WEBM",
      caption: "The official trailer. Press play to watch it here, with sound.",
    },
    gallery: {
      folder: "C:\\ORISON\\SCREENS",
      count: "6 file(s)",
      viewer: { open: "Open full screen", close: "Close", prev: "Previous screenshot", next: "Next screenshot" },
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
    // The monitor's brand: Audeo built the machine in the game
    monitorLabel: "Audeo",
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
        { label: "Voice", value: "Solo narrator, Marco D'Antino" },
        { label: "Cadence", value: "One episode a month" },
        { label: "Length", value: "15 to 35 minutes" },
      ],
      forFansOf: "For fans of The Magnus Archives, Archive 81 and The White Vault.",
    },
    episodes: {
      title: "Case files",
      intro: "Pick an episode to play it here. No account needed.",
      nowPlaying: "Now playing",
      selected: "Selected episode",
      // Shown before the Spotify player is loaded (it is only loaded on request)
      loadPlayer: "Load the Spotify player",
      consentNote: "The player comes from Spotify, which may set its own cookies.",
      privacyLink: "Privacy",
      openOnSpotify: "Open it on Spotify instead",
      play: "Play",
      minutes: "min",
      playerTitle: "Spotify player",
      showFallback: "Episode link pending: playing the full show instead.",
    },
    // The transcripts themselves come from the client's archive repo (src/lib/transcripts.ts)
    transcripts: {
      title: "Transcripts",
      intro: "Father Tommaso Lanza's investigation logs for the Custodia Ultimae Vocis, transcribed in full.",
      warning: "Contains descriptions of death, body horror, religious themes and existential dread.",
      read: "Read the transcript",
      lexicon: "The Lexicon",
      lexiconNote: "Every documented word of the Tongue, by tier.",
      unavailable: "The transcripts can't be loaded right now. They are always on the archive site.",
      archive: "Open the transcript archive",
      back: "All transcripts",
      prev: "Previous case",
      next: "Next case",
      credit: "Written, performed and transcribed by Marco D'Antino. All characters and events are fictitious.",
      metaTitle: "SILENTIUM transcripts - Arcane Canvas",
    },
    cta: {
      title: "Follow the show.",
      text: "New case files every month on Spotify.",
    },
  },
} as const;

