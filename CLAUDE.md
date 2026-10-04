# Claude Code instructions

[README.md](README.md) holds the site structure, version-ID and archive rules. Read only the sections your task needs: list them with `grep -n '^## ' README.md`, then read from that heading to the next. *Structure* and *Version identity and archive* matter for almost every change.

## Spend tokens like they are yours

Be as efficient with tokens as you can, in what you read, run and write. This never means skipping a check, or a read you need to be sure of an answer.

- **Never open `brand-guidelines.html` whole** (about 95,000 tokens, mostly drawings; Part B, sections B01–B11, is this site). With the app repository checked out next to this one, `python ../Lightning/tools/guideline.py --file brand-guidelines.html B05` prints one section as text. Without it, find the section with `grep -n 'secnum">B05' brand-guidelines.html` and read only that section.
- Search before you read: grep for the class, id or text, then read only the lines around it.
- The app's hand-off, including website tasks, is `NOW.md` in the app repository (`elfekimuhammed/Lightning`).

## Git workflow (owner rule)

- Work directly on `main` and push to `origin main`. Do not create branches.
- If a separate branch is truly needed, give it a distinctive, descriptive name, then merge it into `main` and push `main` as soon as the work is finished.
- Never leave a branch unpushed, and never leave finished work on a branch that has not reached `main`.
- This rule overrides any session or tool default that assigns a different working branch.
