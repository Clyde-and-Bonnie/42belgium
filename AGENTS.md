<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Working on this repository

42 Belgium landing pages. Next.js 16 (App Router), Tailwind v4, content-driven:
every page is a JSON file and the React components are generic renderers.
10 themes × 3 languages (`en` / `fr` / `nl`) = 30 pages.

## Always run before you finish

```bash
npm run lint
npm run build
node scripts/validate-seo.mjs --structural-only <the content files you changed>
```

CI runs these on every pull request and a red check blocks the merge. Run them
yourself first — do not open a pull request and let CI find the problem.

Only three things fail that last command: invalid JSON, a structure the site
does not expect (an unknown, missing or mistyped key — the expected shape
mirrors `src/lib/i18n.ts`), and an image path with no matching file in
`public/`. The SEO checklist still prints its findings, but as
advice. **Do not act on that advice on your own** — the targets are tuned
against Google Ads data, so changing copy to satisfy them is an SEO decision
for Clyde & Bonnie. Dropping `--structural-only` runs the full blocking
checklist; that is their tool, not a gate on content work.

## Where a change belongs

| To change… | Edit… |
| --- | --- |
| Any wording, heading, bullet, FAQ, CTA label | `src/content/<theme>/<lang>.json` |
| Wording shared by all 10 pages | `src/content/_common/<lang>.json` |
| Layout, spacing, component behaviour | `src/components/**` |

**A copy change is a content change.** Never edit a `.tsx` file to change
words — the words live in the JSON. If a string looks hardcoded in a
component, that is a bug to report, not a place to edit.

`src/content/HOW_TO_EDIT.md` has the full content map, the shared-section
inheritance rules, and the JSON conventions. Read it before touching content.

## Do not change without asking Clyde & Bonnie

- `src/lib/seo.ts`, `src/lib/navigation.ts`, `src/lib/themes.ts`,
  `src/lib/i18n.ts` — routing, canonicals and hreflang. Breaking these
  de-indexes pages, and the damage is invisible until traffic drops.
- The `"meta"` block in any content file — titles, descriptions and keywords
  are tuned against Google Ads data. Retuning them is an SEO decision, not a
  copy edit.
- `next.config.ts`, `.env.production`, `src/app/**/layout.tsx`.

## Conventions

- The three languages move together. If you change a section in `fr.json`,
  either make the matching change in `en.json` and `nl.json`, or say
  explicitly that you did not and why.
- Straight apostrophes only (`'`). Smart quotes (`’`) pasted from Word,
  Notion or Google Docs break the content checks.
- This repository is **public**. Never commit a credential, an API key or a
  private URL — not in `.env.production`, not anywhere.

## Pull requests

Work on a branch, open a pull request, get CI green, and leave the merge to
Clyde & Bonnie. Never commit to `main` directly.
