# Website release archive

Before editing a live page, preserve it here as `RELEASE-ID.html`, for example
`UX-2026.10.01.06.html`. Add that direct path to `version-registry.json` and
`versions.html`, mark the release archived, and only then give the changed live
page a new `UX-YYYY.MM.DD.NN` identifier.

Archive IDs must never be reused. Keep the archived page’s own `data-ux-version`
unchanged so UX and app-feedback rows remain comparable. Brand-wide changes
(the logo, icons, the testing panel) may be applied to snapshots; the page’s
content and layout stay as they were.

Put `<base href="../">` right after `<meta charset>` in a new snapshot so its
`css/`, `js/` and `assets/` paths resolve from the site root. If the page's own
stylesheet or script will keep changing, save a copy beside the snapshot as
`RELEASE-ID.css` or `RELEASE-ID.js` and link that instead (see
`UX-2026.10.03.01` and `UX-2026.10.07.37`).
