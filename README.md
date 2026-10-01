# Lightning website

The marketing site for **Lightning**, a personal wealth app made in Egypt.

> Study Your Patterns. Control Your Future.

Built in the **Meadow** identity: meadow green for growth, azure for clarity, and a deep Nile anchor for actions. Headings and big numbers use Bricolage Grotesque; text and figures use Manrope. Open the [visual brand guidelines](brand-guidelines.html) for the complete color, typography, card, layout, and voice system.

## Structure

```
index.html          Version A landing page (hybrid of B's clarity and C's philosophy)
version-b.html      Version B landing page (product-first story, rebuilt 2026-09-30)
version-c.html      Version C landing page (product-led, live app tour)
how-it-works.html   Version C step-by-step workflow page
survey.html         optional personal finance survey
css/styles.css      shared styles
css/version-b.css   Version B's own sections (builds on css/version-c.css)
js/version-b.js     Version B calculator with an adjustable return rate
css/version-c.css   Version C and How It Works visual system
js/version-c.js     Version C calculator, signup, product tour and lightbox
css/theme.css       light/dark switch
css/dev-dock.css    testing panel (page version + UX test)
js/dev-dock.js      builds the testing panel on every version
js/theme.js         picks and remembers the theme
assets/app/         screenshots of the Lightning app (sample data)
assets/app/omar/    screenshots of the app's built-in sample household (python -m lightning --demo)
css/ux-test.css     shared UX test feedback rail
js/ux-test.js       shared UX test behavior
apps-script/        Apps Script receiver patches
assets/favicon.svg  bolt icon
brand-guidelines.html visual brand and component guide
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
- `UX-2026.09.30.04` — `how-it-works.html`

The rail discovers each top-level section automatically, so a future landing page only needs the shared CSS and JS includes plus `data-ux-version` and `data-ux-endpoint` on its `<body>`. Responses are posted in one batch and stored as one row per rated section in the `UX Tests` Sheet tab.

UX responses go to the survey sheet until the Apps Script receiver routes them. To fix it, follow the steps at the top of [apps-script/UXTestsReceiverPatch.gs](apps-script/UXTestsReceiverPatch.gs):

1. Paste the file into the receiver's Apps Script project.
2. Make `if (e && e.parameter && e.parameter.form_type === 'ux_test') return saveUxTest_(e.parameter);` the first line of `doPost(e)`.
3. Deploy → Manage deployments → edit the existing deployment → New version → Deploy. Saving alone does not change the live web app.
4. Run `testUxRoute` once from the editor and check that a row appears in the **UX Tests** tab (created automatically if missing).

## Status

The website, survey, and Google Sheets receiver are connected. When changing the receiver, update its URL in both landing pages and the survey page, then verify that a submission appears in the destination Sheet.

## Version C

Version C tells the story in this order: hero, game, three truths, the budgeting story, “And That Is Lightning”, a live product tour, testimonials and signup. `how-it-works.html` walks through the app in six steps.

- **App screenshots** in `assets/app/` are captured from the Lightning app running on a sample household (six months of salary, spending, budgets, THNDR holdings, gold, bills, a car loan and reserves, dated to 30 September 2026). They are 2000 × 1250 WebP files; keep that size when replacing one so the frames stay consistent.
- **Testimonials** are placeholders. Replace the quote, name, initials and role in each `figure[data-placeholder="testimonial"]` in `version-c.html`, then remove the `data-placeholder` attribute.
- The product tour copy lives in the `TOUR` list at the bottom of `version-c.html`.

## Dark mode

All three versions, How It Works and the brand guidelines support light and dark ("Meadow Night"). The full spec is in the Dark Mode section of `brand-guidelines.html`.

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

- Every version uses the same header: the logo, **Home · How It Works**, and a dark **Take the survey** button (just "Survey" on phones). The header only links to pages, never to a section of the same page.
- The page-version switch (A · B · C) and **Submit UX Test** live in the **Testing** tab on the right edge of the screen. `js/dev-dock.js` builds it the same way on every page; load it with `defer` before `js/ux-test.js`.
- How It Works remembers which version the visitor came from, so **Home** and the testing panel point back to it.

## Version A

Version A is the hybrid: Version B's clear opening and practical proof, with Version C's philosophy.

- Order: what Lightning is (privacy in the hero), money in six places, safe to spend, the idea behind Lightning (the budgeting story), the calculator, three truths about building wealth, the product tour, trust, FAQ and early access.
- One quote only: James Clear's line on systems, placed where the story turns from budgets to habits.
- It shares B's styles, screenshots and calculator (`css/version-b.css`, `js/version-b.js`, `assets/app/omar/`), and has the same pricing and founder placeholders in the FAQ.
