# Lightning website

The marketing site for **Lightning**, a personal wealth app made in Egypt.

> Study Your Patterns. Control Your Future.

Built in the **Meadow** identity: meadow green for growth, azure for clarity, and a deep Nile anchor for actions. Headings and big numbers use Bricolage Grotesque; text and figures use Manrope. Open the [Lightning guideline](brand-guidelines.html) (3.10) for the complete system: Part A is the app, Part B is this site. The same file lives in the app repository as `docs/BRAND_GUIDELINE.html`; change both together.

## Structure

```
index.html          Landing page A · Product: what Lightning does (guideline 3.9 Part B)
version-b.html      Landing page B · Philosophy: why it works (guideline 3.9 Part B)
version-c.html      redirect to version-b.html (Version C is archived)
version-d.html      redirect to index.html (Version D is archived)
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
css/landing.css     both landing pages: self-contained, guideline 3.9 tokens and building blocks only
js/landing.js       both landing pages: calculator, product tour, lightbox and signup
css/version-d.css   Version D's stylesheet, kept for the release log page
js/analytics.js     GoatCounter page views and one event per download
audit/              website audits against the guideline
css/theme.css       light/dark switch
css/dev-dock.css    testing panel (page version + UX test)
js/dev-dock.js      builds the testing panel on every version
js/theme.js         picks and remembers the theme
assets/app/mohab/    app screenshots from the built-in sample household (python -m lightning --demo)
css/ux-test.css     shared UX test feedback rail
js/ux-test.js       shared UX test behavior
js/current-status.js multi-ticket app feedback form behavior
apps-script/        Apps Script receiver patches
assets/samples/     fictional Mohab CSV files for safe beta imports
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
- `UX-2026.10.04.01` — `index.html` (A · Product)
- `UX-2026.10.04.02` — `version-b.html` (B · Philosophy)
- `UX-2026.10.04.03` — `index.html` (A · Product, three advantages)
- `UX-2026.10.04.04` — `version-b.html` (B · Philosophy, new screens)
- `UX-2026.10.04.05` — `release-log.html` (guideline 3.10 gradient)
- `UX-2026.09.30.04` — `how-it-works.html` (six steps)
- `UX-2026.10.01.07` — `how-it-works.html` (monthly routine)
- `UX-2026.10.03.04` — `current-status.html` (downloads table links to the release log)
- `UX-2026.10.03.06` — `current-status.html` (separate permanent 0.5 and 0.4 downloads)
- `UX-2026.10.03.07` — `release-log.html` (0.5.0 beta 1 available)
- `UX-2026.10.03.08` — `app-feedback.html` (0.5 and 0.4 build selection)

The rail discovers each top-level section automatically, so a future landing page only needs the shared CSS and JS includes plus `data-ux-version` and `data-ux-endpoint` on its `<body>`. Responses are posted in one batch and stored as one row per rated section in the `UX Tests` Sheet tab.

UX responses go to the survey sheet until the Apps Script receiver routes them. To fix it, follow the steps at the top of [apps-script/UXTestsReceiverPatch.gs](apps-script/UXTestsReceiverPatch.gs):

1. Paste the file into the receiver's Apps Script project.
2. Make `if (e && e.parameter && e.parameter.form_type === 'ux_test') return saveUxTest_(e.parameter);` the first line of `doPost(e)`.
3. Deploy → Manage deployments → edit the existing deployment → New version → Deploy. Saving alone does not change the live web app.
4. Run `testUxRoute` once from the editor and check that a row appears in the **UX Tests** tab (created automatically if missing).

## Current Status and app feedback

[Current Status](current-status.html) is the shared beta hub for both landing pages. It keeps beta orientation, harmless Mohab sample CSVs, release notes/download links and app feedback in one predictable place. The header and the **Testing** panel both link to it. Home on this shared page returns to the landing version a visitor most recently viewed.

The app feedback form accepts multiple tickets at once. The browser sends a single `form_type=app_feedback` request; the receiver expands it into **one row per ticket** in the **App Feedback** tab, capturing the internal landing release, selected app build, section, bug/improvement, visual/technical category, description, session and device.

To activate it, follow [apps-script/AppFeedbackReceiverPatch.gs](apps-script/AppFeedbackReceiverPatch.gs): add the `app_feedback` `doPost` branch, then deploy a new version of the existing Apps Script web app. The static site is already wired to the existing endpoint. The pre-created **App Feedback** tab is in [Lightning-survey-responses](https://docs.google.com/spreadsheets/d/1rmV9GtffAJByilsxre0bQBMm-cza1uCXBwDbjuD_ffc/edit).

The included `assets/samples/mohab-2026-full-year.zip` is Mohab’s full fictional 2026 sample pack: eight CSVs for accounts, CIB payroll, Vodafone Cash, cash wallet, gold, certificate, THNDR and prices. It lets a tester explore the complete import and analysis flow without entering their own data.

## Analytics (GoatCounter)

`js/analytics.js` is loaded on every page (not the brand guideline). It sends page views to [GoatCounter](https://mohamedelfeki.goatcounter.com), which shows visits and unique visitors, and records one event per download:

- `download-app-<version>-<platform>` for an app build, read from any link to the Lightning-downloads repository that ends in `.zip`, `.exe`, `.msi`, `.dmg` or `.AppImage` (for example `download-app-v0.5.0-beta.1-windows`). A new build is counted as soon as its link is on a page; nothing to tag.
- `download-sample-<file>` for the sample pack.

Read them on the GoatCounter dashboard; events are listed with the pages, filter by `download`. GoatCounter ignores localhost, so local previews are not counted. Add `<script src="js/analytics.js?v=20261003-1" defer></script>` before `</head>` on any new page.

## Version identity and archive

Every testable web experience has one visible immutable release ID, in the form `UX-YYYY.MM.DD.NN`. Current IDs appear in the Testing panel and on [Version Archive](versions.html); feedback records that same ID. Before a live page changes, copy it to `archive/RELEASE-ID.html`, add its permanent link to `version-registry.json` and `versions.html`, then allocate a new ID to the changed page. Never reuse an ID or overwrite an archived snapshot.

Windows app versions are separate from website experience IDs. The Current Status page and [Version Archive](versions.html) link to each app build independently. Keep at least the three newest app versions permanently, add a new row for every release, and never replace an older version's file or link. Published ZIPs and checksums live in the public [Lightning-downloads repository](https://github.com/elfekimuhammed/Lightning-downloads).

## Status

The website, survey, and Google Sheets receiver are connected. When changing the receiver, update its URL in both landing pages and the survey page, then verify that a submission appears in the destination Sheet.

## Dark mode

Both landing pages, How It Works and the brand guidelines support light and dark ("Meadow Night"). The full spec is in section B09 Dark mode of `brand-guidelines.html`.

- The page follows the device setting until the visitor uses the switch; the choice is then remembered in `localStorage` (`lightning-theme`).
- To add dark mode to another page: include `css/theme.css` and `js/theme.js` (in `<head>`, not deferred), add `<button data-theme-toggle></button>` to the top bar, and define the page's dark colors under `:root[data-theme="dark"]`.
- The survey is still light only.

## Header and testing panel

- Every version uses the same header: the logo, **Home · How It Works · Current Status**, and a dark **Take the survey** button (just "Survey" on phones). The header only links to pages, never to a section of the same page.
- The page-version switch (A · Product, B · Philosophy), **Submit UX Test**, and **Submit app feedback** live in the **Testing** tab on the right edge of the screen. `js/dev-dock.js` builds it the same way on every page; load it with `defer` before `js/ux-test.js`.
- How It Works and Current Status remember which version the visitor came from, so **Home** and the testing panel point back to it.

## Landing pages

There are two landing pages, both built only from [guideline 3.9](brand-guidelines.html) Part B and both loading only `css/landing.css` and `js/landing.js` (plus the shared theme, testing panel and UX rail). Hero and section headers are centred, each section opens with a short label, and every page ends with the same early-access band. Versions A, B, C and D before 2026-10-04 are in the [version archive](versions.html); `version-c.html` and `version-d.html` now redirect.

**A · Product (`index.html`)** sells Lightning's three advantages over apps that only automate tracking: everything you own and owe, the next three months, and why it changed. Order: hero (H1 with its punch line, the screen trio), beyond tracking (three pillar cards, each against what most apps give), everything you own and owe (six places counted as one net worth), the next three months (safe to spend beside the forecast, then the next 30 days, the loan payoff and the month ahead), analysis (the tour), does the tedious part (bills find their payments, repeats spotted, one balance checks an account, imports ask once per name, beside the Looks recurring screen), how it works (three numbered steps), private by design, good questions and the early-access band.

**B · Philosophy (`version-b.html`)** shows why it works, then the product as proof. Order: hero (H1 with its punch line, the story trio: the plan, the 9:40 reality, the habit), a better system (the habit sum and the page's one quote), a quick game (the calculator), three truths in order, every app sees one corner (six places, then Lightning, beside the Overview screen), private by design and the early-access band.

- Screens are in `assets/app/mohab-2026-10-04/`, captured 2026-10-04 from the app's demo (`LIGHTNING_TODAY=2026-09-30 python -m lightning --demo`); `assets/app/mohab/` keeps the older screens for archived pages.
- Every figure on A is on the screen beside it or adds up from Mohab's Overview on 2026-09-30 (260,565 in your accounts, 10,000 held for family, 52,500 left on the car loan, 198,065 net worth; free cash 72,663 less 1,309 budget left = 71,354 safe to spend; holdings 177,903; next 30 days −15,980 out; +21,830 expected in 2026-11; car loan paid off 2028-06-05). B uses the same household. Recapture the screens and these figures together.
- One quote per page at most (B has James Clear; A has none). No testimonials until there are real ones. No placeholders.
- How It Works, Current Status and the release log are shared; Home on them returns to the landing page the visitor came from.

## Logo

The logo is the two-leaf mark from the guideline (A02): azure is money you hold, green is money that grows. Files are in `assets/brand/`, copied from the guideline:

- `lightning-mark.svg`: the colour mark, used in every header and footer, light and dark.
- `lightning-app-icon.svg`: the mark on a Nile tile, used as the favicon; `lightning-icon-64.png` and `lightning-icon-180.png` (home screen) are rendered from it.
- `lightning-mark-flat.svg`, `lightning-mark-on-dark.svg`, `lightning-mark-nile.svg`, `lightning-mark-white.svg`, `lightning-lockup.svg` and `lightning-lockup-white.svg` for other uses.
- `lightning-logo-gradient.png`, `lightning-logo-gradient-wordmark.png`, `lightning-mark.png`, `icon-512.png` and `linkedin-banner.png` are re-rendered from the SVGs.
- The old ribbon mark and bolt icon are gone; archived pages use the two-leaf mark too.

## App screenshots

All product images come from the app's sample household, pinned to the end of September 2026:

```
LIGHTNING_TODAY=2026-09-30 python -m lightning --demo
```

- Full-window screens (2000 × 1250) are used in tours and steps. Content crops without the sidebar (1800 × 1125, named `a-*.webp`) are used where the chart is the message: the hero trio on every version and the analysis grid on How It Works.
- The hero on A shows the trio: Overview in the middle, Investments and Expense analysis beside it. B shows the Overview beside its six corners.
- Quoted figures (net worth 198,065, savings rate 50.1%, safe to spend 71,354 and so on) match these screens. Rules are in section B07 Product screens of `brand-guidelines.html`.
