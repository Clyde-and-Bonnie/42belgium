"use client";

import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";
import { useEffect, useRef, useState } from "react";
import type { Language } from "@/lib/themes";

const LANGS: { code: Language; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
  { code: "nl", label: "NL" },
];

export function LanguageSwitcher({ current }: { current: Language }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const switchTo = (next: Language) => {
    if (next === current) return;
    // Replace the first path segment (the lang) with the new lang.
    const parts = pathname.split("/");
    parts[1] = next;
    router.push(parts.join("/") || "/");
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-2 text-white font-bold uppercase text-base hover:text-[var(--color-primary)] transition-colors"
      >
        {current.toUpperCase()}
        <Icon className={`fa-solid fa-chevron-down text-xs transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute top-full left-0 mt-2 min-w-[80px] bg-zinc-900 border border-zinc-800 shadow-lg z-50"
        >
          {LANGS.filter((l) => l.code !== current).map((l) => (
            <li key={l.code}>
              <button
                type="button"
                role="option"
                aria-selected={false}
                onClick={() => switchTo(l.code)}
                className="block w-full px-4 py-2 text-left text-white font-bold uppercase text-sm hover:bg-[var(--color-primary)] transition-colors"
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
