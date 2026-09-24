"use client";

import Image from "next/image";
import { useState } from "react";

// The ORISON trailer inside an OS window. Until it is asked for, the window shows the
// trailer's own YouTube cover and a play button; pressing it swaps in the YouTube player,
// already playing, with sound. Nothing is requested from YouTube before that press (the site
// makes no third-party requests on its own): the cover is a local copy
// (public/media/orison/trailer-poster.webp), and the player comes from youtube-nocookie.com,
// which sets no tracking cookies until the video plays.
//
// Mobile first: the whole frame is the button (a big tap target, not just the small label),
// and the player plays inline (playsinline) instead of jumping to the iOS full-screen player.

type Props = {
  videoId: string;
  /** Cover shown before playing (a local copy of the YouTube thumbnail) */
  poster: string;
  /** Visible label on the button */
  playLabel: string;
  /** Accessible name of the button, and title of the player iframe */
  title: string;
};

export function TrailerPlayer({ videoId, poster, playLabel, title }: Props) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0`}
        title={title}
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
        className="block aspect-video w-full border-0 bg-black"
      />
    );
  }

  return (
    <button type="button" onClick={() => setPlaying(true)} aria-label={title} className="group relative block aspect-video w-full">
      <Image src={poster} alt="" fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" />
      {/* Top left: the cover's eye and ORISON logo fill the middle and bottom, the top band is empty */}
      <span aria-hidden="true" className="btn absolute left-2.5 top-2.5 !min-h-0 !px-2.5 !py-1 !text-[1.1rem] group-hover:!bg-[#7ef4ff] md:left-3 md:top-3 md:!px-3 md:!py-1.5 md:!text-[1.35rem]">
        ▶ {playLabel}
      </span>
    </button>
  );
}
