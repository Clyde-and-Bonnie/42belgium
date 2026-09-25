"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";

interface Props {
  youtubeId: string;
  name: string;
  subtitle: string;
  big?: boolean;
  // CSS module class bundles from the parent proposal.
  thumbClass: string;
  playClass: string;
  cardClass: string;
  metaClass: string;
  nameClass: string;
  subClass: string;
}

/**
 * Story card with thumb + play button. Clicking swaps the thumb for an
 * autoplay YouTube iframe so users can watch in-place without leaving.
 */
export function StoryThumb({
  youtubeId,
  name,
  subtitle,
  big,
  thumbClass,
  playClass,
  cardClass,
  metaClass,
  nameClass,
  subClass,
}: Props) {
  const [playing, setPlaying] = useState(false);
  const poster = big
    ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
    : `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
  const fallback = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;

  return (
    <div
      className={cardClass}
      role={playing ? undefined : "button"}
      tabIndex={playing ? undefined : 0}
      onClick={() => !playing && setPlaying(true)}
      onKeyDown={(e) => {
        if (!playing && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          setPlaying(true);
        }
      }}
    >
      <div className={thumbClass}>
        {playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&controls=1`}
            title={`${name} - ${subtitle}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              width: "100%",
              height: "100%",
              border: 0,
              position: "absolute",
              inset: 0,
            }}
          />
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={poster}
              alt={`${name} - ${subtitle}`}
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                if (img.src !== fallback) img.src = fallback;
              }}
            />
            <span className={playClass} aria-hidden="true">
              <span>
                <Icon className="fa-solid fa-play" />
              </span>
            </span>
          </>
        )}
      </div>
      <div className={metaClass}>
        <p className={nameClass}>{name}</p>
        <p className={subClass}>{subtitle}</p>
      </div>
    </div>
  );
}
