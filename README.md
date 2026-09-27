# Lightning website

The marketing site for **Lightning**, a personal wealth app made in Egypt.

> Study Your Patterns. Control Your Future.

Built in the **Meadow** identity: meadow green for growth, azure for clarity, and a deep Nile anchor for actions. Headings and big numbers use Bricolage Grotesque; text and figures use Manrope. See [Brand guidelines](BRAND_GUIDELINES.md) for the complete color, typography, card, layout, and voice system.

## Structure

```
index.html          Version A landing page
version-b.html      Version B landing page
survey.html         optional personal finance survey
css/styles.css      shared styles
css/version-b.css   Version B visual system
assets/favicon.svg  bolt icon
BRAND_GUIDELINES.md brand and component rules
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

## Status

The website, survey, and Google Sheets receiver are connected. When changing the receiver, update its URL in both landing pages and the survey page, then verify that a submission appears in the destination Sheet.
