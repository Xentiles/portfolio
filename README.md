# Dominik Nagy: portfolio and link hub

Built with Astro and the Orbital Clarity design language (v0.5). English at `/`, Swedish at `/sv/`.

## Run it

```sh
npm install
npm run dev      # local preview at http://localhost:4321
npm run build    # static site in dist/
```

## Where things live

| What | Where |
| --- | --- |
| All visible words, English and Swedish | `src/i18n/strings.ts` |
| Page shell, top bar, footer | `src/layouts/Base.astro` |
| Hero (name, portrait, orbit) | `src/components/Hero.astro` |
| Link hub and contact button | `src/components/LinkHub.astro` |
| Styles and theme tokens (Charcoal, Paper) | `src/styles/site.css` |
| Ink field, orbit, cursor and portrait shader | `public/scripts/ink.js` (ported from e-ink study 03) |
| Libron font (official files, OFL) | `public/fonts/libron/` |

## Status

v0.2: hero, link hub, the six story sections and three case studies (/work/… and /sv/arbete/…). Section words: `src/i18n/home.ts`. Case studies: `src/i18n/work.ts`.
