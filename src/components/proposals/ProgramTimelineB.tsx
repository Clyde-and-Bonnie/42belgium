"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import type { CurriculumPhase } from "@/lib/i18n";
import type { Language } from "@/lib/themes";
import { proposalUiStrings } from "@/lib/i18n";
import styles from "./ProposalB.module.css";

interface Props {
  phases: CurriculumPhase[];
  lang: Language;
}

// Split an item string on " - " (our convention) OR on a leading **head**
// so the first chunk can be rendered bold.
function splitItem(item: string): [string, string] {
  const match = item.match(/^\*\*(.+?)\*\*(.*)$/);
  if (match) return [match[1], match[2]];
  const sep = item.indexOf(" - ");
  if (sep >= 0) return [item.slice(0, sep), item.slice(sep)];
  return [item, ""];
}

export function ProgramTimelineB({ phases, lang }: Props) {
  const t = proposalUiStrings[lang].timeline;
  const [active, setActive] = useState(0);
  const phase = phases[active];
  const paragraphs = phase.description.split("\n\n");

  return (
    <>
      <div className={styles.progTimeline} data-active={String(active)}>
        {phases.map((p, i) => {
          const cls = [
            styles.progStep,
            i === active && styles.active,
            i <= active && styles.done,
          ]
            .filter(Boolean)
            .join(" ");
          return (
            <button
              key={p.number}
              type="button"
              className={cls}
              onClick={() => setActive(i)}
              aria-pressed={i === active}
            >
              <div className={styles.dot}>{p.number}</div>
              <h3>{p.title}</h3>
              <p className={styles.dur}>{p.duration}</p>
            </button>
          );
        })}
      </div>

      <div className={styles.progPanel} aria-live="polite">
        <h4>{phase.title}</h4>
        {paragraphs.map((para, pi) => {
          const m = para.match(/^\*\*(.+?)\*\*(.*)$/);
          if (m) {
            return (
              <p key={pi}>
                <strong>{m[1]}</strong>
                {m[2]}
              </p>
            );
          }
          return <p key={pi}>{para}</p>;
        })}
        <ul>
          {phase.items.map((item) => {
            const [head, tail] = splitItem(item);
            return (
              <li key={item}>
                <Icon className="fa-solid fa-chevron-right" />
                <span>
                  <strong>{head}</strong>
                  {tail}
                </span>
              </li>
            );
          })}
        </ul>
        {phase.flexibility && phase.flexibility.length > 0 && (
          <p className={styles.extra}>
            <strong>{t.flexibility}: </strong>
            {phase.flexibility.join(" · ")}
          </p>
        )}
        {phase.globalMobility && (
          <p className={styles.extra}>
            <strong>{t.globalMobility}: </strong>
            {phase.globalMobility}
          </p>
        )}
      </div>
    </>
  );
}
