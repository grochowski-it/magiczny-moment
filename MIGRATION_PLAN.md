# Migration plan — mm-event.pl to the newest Nuxt ecosystem

Goal: move the site onto the current Nuxt ecosystem (Nuxt 4.6 line and current
modules) **without losing any functionality** currently live at
https://mm-event.pl, and add the missing "basic" production features:

- RODO (GDPR) information + cookie consent
- LLM / AI search-engine discoverability
- Local / geolocation SEO positioning
- Schema.org structured data
- Core Web Vitals refinement

Each phase is independently shippable and reversible. Tailwind v4 (the only
risky rewrite) is isolated in Phase 9 and can be deferred.

---

## 1. Current state vs. target state

| Package | Current (repo + lockfile) | Target (latest stable) | Type of change |
|---|---|---|---|
| `nuxt` | 4.4.2 | 4.6.4 | minor (breaking for some modules) |
| `@nuxt/content` | 3.12.0 | 3.16.2 | minor |
| `@nuxt/fonts` | 0.10.3 | 1.2.0 | **major 0.x → 1.0** |
| `@nuxt/icon` | 1.13.0 | 2.6.2 | **major 1 → 2** |
| `@nuxt/image` | 1.10.0 | 2.2.1 | **major 1 → 2** (also security fix) |
| `@nuxtjs/sitemap` | 7.6.0 | 9.1.0 | **major 7 → 9** (requires Nuxt ≥ 4.6) |
| `@nuxtjs/tailwindcss` | 6.12.2 | 6.14.0 | patch (Tailwind 3) |
| `tailwindcss` (transitive) | 3.4.17 | 3.4.17 (keep) / 4.3.5 (Phase 9) | optional major |
| `nuxt-studio` | 1.4.0 | 1.8.0 | minor |
| `nuxt-viewport` | 2.3.1 | 2.6.1 | minor |
| `vue` (transitive) | 3.5.30 | 3.5.45 | patch |
| `embla-carousel-vue` | 8.6.0 | 8.6.0 | none |
| Node runtime | CI uses 20 | `^22.22.3 \|\| ^24.15.0 \|\| >=26` | required by Nuxt 4.6 |
| Deployment | Vercel (SSR) + legacy gh-pages export | Vercel | consolidate |

Notes on forced upgrades:
- `@nuxtjs/sitemap@9` requires `nuxt ^4.6.0 || ^5.0.0`, so upgrading sitemap
  forces Nuxt 4.6. This drives the whole plan.
- Nuxt 4.6.4 requires Node `^22.22.3 || ^24.15.0 || >=26.0.0`.
- `@nuxt/image@2.2.1` is a security release (IPX integer-overflow, GHSA-qf89-6xm4-66wm).

New modules to add for the requested features (all verified current):

| Module | Version | Purpose |
|---|---|---|
| `@nuxtjs/seo` | 6.0.1 | Meta/SEO bundle: robots v7, schema-org v7, og-image v7, sitemap v9, link-checker, site-config, ai-ready (peer `nuxt ^4.6.1 \|\| ^5`) |
| `nuxt-schema-org` | 7.0.1 | Schema.org JSON-LD (`Organization`, `LocalBusiness`, `Service`, `Offer`, …) |
| `nuxt-ai-ready` | 3.5.0 | `llms.txt` + `/page.md` endpoints + Content integration |
| `@nuxtjs/robots` | 7.0.2 | `robots.txt` + AI content-signals |
| `nuxt-og-image` | 7.0.7 | Social/OG images |
| `@dargmuesli/nuxt-cookie-control` | 9.3.12 | Cookie banner with granular consent (Polish locale) |
| `nuxt-gtag` | 5.0.0 | Analytics (only loaded after consent) |

> Recommendation: adopt `@nuxtjs/seo` once (it already bundles sitemap v9, robots
> v7, schema-org v7, og-image v7 and ai-ready) instead of wiring each module
> separately. Fall back to individual modules only if the bundle causes friction.

---

## 2. Issues found in the current production site (must be handled)

These are live problems, not just migration risks.

1. **Offer detail pages are broken in production.**
   `https://mm-event.pl/oferta/<slug>` renders an empty title, empty content,
   empty price and `srcset="undefined 1x"`. The SSR payload contains a
   `NuxtError` for `POST /__nuxt_content/oferta/query`. Root cause: `@nuxt/content`
   v3 runs its SQLite query at request time on Vercel serverless, where the
   native `better-sqlite3` backend fails (HTTP 500). Only the homepage works
   because it is prerendered (`routeRules: { '/': { prerender: true } }`).
2. **Sitemap contains only `/`.** The `sitemap.sources` entry
   `/api/sitemap/oferta` returns HTTP 500 (same content-query failure). All 9
   offer pages are missing from `sitemap.xml`.
3. **`robots.txt` returns 404.**
4. **No SEO metadata.** Production HTML has no `<title>`, no meta description,
   no Open Graph tags, and `<html>` has **no `lang` attribute**. No
   `useSeoMeta`/`useHead` and no `app.head` config.
5. **No structured data / no `llms.txt`.** Nothing tells Google or LLMs what the
   business is, where it operates, or what it offers.
6. **No RODO/privacy page and no cookie consent.** The site shows a phone number
   and email (personal data) with no privacy information, and has no consent
   mechanism for any future analytics.
7. **Nuxt Studio is misconfigured.** `studio.repository.owner = 'jules'`; the
   real repo is `grochowski-it/magiczny-moment`. Production publishing cannot work.
8. **CI workflow is stale and broken.** `.github/workflows/studio.yml` uses Node
   20, installs the deprecated `@nuxthq/studio`, writes `.nuxtrc`, builds with the
   `github_pages` preset and deploys to `gh-pages` — conflicts with Vercel and
   fails on Nuxt 4.6.
9. **Accessibility gaps** that also hurt SEO: images have no `alt`, carousel
   buttons have no `aria-label`, no `lang`.
10. **Heavy assets hurt Core Web Vitals** (see Phase 8):
    `iskry.jpg` 17.4 MB, `banki.jpg` 10.9 MB, hero video `filmik_glowna.mp4` 9.3 MB,
    `20240825_033825.jpg` 3.7 MB. `public/` totals ~64 MB.
11. **Dead code / stray artifacts:** `index2.html`, `index_test.html`,
    `public/favicon.ico~`; unused composables `useGenHumanReadableId.ts`,
    `usePriorityPlus.ts` (the latter pulls `lodash-es`); unused images
    (`18.jpg`, `telazheks.jpg`, `ledkabina-*.jpg`, `tlo_kontakt.png`,
    `osiemnastka.jpg`, `LOGO_old.png`); `tailwind.config.js` uses `require()`
    inside an ESM module.
12. **Legacy branch/PR clutter** — two long-lived `feat/nuxt-4-migration-*`
    branches and an open PR #30 with `mergeable: false`. Close or rebase first.

---

## 3. Phases

### Phase 0 — Baseline and safety net
1. Branch off `master`: `chore/nuxt-ecosystem-upgrade`.
2. Capture a baseline of production **before** changes:
   - Full-page screenshots (desktop + mobile) of `/` and one `/oferta/*`.
   - Current `sitemap.xml`, `robots.txt` (404), response headers, rendered HTML.
   - Lighthouse run (mobile + desktop) — the reference for Phase 8.
3. Toolchain: install `pnpm@9.12.3` (repo pins it; sandbox has none), Node 22.22.3+.
4. Add `engines` to `package.json`: `"node": "^22.22.3 || ^24.15.0 || >=26.0.0"`.
5. Agree the smoke-test checklist (section 4) used to verify every phase.

### Phase 1 — Core runtime (Nuxt 4.6)
1. Bump `nuxt` to `^4.6.4`.
2. Keep `future.compatibilityVersion: 4` (Nuxt 5 is alpha; do not adopt
   `compatibilityVersion: 5` yet).
3. `pnpm install`, then `pnpm dev` + `pnpm build` to confirm the base boots.
4. Fix deprecation warnings surfaced by Nuxt 4.6.

### Phase 2 — Module upgrades (one commit each, easiest → hardest)
1. `nuxt-viewport` 2.3.1 → 2.6.1 (no API change for our usage).
2. `nuxt-studio` 1.4.0 → 1.8.0. **Fix config**: set `repository.owner` to the
   real owner and `branch` to the deploy branch; set a `route`. Document required
   production env (`STUDIO_GITHUB_CLIENT_ID` / `STUDIO_GITHUB_CLIENT_SECRET`) or
   publishing will 500.
3. `@nuxt/fonts` 0.10.3 → 1.2.0. Breaking changes:
   - `throwOnError` now defaults to `true` outside dev → a font that fails to
     resolve fails the production build. Our fonts live in `public/fonts/*` and
     are referenced via `font-[eternals-universe]` / `Lora`; verify resolution,
     else declare `fonts.families` explicitly or set `throwOnError: false`.
   - Metadata cached under `node_modules/.cache/nuxt/fonts/meta`.
   - Default format is now `woff2` only.
   - **Polish subsets**: declare `subsets: ['latin', 'latin-ext']` so ą/ć/ę/ł/ń/ó/ś/ź/ż
     render (feeds Phase 8).
4. `@nuxt/icon` 1.13.0 → 2.6.2. We use `customCollections` with relative
   `dir: './assets/icons'`; in v2.6 a relative `dir` in a *layer* resolves against
   the layer dir — this is an app, so should be unaffected. Verify `my-icon:listek`.
5. `@nuxt/image` 1.10.0 → 2.2.1. Stricter TS (`defineProvider`); default Vercel
   provider already in use (`/_vercel/image?url=...`). Verify `NuxtImg`, `screens`,
   `format: ['webp']`. Security fix — do this regardless.
6. `@nuxt/content` 3.12.0 → 3.16.2 (minor; verify `queryCollection(...).path()`).
7. `@nuxtjs/sitemap` 7.6.0 → 9.1.0 (or let `@nuxtjs/seo` v6 pull it in Phase 4):
   - Requires Nuxt ≥ 4.6 (done in Phase 1).
   - Server helpers now import from `#sitemap/server` (`defineSitemapEventHandler`,
     `SitemapUrlInput`); events are `RequestEvent` (no `event.node`). Update
     `server/api/sitemap/oferta.ts` imports.
   - Zod 4 optional peer (we don't use `defineSitemapSchema`).

After Phase 2: `pnpm build` + section 4 checklist on a Vercel preview.

### Phase 3 — Fix the production bugs (content query + sitemap data)
1. **Content query on serverless.** Lowest-risk fix (site is small, fully static):
   prerender all routes so no content query runs at request time.
   - `routeRules: { '/**': { prerender: true } }` and `nitro.prerender.crawlLinks: true`.
   - Confirm `/oferta/*` render title/content/price/image.
   - Alternative (only if runtime queries are required): switch the Content v3 DB
     backend to a Vercel-supported one (`@libsql/client`/remote DB) — larger change.
2. **Sitemap source.** With prerendering, the Nitro endpoint runs at build time and
   `/api/sitemap/oferta` works. Update it to the v9 import path and verify
   `sitemap.xml` lists `/` + all 9 offer URLs.

### Phase 4 — Technical SEO foundation (meta, robots, OG, AI/LLM)
1. Adopt `@nuxtjs/seo` v6 (bundles robots v7, schema-org v7, og-image v7, sitemap v9,
   site-config, link-checker, ai-ready). Keep `site.url`; add `site.name`,
   `site.description`, `site.defaultLocale: 'pl'`.
2. **Metadata**: `useSeoMeta` on `pages/index.vue` and `pages/oferta/[id].vue`
   (title + description from frontmatter for offers), plus `app.head` defaults.
   Add `<html lang="pl">` via `app.head.htmlAttrs` / `useHead`.
3. **robots.txt** via `@nuxtjs/robots` v7, with the sitemap reference and AI
   content-signals (allow search + citation; decide on training policy).
4. **LLM discoverability** via `nuxt-ai-ready` v3:
   - Prerender `/llms.txt` (+ `/llms-full.txt`).
   - Per-route markdown (`/oferta/<slug>.md`) served to AI crawlers; it reads the
     Content markdown directly.
   - Content-Signal directives in robots for AI search vs training.
   - Optional MCP endpoint for agent queries (only if desired).
5. **OG images** via `nuxt-og-image` v7 for social sharing; set `og:locale` pl_PL.
6. Verify: `<title>`, description, OG tags, `/llms.txt`, `/robots.txt`,
   `/sitemap.xml` all present and valid.

### Phase 5 — Schema.org structured data
This is the machine-readable description of the business for Google, and the
input for local SEO (Phase 6). Use `nuxt-schema-org` v7 (requires Nuxt 4.6+, Node
22.22.3+, and **SSR** — we have it). It builds a single `@graph` of `WebSite` +
`WebPage` automatically, and we add the business + offer nodes.

> Blocker: needs the company identity (legal name, address, NIP/KRS, phone,
> email, geo, social profiles). The site currently exposes only a phone and email.

1. **Site-wide identity** in `nuxt.config.ts` (`schemaOrg.identity`). Because this
   is a local service business, use `LocalBusiness`:
   ```ts
   export default defineNuxtConfig({
     schemaOrg: {
       identity: {
         type: 'LocalBusiness',
         '@type': 'ProfessionalService', // or the most specific subtype
         name: '…', description: '…', url: 'https://mm-event.pl',
         logo: '/LOGO.png', image: '/…',
         telephone: '+48 602 434 673',
         email: 'magiczny.event@gmail.com',
         address: { streetAddress, addressLocality, addressRegion, postalCode, addressCountry: 'PL' },
         geo: { '@type': 'GeoCoordinates', latitude, longitude },
         areaServed: 'PL',              // refined in Phase 6
         priceRange: 'zł',
         openingHoursSpecification: [{ dayOfWeek: ['Mo'..'Fr'], opens: '08:00', closes: '20:00' }],
         sameAs: [ /* social profile URLs */ ],
       },
     },
   })
   ```
   Note: `type: 'LocalBusiness'` renders as `["Organization","LocalBusiness"]`; do
   **not** wrap the config identity in `defineLocalBusiness()` (it drops the
   `LocalBusiness` type).
2. **Per-offer nodes** on `pages/oferta/[id].vue` with `useSchemaOrg`:
   `defineService` (name = offer title, description = offer content,
   `provider` → the business `@id`) and `defineOffer` (`price` from frontmatter,
   `priceCurrency: 'PLN'`, `availability`, `url`). This lets Google show
   service/price data.
3. **Content frontmatter support** (optional but clean): add
   `defineSchemaOrgSchema()` + a `head` field to the collections in
   `content.config.ts`, then render `useHead(page.head)` and
   `useSeoMeta(page.seo)` in the pages. This lets each markdown file carry its own
   `schemaOrg` block editable in Studio.
4. **Breadcrumbs** (`defineBreadcrumb`) on offer pages (Home → Oferta → offer).
5. **FAQ** (`defineQuestion`/FAQPage) — only if an FAQ section is added; it can win
   a rich result but must match visible on-page content.
6. Validate every node with the Google Rich Results Test and the Nuxt SEO
   Schema.org validator; check the emitted `application/ld+json` in SSR HTML.

### Phase 6 — Local / geolocation SEO positioning
1. **NAP consistency**: one canonical name, address, phone, email reused in the
   footer, contact section, privacy policy and structured data (needs the business
   data from Phase 5).
2. **`LocalBusiness` schema** (from Phase 5) enriched with `geo`
   (latitude/longitude), `address` (`PostalAddress`), `areaServed` (e.g. Poland /
   city + surrounding voivodeship), `openingHoursSpecification`, `hasMap`.
3. **`areaServed` + service area** copy on the offer pages so pages match
   "…<city>" queries.
4. **Google Business Profile** (off-site): create/claim, set category
   (Event/Party equipment rental), service area, hours, photos, and link the site.
   Keep NAP identical to the site. This is the single biggest local-ranking lever.
5. **Local content**: a short "Obszar działania" / service-area section with the
   cities served, and location keywords in titles/descriptions.
6. **Map**: optional. Prefer a **static map image** (no third-party cookies) over
   an embedded Google/OSM iframe; if an embed is used, gate it behind cookie
   consent (Phase 7) and lazy-load it.
7. **Meta**: `og:locale=pl_PL`, `lang="pl"`, canonical URLs; consider `hreflang`
   only if a multi-language version is ever added.
8. Verify: LocalBusiness passes the Rich Results Test; NAP matches GBP exactly.

### Phase 7 — RODO (GDPR) information & cookie consent
> Legal wording must be reviewed by the business/lawyer; this phase builds the
> plumbing and drafts content. **Blocker: the site currently shows no company
> identity** — the data controller details are needed for both the privacy policy
> and LocalBusiness schema. Collect them first.

1. **Privacy policy page** (`/polityka-prywatnosci`) as a Content collection
   (`legal`) so it is editable in Studio. It must cover, per RODO Art. 13:
   - Identity + contact of the controller (and DPO if any).
   - Purposes and legal bases of processing (contact inquiries; analytics if added).
   - Categories of data, recipients/processors (hosting, analytics, email).
   - Retention periods, and the rights: access, rectification, erasure,
     restriction, portability, objection, and complaint to the Polish DPA
     (Prezes Urzędu Ochrony Danych Osobowych).
   - International transfers (Vercel/Google US) + safeguards.
   - Cookie information and how to withdraw consent.
2. **Cookie consent (CMP)** via `@dargmuesli/nuxt-cookie-control` v9 (Polish locale):
   - Granular categories: necessary (always on), analytics, marketing.
   - Block non-essential scripts until consent (no cookies before opt-in).
   - Persist choice, allow change/withdraw, link to the policy.
3. **Analytics with Consent Mode v2.** If analytics is added (e.g. `nuxt-gtag` v5),
   load it only after consent and implement Google Consent Mode v2 defaults
   (required for EU). Confirm with the business whether analytics is even wanted.
4. **Contact details / forms.** No form exists today; the phone/email in the
   contact section is personal data — the privacy policy must cover it. If a
   contact form is added later, add an explicit consent checkbox + Art. 13 notice.
5. Verify: banner appears on first visit, blocks non-essential cookies, choice
   persists, policy page reachable from footer and banner.

### Phase 8 — Core Web Vitals & performance refinement
Targets: LCP < 2.5 s, CLS < 0.1, INP < 200 ms (mobile, field data).

1. **LCP — hero.** The autoplaying 9.3 MB `filmik_glowna.mp4` is the main LCP
   risk. Actions:
   - Re-encode/compress the loop (target ≤ 1–2 MB, e.g. H.264/VP9, shorter loop,
     reduced resolution) and serve via `<video preload="metadata" poster="...">`.
   - Provide a lightweight poster image (NuxtImg, AVIF/WebP) so LCP paint does not
     wait on the video.
   - Consider disabling autoplay video on mobile / `prefers-reduced-motion`, or
     swapping to a hero image on small screens.
2. **Images.** Source images are huge (17 MB, 10 MB, 3.7 MB). Compress the
   originals (they are still fetched/transformed on cold start) and rely on
   `@nuxt/image` v2 (`format: ['webp']`, `screens`) for responsive variants.
   Add explicit `width`/`height` (or aspect ratio) to every `<NuxtImg>` to remove
   CLS; fix the `srcset="undefined"` bug (Phase 3).
3. **Fonts.** Convert the self-hosted TTF/OTF to `woff2`, subset to
   `latin` + `latin-ext`, preload the critical family; `@nuxt/fonts` v1 already
   emits `size-adjust` fallbacks (keep). Drop duplicate static/variable TTFs from
   `public/fonts` once `@nuxt/fonts` serves them.
4. **CSS/JS.** Verify critical CSS and defer non-critical JS; confirm no hydration
   warnings from Embla/nav.
5. **Caching.** Long-lived `Cache-Control` for hashed `_nuxt/*` assets and
   `public/` images; sitemap `gzip` (already set).
6. **A11y (overlaps SEO).** Add `alt` to images, `aria-label` to the carousel
   prev/next buttons and the drawer toggle, and `lang="pl"`.
7. Verify: re-run Lighthouse/PageSpeed vs the Phase 0 baseline; confirm LCP/CLS/INP
   improvements on mobile and that visuals are unchanged.

### Phase 9 — Tailwind v4 (optional, isolated, deferrable)
Only if "newest ecosystem" should include Tailwind v4. Keep on its own branch/PR.

1. Remove `@nuxtjs/tailwindcss` + `tailwindcss-animate`; add `tailwindcss@^4`,
   `@tailwindcss/vite`, `tw-animate-css` (v4 replacement for `tailwindcss-animate`).
2. Add the `@tailwindcss/vite` plugin in `nuxt.config.ts` `vite.plugins`.
3. Convert `tailwind.config.js` to CSS-first config in `assets/styles/global.css`:
   - `theme.extend` → `@theme { ... }` (`--font-sans`, `--font-custom`,
     `--color-accent`, `--color-accent-600`, keyframes/animation).
   - Custom `matchUtilities` text-shadow plugin → `@utility text-shadow-*`.
   - `.object-t30` plugin → `@utility` or a plain class.
   - `@import "tailwindcss";` replaces the `@tailwind` directives.
4. Fix renamed utilities used here: `shadow-sm` → `shadow-xs`
   (`Navigation.vue`), `backdrop-blur-0` → `backdrop-blur-none`
   (`Navigation.vue`); verify `h-[--menu-height]` (v4 prefers `h-(--menu-height)`).
5. Fix the `textShadow` typo (`'0px 0px 8px\` black'`) during conversion.
6. Verify `@apply` blocks in `Navigation.vue` / `card.vue` compile.
7. Visual diff against the Phase 0 baseline; ship only on a clean match.

### Phase 10 — Cleanup (non-functional, low risk)
1. Delete `index2.html`, `index_test.html`, `public/favicon.ico~`.
2. Delete unused composables and the now-unused `lodash-es` + `@types/lodash-es`.
3. Delete unused public images (section 2.11) after confirming no content refs.
4. `tsconfig.json`: drop the stale `#content/*` path override and old comment.
5. Update `README.md` (still says "Content v2 Minimal Starter").

### Phase 11 — CI/CD consolidation
1. Decide the single deployment target (production is Vercel SSR).
2. If keeping the Actions workflow: Node 22.22.3+, remove `@nuxthq/studio` +
   `.nuxtrc`, drop the `github_pages` preset unless gh-pages is still wanted.
3. If Vercel only: replace the workflow with a build check
   (`pnpm install --frozen-lockfile && pnpm build`) and let Vercel deploy.
4. Add a `pnpm build` CI job as the required check for the migration PR.
5. `better-sqlite3` stays in devDependencies; confirm it is not needed at runtime
   once Phase 3 prerendering is in place.

---

## 4. Verification checklist (run after every phase)

Functional parity:
- [ ] `/` renders hero video, nav (desktop + mobile drawer), offer carousel with
      9 cards, contact section.
- [ ] Each `/oferta/<slug>` renders correct title, description, price, image
      (currently broken — key acceptance test).
- [ ] Nav anchor scrolling (`#witamy`, `#oferta`, `#kontakt`) works on `/`; the
      "back"/"contact" buttons work on offer pages.
- [ ] Custom icon `my-icon:listek` renders (contact + 404).
- [ ] Fonts: `Lora` body + `eternals-universe` headings render, including Polish
      diacritics (ą/ć/ę/ł/ń/ó/ś/ź/ż).
- [ ] Images served through the image provider; no `srcset="undefined"`.
- [ ] 404 route shows the styled error page.
- [ ] Responsive breakpoints behave as before (nuxt-viewport drawer logic).

SEO / AI / local:
- [ ] `sitemap.xml` lists `/` + all 9 offer URLs, HTTP 200.
- [ ] `robots.txt` returns 200 with the sitemap reference + AI signals.
- [ ] `<title>`, meta description, canonical, OG tags on `/` and offer pages.
- [ ] `<html lang="pl">`.
- [ ] JSON-LD `@graph`: `WebSite`, `WebPage`, `LocalBusiness` (+ `Service`/`Offer`
      per offer, breadcrumbs) validates in the Rich Results Test.
- [ ] `/llms.txt` (+ `/llms-full.txt`) generated; `/oferta/<slug>.md` returns
      markdown.
- [ ] NAP in the footer/contact matches the structured data and the Google
      Business Profile.

RODO / consent:
- [ ] Privacy policy page reachable from footer + banner, covering RODO Art. 13.
- [ ] Cookie banner on first visit; granular categories; blocks non-essential
      cookies until consent; choice persists and is revocable.
- [ ] Analytics (if enabled) loads only after consent, with Consent Mode v2.

Performance:
- [ ] Lighthouse/PageSpeed not worse than the Phase 0 baseline; LCP < 2.5 s,
      CLS < 0.1, INP < 200 ms on mobile.
- [ ] No new console errors / hydration warnings.

---

## 5. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Content v3 query fails on Vercel serverless | Prerender all routes (Phase 3) |
| Missing company/legal data blocks RODO + LocalBusiness | Collect controller identity (name, address, NIP/KRS, email) before Phase 5/7 |
| Schema.org nodes drift from visible content | Only mark up content that is on the page (Service/Offer from frontmatter, FAQ if visible) |
| Cookie consent wrongly implemented (cookies before consent) | Block scripts until opt-in; test with a fresh profile; Consent Mode v2 |
| AI content-signals policy conflict (train vs cite) | Decide policy with the business; default to allow search/citation |
| `@nuxt/fonts` v1 `throwOnError` fails the build | Verify resolution; explicit `fonts.families` or `throwOnError: false` |
| Heavy hero video keeps LCP high | Re-encode + poster + mobile fallback (Phase 8) |
| Tailwind v3 → v4 visual regressions | Isolate in Phase 9; diff vs baseline; defer if time-boxed |
| Sitemap v9 API changes (`#sitemap/server`) | Update the one endpoint; verify output |
| Studio publish needs OAuth env vars | Set `STUDIO_*` env vars; fix `repository.owner` |
| Two deployment paths diverge (Vercel + gh-pages) | Consolidate in Phase 11 |
| Long-lived migration branches/PR #30 | Close/rebase before starting |

---

## 6. Open questions / inputs needed from the business
1. **Company identity** for RODO + Schema.org/LocalBusiness: legal name, address,
   NIP/KRS, contact email for privacy matters, DPO (if any), geo coordinates,
   social profile URLs.
2. **Analytics/marketing**: are Google Analytics / Meta Pixel / Google Ads wanted?
   (Determines whether a CMP and Consent Mode are strictly needed.)
3. **Service area** for local SEO: which cities/region to target.
4. **AI training policy**: allow LLMs to train on the content, or only search/cite?
5. **Deployment**: keep the gh-pages export or consolidate on Vercel?
6. **Tailwind v4**: include it in this migration or defer?

---

## 7. Rollback
- Each phase is a separate commit/PR on `chore/nuxt-ecosystem-upgrade`.
- Vercel keeps the previous production deployment; promote it if a phase fails.
- Keep the Phase 0 baseline (screenshots + HTML + Lighthouse) to compare and to
  justify a rollback decision.
