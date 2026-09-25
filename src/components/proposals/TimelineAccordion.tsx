"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import type { CurriculumPhase } from "@/lib/i18n";
import type { Language } from "@/lib/themes";
import { proposalUiStrings } from "@/lib/i18n";

interface Props {
  phases: CurriculumPhase[];
  lang: Language;
}

export function TimelineAccordion({ phases, lang }: Props) {
  const t = proposalUiStrings[lang].timeline;
  const [openPhase, setOpenPhase] = useState<number>(0);
  const toggle = (i: number) => setOpenPhase((prev) => (prev === i ? -1 : i));

  return (
    <div className="space-y-0">
      {phases.map((phase, i) => {
        const isOpen = openPhase === i;
        const isReached = isOpen || i < openPhase;
        const isNotLast = i < phases.length - 1;
        return (
          <div key={phase.number} className="flex gap-5">
            {/* Left rail: dot + connector segment */}
            <div className="flex flex-col items-center shrink-0">
              <button
                type="button"
                onClick={() => toggle(i)}
                aria-label={`Toggle ${phase.title}`}
                className={`relative z-10 mt-5 flex h-10 w-10 shrink-0 items-center justify-center text-sm font-bold transition-all duration-400 cursor-pointer hover:brightness-110 ${
                  isReached
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-white border-2 border-zinc-300 text-zinc-500"
                }`}
              >
                {phase.number}
              </button>
              {isNotLast && (
                <div
                  className={`w-px flex-1 transition-colors duration-400 ${
                    i < openPhase ? "bg-[var(--color-primary)]" : "bg-zinc-300"
                  }`}
                />
              )}
            </div>

            {/* Right: header button + collapsible content */}
            <div className="flex-1 min-w-0">
              <button
                type="button"
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
                className="w-full flex items-center gap-4 py-5 text-left group"
              >
                {phase.icon && (
                  <Icon
                    className={`${phase.icon} text-lg shrink-0 transition-colors duration-300 ${
                      isReached ? "text-[var(--color-primary)]" : "text-zinc-400"
                    }`}
                  />
                )}
                <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:gap-4">
                  <h3
                    className={`text-lg font-bold transition-colors duration-300 sm:flex-1 ${
                      isOpen ? "text-black" : "text-zinc-600 group-hover:text-black"
                    }`}
                  >
                    {phase.title}
                  </h3>
                  <span className="mt-1 sm:mt-0 text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] shrink-0">
                    {phase.duration}
                  </span>
                </div>
                <Icon
                  className={`fa-solid fa-chevron-down text-zinc-400 text-sm shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Collapsible content */}
              <div
                className={`overflow-hidden transition-all duration-400 ease-in-out ${
                  isOpen ? "max-h-[1600px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="pb-8 pr-4">
                  {phase.description.split("\n\n").map((para, pi) => {
                    const match = para.match(/^\*\*(.+?)\*\*(.*)$/);
                    const head = match ? match[1] : null;
                    const rest = match ? match[2] : para;
                    return (
                      <p key={pi} className="text-base leading-relaxed text-zinc-700 mb-6">
                        {head && <strong className="font-bold text-black">{head}</strong>}
                        {rest}
                      </p>
                    );
                  })}
                  <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                    {phase.items.map((item) => {
                      const match = item.match(/^\*\*(.+?)\*\*(.*)$/);
                      const head = match ? match[1] : null;
                      const tail = match ? match[2] : item;
                      return (
                        <li key={item} className="flex gap-3 text-sm">
                          <Icon className="fa-solid fa-chevron-right text-[var(--color-primary)] mt-1 text-xs shrink-0" />
                          <span className="text-zinc-800">
                            {head && <strong className="font-bold text-black">{head}</strong>}
                            {tail}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  {phase.flexibility && phase.flexibility.length > 0 && (
                    <div className="mt-8">
                      <p className="text-base font-bold text-black mb-3">{t.flexibility}:</p>
                      <ul className="space-y-2 list-disc pl-5">
                        {phase.flexibility.map((item, idx) => (
                          <li key={idx} className="text-sm text-zinc-800 leading-relaxed">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {phase.globalMobility && (
                    <p className="mt-6 text-sm text-zinc-800 leading-relaxed">
                      <strong className="font-bold text-black">{t.globalMobility}:</strong>{" "}
                      {phase.globalMobility}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
