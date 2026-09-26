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

## Status

This is a draft. The early-access form doesn't send anything yet.
