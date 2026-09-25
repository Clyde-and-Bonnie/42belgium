@AGENTS.md

# Sessions de l'équipe 42 Belgium

## Où sont les choses
- Textes : `src/content/<thème>/<langue>.json` ; sections communes : `src/content/_common/<langue>.json`. Lire `src/content/HOW_TO_EDIT.md` avant toute modification.
- Images : `public/assets/gallery/`, référencées dans les JSON par `"image"` / `"decoration"`. Un nouveau fichier image doit porter exactement le nom cité dans le JSON.

## Règles
- Toujours mettre à jour les 3 langues (EN, FR, NL) ensemble, sauf demande contraire explicite. Si une langue n'est pas modifiée, le dire et expliquer pourquoi.
- Ne pas toucher à la mise en page, aux composants (`src/components/**`), aux fichiers `src/app/**`, `src/lib/**`, à la config ni au bloc `"meta"` sans demande explicite. Si un texte semble codé en dur dans un composant, le signaler au lieu de modifier le composant.
- Une modification = une branche = une pull request. Ne jamais commiter sur `main`.
- Avant de pousser : `npm run lint`, `npm run build`, puis `node scripts/validate-seo.mjs --structural-only <fichiers modifiés>`. Corriger toute erreur avant de pousser. Les avertissements SEO sont des conseils : ne pas réécrire le texte pour les satisfaire.
- Ne jamais ajouter de clé, de token ni d'URL privée : ce repository est public.
