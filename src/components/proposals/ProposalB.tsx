/**
 * PROPOSITION B - Editorial / Magazine
 *
 * Ported from the static handoff HTML/CSS (handoff/Opportunity EN - Proposal B.html).
 * Reads the SAME canonical content as Proposals A and C - only the design differs.
 * Interactive parts are client components (ProgramTimelineB, StoryThumb).
 * The shared Header sits above (transparent → white on scroll, threshold 40px
 * auto-applied on the /proposals/b route).
 */

import type { PageContent } from "@/lib/i18n";
import { Icon } from "@/components/Icon";
import type { Language } from "@/lib/themes";
import { ApplyLink } from "./ApplyLink";
import { PartnerStrip } from "./PartnerStrip";
import { ProgramTimelineB } from "./ProgramTimelineB";
import { StoryThumb } from "./StoryThumb";
import { LookForTag } from "./LookForTag";
import styles from "./ProposalB.module.css";

export function ProposalB({ content, lang }: { content: PageContent; lang: Language }) {
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

  const cluster1 = clusters[0];
  const cluster2 = clusters[1];
  const cluster3 = clusters[2];

  return (
    <div className={styles.page}>
      {/* ─── HERO ─── */}
      <section className={styles.hero}>
        <div className={styles.heroImg} aria-hidden="true" />
        <div className={styles.heroInner}>
          <div>
            <p className={styles.heroEyebrow}>
              <Icon className="fa-solid fa-rocket" />
              Free structured training
            </p>
            <h1 className={styles.heroH1}>
              {hero.headline.split("\n").map((line, i) => {
                if (i === 0) return <span key={i}>{line}<br /></span>;
                // Second line: colour the first word (Remotely / Remote / ...) pink
                const words = line.split(" ");
                return (
                  <span key={i}>
                    <span className={styles.pink}>{words[0]}</span>
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
                See the outcomes
              </a>
            </div>
          </div>
          {hero.reassurance && (
            <p className={styles.heroReassurance}>{hero.reassurance}</p>
          )}
        </div>
        <div className={styles.heroBar} />
      </section>

      {/* ─── CLUSTER 01 - FLEXIBILITY & REMOTE WORK ─── */}
      <section id="why" className={styles.c1}>
        <div className={styles.c1Inner}>
          <div className={styles.c1Head}>
            <p className={styles.secMarker}>{cluster1.name}</p>
            <div className={styles.c1HeadRow}>
              <h2>{cluster1.heading}</h2>
              <p className={styles.body}>{cluster1.body}</p>
            </div>
          </div>
          {cluster1.bullets && cluster1.bullets.length > 0 && (
            <div className={styles.c1Cards}>
              {cluster1.bullets.map((bullet, i) => (
                <div key={bullet} className={styles.c1Card}>
                  <p className={styles.num}>{String(i + 1).padStart(2, "0")}</p>
                  <p className={styles.txt}>{bullet}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── CLUSTER 02 - ACCESSIBLE FREE TRAINING ─── */}
      <section className={styles.c2}>
        <div className={styles.c2Inner}>
          <div className={styles.c2Head}>
            <div className={styles.c2Img}>
              <div className={styles.bg} aria-hidden="true" />
              <div
                className={styles.pic}
                role="img"
                aria-label="Students at 42 Belgium Antwerp campus"
              />
            </div>
            <div>
              <p className={styles.secMarker}>{cluster2.name}</p>
              <h2>{cluster2.heading}</h2>
              <p className={styles.body}>{cluster2.body}</p>
            </div>
          </div>

          {cluster2.subheading && (
            <div className={styles.c2Divider}>
              <h3>{cluster2.subheading}</h3>
              <span className={styles.rule} />
            </div>
          )}
          {cluster2.bodyPart2 && (
            <p className={styles.c2Copy}>{cluster2.bodyPart2}</p>
          )}

          {cluster2.comparison && (() => {
            const criteria = ["Learning", "Proof", "Feedback", "Support", "Motivation"];
            return (
              <div className={styles.c2Vs}>
                {/* Header row — column labels */}
                <div className={`${styles.c2VsRow} ${styles.c2VsHeadRow}`}>
                  <div />
                  <p className={`${styles.c2VsHead} ${styles.c2VsHeadLeft}`}>
                    {cluster2.comparison.leftLabel}
                  </p>
                  <p className={`${styles.c2VsHead} ${styles.c2VsHeadRight}`}>
                    {cluster2.comparison.rightLabel}
                  </p>
                </div>
                {/* Body rows */}
                {cluster2.comparison.rows.map((row, ri) => (
                  <div key={ri} className={styles.c2VsRow}>
                    <p className={styles.c2VsCrit}>
                      {criteria[ri] || `#${ri + 1}`}
                    </p>
                    <div className={`${styles.c2VsCell} ${styles.c2VsCellLeft}`}>
                      <Icon className="fa-solid fa-xmark" />
                      <span>{row.left}</span>
                    </div>
                    <div className={`${styles.c2VsCell} ${styles.c2VsCellRight}`}>
                      <Icon className="fa-solid fa-check" />
                      <span>{row.right}</span>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </section>

      {/* ─── CLUSTER 03 - LOW BARRIER ─── */}
      <section className={styles.c3}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/3-chevrons-blue.svg"
          alt=""
          aria-hidden="true"
          className={styles.chBlue}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/3-chevrons-pink.svg"
          alt=""
          aria-hidden="true"
          className={styles.chPink}
        />
        <div className={styles.c3Inner}>
          <div className={styles.c3Head}>
            <p className={styles.secMarker}>{cluster3.name}</p>
            <h2>{cluster3.heading}</h2>
            <p className={styles.body}>{cluster3.body}</p>
            {cluster3.subheading && <h3>{cluster3.subheading}</h3>}
            {cluster3.bodyPart2 && (
              <p className={styles.body2}>{cluster3.bodyPart2}</p>
            )}
          </div>
          {(cluster3.dontAsk || cluster3.lookFor) && (
            <div className={styles.c3Grid}>
              <div className={`${styles.c3Col} ${styles.c3ColLeft}`}>
                <h4>What we don&apos;t ask for</h4>
                <ul>
                  {(cluster3.dontAsk || []).map((item) => (
                    <li key={item}>
                      <span className={styles.strike}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`${styles.c3Col} ${styles.c3ColRight}`}>
                <h4>What we look for</h4>
                <div className={styles.tagRow}>
                  {(cluster3.lookFor || []).map((item) => (
                    <LookForTag key={item} lang={lang} className={styles.tagBtn}>
                      {item}
                    </LookForTag>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div className={styles.c3Cta}>
            <ApplyLink lang={lang} className={styles.btnPrimary}>
              Start your application <Icon className="fa-solid fa-arrow-right" />
            </ApplyLink>
          </div>
        </div>
      </section>

      {/* ─── AFTER 42 ─── */}
      {afterForty && (
        <section id="after" className={styles.after}>
          <div className={styles.afterInner}>
            <div className={styles.afterHead}>
              <div>
                <p className={styles.afterStat}>{afterForty.stat.value}</p>
                <p className={styles.afterStatLab}>{afterForty.stat.label}</p>
              </div>
              <div>
                <p className={styles.secMarker}>The outcome</p>
                <h2>{afterForty.heading}</h2>
                <p className={styles.body}>{afterForty.description}</p>
              </div>
            </div>
            <div className={styles.afterCareers}>
              {afterForty.careers.map((career) => (
                <div key={career.label} className={styles.afterCareer}>
                  <Icon className={career.icon} />
                  <span>{career.label}</span>
                </div>
              ))}
            </div>
            {afterForty.communityNote && (
              <p className={styles.afterNote}>{afterForty.communityNote}</p>
            )}
          </div>
        </section>
      )}

      {/* ─── PARTNERS (shared) ─── */}
      <PartnerStrip />

      {/* ─── THE PROGRAM - horizontal timeline ─── */}
      {whatYouBuild && whatYouBuild.phases && (
        <section className={styles.prog}>
          <div className={styles.progInner}>
            <p className={styles.secMarker}>The program</p>
            <h2>{whatYouBuild.heading}</h2>
            <p className={styles.body}>{whatYouBuild.intro}</p>
            <ProgramTimelineB phases={whatYouBuild.phases} lang={lang} />
            {whatYouBuild.plusNote && (
              <p className={styles.progNote}>{whatYouBuild.plusNote}</p>
            )}
          </div>
        </section>
      )}

      {/* ─── REAL STORIES - one big + two small ─── */}
      {realStories && realStories.videos.length > 0 && (
        <section className={styles.stories}>
          <div className={styles.storiesInner}>
            <p className={styles.secMarker}>Testimonials</p>
            <h2>{realStories.heading}</h2>
            <p className={styles.body}>{realStories.description}</p>
            <div className={styles.storiesGrid}>
              <StoryThumb
                youtubeId={realStories.videos[0].youtubeId}
                name={realStories.videos[0].name}
                subtitle={realStories.videos[0].subtitle}
                big
                cardClass={`${styles.story} ${styles.storyBig}`}
                thumbClass={styles.thumb}
                playClass={styles.play}
                metaClass={styles.meta}
                nameClass={styles.name}
                subClass={styles.sub}
              />
              <div className={styles.storiesSub}>
                {realStories.videos.slice(1, 3).map((v) => (
                  <StoryThumb
                    key={v.youtubeId}
                    youtubeId={v.youtubeId}
                    name={v.name}
                    subtitle={v.subtitle}
                    cardClass={styles.story}
                    thumbClass={styles.thumb}
                    playClass={styles.play}
                    metaClass={styles.meta}
                    nameClass={styles.name}
                    subClass={styles.sub}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── OPEN DAY ─── */}
      {openDays && (
        <section id="open-day" className={styles.open}>
          <div className={styles.openInner}>
            <p className={styles.secMarker}>Campus visits</p>
            <h2>{openDays.heading}</h2>
            <p className={styles.body}>{openDays.intro}</p>
            <div className={styles.openGrid}>
              {openDays.campuses.map((campus) => (
                <a
                  key={campus.name}
                  href={openDays.ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.openCard}
                  aria-label={`Register for Open Day in ${campus.name}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={campus.image}
                    alt={`42 Belgium ${campus.name} campus`}
                  />
                  <span className={styles.label}>{campus.name}</span>
                </a>
              ))}
            </div>
            <div className={styles.openCta}>
              <a
                href={openDays.ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnPrimary}
              >
                {openDays.ctaLabel} <Icon className="fa-solid fa-arrow-right" />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ─── THE PATH ─── */}
      {howToApply && (
        <section id="apply" className={styles.path}>
          <div className={styles.pathInner}>
            <p className={styles.secMarker}>The path</p>
            <h2>{howToApply.heading}</h2>
            <div className={styles.pathSteps}>
              {howToApply.steps.map((step) => (
                <div key={step.number} className={styles.pathStep}>
                  <p className={styles.num}>{step.number}</p>
                  <h3>{step.title}</h3>
                  {step.description.split("\n\n").map((para, pi) => (
                    <p key={pi}>{para}</p>
                  ))}
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
            <div className={styles.faqGrid}>
              {(() => {
                const half = Math.ceil(faq.length / 2);
                const columns = [faq.slice(0, half), faq.slice(half)];
                return columns.map((col, colIdx) => (
                  <div key={colIdx} className={styles.faqCol}>
                    {col.map((item, i) => (
                      <details
                        key={item.question}
                        className={styles.faqItem}
                        open={colIdx === 0 && i === 0}
                      >
                        <summary>
                          {item.question}
                          <Icon className="fa-solid fa-plus" />
                        </summary>
                        <p className={styles.a}>{item.answer}</p>
                      </details>
                    ))}
                  </div>
                ));
              })()}
            </div>
          </div>
        </section>
      )}

      {/* ─── STATS BAR ─── */}
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

      {/* ─── FINAL CTA ─── */}
      {ctaFinal && (
        <section className={styles.final}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/3-chevrons-pink.svg"
            alt=""
            aria-hidden="true"
            className={`${styles.ch} ${styles.ch1}`}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/3-chevrons-pink.svg"
            alt=""
            aria-hidden="true"
            className={`${styles.ch} ${styles.ch2}`}
          />
          <div className={styles.finalInner}>
            <h2>
              {ctaFinal.title.split(" ").slice(0, -2).join(" ")}{" "}
              <span className={styles.pink}>
                {ctaFinal.title.split(" ").slice(-2).join(" ")}
              </span>
            </h2>
            <p>{ctaFinal.description}</p>
            <div className={styles.finalCta}>
              <ApplyLink lang={lang} className={styles.btnPrimary}>
                {ctaFinal.cta.replace("→", "").trim()}{" "}
                <Icon className="fa-solid fa-arrow-right" />
              </ApplyLink>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
