/**
 * Lightweight YouTube embed - lazy-loaded iframe with poster image.
 * Avoids loading the YouTube player until the user clicks.
 */

"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import Image from "next/image";

interface Props {
  youtubeId: string;
  title: string;
}

export function YouTubeEmbed({ youtubeId, title }: Props) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        className="w-full aspect-video"
        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
        title={title}
        frameBorder={0}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="relative w-full aspect-video bg-black overflow-hidden group"
      aria-label={`Play video: ${title}`}
    >
      <Image
        src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
        alt={title}
        fill
        className="object-cover transition-transform group-hover:scale-105"
        unoptimized
      />
      <span className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
        <span className="flex h-16 w-16 items-center justify-center bg-[var(--color-primary)] text-white group-hover:scale-110 transition-transform">
          <Icon className="fa-solid fa-play text-xl ml-1" />
        </span>
      </span>
    </button>
  );
}
