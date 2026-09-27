# Lightning brand guidelines

Version 1 · September 2026

Lightning helps people in Egypt understand their money and change their habits. The brand should feel clear, energetic, capable and calm. Show the user what their money is doing, then give them one practical next step.

## Brand idea

**Study Your Patterns. Control Your Future.** is the primary line. **Wealth Management Made Easy.** is the supporting promise. Use them together in the hero; elsewhere, use the shorter promise only when it adds meaning.

The visual idea is **Meadow**: a soft, welcoming environment with one vivid green to blue focal surface. Pale green signals growth and pale blue signals clarity. Deep Nile anchors actions and gives large numbers a confident frame.

## Voice and tone

| Quality | Do | Avoid |
| --- | --- | --- |
| Clear | “See what comes in, goes out and stays.” | Finance jargon without explanation. |
| Encouraging | “Small changes can make room in your month.” | Blame, guilt or “you are bad with money.” |
| Concrete | “2,000 EGP a month is 24,000 EGP a year.” | Vague promises about freedom or guaranteed wealth. |
| Honest | Label the 20% comparison as an illustration. | Presenting hypothetical returns as certain. |
| Local | Use EGP and familiar account examples. | Generic US banking language. |

Speak directly to the reader using “you.” Favor short sentences and familiar words. Headlines use Title Case; small eyebrow labels use uppercase. Body copy uses sentence case. Treat the user's financial choices with respect. Keep humor light, as in “Wanna Play a Game?” Never claim Lightning has a feature unless the product actually has it.

### Approved copy examples

- “How Much Could You Cut from Your Expenses Right Now and Still Live Comfortably?”
- “Your money lives in five places. Your picture should live in one.”
- “Study your patterns, and create better habits.”
- For the calculator: “An illustration, not a forecast.”

Use the three agreed quotes in Version B as written: Warren Buffett on savings and compound interest, Morgan Housel on spending, and James Clear on systems. Verify exact wording and attribution with original sources before using them in paid campaigns or printed materials.

## Color system

| Role | Token | Hex | Use |
| --- | --- | --- | --- |
| Ink | `--ink` | `#0D2233` | Headlines and primary text. |
| Secondary ink | `--ink2` | `#304A5C` | Paragraphs and card descriptions. |
| Muted | `--muted` | `#5C7483` | Labels, hints and footnotes. |
| Meadow | `--mint` | `#14A874` | Growth accents, icons, focus details. |
| Meadow dark | `--mint-t` | `#0B8A5F` | Green text on light surfaces. |
| Azure | `--azure` | `#0B6DD6` | Secondary accent and held money. |
| Nile | `--nile` | `#0A2442` | Primary buttons, selected chips, anchor cards. |
| Rose | `--rose` | `#C93D72` | Overspending or negative amounts only. |
| Page start | `--bg1` | `#E3F6EC` | Soft canvas gradient. |
| Page end | `--bg3` | `#E1EEFB` | Soft canvas gradient. |
| Card paper | `--b-paper` | `#F8FCFA` | Neutral content cards and calculator input. |

The **focal gradient** runs from `#087653` through `#087F91` to `#0959AB` at roughly 135°. Use it for one prominent result or Lightning summary per viewport. Set text on this gradient in white. Light cards use ink text. Avoid putting pale text on pale cards or using more than one vivid focal card in the same section.

Semantic use: green for growth and positive savings, blue for held balances and clarity, rose for spending overages. Color must reinforce the text, never carry the meaning alone.

## Typography

| Role | Family | Weight | Desktop size | Mobile size | Line height |
| --- | --- | --- | --- | --- | --- |
| Hero | Bricolage Grotesque | 800 | 78 px max | 46 px min | 1.02 |
| Section heading | Bricolage Grotesque | 800 | 42–48 px | 30–34 px | 1.08–1.1 |
| Card heading | Bricolage Grotesque | 800 | 21–26 px | 20–23 px | 1.2 |
| Result amount | Bricolage Grotesque | 800 | 64 px max | 40–54 px | 1 |
| Body | Manrope | 500 | 16–18 px | 15–17 px | 1.55–1.65 |
| UI label | Manrope | 700 | 11–14 px | 11–14 px | 1.35 |

Load fonts from Google Fonts as the site currently does. Fallbacks are Segoe UI and system sans serif. Keep large headings slightly tight (`letter-spacing: -.03em`), but keep body text naturally spaced. Use tabular numerals in calculators and financial figures. Format EGP values with commas and no decimals on marketing pages: `2,000 EGP`, `120,000 EGP`.

## Layout and spacing

- Maximum content width: 1,120 px; side padding: 24 px desktop, 16 px narrow mobile.
- Section rhythm: roughly 72 px top and bottom, reduced to 48–56 px on mobile.
- Card grid gap: 14–18 px. Internal card padding: 24–40 px depending on prominence.
- Card corner radius: 22 px for containers, 16–18 px for fields, full pill radius for buttons and chips.
- Shadows should be soft and low contrast. Use `0 14px 34px -24px rgba(10,36,66,.42)` as the standard.
- Left align content within cards. Center only the hero, game invitation and calculator disclaimer.

## Card hierarchy

1. **Focal result card:** vivid green to blue gradient; white text; largest number on the page. Use for the calculator result or the consolidated Lightning picture.
2. **Primary interaction card:** near white; strong ink label; large editable amount; clear focus state and simple presets. Keep it paired with the focal result.
3. **Information card:** white or a very pale green or blue tint; title first, one compact paragraph second. Use for tracked categories.
4. **Numbered belief card:** light surface, deep Nile number badge, bold statement, short supporting copy. Keep the three cards the same height and spacing where practical.
5. **Quote card:** pale blue; quote first, attribution below a quiet divider. Never mix it with financial metrics.
6. **Call to action card:** soft green to blue background; one primary action and one optional alternative. The email field and survey link should be visibly distinct.

Give each card one job. If a card has a calculation, give the result more visual weight than its explanation. If it has a quote, omit unrelated numbers or charts. Maintain at least 16 px between a heading and dense content.

## Buttons, fields and feedback

Primary buttons use Nile fill and white text. Secondary buttons use a white or pale surface and Ink text. Buttons are at least 44 px tall; the standard size is 48 px. Show hover, keyboard focus and disabled states. Avoid multiple competing primary buttons in one tight cluster.

Amount fields use a white fill, 1 px cool gray border and 16–18 px radius. On focus, use a green border plus a pale green ring. Keep `EGP` visible beside the value. Preset chips are neutral until selected; the selected chip is Nile with white text. All interactive states must remain understandable without color alone.

The calculator starts at `2,000 EGP`. On every change, update the bank equivalent, monthly amount, annual savings and ten year illustration together. Empty input shows an em dash in outputs. Format numbers with thousands separators and zero decimal places. Explain the rate and compounding assumption immediately below the card.

Email signup feedback belongs next to the form. Success should say what happened in plain language. Since the current browser submission uses a Google Apps Script endpoint in `no-cors` mode, a network completion does not prove the Sheet stored the row; verify the destination Sheet when changing the integration.

## Imagery and iconography

Use the lightning bolt mark from `assets/favicon.svg`. Prefer simple product-like diagrams and UI excerpts to stock finance photos. Keep icon shapes rounded and minimal. Small category icons may sit in 38–44 px softly tinted squares. Avoid decorative illustrations that compete with the calculator result.

## Accessibility and responsive behavior

- Keep text contrast at least WCAG AA for normal text; white text on the focal gradient uses its darker approved stops.
- Preserve a visible keyboard focus ring and semantic labels for inputs.
- Never rely on green or rose alone to explain gains or losses.
- At narrow widths, stack the calculator input above its result and stack its secondary metrics vertically when necessary.
- Make body text readable without zoom and keep touch targets at least 44 px where possible.
- Respect reduced motion preferences; motion is optional and should never hide information.

## Application

Version B uses the focused expression of this system in `version-b.html` and `css/version-b.css`, layered on top of `css/styles.css`. Version A remains the comparison variant. The survey currently has its own styles; align it to these tokens when it is next redesigned.
