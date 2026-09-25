"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { StoryThumb } from "./StoryThumb";
import styles from "./ProposalC.module.css";

interface Video {
  name: string;
  subtitle: string;
  youtubeId: string;
}

export function StoriesCarouselC({ videos }: { videos: Video[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const update = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const scrollStep = () => (trackRef.current?.clientWidth || 0) * 0.6;
  const scrollBy = (dir: 1 | -1) =>
    trackRef.current?.scrollBy({ left: dir * scrollStep(), behavior: "smooth" });

  return (
    <div className={styles.storiesTrackWrap}>
      <div className={styles.storiesTrack} ref={trackRef}>
        {videos.map((v) => (
          <StoryThumb
            key={v.youtubeId}
            youtubeId={v.youtubeId}
            name={v.name}
            subtitle={v.subtitle}
            cardClass={styles.storyCard}
            thumbClass={styles.thumb}
            playClass={styles.play}
            metaClass={styles.meta}
            nameClass={styles.name}
            subClass={styles.sub}
          />
        ))}
      </div>
      <div className={styles.storiesNav}>
        <button
          type="button"
          className={styles.sBtn}
          onClick={() => scrollBy(-1)}
          disabled={!canPrev}
          aria-label="Previous"
        >
          <Icon className="fa-solid fa-chevron-left" />
        </button>
        <button
          type="button"
          className={styles.sBtn}
          onClick={() => scrollBy(1)}
          disabled={!canNext}
          aria-label="Next"
        >
          <Icon className="fa-solid fa-chevron-right" />
        </button>
      </div>
    </div>
  );
}
