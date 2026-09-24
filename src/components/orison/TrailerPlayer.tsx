"use client";

import { useState } from "react";
import { LoopVideo } from "@/components/LoopVideo";

// The ORISON trailer inside an OS window. Until it is asked for, the window shows the muted
// loop and a play button; pressing it swaps in the YouTube player, already playing, with sound.
// Nothing is requested from YouTube before that press (the site makes no third-party
// requests on its own), and the player comes from youtube-nocookie.com, which sets no
// tracking cookies until the video plays.
//
// Mobile first: the whole frame is the button (a big tap target, not just the small label),
// and the player plays inline (playsinline) instead of jumping to the iOS full-screen player.

type Props = {
  videoId: string;
  /** Loop shown before playing: path without extension, as for LoopVideo */
  loopSrc: string;
  poster: string;
  /** Visible label on the button */
  playLabel: string;
  /** Accessible name of the button, and title of the player iframe */
  title: string;
};

export function TrailerPlayer({ videoId, loopSrc, poster, playLabel, title }: Props) {
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
      <LoopVideo src={loopSrc} poster={poster} />
      <span aria-hidden="true" className="btn absolute bottom-3 left-3 !min-h-0 !px-3 !py-1.5 group-hover:!bg-[#7ef4ff]">
        ▶ {playLabel}
      </span>
    </button>
  );
}
