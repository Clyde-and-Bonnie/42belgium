"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import type { FaqItem } from "@/lib/i18n";

interface Props {
  items: FaqItem[];
}

const pad2 = (x: number) => String(x).padStart(2, "0");

export function FaqAccordion({ items }: Props) {
  // -1 means "all collapsed" (only reachable via mobile re-tap).
  // Desktop layout falls back to 0 for rendering.
  const [active, setActive] = useState<number>(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const n = items.length;
  const desktopActive = active >= 0 ? active : 0;

  const activateAndFocus = (i: number) => {
    setActive(i);
    tabRefs.current[i]?.focus();
  };

  const onTablistKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        activateAndFocus((desktopActive + 1) % n);
        break;
      case "ArrowUp":
        e.preventDefault();
        activateAndFocus((desktopActive - 1 + n) % n);
        break;
      case "Home":
        e.preventDefault();
        activateAndFocus(0);
        break;
      case "End":
        e.preventDefault();
        activateAndFocus(n - 1);
        break;
    }
  };

  const onSectionKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      setActive((a) => ((a >= 0 ? a : 0) - 1 + n) % n);
    } else if (e.key === "ArrowRight") {
      setActive((a) => ((a >= 0 ? a : 0) + 1) % n);
    }
  };

  const activePanelId = `faq-panel-${desktopActive}`;
  const activeTabId = `faq-tab-${desktopActive}`;

  return (
    <>
      {/* Mobile (below lg): expand-in-place accordion */}
      <div className="lg:hidden border-y border-zinc-800">
        {items.map((item, i) => {
          const isOpen = i === active;
          const panelId = `faq-mobile-panel-${i}`;
          return (
            <div key={i} className="border-b border-zinc-800 last:border-b-0">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setActive(isOpen ? -1 : i)}
                className={`group w-full flex items-center gap-4 px-5 py-4 text-left transition-colors duration-200 ${
                  isOpen
                    ? "bg-[var(--color-primary)] text-white"
                    : "text-zinc-300 hover:bg-zinc-900"
                }`}
              >
                <span
                  className={`text-xs font-bold tabular-nums ${
                    isOpen ? "text-white/80" : "text-zinc-500"
                  }`}
                >
                  {pad2(i + 1)}
                </span>
                <span className="flex-1 text-sm font-bold leading-snug">
                  {item.question}
                </span>
                <Icon
                  className={`fa-solid fa-chevron-down text-xs shrink-0 motion-safe:transition-transform motion-safe:duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>
              <div
                id={panelId}
                role="region"
                hidden={!isOpen}
                className="px-5 pb-6 pt-2 animate-faqFadeIn"
              >
                <p className="text-base leading-relaxed text-zinc-300">
                  {item.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop (lg+): tablist + side panel */}
      <div
        onKeyDown={onSectionKeyDown}
        className="hidden lg:grid lg:grid-cols-[1fr_1.3fr] lg:gap-12"
      >
        {/* LEFT - tablist */}
        <div
          role="tablist"
          aria-orientation="vertical"
          aria-label="Frequently asked questions"
          onKeyDown={onTablistKeyDown}
          className="flex flex-col border-y border-zinc-800"
        >
          {items.map((item, i) => {
            const isActive = i === desktopActive;
            const tabId = `faq-tab-${i}`;
            const panelId = `faq-panel-${i}`;
            return (
              <button
                key={i}
                id={tabId}
                role="tab"
                type="button"
                aria-selected={isActive}
                aria-controls={panelId}
                tabIndex={isActive ? 0 : -1}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                onClick={() => setActive(i)}
                className={`group flex items-center gap-4 px-5 py-4 text-left border-b border-zinc-800 last:border-b-0 transition-colors duration-200 ${
                  isActive
                    ? "bg-[var(--color-primary)] text-white"
                    : "text-zinc-300 hover:bg-zinc-900"
                }`}
              >
                <span
                  className={`text-xs font-bold tabular-nums ${
                    isActive ? "text-white/80" : "text-zinc-500"
                  }`}
                >
                  {pad2(i + 1)}
                </span>
                <span className="flex-1 text-sm font-bold leading-snug">
                  {item.question}
                </span>
                <Icon
                  className={`fa-solid fa-arrow-right text-xs shrink-0 motion-safe:transition-transform motion-safe:duration-200 ${
                    isActive
                      ? "motion-safe:translate-x-1"
                      : "motion-safe:group-hover:translate-x-1"
                  }`}
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </div>

        {/* RIGHT - panel + controls */}
        <div>
          <div
            key={desktopActive}
            role="tabpanel"
            id={activePanelId}
            aria-labelledby={activeTabId}
            className="animate-faqFadeIn"
          >
            <h3 className="text-2xl font-bold text-[var(--color-primary)] mb-5 leading-tight">
              {items[desktopActive].question}
            </h3>
            <p className="text-base leading-relaxed text-zinc-300">
              {items[desktopActive].answer}
            </p>
          </div>

          {/* Counter + prev/next */}
          <div className="mt-10 flex items-center justify-between border-t border-zinc-800 pt-6">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-500">
              Question {pad2(desktopActive + 1)} of {pad2(n)}
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Previous question"
                onClick={() => setActive((a) => ((a >= 0 ? a : 0) - 1 + n) % n)}
                className="flex h-10 w-10 items-center justify-center border border-zinc-700 text-zinc-400 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
              >
                <Icon className="fa-solid fa-chevron-left text-sm" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Next question"
                onClick={() => setActive((a) => ((a >= 0 ? a : 0) + 1) % n)}
                className="flex h-10 w-10 items-center justify-center border border-zinc-700 text-zinc-400 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
              >
                <Icon className="fa-solid fa-chevron-right text-sm" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
