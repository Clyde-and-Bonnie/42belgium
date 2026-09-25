"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import type { Cluster } from "@/lib/i18n";
import type { Language } from "@/lib/themes";
import { ApplyLink } from "./ApplyLink";
import { LookForTag } from "./LookForTag";
import styles from "./ProposalC.module.css";

interface Props {
  clusters: [Cluster, Cluster, Cluster];
  lang: Language;
}

/**
 * Why 42 — three-tab composite on desktop, stacked accordion on mobile.
 * Desktop container and mobile container are both rendered; CSS toggles
 * which is visible at the 900px breakpoint.
 */
export function WhyTabsC({ clusters, lang }: Props) {
  const [active, setActive] = useState(0);
  const [c1, c2, c3] = clusters;

  const tabs = [
    { label: "Flexibility & remote work", num: "01" },
    { label: "Free - not a MOOC", num: "02" },
    { label: "No barriers to entry", num: "03" },
  ];

  const pane1Content = (
    <div className={styles.whyP1Grid}>
      <div>
        <h3>{c1.heading}</h3>
        <p className={styles.body}>{c1.body}</p>
      </div>
      {c1.bullets && c1.bullets.length > 0 && (
        <ul className={styles.whyBullets}>
          {c1.bullets.map((b) => (
            <li key={b}>
              <span className={styles.check}>
                <Icon className="fa-solid fa-check" />
              </span>
              {b}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const pane2Content = (
    <>
      <div className={styles.whyP2Top}>
        <div>
          <h3>{c2.heading}</h3>
          <p className={styles.body}>{c2.body}</p>
          {c2.bodyPart2 && (
            <p className={styles.whyP2Body}>{c2.bodyPart2}</p>
          )}
        </div>
        <div className={styles.whyP2Img}>
          <div className={styles.bg} aria-hidden="true" />
          <div
            className={styles.pic}
            role="img"
            aria-label="Students at 42 Belgium"
          />
        </div>
      </div>
      {c2.subheading && <p className={styles.whyP2Sub}>{c2.subheading}</p>}
      {c2.comparison && (() => {
        const criteria = ["Learning", "Proof", "Feedback", "Support", "Motivation"];
        return (
          <div className={styles.whyP2Table}>
            <div className={styles.whyP2Th} />
            <div className={`${styles.whyP2Th} ${styles.whyP2ThLeft}`}>
              {c2.comparison.leftLabel}
            </div>
            <div className={`${styles.whyP2Th} ${styles.whyP2ThRight}`}>
              {c2.comparison.rightLabel}
            </div>
            {c2.comparison.rows.map((row, ri) => {
              const last = ri === c2.comparison!.rows.length - 1;
              return (
                <div key={ri} style={{ display: "contents" }}>
                  <div
                    className={`${styles.whyP2Crit} ${last ? styles.whyP2CellLast : ""}`}
                  >
                    {criteria[ri] || `#${ri + 1}`}
                  </div>
                  <div
                    className={`${styles.whyP2Cell} ${styles.whyP2CellLeft} ${last ? styles.whyP2CellLast : ""}`}
                  >
                    <Icon className="fa-solid fa-xmark" />
                    {row.left}
                  </div>
                  <div
                    className={`${styles.whyP2Cell} ${styles.whyP2CellRight} ${styles.whyP2CellRight2} ${last ? styles.whyP2CellLast : ""}`}
                  >
                    <Icon className="fa-solid fa-check" />
                    {row.right}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })()}
    </>
  );

  const pane3Content = (
    <>
      <div className={styles.whyP3Grid}>
        <div>
          <h3>{c3.heading}</h3>
          <p className={styles.body}>{c3.body}</p>
          {c3.subheading && <h4>{c3.subheading}</h4>}
          {c3.bodyPart2 && <p className={styles.body2}>{c3.bodyPart2}</p>}
        </div>
        <div className={styles.whyP3Tags}>
          {c3.dontAsk && c3.dontAsk.length > 0 && (
            <div className={styles.whyP3TagsDont}>
              <h5>What we don&apos;t ask for</h5>
              <div className={styles.whyP3Row}>
                {c3.dontAsk.map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>
            </div>
          )}
          {c3.lookFor && c3.lookFor.length > 0 && (
            <div className={styles.whyP3TagsLook}>
              <h5>What we look for</h5>
              <div className={styles.whyP3Row}>
                {c3.lookFor.map((l) => (
                  <LookForTag key={l} lang={lang}>{l}</LookForTag>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={styles.whyCta}>
        <ApplyLink lang={lang} className={styles.btnPrimary}>
          Start your application <Icon className="fa-solid fa-arrow-right" />
        </ApplyLink>
      </div>
    </>
  );

  const panes = [pane1Content, pane2Content, pane3Content];

  return (
    <>
      {/* Desktop — tabs + panes */}
      <div className={styles.whyDesktop}>
        <div className={styles.whyTabs} role="tablist">
          {tabs.map((t, i) => (
            <button
              key={t.label}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-controls={`why-pane-${i}`}
              id={`why-tab-${i}`}
              className={`${styles.whyTab} ${i === active ? styles.active : ""}`}
              onClick={() => setActive(i)}
            >
              <span className={styles.num}>{t.num}</span> {t.label}
            </button>
          ))}
        </div>

        {panes.map((content, i) => (
          <div
            key={i}
            id={`why-pane-${i}`}
            role="tabpanel"
            aria-labelledby={`why-tab-${i}`}
            className={styles.whyPane}
            hidden={active !== i}
          >
            {content}
          </div>
        ))}
      </div>

      {/* Mobile — stacked accordion */}
      <div className={styles.whyMobile}>
        {tabs.map((t, i) => (
          <details
            key={t.label}
            className={styles.whyAcc}
            open={i === 0}
          >
            <summary>
              <span className={styles.num}>{t.num}</span>
              <span>{t.label}</span>
              <Icon className={`fa-solid fa-plus ${styles.whyAccPlus}`} aria-hidden="true" />
            </summary>
            <div className={styles.whyAccContent}>{panes[i]}</div>
          </details>
        ))}
      </div>
    </>
  );
}
