/**
 * PROPOSITION A - Bold / Story design variant
 *
 * Reads the SAME canonical content as Proposals B and C - only the design
 * differs. Design signatures of this variant:
 *   - Dark dominant palette (black + teal accent)
 *   - Large, confident typography (7xl hero)
 *   - Numbered section markers ("01 / 02 / 03") creating a narrative flow
 *   - Alternating sections (black → white → zinc-100) for visual rhythm
 *   - Story-first: 98% stat hero, MOOC comparison as visual moment
 */

import Link from "next/link";
import { Icon } from "@/components/Icon";
import Image from "next/image";
import type { PageContent } from "@/lib/i18n";
import { proposalUiStrings } from "@/lib/i18n";
import type { Language } from "@/lib/themes";
import { YouTubeEmbed } from "./YouTubeEmbed";
import { TimelineAccordion } from "./TimelineAccordion";
import { ApplyLink } from "./ApplyLink";
import { PartnerStrip } from "./PartnerStrip";
import { LookForTag } from "./LookForTag";
import { FaqAccordion } from "./FaqAccordion";

export function ProposalA({ content, lang }: { content: PageContent; lang: Language }) {
  const { hero, clusters, afterForty, whatYouBuild, realStories, howToApply, openDays, faq, stats, ctaFinal } = content;

  // The hero image is hidden below the `sm` breakpoint, so on mobile the first
  // cluster that carries an image is the largest above-the-fold image — i.e. the
  // mobile LCP. Load it eagerly (priority) instead of next/image's default lazy,
  // otherwise the LCP image is fetched far too late on slow connections.
  const firstImageClusterIdx = clusters.findIndex((c) => c.image);
  const t = proposalUiStrings[lang];

  return (
    <>
      {/* ─── HERO - full width, text left, image right ─── */}
      <section className="relative bg-black text-white overflow-hidden">
        {/* Image - absolute, pinned to right half, full section height */}
        <div className="absolute top-0 right-0 bottom-0 w-1/2 hidden sm:block">
          <Image
            src={hero.image ?? "/assets/gallery/Skills-42Blegium-1.png"}
            alt={hero.imageAlt ?? "42 Belgium students building tech skills"}
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover object-center"
            quality={85}
          />
        </div>
        {/* Text - left half, generous left padding, no max-width container */}
        <div className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 pl-[max(48px,calc((100vw-1400px)/2+48px))] pr-10 sm:pr-0">
          <div className="sm:w-1/2 sm:pr-24 lg:pr-32">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[var(--color-primary)] mb-6">
              <Icon className="fa-solid fa-rocket mr-2" />
              {t.hero.eyebrow}
            </p>
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              {hero.headline.split("\n").map((line, i) => (
                <span key={i}>{i > 0 && <br />}{line}</span>
              ))}
            </h1>
            <p className="mt-8 text-lg leading-relaxed text-zinc-300 max-w-lg">
              {hero.subheadline}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <ApplyLink lang={lang} className="inline-flex items-center justify-center bg-[var(--color-primary)] text-white font-bold uppercase tracking-wider px-10 py-4 text-base hover:brightness-110 transition-all">
                {hero.cta}
              </ApplyLink>
              <Link
                href="#after"
                className="inline-flex items-center justify-center border-2 border-zinc-400 text-zinc-300 font-bold uppercase tracking-wider px-10 py-4 text-base hover:border-white hover:text-white transition-all"
              >
                {t.hero.secondaryCta}
              </Link>
            </div>
            {hero.reassurance && (
              <p className="mt-6 text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                {hero.reassurance}
              </p>
            )}
          </div>
        </div>
        <div className="h-1 w-full bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-secondary)]/25" />
      </section>

      {/* ─── CLUSTERS ─── */}
      {clusters.map((cluster, i) => {
        const isEven = i % 2 === 0;
        const bgClass = isEven ? "bg-white text-black" : "bg-zinc-100 text-black";
        const isLowBarrier = cluster.lowBarrier === true;
        return (
          <section
            key={cluster.name}
            className={`${bgClass}${isLowBarrier || cluster.decoration ? " relative overflow-hidden" : ""}`}
          >
            {!isLowBarrier && cluster.decoration && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cluster.decoration}
                  alt=""
                  aria-hidden="true"
                  style={{ opacity: cluster.decorationOpacity ?? 0.1 }}
                  className={`pointer-events-none absolute w-[420px] sm:w-[520px] select-none ${
                    {
                      "top-left": "-top-8 -left-10",
                      "top-right": "-top-8 -right-10",
                      "bottom-left": "-bottom-8 -left-10",
                      "bottom-right": "-bottom-8 -right-10",
                    }[cluster.decorationPosition ?? "bottom-right"]
                  }`}
                />
              </>
            )}
            {isLowBarrier && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/3-chevrons-blue.svg"
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-6 -left-20 w-[300px] sm:w-[380px] opacity-[0.1] select-none"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/3-chevrons-pink.svg"
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-10 -right-16 w-[320px] sm:w-[420px] opacity-[0.1] select-none"
                />
              </>
            )}
            <div className={`mx-auto max-w-5xl px-6 py-20 sm:py-28${isLowBarrier || cluster.decoration ? " relative" : ""}`}>
              {isLowBarrier ? (
                <div className="grid gap-12 lg:grid-cols-2 items-start">
                  {/* LEFT - text content */}
                  <div>
                    <p className="text-base font-bold uppercase tracking-[0.3em] text-[var(--color-primary)] mb-4">
                      {String(i + 1).padStart(2, "0")} · {cluster.name}
                    </p>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                      {cluster.heading}
                    </h2>
                    <p className="mt-6 text-lg leading-relaxed text-zinc-700">
                      {cluster.body}
                    </p>
                    {cluster.subheading && (
                      <h3 className="mt-8 text-2xl font-bold tracking-tight text-black">
                        {cluster.subheading}
                      </h3>
                    )}
                    {cluster.bodyPart2 && (
                      <p className="mt-4 text-lg leading-relaxed text-zinc-700">
                        {cluster.bodyPart2}
                      </p>
                    )}
                  </div>
                  {/* RIGHT - tag groups, offset to align with the H2 */}
                  <div className="space-y-10">
                    {/* Invisible spacer matching the eyebrow so the first group aligns with the H2 */}
                    <p
                      aria-hidden="true"
                      className="hidden lg:block invisible text-sm font-bold uppercase tracking-[0.3em] mb-4"
                    >
                      &nbsp;
                    </p>
                    {cluster.dontAsk && cluster.dontAsk.length > 0 && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-500 mb-5">
                          {t.cluster.dontAskLabel}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {cluster.dontAsk.map((bullet, bi) => (
                            <span
                              key={bi}
                              className="inline-flex items-center px-4 py-2 border border-zinc-300 bg-white text-sm font-bold uppercase tracking-wider text-zinc-600"
                            >
                              {bullet}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {cluster.lookFor && cluster.lookFor.length > 0 && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-primary)] mb-5">
                          {t.cluster.lookForLabel}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {cluster.lookFor.map((bullet, bi) => (
                            <LookForTag key={bi} lang={lang}>{bullet}</LookForTag>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : cluster.image ? (
                <div className={`grid gap-12 items-stretch ${cluster.imageLeft ? "lg:grid-cols-[440px_1fr]" : "lg:grid-cols-[1fr_440px]"}`}>
                  <div className={cluster.imageLeft ? "lg:order-2" : undefined}>
                    <p className="text-base font-bold uppercase tracking-[0.3em] text-[var(--color-primary)] mb-4">
                      {String(i + 1).padStart(2, "0")} · {cluster.name}
                    </p>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                      {cluster.heading}
                    </h2>
                    <p className="mt-6 text-lg leading-relaxed text-zinc-700">
                      {cluster.body}
                    </p>
                  </div>
                  {/* Image with pink offset block behind - 42 Belgium signature treatment */}
                  <div className={`relative min-h-[280px] lg:min-h-0 ${cluster.imageLeft ? "lg:order-1" : ""}`}>
                    <div
                      aria-hidden="true"
                      className={`absolute inset-0 bg-[var(--color-secondary)] translate-y-2 ${cluster.imageLeft ? "-translate-x-2" : "translate-x-2"}`}
                    />
                    <div className="relative w-full h-full overflow-hidden">
                      <Image
                        src={cluster.image}
                        alt={cluster.imageAlt || ""}
                        fill
                        sizes="(min-width: 1024px) 440px, 100vw"
                        className="object-cover"
                        priority={i === firstImageClusterIdx}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-base font-bold uppercase tracking-[0.3em] text-[var(--color-primary)] mb-4">
                    {String(i + 1).padStart(2, "0")} · {cluster.name}
                  </p>
                  <h2 className="text-3xl font-bold tracking-tight sm:text-4xl max-w-3xl">
                    {cluster.heading}
                  </h2>
                  <p className="mt-6 text-lg leading-relaxed text-zinc-700 max-w-3xl">
                    {cluster.body}
                  </p>
                </>
              )}
              {!isLowBarrier && cluster.subheading && (
                <h3 className="mt-10 text-2xl font-bold tracking-tight text-black">
                  {cluster.subheading}
                </h3>
              )}
              {!isLowBarrier && cluster.bodyPart2 && (
                <p className="mt-4 text-lg leading-relaxed text-zinc-700 max-w-3xl">
                  {cluster.bodyPart2}
                </p>
              )}

              {/* Comparison block - asymmetric (42 column elevated) */}
              {cluster.comparison && (() => {
                const criteria = cluster.comparison.criteria || [];
                const labelFor = (ri: number) =>
                  criteria[ri] || t.cluster.comparisonCriteriaFallback.replace("{n}", String(ri + 1));
                return (
                  <div className="mt-12">
                    {/* Desktop: 3-col grid (sm and up) */}
                    <div className="hidden sm:grid grid-cols-[160px_1fr_1.1fr]">
                      {/* Header row */}
                      <div />
                      <div className="px-6 py-5 flex items-center justify-center border-l border-t border-b border-zinc-200">
                        <p className="text-sm font-bold uppercase tracking-[0.25em] text-zinc-400">
                          {cluster.comparison!.leftLabel}
                        </p>
                      </div>
                      <div className="px-6 py-5 bg-[var(--color-primary)] flex items-center justify-center shadow-[0_-4px_20px_-8px_rgba(0,0,0,0.15)]">
                        <p className="text-base font-bold uppercase tracking-[0.25em] text-white">
                          {cluster.comparison!.rightLabel}
                        </p>
                      </div>
                      {/* Feature rows */}
                      {cluster.comparison!.rows.map((row, ri) => {
                        const isLast = ri === cluster.comparison!.rows.length - 1;
                        return (
                          <div key={ri} className="contents">
                            {/* Criterion label */}
                            <div className={`px-6 py-6 bg-white flex items-center border-r border-zinc-200 ${!isLast ? "border-b border-zinc-200" : ""}`}>
                              <p className="text-sm font-bold uppercase tracking-wider text-black">
                                {labelFor(ri)}
                              </p>
                            </div>
                            {/* MOOC cell - muted */}
                            <div className="px-6 py-6 flex items-center gap-4 border-b border-zinc-200">
                              <Icon className="fa-solid fa-xmark text-[var(--color-secondary)] text-base shrink-0" />
                              <p className="text-base text-zinc-500">{row.left}</p>
                            </div>
                            {/* 42 cell - elevated, teal-tinted, bold */}
                            <div className={`px-6 py-6 flex items-center gap-4 bg-[var(--color-primary)]/5 border-l-4 border-[var(--color-primary)] ${!isLast ? "border-b border-b-zinc-200" : ""}`}>
                              <Icon className="fa-solid fa-check text-[var(--color-primary)] text-2xl shrink-0" />
                              <p className="text-base font-bold text-black leading-snug">{row.right}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Mobile: stacked cards per criterion */}
                    <div className="sm:hidden space-y-8">
                      {cluster.comparison!.rows.map((row, ri) => (
                        <div key={ri}>
                          <p className="text-sm font-bold uppercase tracking-wider text-black mb-3">
                            {criteria[ri] || `Feature ${ri + 1}`}
                          </p>
                          <div className="space-y-2">
                            {/* MOOC card */}
                            <div className="px-5 py-4 border border-zinc-200 bg-white">
                              <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-2">
                                {cluster.comparison!.leftLabel}
                              </p>
                              <div className="flex items-start gap-3">
                                <Icon className="fa-solid fa-xmark text-[var(--color-secondary)] text-base shrink-0 mt-1" />
                                <p className="text-base text-zinc-500">{row.left}</p>
                              </div>
                            </div>
                            {/* 42 card */}
                            <div className="px-5 py-4 bg-[var(--color-primary)]/5 border-l-4 border-[var(--color-primary)]">
                              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)] mb-2">
                                {cluster.comparison!.rightLabel}
                              </p>
                              <div className="flex items-start gap-3">
                                <Icon className="fa-solid fa-check text-[var(--color-primary)] text-xl shrink-0 mt-0.5" />
                                <p className="text-base font-bold text-black leading-snug">{row.right}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {isLowBarrier && (
                <div className="mt-14 flex justify-center">
                  <ApplyLink lang={lang} className="group inline-flex items-center gap-3 bg-[var(--color-primary)] text-white font-bold uppercase tracking-wider px-10 py-4 text-base hover:brightness-110 transition-all">
                    {t.cluster.applyCta}
                    <Icon className="fa-solid fa-arrow-right text-sm transition-transform duration-200 group-hover:translate-x-1" />
                  </ApplyLink>
                </div>
              )}
              {cluster.bullets && cluster.bullets.length > 0 && !isLowBarrier && (
                <ul className="mt-12 space-y-0 border-l-2 border-[var(--color-primary)] ml-1">
                  {cluster.bullets.map((bullet, bi) => (
                    <li key={bi} className="flex items-center gap-5 py-5 pl-6 border-b border-zinc-200 last:border-b-0">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-[var(--color-primary)] text-white">
                        <Icon className="fa-solid fa-check" />
                      </span>
                      <p className="text-base font-bold text-black">{bullet}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        );
      })}

      {/* ─── AFTER 42 ─── */}
      {afterForty && (
        <section id="after" className="bg-black text-white">
          <div className="mx-auto max-w-5xl px-6 py-24 sm:py-32">
            <p className="text-base font-bold uppercase tracking-[0.3em] text-[var(--color-primary)] mb-4">
              {t.afterForty.eyebrow}
            </p>
            <div className="grid gap-12 sm:grid-cols-2 items-start">
              <div>
                <p className="text-7xl sm:text-8xl font-bold text-[var(--color-primary)] leading-none">
                  {afterForty.stat.value}
                </p>
                <p className="mt-3 text-base uppercase tracking-wider text-zinc-300">
                  {afterForty.stat.label}
                </p>
                <h2 className="mt-10 text-3xl font-bold tracking-tight sm:text-4xl">
                  {afterForty.heading}
                </h2>
                <p className="mt-6 text-lg leading-relaxed text-zinc-300">
                  {afterForty.description}
                </p>
              </div>
              <div className="grid gap-3">
                {afterForty.careers.map((career) => (
                  <div
                    key={career.label}
                    className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 p-4"
                  >
                    <Icon className={`${career.icon} text-[var(--color-primary)] text-xl w-6`} />
                    <span className="text-base">{career.label}</span>
                  </div>
                ))}
                {afterForty.communityNote && (
                  <p className="mt-4 text-sm text-zinc-300 italic leading-relaxed">
                    {afterForty.communityNote}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── PARTNER STRIP - between The Outcome and The Program ─── */}
      <PartnerStrip />

      {/* ─── WHAT YOU'LL BUILD - timeline accordion ─── */}
      {whatYouBuild && whatYouBuild.phases && (
        <section className="bg-white text-black">
          <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
            <p className="text-base font-bold uppercase tracking-[0.3em] text-[var(--color-primary)] mb-4">
              {t.whatYouBuild.eyebrow}
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl max-w-3xl">
              {whatYouBuild.heading}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-zinc-700 max-w-3xl">
              {whatYouBuild.intro}
            </p>
            <div className="mt-12">
              <TimelineAccordion phases={whatYouBuild.phases} lang={lang} />
            </div>
            {whatYouBuild.plusNote && (
              <p className="mt-8 text-sm text-zinc-600 italic leading-relaxed max-w-3xl">
                {whatYouBuild.plusNote}
              </p>
            )}
          </div>
        </section>
      )}

      {/* ─── REAL STORIES (video embeds) ─── */}
      {realStories && (
        <section className="bg-zinc-100">
          <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
            <p className="text-base font-bold uppercase tracking-[0.3em] text-[var(--color-secondary)] mb-4">
              {t.realStories.eyebrow}
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl max-w-3xl text-black">
              {realStories.heading}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-zinc-700 max-w-3xl">
              {realStories.description}
            </p>
            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {realStories.videos.map((video) => (
                <div key={video.youtubeId}>
                  <YouTubeEmbed youtubeId={video.youtubeId} title={`${video.name} - ${video.subtitle}`} />
                  <p className="mt-4 text-lg font-bold text-black">{video.name}</p>
                  <p className="text-xs uppercase tracking-wider text-zinc-600">{video.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── OPEN DAYS ─── */}
      {openDays && openDays.campuses && openDays.campuses.length > 0 && (
        <section className="bg-white text-black">
          <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
            <p className="text-base font-bold uppercase tracking-[0.3em] text-[var(--color-primary)] mb-4">
              {t.openDays.eyebrow}
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl max-w-3xl">
              {openDays.heading}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-zinc-700 max-w-3xl">
              {openDays.intro}
            </p>
            <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2">
              {openDays.campuses.map((campus) => (
                <div key={campus.name}>
                  <a
                    href={openDays.ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Register for Open Day in ${campus.name}`}
                    className="relative aspect-[4/3] overflow-hidden group block"
                  >
                    <Image
                      src={campus.image}
                      alt={`42 Belgium ${campus.name} campus`}
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <p className="absolute bottom-5 left-6 text-2xl font-bold text-white tracking-tight">
                      {campus.name}
                    </p>
                  </a>
                  {(campus.subHeading || campus.address || campus.description) && (
                    <div className="mt-5">
                      {campus.subHeading && (
                        <h3 className="text-xl font-bold tracking-tight text-black">
                          {campus.subHeading}
                        </h3>
                      )}
                      {campus.address && (
                        <p className="mt-1.5 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-zinc-500">
                          <Icon className="fa-solid fa-location-dot text-[var(--color-primary)]" />
                          {campus.address}
                        </p>
                      )}
                      {campus.description && (
                        <p className="mt-3 text-base leading-relaxed text-zinc-700">
                          {campus.description}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-12 flex justify-center">
              <a
                href={openDays.ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 bg-[var(--color-primary)] text-white font-bold uppercase tracking-wider px-10 py-4 text-base hover:brightness-110 transition-all"
              >
                {openDays.ctaLabel}
                <Icon className="fa-solid fa-arrow-right text-sm transition-transform duration-200 group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ─── HOW TO APPLY ─── */}
      {howToApply && (
        <section className="bg-zinc-100 text-black" id="apply">
          <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
            <p className="text-base font-bold uppercase tracking-[0.3em] text-[var(--color-secondary)] mb-4">
              {t.howToApply.eyebrow}
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl max-w-3xl">
              {howToApply.heading}
            </h2>
            <div className="mt-12 space-y-6">
              {howToApply.steps.map((step) => (
                <div
                  key={step.number}
                  className="grid gap-3 sm:gap-6 sm:grid-cols-[auto_1fr] items-start border-l-4 border-[var(--color-secondary)] pl-8 py-2"
                >
                  <span className="text-4xl sm:text-6xl font-bold text-zinc-200 leading-none sm:w-24">
                    {step.number}
                  </span>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    {step.description.split("\n\n").map((para, pi) => (
                      <p
                        key={pi}
                        className={`text-lg text-zinc-700 leading-relaxed${pi > 0 ? " mt-3" : ""}`}
                      >
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 flex flex-col sm:flex-row gap-4 items-center">
              <ApplyLink lang={lang} className="inline-flex items-center justify-center bg-[var(--color-secondary)] text-white font-bold uppercase tracking-wider px-10 py-4 text-base hover:brightness-110 transition-all">
                {howToApply.ctaLabel}
              </ApplyLink>
              {howToApply.microcopy && (
                <p className="text-sm text-zinc-600">{howToApply.microcopy}</p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ─── FAQ ─── */}
      {faq && faq.length > 0 && (
        <section className="bg-black text-white">
          <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
            <p className="text-base font-bold uppercase tracking-[0.3em] text-[var(--color-primary)] mb-4">
              {t.faq.eyebrow}
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-12">
              {t.faq.heading}
            </h2>
            <FaqAccordion items={faq} />
          </div>
        </section>
      )}

      {/* ─── STATS BAR ─── */}
      {stats && stats.length > 0 && (
        <section className="bg-[var(--color-secondary)] text-white">
          <div className="mx-auto max-w-5xl px-6 py-12">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 text-center">
              {stats.map((stat, i) => (
                <div key={i}>
                  <p className="text-4xl font-bold sm:text-5xl text-white">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-white/80">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── FINAL CTA ─── */}
      {ctaFinal && (
        <section className="bg-white text-black">
          <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
            <div className="max-w-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/3-chevrons-pink.svg"
                alt=""
                aria-hidden="true"
                className="w-40 sm:w-56 mb-8 select-none"
              />
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                {ctaFinal.title}
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-zinc-700">
                {ctaFinal.description}
              </p>
              <div className="mt-10">
                <ApplyLink lang={lang} className="inline-flex items-center justify-center bg-[var(--color-primary)] text-white font-bold uppercase tracking-wider px-10 py-4 text-base hover:brightness-110 transition-all">
                  {ctaFinal.cta}
                </ApplyLink>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
