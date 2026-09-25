/**
 * PROPOSITION C - Scroll-driven / App-like
 *
 * Ported from the static handoff HTML/CSS (handoff/Opportunity EN - Proposal C.html).
 * Reads the SAME canonical content as Proposals A and B. Key signatures:
 *   - Header NOT sticky (scrolled past, dock takes over)
 *   - Tabs inside "Why 42" (fuses clusters 1, 2, 3)
 *   - Sticky side-rail program with scroll-spy
 *   - Alternating full-bleed Open Day blocks
 *   - Turquoise final CTA with black button
 *   - Fixed bottom dock nav with active-section highlight
 */

import type { Cluster, PageContent } from "@/lib/i18n";
import { Icon } from "@/components/Icon";
import type { Language } from "@/lib/themes";
import { ApplyLink } from "./ApplyLink";
import { PartnerStrip } from "./PartnerStrip";
import { WhyTabsC } from "./WhyTabsC";
import { ProgramRailC } from "./ProgramRailC";
import { StoriesCarouselC } from "./StoriesCarouselC";
import { DockC } from "./DockC";
import styles from "./ProposalC.module.css";

export function ProposalC({ content, lang }: { content: PageContent; lang: Language }) {
  const {
    hero,
    clusters,
    afterForty,
    whatYouBuild,
    realStories,
    openDays,
    howToApply,
    faq,
    stats,
    ctaFinal,
  } = content;

  const whyTuple: [Cluster, Cluster, Cluster] = [
    clusters[0],
    clusters[1],
    clusters[2],
  ];

  return (
    <div className={styles.page}>
      {/* ─── HERO ─── */}
      <section className={styles.hero} id="top">
        <div className={styles.heroGrid}>
          <div className={styles.heroLeft}>
            <p className={styles.heroEyebrow}>
              <Icon className="fa-solid fa-rocket" />
              Free structured training
            </p>
            <h1 className={styles.heroH1}>
              {hero.headline.split("\n").map((line, i) => {
                if (i === 0) return <span key={i}>{line}<br /></span>;
                const words = line.split(" ");
                return (
                  <span key={i}>
                    <span className={styles.teal}>{words[0]}</span>
                    {words.length > 1 ? " " + words.slice(1).join(" ") : ""}
                  </span>
                );
              })}
            </h1>
            <p className={styles.heroLede}>{hero.subheadline}</p>
            <div className={styles.heroCtas}>
              <ApplyLink lang={lang} className={styles.btnPrimary}>
                {hero.cta.replace("→", "").trim()}{" "}
                <Icon className="fa-solid fa-arrow-right" />
              </ApplyLink>
              <a href="#after" className={styles.btnGhost}>
                See outcomes
              </a>
            </div>
            {hero.reassurance && (
              <div className={styles.heroReassurance}>
                {hero.reassurance.split(/\s*·\s*/).map((r) => (
                  <span key={r}>
                    <Icon className="fa-solid fa-check" />
                    {r}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className={styles.heroRight} aria-hidden="true" />
        </div>
        <div className={styles.heroBar} />
      </section>

      {/* ─── WHY 42 - tabbed composite ─── */}
      <section id="why" className={styles.why}>
        <div className={styles.whyInner}>
          <div className={styles.whyHead}>
            <p className={styles.secMarker}>Why 42</p>
            <h2>Three reasons this works.</h2>
          </div>
          <WhyTabsC clusters={whyTuple} lang={lang} />
        </div>
      </section>

      {/* ─── AFTER 42 ─── */}
      {afterForty && (
        <section id="after" className={styles.after}>
          <div className={styles.afterInner}>
            <div className={styles.afterGrid}>
              <div>
                <p className={styles.afterStat}>{afterForty.stat.value}</p>
                <p className={styles.afterStatLab}>{afterForty.stat.label}</p>
                <h2>{afterForty.heading}</h2>
                <p className={styles.body}>{afterForty.description}</p>
                {afterForty.communityNote && (
                  <p className={styles.afterNote}>
                    {afterForty.communityNote}
                  </p>
                )}
              </div>
              <div className={styles.afterCareers}>
                {afterForty.careers.map((career) => (
                  <div key={career.label} className={styles.afterCareer}>
                    <Icon className={career.icon} />
                    <span>{career.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── PARTNERS (shared) ─── */}
      <section id="partners">
        <PartnerStrip />
      </section>

      {/* ─── PROGRAM - sticky rail ─── */}
      {whatYouBuild && whatYouBuild.phases && (
        <section id="program" className={styles.prog}>
          <div className={styles.progInner}>
            <p className={styles.secMarker}>The program</p>
            <h2>{whatYouBuild.heading}</h2>
            <p className={styles.body}>{whatYouBuild.intro}</p>
            <ProgramRailC phases={whatYouBuild.phases} lang={lang} />
            {whatYouBuild.plusNote && (
              <p className={styles.progNote}>{whatYouBuild.plusNote}</p>
            )}
          </div>
        </section>
      )}

      {/* ─── STORIES - horizontal carousel ─── */}
      {realStories && realStories.videos.length > 0 && (
        <section className={styles.stories}>
          <div className={styles.storiesInner}>
            <p className={styles.secMarker}>Real students</p>
            <h2>{realStories.heading}</h2>
            <p className={styles.body}>{realStories.description}</p>
            <StoriesCarouselC videos={realStories.videos} />
          </div>
        </section>
      )}

      {/* ─── OPEN DAY - alternating full-bleed blocks ─── */}
      {openDays && (
        <section id="open-day" className={styles.open}>
          <div className={styles.openIntro}>
            <p className={styles.secMarker}>Campus visits</p>
            <h2>{openDays.heading}</h2>
            <p className={styles.body}>{openDays.intro}</p>
          </div>

          {openDays.campuses.map((campus, i) => {
            const blockClass = [
              styles.openBlock,
              i % 2 === 1 ? styles.openBlockReverse : "",
              i % 2 === 1 ? styles.openBlockDark : "",
            ]
              .filter(Boolean)
              .join(" ");
            const picClass =
              campus.name.toLowerCase() === "antwerp"
                ? styles.antwerp
                : styles.brussels;
            return (
              <div key={campus.name} className={blockClass}>
                <a
                  href={openDays.ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Register for Open Day in ${campus.name}`}
                  className={`${styles.openPic} ${picClass}`}
                />
                <div className={styles.openText}>
                  <p className={styles.city}>{campus.name}</p>
                  <h3>
                    {campus.address}
                    <br />
                    {campus.subHeading}
                  </h3>
                  <p>{campus.description}</p>
                  <a
                    href={openDays.ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.more}
                  >
                    See upcoming dates <Icon className="fa-solid fa-arrow-right" />
                  </a>
                </div>
              </div>
            );
          })}

          <div className={styles.openCtaRow}>
            <a
              href={openDays.ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnPrimary}
            >
              {openDays.ctaLabel} <Icon className="fa-solid fa-arrow-right" />
            </a>
          </div>
        </section>
      )}

      {/* ─── PATH ─── */}
      {howToApply && (
        <section id="apply" className={styles.path}>
          <div className={styles.pathInner}>
            <p className={styles.secMarker}>The path</p>
            <h2>{howToApply.heading}</h2>
            <div className={styles.pathList}>
              {howToApply.steps.map((step) => (
                <div key={step.number} className={styles.pathStep}>
                  <p className={styles.num}>{step.number}</p>
                  <div>
                    <h3>{step.title}</h3>
                    {step.description.split("\n\n").map((para, pi) => (
                      <p key={pi}>{para}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.pathCta}>
              <ApplyLink lang={lang} className={styles.btnPrimary}>
                {howToApply.ctaLabel.replace("→", "").trim()}{" "}
                <Icon className="fa-solid fa-arrow-right" />
              </ApplyLink>
              {howToApply.microcopy && <p>{howToApply.microcopy}</p>}
            </div>
          </div>
        </section>
      )}

      {/* ─── FAQ ─── */}
      {faq && faq.length > 0 && (
        <section id="faq" className={styles.faq}>
          <div className={styles.faqInner}>
            <p className={styles.secMarker}>Questions</p>
            <h2>Every question. Answered honestly.</h2>
            <div className={styles.faqList}>
              {faq.map((item, i) => (
                <details
                  key={item.question}
                  className={styles.faqItem}
                  open={i === 0}
                >
                  <summary>
                    <span>{item.question}</span>
                    <span className={styles.plus}>
                      <Icon className="fa-solid fa-plus" />
                    </span>
                  </summary>
                  <p className={styles.a}>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── STATS ─── */}
      {stats && stats.length > 0 && (
        <section className={styles.stats}>
          <div className={styles.statsInner}>
            <div className={styles.statsGrid}>
              {stats.map((s, i) => (
                <div key={i}>
                  <p className={styles.val}>{s.value}</p>
                  <p className={styles.lab}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── FINAL CTA - turquoise ─── */}
      {ctaFinal && (
        <section className={styles.final}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/3-chevrons-white.svg"
            alt=""
            aria-hidden="true"
            className={`${styles.ch} ${styles.ch1}`}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/3-chevrons-white.svg"
            alt=""
            aria-hidden="true"
            className={`${styles.ch} ${styles.ch2}`}
          />
          <div className={styles.finalInner}>
            <h2>
              {ctaFinal.title.split(" ").slice(0, -2).join(" ")}{" "}
              <span className={styles.black}>
                {ctaFinal.title.split(" ").slice(-2).join(" ")}
              </span>
            </h2>
            <p>{ctaFinal.description}</p>
            <div className={styles.finalCta}>
              <ApplyLink lang={lang} className={styles.big}>
                {ctaFinal.cta.replace("→", "").trim()}{" "}
                <Icon className="fa-solid fa-arrow-right" />
              </ApplyLink>
            </div>
          </div>
        </section>
      )}

      {/* ─── FLOATING DOCK ─── */}
      <DockC lang={lang} />
    </div>
  );
}
