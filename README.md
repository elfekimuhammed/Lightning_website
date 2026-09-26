# Lightning website

The marketing site for **Lightning**, a personal wealth app made in Egypt.

> Study Your Patterns. Control Your Future.

Built in the **Meadow** identity: meadow green for growth, azure for held money, and one deep Nile anchor per view. Headings and big numbers use Bricolage Grotesque; text and figures use Manrope.

## Structure

```
index.html          the page
css/styles.css      all styles (base + Meadow identity)
assets/favicon.svg  the bolt icon
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

GitHub Pages is static, so it cannot store survey answers or email addresses on its own. The survey is prepared to send every response to a form endpoint.

1. Create a form in a collector such as [Formspree](https://formspree.io/) and copy its endpoint URL.
2. In `survey.html`, replace the empty value in `<form id="finance-survey" ... data-endpoint="">` with that URL.
3. Publish the site. The collector will receive every answer, including the optional `email` field.

The calculator runs entirely in the browser. Its target is calculated as monthly amount × 12 ÷ 20% (for example, 2,000 EGP/month = 120,000 EGP).

## Status

The calculator and survey are ready. Connect the survey endpoint above before collecting responses.
