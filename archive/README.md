# Website release archive

Before editing a live page, preserve it here as `RELEASE-ID.html`, for example
`UX-2026.10.01.06.html`. Add that direct path to `version-registry.json` and
`versions.html`, mark the release archived, and only then give the changed live
page a new `UX-YYYY.MM.DD.NN` identifier.

Archive IDs must never be reused. Keep the archived page’s own `data-ux-version`
unchanged so UX and app-feedback rows remain comparable.
