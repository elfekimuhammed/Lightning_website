# Lightning website

The marketing site for **Lightning**, a personal wealth app made in Egypt.

> Study Your Patterns. Control Your Future.

Built in the **Meadow** identity: meadow green for growth, azure for clarity, and a deep Nile anchor for actions. Headings and big numbers use Bricolage Grotesque; text and figures use Manrope. Open the [Lightning guideline](brand-guidelines.html) (3.8) for the complete system: Part A is the app, Part B is this site. The same file lives in the app repository as `docs/BRAND_GUIDELINE.html`; change both together.

## Structure

```
index.html          Version A landing page (hybrid of B's clarity and C's philosophy)
version-b.html      Version B landing page (product-first story, rebuilt 2026-09-30)
version-c.html      Version C landing page (product-led, live app tour)
version-d.html      Version D landing page (built from guideline 3.8 Part B)
how-it-works.html   the monthly 30-minute routine: upload, adjust, analyse
release-log.html    release log: what changed build by build (Version D system; css/release-log.css)
current-status.html shared beta hub: status, safe sample CSVs, builds and app feedback
versions.html       release registry and visible IDs for every testable experience
version-registry.json machine-readable release IDs and archive locations
survey.html         optional personal finance survey
css/styles.css      shared styles
css/version-b.css   Version B's own sections (builds on css/version-c.css)
js/version-b.js     Version B calculator with an adjustable return rate
css/version-c.css   Version C and How It Works visual system
js/version-c.js     Version C calculator, signup, product tour and lightbox
css/version-d.css   Version D: self-contained, guideline 3.8 tokens and building blocks only
js/version-d.js     Version D calculator, product tour, lightbox and signup
audit/              website audits against the guideline
css/theme.css       light/dark switch
css/dev-dock.css    testing panel (page version + UX test)
js/dev-dock.js      builds the testing panel on every version
js/theme.js         picks and remembers the theme
assets/app/omar/    app screenshots from the built-in sample household (python -m lightning --demo)
css/ux-test.css     shared UX test feedback rail
js/ux-test.js       shared UX test behavior
js/current-status.js multi-ticket app feedback form behavior
apps-script/        Apps Script receiver patches
assets/samples/     fictional Omar CSV files for safe beta imports
assets/brand/       the two-leaf logo and icons (see Logo below)
brand-guidelines.html Lightning guideline 3.8: A · App and B · Website (same file as the app's docs/BRAND_GUIDELINE.html)
```

It's a static site with no build step and no dependencies. The fonts load from Google Fonts.

## Run it locally

Open `index.html` in a browser, or serve the folder:

```
python -m http.server 8000
```

## Publish with GitHub Pages

Settings → Pages → Deploy from a branch → `main` / root.

## Collect survey responses

GitHub Pages is static. The survey and both landing pages send responses to the configured Google Apps Script endpoint, which writes to Google Sheets. The survey posts `form_type=survey`; the email signup posts `form_type=signup`. The calculator runs in the browser.

The bank equivalent uses monthly amount × 12 ÷ 20% (for example, 2,000 EGP/month = 120,000 EGP). Version B also illustrates ten years of monthly deposits at a hypothetical 20% annual rate, compounded monthly.

## UX test responses

Every landing page includes the same scroll-aware UX feedback rail. It sends an internal release identifier rather than the visible landing-page name:

- `UX-2026.09.28.01` — `index.html` (before the hybrid)
- `UX-2026.10.01.06` — `index.html` (hybrid)
- `UX-2026.09.28.02` — `version-b.html` (before the rebuild)
- `UX-2026.09.30.05` — `version-b.html` (rebuilt)
- `UX-2026.09.30.03` — `version-c.html`
- `UX-2026.10.03.01` — `version-d.html` (guideline 3.6)
- `UX-2026.10.03.02` — `version-d.html` (guideline 3.7)
- `UX-2026.10.03.03` — `version-d.html` (guideline 3.8)
- `UX-2026.09.30.04` — `how-it-works.html` (six steps)
- `UX-2026.10.01.07` — `how-it-works.html` (monthly routine)
- `UX-2026.10.03.04` — `current-status.html` (downloads table links to the release log)
- `UX-2026.10.03.05` — `release-log.html`

The rail discovers each top-level section automatically, so a future landing page only needs the shared CSS and JS includes plus `data-ux-version` and `data-ux-endpoint` on its `<body>`. Responses are posted in one batch and stored as one row per rated section in the `UX Tests` Sheet tab.

UX responses go to the survey sheet until the Apps Script receiver routes them. To fix it, follow the steps at the top of [apps-script/UXTestsReceiverPatch.gs](apps-script/UXTestsReceiverPatch.gs):

1. Paste the file into the receiver's Apps Script project.
2. Make `if (e && e.parameter && e.parameter.form_type === 'ux_test') return saveUxTest_(e.parameter);` the first line of `doPost(e)`.
3. Deploy → Manage deployments → edit the existing deployment → New version → Deploy. Saving alone does not change the live web app.
4. Run `testUxRoute` once from the editor and check that a row appears in the **UX Tests** tab (created automatically if missing).

## Current Status and app feedback

[Current Status](current-status.html) is the shared beta hub for all three landing experiences. It keeps beta orientation, harmless Omar sample CSVs, release notes/download links and app feedback in one predictable place. The header and the **Testing** panel both link to it. Home on this shared page returns to the landing version a visitor most recently viewed.

The app feedback form accepts multiple tickets at once. The browser sends a single `form_type=app_feedback` request; the receiver expands it into **one row per ticket** in the **App Feedback** tab, capturing the internal landing release, selected app build, section, bug/improvement, visual/technical category, description, session and device.

To activate it, follow [apps-script/AppFeedbackReceiverPatch.gs](apps-script/AppFeedbackReceiverPatch.gs): add the `app_feedback` `doPost` branch, then deploy a new version of the existing Apps Script web app. The static site is already wired to the existing endpoint. The pre-created **App Feedback** tab is in [Lightning-survey-responses](https://docs.google.com/spreadsheets/d/1rmV9GtffAJByilsxre0bQBMm-cza1uCXBwDbjuD_ffc/edit).

The included `assets/samples/omar-2026-full-year.zip` is Omar’s full fictional 2026 sample pack: eight CSVs for accounts, CIB payroll, Vodafone Cash, cash wallet, gold, certificate, THNDR and prices. It lets a tester explore the complete import and analysis flow without entering their own data.

## Version identity and archive

Every testable web experience has one visible immutable release ID, in the form `UX-YYYY.MM.DD.NN`. Current IDs appear in the Testing panel and on [Version Archive](versions.html); feedback records that same ID. Before a live page changes, copy it to `archive/RELEASE-ID.html`, add its permanent link to `version-registry.json` and `versions.html`, then allocate a new ID to the changed page. Never reuse an ID or overwrite an archived snapshot.

## Status

The website, survey, and Google Sheets receiver are connected. When changing the receiver, update its URL in both landing pages and the survey page, then verify that a submission appears in the destination Sheet.

## Version C

Version C tells the story in this order: hero, game, three truths, the budgeting story, “And That Is Lightning”, a live product tour, testimonials and signup. `how-it-works.html` walks through the app in six steps.

- **App screenshots** in `assets/app/` are captured from the Lightning app running on a sample household (six months of salary, spending, budgets, THNDR holdings, gold, bills, a car loan and reserves, dated to 30 September 2026). They are 2000 × 1250 WebP files; keep that size when replacing one so the frames stay consistent.
- **Testimonials** are placeholders. Replace the quote, name, initials and role in each `figure[data-placeholder="testimonial"]` in `version-c.html`, then remove the `data-placeholder` attribute.
- The product tour copy lives in the `TOUR` list at the bottom of `version-c.html`.

## Dark mode

All four versions, How It Works and the brand guidelines support light and dark ("Meadow Night"). The full spec is in section B09 Dark mode of `brand-guidelines.html`.

- The page follows the device setting until the visitor uses the switch; the choice is then remembered in `localStorage` (`lightning-theme`).
- To add dark mode to another page: include `css/theme.css` and `js/theme.js` (in `<head>`, not deferred), add `<button data-theme-toggle></button>` to the top bar, and define the page's dark colors under `:root[data-theme="dark"]`.
- The survey is still light only.

## Version B

Version B tells one story, in this order: what Lightning is (with privacy in the hero), money spread across many places, why your balance isn't all yours to spend, your habits, the small-change calculator, how small changes become wealth, the product tour, trust, FAQ and early access.

- Screens and numbers come from the app's own sample household (Omar, September 2026). If you recapture `assets/app/omar/`, update the figures quoted in `version-b.html`.
- Two FAQ answers are placeholders: pricing and the founder note. Fill them in before sharing the page widely.
- There is no testimonial section. Add one once you have real quotes that describe a realization, not praise.
- How It Works links back to whichever landing page (B or C) the visitor came from.

## Header and testing panel

- Every version uses the same header: the logo, **Home · How It Works · Current Status**, and a dark **Take the survey** button (just "Survey" on phones). The header only links to pages, never to a section of the same page.
- The page-version switch (A · B · C · D), **Submit UX Test**, and **Submit app feedback** live in the **Testing** tab on the right edge of the screen. `js/dev-dock.js` builds it the same way on every page; load it with `defer` before `js/ux-test.js`.
- How It Works and Current Status remember which version the visitor came from, so **Home** and the testing panel point back to it.

## Version D

Version D is built from [guideline 3.8](brand-guidelines.html) Part B, after the [2026-10-03 audit](audit/2026-10-03-website-audit.md) of A, B, C, How It Works and Current Status.

- Order: hero (label, H1 with its punch line in the gradient, one line, Get early access, the screen trio), one picture (six places counted as one net worth), what's really free (safe to spend beside the Cash planning screen), what we believe (one habit and the page's one quote), try it (the calculator), the tour (every screen answers one question), private by design, good questions and the early-access band. Each section opens with a short label so the reader knows what kind of section comes next.
- It loads only `css/version-d.css` (plus the shared theme, testing panel and UX rail). Tokens are copied from the guideline; change them there first. Hero and section headers are centred; copy inside cards is left aligned.
- Every figure is on the screen beside it or adds up from Omar's Overview on 2026-09-30 (260,565 in your accounts, 10,000 held for family, 52,500 left on the car loan, 198,065 net worth). Recapture the screens and these figures together.
- No placeholders: the FAQ answers only what the app does today, and the founder answer points to Current Status.
- How It Works and Current Status are shared and still use the older style; the audit lists what they need.

## Logo

The logo is the two-leaf mark from the guideline (A02): azure is money you hold, green is money that grows. Files are in `assets/brand/`, copied from the guideline:

- `lightning-mark.svg`: the colour mark, used in every header and footer, light and dark.
- `lightning-app-icon.svg`: the mark on a Nile tile, used as the favicon; `lightning-icon-64.png` and `lightning-icon-180.png` (home screen) are rendered from it.
- `lightning-mark-flat.svg`, `lightning-mark-on-dark.svg`, `lightning-mark-nile.svg`, `lightning-mark-white.svg`, `lightning-lockup.svg` and `lightning-lockup-white.svg` for other uses.
- `lightning-logo-gradient.png`, `lightning-logo-gradient-wordmark.png`, `lightning-mark.png`, `icon-512.png` and `linkedin-banner.png` are re-rendered from the SVGs.
- The old ribbon mark and bolt icon are gone; archived pages use the two-leaf mark too.

## Version A

Version A is the hybrid: Version B's clear opening and practical proof, with Version C's philosophy.

- Order: what Lightning is (privacy in the hero), money in six places, safe to spend, the idea behind Lightning (the budgeting story), the calculator, three truths about building wealth, the product tour, trust, FAQ and early access.
- One quote only: James Clear's line on systems, placed where the story turns from budgets to habits.
- It shares B's styles, screenshots and calculator (`css/version-b.css`, `js/version-b.js`, `assets/app/omar/`), and has the same pricing and founder placeholders in the FAQ.

## App screenshots

All product images come from the app's sample household, pinned to the end of September 2026:

```
LIGHTNING_TODAY=2026-09-30 python -m lightning --demo
```

- Full-window screens (2000 × 1250) are used in tours and steps. Content crops without the sidebar (1800 × 1125, named `a-*.webp`) are used where the chart is the message: the hero trio on every version and the analysis grid on How It Works.
- The hero on A, B and C shows the trio: Overview in the middle, Investments and Expense analysis beside it.
- Quoted figures (net worth 198,065, savings rate 50.1%, safe to spend 71,354 and so on) match these screens. Rules are in section B07 Product screens of `brand-guidelines.html`.
