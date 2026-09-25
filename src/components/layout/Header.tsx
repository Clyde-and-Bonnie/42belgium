"use client";

import { useState, useEffect } from "react";
import { Icon } from "@/components/Icon";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { Language } from "@/lib/themes";
import { getNavItems, getApplyUrl, getApplyLabel } from "@/lib/navigation";
import { LANGUAGES, getSlug, getThemeFromSlug } from "@/lib/themes";
import styles from "./Header.module.css";

/**
 * Resolve where the language-switcher link should point, based on the current
 * pathname. We stay inside the app and keep the user on the equivalent page
 * in the target language. Three route shapes today:
 *   - /[lang]/[slug]              → /[target]/[slugForTarget]
 *   - /[lang]/proposals/[variant] → /[target]/proposals/[variant]
 *   - /[lang]                     → /[target] (dashboard)
 *   - anything else               → /[target] (safe fallback)
 *
 * For the LP case, slug A in language X maps to its theme via getThemeFromSlug,
 * and the theme maps back to slug B in language Y via getSlug. If the slug
 * isn't recognised (e.g. typo URL), we fall back to the target dashboard.
 */
function getLangSwitchHref(
  pathname: string,
  currentLang: Language,
  target: Language
): string {
  const propMatch = pathname.match(/^\/[a-z]+\/proposals\/([a-c])\/?$/);
  if (propMatch) return `/${target}/proposals/${propMatch[1]}`;

  const lpMatch = pathname.match(/^\/[a-z]+\/([a-z0-9-]+)\/?$/);
  if (lpMatch) {
    const theme = getThemeFromSlug(currentLang, lpMatch[1]);
    if (theme) return `/${target}/${getSlug(theme, target)}`;
  }

  return `/${target}`;
}

interface HeaderProps {
  lang: Language;
}

function ChevronDown() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      className={styles.navChevron}
      aria-hidden="true"
    >
      <path d="M1 3.5L5 7.5L9 3.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ApplyArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 108 108" fill="currentColor" aria-hidden="true">
      <path d="M16 54L86 54L54 86L57.5 89.5L96 51.3L57.5 13L54 16.5L86 49H16V54Z" />
    </svg>
  );
}

function cx(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

export function Header({ lang }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const navItems = getNavItems(lang);
  const applyUrl = getApplyUrl(lang);
  const applyLabel = getApplyLabel(lang);

  // Derive the variant from the pathname so the shared layout doesn't need
  // a dedicated prop plumbing — Proposal C uses a non-sticky (static) header,
  // Proposal B lowers the scroll threshold to 40px for a snappier reveal.
  const pathname = usePathname() ?? "";
  const isStatic = /\/proposals\/c\/?$/.test(pathname);
  const isBVariant = /\/proposals\/b\/?$/.test(pathname);
  const threshold = isBVariant ? 40 : 80;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return (
    <header className={cx(styles.header, isStatic && styles.static, scrolled && styles.scrolled)}>
      <div className={styles.container}>
        {/* ── Logo ── */}
        <Link href={`https://42belgium.be/${lang}/`} className={styles.logoLink}>
          <Image
            src="/assets/logo-42-white.svg"
            alt="42 Belgium"
            width={140}
            height={26}
            priority
            className={styles.logo}
            style={{ height: "auto" }}
          />
        </Link>

        {/* ── Desktop nav ── */}
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <div
              key={item.label}
              className={styles.navItem}
              onMouseEnter={() => item.children && setOpenDropdown(item.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <a href={item.href} className={styles.navLink}>
                {item.label}
                {item.children && <ChevronDown />}
              </a>

              {item.children && openDropdown === item.label && (
                <div className={styles.dropdown}>
                  {item.children.map((child) => (
                    <a
                      key={child.label}
                      href={child.href}
                      className={styles.dropdownItem}
                    >
                      {child.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* ── Right: lang + apply ── */}
        <div className={styles.rightCluster}>
          <div className={styles.langSwitcher}>
            {LANGUAGES.map((l) => (
              <Link
                key={l}
                href={getLangSwitchHref(pathname, lang, l)}
                className={cx(styles.langLink, l === lang && styles.active)}
              >
                {l}
              </Link>
            ))}
          </div>

          <a href={applyUrl} className={styles.applyButton}>
            {applyLabel}
            <ApplyArrow />
          </a>
        </div>

        {/* ── Mobile actions: hamburger + Apply (same dest/colour as hero CTA) ── */}
        <div className={styles.mobileActions}>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={styles.mobileToggle}
            aria-label="Toggle menu"
          >
            <Icon className={`fa-solid ${mobileOpen ? "fa-xmark" : "fa-bars"} text-xl`} />
          </button>
          <a href={applyUrl} className={styles.mobileHeaderApply}>
            {applyLabel}
          </a>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div className={styles.mobileMenu}>
          <nav className={styles.mobileNav}>
            {navItems.map((item) => (
              <div key={item.label}>
                <a href={item.href} className={styles.mobileNavLink}>
                  {item.label}
                </a>
                {item.children && (
                  <div className={styles.mobileChildList}>
                    {item.children.map((child) => (
                      <a
                        key={child.label}
                        href={child.href}
                        className={styles.mobileChildLink}
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <a href={applyUrl} className={styles.mobileApply}>
              {applyLabel}
            </a>
            <div className={styles.mobileLangRow}>
              {LANGUAGES.map((l) => (
                <Link
                  key={l}
                  href={getLangSwitchHref(pathname, lang, l)}
                  className={cx(styles.mobileLangLink, l === lang && styles.active)}
                >
                  {l}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
