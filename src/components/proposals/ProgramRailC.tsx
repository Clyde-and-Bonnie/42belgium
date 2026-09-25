"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import type { CurriculumPhase } from "@/lib/i18n";
import type { Language } from "@/lib/themes";
import { proposalUiStrings } from "@/lib/i18n";
import styles from "./ProposalC.module.css";

interface Props {
  phases: CurriculumPhase[];
  lang: Language;
}

function splitItem(item: string): [string, string] {
  const match = item.match(/^\*\*(.+?)\*\*(.*)$/);
  if (match) return [match[1], match[2]];
  const sep = item.indexOf(" - ");
  if (sep >= 0) return [item.slice(0, sep), item.slice(sep)];
  return [item, ""];
}

export function ProgramRailC({ phases, lang }: Props) {
  const t = proposalUiStrings[lang].timeline;
  const [active, setActive] = useState(0);
  const phaseRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const onScroll = () => {
      let idx = 0;
      phaseRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.4) idx = i;
      });
      setActive(idx);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const jumpTo = (i: number) => {
    phaseRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className={styles.progLayout}>
      <div className={styles.progRail}>
        {phases.map((p, i) => (
          <button
            key={p.number}
            type="button"
            onClick={() => jumpTo(i)}
            className={i === active ? styles.active : ""}
            aria-current={i === active ? "true" : undefined}
          >
            <span className={styles.n}>{p.number}</span>
            <span className={styles.t}>{p.title}</span>
          </button>
        ))}
      </div>

      <div className={styles.progContent}>
        {phases.map((p, i) => {
          const paragraphs = p.description.split("\n\n");
          return (
            <article
              key={p.number}
              id={`ph-${i}`}
              ref={(el) => { phaseRefs.current[i] = el; }}
              className={styles.progPhase}
            >
              <div className={styles.phHead}>
                <span className={styles.phN}>{t.phase} {p.number}</span>
                <span className={styles.phDur}>{p.duration}</span>
              </div>
              <h3>{p.title}</h3>
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
              <ul className={styles.items}>
                {p.items.map((item) => {
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
              {p.globalMobility && (
                <div className={styles.extra}>
                  <strong>{t.globalMobility}: </strong>
                  {p.globalMobility}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
