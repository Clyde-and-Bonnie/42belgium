"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";
import { getApplyUrl } from "@/lib/navigation";
import type { Language } from "@/lib/themes";
import styles from "./ProposalC.module.css";

const ITEMS = [
  { id: "why",     label: "Why 42",  icon: "fa-regular fa-lightbulb" },
  { id: "program", label: "Program", icon: "fa-solid fa-list-ol" },
  { id: "open-day", label: "Visit",  icon: "fa-solid fa-location-dot" },
  { id: "apply",   label: "Path",    icon: "fa-solid fa-compass" },
  { id: "faq",     label: "FAQ",     icon: "fa-solid fa-circle-question" },
] as const;

/**
 * Floating bottom dock — hidden until the user scrolls past the hero
 * (reveal via translate transform), highlights the active section via
 * scroll-spy, and includes a pink Apply CTA on the right.
 */
export function DockC({ lang }: { lang: Language }) {
  const [show, setShow] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => {
      // Show when the hero is mostly off-screen.
      const hero = document.getElementById("top");
      if (hero) {
        setShow(hero.getBoundingClientRect().bottom < 80);
      } else {
        setShow(window.scrollY > 400);
      }
      // Determine active section
      let found: string | null = null;
      for (const item of ITEMS) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.5 && r.bottom > 80) {
          found = item.id;
          break;
        }
      }
      setActive(found);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      aria-label="Quick navigation"
      className={`${styles.dock} ${show ? styles.show : ""}`}
    >
      <div className={styles.dockItems}>
        {ITEMS.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`${styles.dockBtn} ${active === item.id ? styles.active : ""}`}
          >
            <Icon className={item.icon} />
            <span className="label">{item.label}</span>
          </a>
        ))}
      </div>
      <div className={styles.dockDivider} />
      <a
        href={getApplyUrl(lang)}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.dockApply}
      >
        Apply <Icon className="fa-solid fa-arrow-right" />
      </a>
    </nav>
  );
}
