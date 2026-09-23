# Changelog

All notable changes to NotionKit are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow
[Semantic Versioning](https://semver.org/).

## [1.6.0] – 2026-09-23

App views: the base layer that LearnHub and Auxdesk each built on their own –
page properties, list view, page width and text size, panels, rendered
Markdown – moves into the foundation, in Notion's idiom. Additive: no class
renamed, no token changed. One deliberate change of look: the editor adapter
now takes the page's text size (see Changed).

### Added
- **Page properties: `.nk-props` and `.nk-prop`** (`p-name`, `p-icon`,
  `p-value`). The rows under the title of a database page, the pattern
  Notion is known for: the name with its type icon in a 160px column, the
  value beside it, 34px rows, both halves with the hover wash. Below 860px
  the name stands above its value. Written as `<dl>`, `<dt>` and `<dd>` it
  is a description list for assistive technology too. LearnHub and Auxdesk
  each had it as `.kv`.
- **Page options: `.nk-page.full` and `.nk-page.small`.** Notion's “Full
  width” lifts the 760px cap; “Small text” sets the document text from 16px
  to 14px, and headings, lead, prose and editor follow. Options of a page,
  not app settings – in Notion they live in the page's ⋯ menu. LearnHub and
  Auxdesk built this as `.pg` with their own safe-area padding, which the
  page column already has.
- **List view: `.nk-list` and `.nk-list-item`** (`l-icon`, `l-title`,
  `l-meta`, `last`). The third database view: one line per row with icon,
  title and a few properties on the right, hairlines between rows. On a
  phone the title ends in an ellipsis and the properties keep their place.
  LearnHub and Auxdesk: `.list`.
- **Panels: `.nk-panels` and `.nk-panel`.** A neutral surface for content
  that belongs together, like the cards on Notion's Home – a new name,
  because `.nk-card` is the board card. The grid shares the row between
  columns of at least 200px and falls to one on a phone. A cover as first
  child runs to the edges and a page icon overlaps it: a page tile. LearnHub,
  Auxdesk and NotionKit Web each had `.card` and `.cards`.
- **Prose: `.nk-prose`.** Rendered Markdown and saved editor HTML take the
  document look from one class on the container: headings, lists, task
  lists, links, code, quotes, rules, pictures and tables. It reads the very
  same rules as the TipTap adapter, so reading and editing match to the
  pixel. A wide table scrolls in its own box; an empty paragraph keeps its
  line. Class only, as in GlassKit 1.14.0: `::slotted()` never reaches a
  paragraph inside a slotted node. Auxdesk styles its Markdown by hand
  today, the LearnHub handbook will need it.
- **Avatar: `.nk-avatar`.** Initials, an emoji or a photo in a circle, on an
  `<img>` or a box holding one: 24px, `small` 20px, `large` 32px, `xlarge`
  56px; without a colour the avatar gradient, the nine colour names take
  Notion's mid-tones, `square` the workspace icon's corners. Member rows,
  mentions and avatar groups size it as they sized `.mini-avatar`. From
  LearnHub's `.avatar`; the demo's members no longer carry hex values.
- **Smaller pieces:** `.nk-table .num` for right-aligned numbers in figures
  of equal width, the header stays left as in Notion (GlassKit's `__num`,
  LearnHub's `.num`); `.nk-progress.wide` fills its row and keeps its label
  beside it (LearnHub's `.progress`); an `<img>` in `.nk-cover` fills the
  band, cropped (LearnHub's `.cover`); `.nk-ai-msg.bubble` sets a message as
  a grey bubble, with `.user` on the right as in Notion's AI chat (LearnHub
  used the accent blue); a `.nk-switch` in a menu row sits on the right.
- SKILL.md: the workspace skeleton shows properties and a list of
  sub-pages; two new skeletons, “Home page” and “Sign-in page” – eight
  instead of six. A sign-in page stays a skeleton, not a component.
- `test/app-views.spec.mjs`, 13 tests: reading and editing match byte for
  byte in both languages, the page menu switches small text and full width,
  properties stack on a phone, the list keeps one line, panels fall to one
  column, numbers align right, avatars take their sizes from classes and the
  demo carries no inline hex colour.

### Changed
- **The editor adapter takes the page's text size.** 1.5.0 set document
  text to 16px, but TipTap stayed at 14px/1.6, so the editor in a page was
  smaller than the text around it and `small` could not reach it. Editor
  and prose now inherit the size – 16px on a page, 14px with `small`,
  whatever the container has elsewhere – with the page's line height of 1.5
  and headings in em at Notion's ratios (1.875, 1.5, 1.25). Paragraphs
  stand 6px apart as the adapter always meant – a more specific
  `p { margin: 0 }` had cancelled the gap – bold is 600, and the first and
  last block have no outer margin. In a 14px context, like the docs editor,
  only line height, heading sizes and paragraph gaps change.
- `.nk-heading` and `p.lead` are sized in em (1.5em, 1em), so `small` and a
  smaller parent carry them. On a page they stay 24px and 16px.
- `.nk-progress-label` stays on one line.

### Site
- Demo, class markup: the project page shows its properties under the
  title – status, owner with avatar, due date, tags, a full-width progress
  bar – visible in the landing page's large frame without scrolling. A new
  ⋯ in the topbar opens the page menu with “Small text” and “Full width”,
  and both switch the page at once. The project database gets “List” as a
  third view and an “Effort” column with right-aligned hours. The editor
  gets “Edit · Read”, where Read shows the same content as prose. The AI
  embedding shows your own question as a grey bubble. Members use the
  avatar component. “Home” in the sidebar and the tab bar opens a new
  start view in full width and small text: recently visited pages as
  panels with picture covers, what is due as a list.
- Landing page: “What is in the box” names the new pieces, about 130
  classes, eight skeletons. Docs and showcase document every new class;
  the table preview no longer reads “＋ ＋ New page”.
- Size: 10.7 KB of 14 KB gzipped.

## [1.5.3] – 2026-09-23

Phone release: the topbar, the settings modal and the member list keep to a
390px screen, and no page of the site scrolls sideways any more. Additive,
no class renamed; on the desktop everything renders as before except the
landing page's device frames, which now scale.

### Fixed
- **The topbar broke apart on phones.** At 390px the actions wrapped over
  three lines, the trail wrapped as well, and "Share" ran off the screen.
  Below 860px the topbar now shows the page and its actions, as Notion's
  mobile app does: only the last crumb stays and ends in an ellipsis, and
  passive text steps aside.
- **The settings modal ran past the screen on phones.** Field rows kept
  their 210px controls beside the label, so five of the six panes in the
  demo ran 7–66px past a 390px screen. Below 860px a field row wraps – a
  control that does not fit moves below its label – and no input, select,
  textarea or slider grows past its column.
- **A long address pushed the role select out of a member row.** The name
  column may shrink now, and an address without a break point ends in an
  ellipsis (`:has()`; Firefox before 121 keeps the old layout).

### Added
- `.nk-topbar-meta` for passive text among the topbar actions – "Edited
  2 min ago": tertiary, 12px, one line, hidden below 860px. The demo used an
  inline-styled `.nk-topbar-btn` for it.
- `test/phone.spec.mjs`: at 390px no page of the site scrolls sideways,
  every settings pane keeps to the screen, the topbar keeps to one row and
  the member row keeps its select; the landing page's frames scale the app
  to their width. Against 1.5.2 ten of the fourteen tests fail.

### Changed
- **Size budget: 14 KB gzipped instead of 10 KB.** The "14 KB rule": a new
  connection delivers about 14 KB in its first round trip, and the
  stylesheet usually arrives over a connection of its own. The minified
  budget moves to 75 KB so it never binds first. `npm run check:size`
  enforces both and keeps the size claims in README.md current – they had
  stood at the 1.5.0 values. Today: 9.6 KB of 14 KB.

### Site
- Landing page: the desktop and mobile frames scale to the width they get,
  CSS only (`container-type` and `tan(atan2(100cqw, 1280px))`, the way CSS
  divides two lengths). The fixed 640px desktop frame made the page 656px
  wide on a 390px phone.
- Navigation on phones: the page links move into a second row that scrolls
  sideways instead of disappearing, so docs, showcase and demo stay one tap
  away; anchors in the docs land below the taller bar.

## [1.5.2] – 2026-09-23

Fix release: five defects that GlassKit fixed in its 1.11–1.17 line and that
NotionKit had as well. Each was confirmed before the change and is guarded
by a regression test from now on. No class renamed, no token changed; on
the desktop every page renders pixel for pixel as before, in both themes.

### Fixed
- **`hidden` did not hide.** The attribute is only a user-agent rule, and
  every component that sets its own `display` beat it: `.nk-btn`,
  `.nk-callout`, `.nk-tag`, `.nk-banner`, `.nk-field` and
  `.nk-tab-bar-item` stayed on screen with `hidden`. One rule in the
  scoped reset gives the attribute its platform meaning back for every nk-
  element and, through `::slotted()`, for slotted nodes a twin would
  display. `hidden="until-found"` keeps the browser's own behaviour.
  (GlassKit 1.16.0 fixed the same for its button.)
- **The toast sat under the dialog and behind the tab bar.** `.nk-toast`
  had no `z-index`: with the settings dialog open it painted dimmed under
  the scrim, and on a phone it lay entirely behind the tab bar. It is now
  `z-index: 120`, above the modal (100) and the command palette (110). On
  phones it rises 12px above a visible tab bar, the floating one included
  (`:has()`, class markup; `<nk-toast>` in NotionKit Elements measures
  the bar itself), and its bottom offset clears the home indicator:
  `max(20px, inset + 12px)`. A short message also stays on one line on a
  phone – `left: 50%` had left the toast half the viewport to shrink into;
  it now takes its own width, up to the viewport minus 32px.
  (GlassKit 1.15.1 fixed the stacking of its overlays.)
- **Date and time fields ran out of their column on iOS.** iOS draws
  `input[type="date"]`, `time`, `datetime-local` and `month` as native
  controls with a width of their own. Measured in the iOS 26.3 and 27.0
  simulators at 402px: a wide field ran 21px past its column, two fields in
  a `.nk-fields` row overlapped by 10px, the value sat centred, and the
  fields were 37px tall against 32px for a text field. `.nk-input` of
  those types now drops the native appearance, the value starts at the
  left, and an empty field keeps one line – without that it collapsed to
  12px. After: flush with the column, 12px apart in the row, 32px tall,
  filled or empty, on both iOS versions. Chromium on the desktop renders
  the fields pixel for pixel as before. (GlassKit 1.17.0.)
- **Checkboxes and switches centred on multi-line labels.** `.nk-check`
  and `.nk-switch-label` used `align-items: center`, so beside a consent
  text over three lines the box sat level with the middle line. Both now
  meet the first line, as in Notion: the shorter of control and text is
  nudged by half the difference to the line height (`1lh`), so a one-line
  label sits exactly where it did. Where `lh` is unknown the control sits
  at the top. (GlassKit 1.11.0.)
- **Several actions in an empty state touched.** `.nk-empty` had no place
  for more than one action, and buttons written without whitespace between
  them stood without a gap. `.e-actions` is a centred row that wraps, 8px
  apart in both directions. A single action directly in `.nk-empty`
  renders as before. (GlassKit 1.17.0.)

### Added
- `test/`: Playwright regression tests for all five fixes, run by Verify
  Build in Chromium (`npm test`). Against the 1.5.1 stylesheet nine of the
  eleven tests fail; the other two guard behaviour that must not change.
- Demo app: the empty state in "More building blocks" offers "Import"
  next to "New entry", and the product-news checkbox in the notification
  settings carries a two-line label.

### Docs
- README cheat sheet and the docs' state table list the `hidden`
  attribute. The cheat sheet now names all nine tag colours and the danger
  banner, and the landing page no longer speaks of four tag colours – all
  three were stale since 1.5.0.

## [1.5.1] – 2026-09-14

### Fixed
- **Tab bar over the home indicator.** The bottom padding added its own 6px
  to `env(safe-area-inset-bottom)`, leaving a 40px empty strip on an
  iPhone 15. Now `max(6px, inset)`: without an inset nothing changes, with
  one the bar ends at the 34px iOS asks for. The bar height and the spacer
  follow (`--nk-tab-bar-height` − 6px + the padding).
- **Lateral safe areas.** Nothing honoured `env(safe-area-inset-left/right)`,
  so in landscape the Dynamic Island covered the menu button, the page text
  and the first tab. Handled per surface, never on `.nk-app`, so backgrounds
  still run edge to edge: `.nk-topbar`, `.nk-page` (both breakpoints) and
  `.nk-tab-bar` pad by `max(own padding, inset)`, `.nk-tab-bar.floating`
  keeps its 12px inside the insets, `.nk-sidebar` grows by the left inset and
  pads its content – which also covers the Elements drawer. `.nk-modal` and
  `.nk-cmdk` sit inside the insets too (`max-width: 100%`). Reported by
  Auxdesk.

## [1.5.0] – 2026-09-13

Fidelity release: the light theme, the type scale and the form controls were
re-measured against Notion's current (2025) app – a public notion.site page
exposes the full token set under `:root, .notion-light-theme`, and a live
table view gave the metrics. Additive in markup; the visual defaults move.
Reported by Auxdesk: text, tags and inputs read lighter than the original.

### Added
- Tag palette: `.nk-tag` now has all nine Notion select colours – `gray`
  (also the default without a colour class), `brown`, `orange`, `yellow`,
  `green`, `blue`, `purple`, `pink`, `red` – as `--nk-tag-<colour>-bg` /
  `-text` pairs in both themes.
- Two more roles per hue: `--nk-tint-<colour>` (the soft block background,
  for banners and tracks) and `--nk-color-<colour>` (the mid-tone for
  coloured text and marks). The old tag text values live on as
  `--nk-color-*`, the old tag backgrounds as `--nk-tint-*`.
- `--nk-text-sidebar` – tree items, breadcrumbs and topbar buttons; one
  step darker than secondary, as Notion draws its sidebar (6.1:1 instead
  of 4.0:1).
- `--nk-bg-input` – the filled surface of inputs, selects, textareas and
  the emoji search.
- `--nk-shadow-btn` – the white button's outline, a 1px inset ring plus a
  1px drop.
- `.nk-table.wrap` / `.nk-table td.wrap` let cell text break, like Notion's
  "wrap column".
- `.nk-banner.danger`.

### Changed
- Tokens follow Notion's 2025 light theme: `--nk-text` `#2c2c2b`, opaque
  greys for secondary (`#7d7a75`) and tertiary (`#91918e`) text instead of
  alpha, `--nk-bg-sidebar` `#f9f8f7`, hover/active washes mixed from the
  text colour, borders `rgba(28,19,1,0.11)` / `rgba(27,21,0,0.19)` –
  hairlines are ~15 % stronger. `--nk-danger` is `#cd3c3a` (4.9:1, was
  3.5:1); dark mode gets its own `#df5452`.
- `.nk-body` uses `-webkit-font-smoothing: auto`, as Notion does. The
  previous `antialiased` thinned every glyph on macOS.
- Type scale on whole pixels: UI 14px, meta 12px; 13.5px / 12.5px / 11.5px
  / 11px are gone from buttons, inputs, menus, tags, banners, comments and
  labels. `.nk-page` sets 16px / 1.5 for document text (headings 24px);
  callouts and quotes inherit instead of forcing 14.5px.
- Tags are Notion's select option: 20px tall, 3px corners, 14px, near-black
  text on a saturated fill – every light pair ≥ 10:1 (was 2.8–4.1:1).
- Inputs are filled (`--nk-bg-input`) inside a `--nk-border` hairline, 32px
  tall at 14px; the focus ring is 60 % accent border + 30 % accent halo.
- Buttons are 28px at 14px (`.small` 24px at 13px). `.secondary` and
  `.danger` are the white button: `--nk-bg-card` plus `--nk-shadow-btn`, no
  border.
- Tables: 36px rows, 14px header in secondary colour, hairlines between
  columns as well as rows, `padding: 0 8px`.
- `.nk-db-tab` is a pill on the active wash instead of an underline; the
  strip has no bottom rule.
- Banners are tinted blocks (`--nk-tint-*` under the normal text colour)
  instead of tag-coloured text.
- Settings modal: 1150 × 715, 240px nav, pane up to 800px, title 22px,
  section headings 16px with a rule; field and card descriptions use
  secondary instead of tertiary.
- `.nk-share-btn` is borderless; `.nk-section-label` 12px; `.nk-topbar`
  44px; menu items 28px at 14px.
- `theme-override.css`: the high-contrast block now lifts only the pairs
  still under 4.5:1 (secondary, tertiary, accent, dark yellow tag).

### Migration
- `--nk-tag-<colour>-text` is now near-black. Anything that used it as a
  *text colour* (error text, deltas, code attributes) should switch to
  `--nk-color-<colour>`; anything that used `--nk-tag-<colour>-bg` as a
  soft surface should switch to `--nk-tint-<colour>`.

## [1.4.1] – 2026-09-12

### Fixed
- A page without a cover clipped the top of its icon: `.nk-page-icon` always
  had `margin-top: -42px`, and `.nk-page` no top padding, so half the icon
  sat outside the scroll container. The overlap now applies only after a
  cover (`.nk-cover + .nk-page`, or `.nk-page.covered` as set by
  `<nk-page cover>`); otherwise the page has 24px top padding and the icon
  sits inside it. The 860px rule no longer resets that padding. Reported by
  Auxdesk.

## [1.4.0] – 2026-09-12

Additive: phone fixes for the segmented control and the app shell.

### Added
- `.nk-segmented.scroll` scrolls a long row horizontally with the scrollbar
  hidden, capped at the parent width; `.nk-segmented.wrap` breaks it onto
  further rows. Default stays one row.
- `.nk-tab-bar.fixed` pins the bar to the viewport bottom; a following
  `.nk-tab-bar-spacer` keeps its height in the flow. New token
  `--nk-tab-bar-height` (58px) sets both, plus the safe-area inset; the bar
  now has that fixed height instead of a content-driven one.

### Changed
- `.nk-body` and `.nk-app` use `100dvh` with a `100vh` fallback: a
  standalone PWA on iOS no longer counts the status bar into the shell, so
  the tab bar no longer sits half behind the home indicator. Reported by
  Auxdesk.

## [1.3.1] – 2026-09-11

### Fixed
- Inputs in `.nk-fields` (and in `.nk-field.stacked` / `.compact`) overflowed
  their column by about 20px: the controls' `min-width: 210px` became the
  grid item's automatic minimum, which `width: 100%` cannot undercut. Now
  `min-width: 0` on the stacked / compact field, its `.f-control`, the
  controls inside, and on `.nk-input.wide` / `.nk-textarea.wide` /
  `.nk-select.wide`. Reported by Auxdesk.

## [1.3.0] – 2026-09-11

Additive: form layouts and a labelled switch, no existing value changes.

### Added
- **Field layouts.** `.nk-field.stacked` puts the label above a full-width
  control (textareas, long descriptions); `.nk-field.compact` shrinks the
  label to 12px tertiary text and drops the row padding. `.nk-fields` is a
  grid of `minmax(150px, 1fr)` columns for several short fields in one row,
  wrapping as the width allows; its direct `.nk-field` children are stacked
  and compact by themselves. `.nk-select.wide` joins `.nk-input.wide` /
  `.nk-textarea.wide`.
- **Labelled switch.** `label.nk-switch-label` wraps a `.nk-switch` and its
  visible text in one inline row; the text is part of the hit area. For
  several switches side by side, where the `nk-field` row cannot name them.
- State reference: `stacked`, `compact`. Requested by Auxdesk; NotionKit
  Elements 1.2.0 wraps all of it.

## [1.2.0] – 2026-09-11

Additive: one new component, no existing value changes.

### Added
- **Tab bar** – `.nk-tab-bar` with `.nk-tab-bar-item` (`.icon`, `.label`,
  `.active`): the thumb-reachable twin of the sidebar for phones and
  installed PWAs. Up to five destinations, icon over label, the current one
  in `--nk-accent`, background `--nk-bg-sidebar`, top border `--nk-border`,
  bottom padding grows with `env(safe-area-inset-bottom)`. Placed last inside
  `.nk-main` it sits below the scrolling page; in a self-scrolling document
  it is `position: sticky; bottom: 0`. Hidden above 860px (the sidebar takes
  over), shown by the single breakpoint below; `.always` shows it at every
  width (previews, phone frames), `.floating` turns it into a fixed capsule.
  Slotted twins for `[slot="icon"]` and `.label`. Requested by Auxdesk;
  NotionKit Elements 1.1.0 wraps it as `<nk-tab-bar>` / `<nk-tab-bar-item>`.
- Demo app: a tab bar at the bottom of the main column, visible on a phone.

## [1.1.1] – 2026-09-05

### Fixed
- Slotted twins that set margin or padding on elements the scoped reset also
  touches (`button`, `h2`–`h4`, `p`) never applied inside a web component:
  the reset lives in the document tree, and for normal declarations the
  outer tree beats `::slotted()` from the shadow tree. A `<button>` slotted
  into `<nk-segmented>` therefore rendered with zero padding (33×15 px
  instead of 57×23 px, measured). Those declarations are now `!important`
  – for important declarations the inner tree wins – on
  `.nk-segmented ::slotted(button)`, `.nk-ai-actions ::slotted(button)`,
  `.nk-bubble-menu ::slotted(button)`, `.nk-page ::slotted(p.lead)`,
  `.nk-g-item ::slotted(h4)` and `.nk-settings-pane ::slotted(h2/h3)`.
  Everything else in a twin stays overridable from the document.
- `a.crumb { text-decoration: none }` – a breadcrumb entry that is a link
  no longer shows an underline.

## [1.1.0] – 2026-09-05

Companion release for NotionKit Elements. Additive only: no existing value
changes, every rule below is new.

### Added
- `[slot="…"]` twins for every part the Elements layer exposes as a named
  slot – `.nk-tree-item ::slotted([slot="icon"])`, `.nk-field
  ::slotted([slot="label"])`, `.nk-stat ::slotted([slot="delta"].up)`,
  `.nk-empty ::slotted([slot="title"])`, avatar slots on workspace,
  settings user, profile row, member row, mention, comment and AI message,
  and so on. A consumer writes `<span slot="icon">📁</span>` without
  repeating the internal class. 92 twins in total (was 57).
- Twins for rules that had none: `.nk-page ::slotted(p.lead)`,
  `.nk-settings-pane ::slotted(h2)` / `::slotted(h3)` (with explicit
  margins, since slotted nodes miss the scoped reset),
  `.nk-code ::slotted(.tag)` / `::slotted(.attr)`,
  `.nk-ai-actions ::slotted(button:hover)`,
  `.nk-bubble-menu ::slotted(button:hover)` / `::slotted(button.active)`,
  `.nk-member-row ::slotted([slot="role"])`.
- Explicit state classes for states a container used to imply:
  `.nk-tree-item.compact` (the 26px footer / settings-nav row height),
  `.nk-member-row.last` (no bottom border), `.nk-select.compact`
  (120px minimum, as inside a member row).
- Disabled optics: `.nk-btn:disabled`, `.nk-switch:disabled`,
  `.nk-check input:disabled`, `.nk-todo input:disabled`.
- `.nk-new-row` as a class of its own. `.nk-table .new-row` stays as an
  alias, but it never matched the documented markup – the add row sits
  *after* the table inside `.nk-table-wrap`, so the descendant selector
  found nothing. Demo, docs and skeletons now use `.nk-new-row`.

### Notes
- NotionKit Elements 1.0 declares `>=1.0.0` as its peer range and works
  with 1.0.0, but pins 1.1.0 in its documentation: without this release
  slotted icons need the internal class (`slot="icon" class="icon"`), footer
  rows are 28px instead of 26px, and disabled controls carry no optics.

## [1.0.0] – 2026-09-05

First release. The CSS foundation of the NotionKit family.

### Added
- `notionkit.css`: ~100 component classes across app shell, page tree, page
  shell, content elements, database views, forms & settings, settings modal,
  overlays & menus, gallery & productivity blocks, collaboration & AI, and an
  editor adapter section for TipTap/ProseMirror, BlockNote and Novel.
- Light theme on `:root`, dark theme on `[data-theme="dark"]`, both complete
  down to tag colours and shadows; `color-scheme` set in both blocks so
  browser-drawn widgets follow.
- Two-block structure (tokens / components), verified at build time by
  `build-styles-js.mjs`, which emits `notionkit-styles.js` with the exports
  `nkSheet`, `css`, `tokensSheet`, `tokensCss`, `componentsSheet`,
  `componentsCss`.
- 57 `::slotted()` twin selectors so web components can adopt the component
  sheet and still style slotted content.
- Scoped reset on `[class*="nk-"]` – no unprefixed global rules; `.nk-body`
  is the opt-in document base.
- All derived colours mixed from tokens with `color-mix()`; re-branding is a
  single `--nk-accent` declaration.
- `@media (prefers-reduced-motion: reduce)` support.
- `theme-override.css` with three example palettes and a measured
  high-contrast block.
- `SKILL.md`, generated from the same sources as the documentation, with six
  complete app skeletons.
- Demo (`app.html`), landing page, showcase and documentation in English and
  German, with a live TipTap editor (slash menu, bubble toolbar, block handle
  with drag & drop) and a palette switcher.
- `elements-poc.html` / `nk-callout.js`: proof of concept for the planned
  NotionKit Elements layer.

### Notes
- The default palette keeps Notion's own colour values. Body text clears
  WCAG AA in both themes; secondary text, tag pairs, the primary button label
  and the danger colour sit below 4.5:1 – see the contrast table in the docs
  and the high-contrast block in `theme-override.css`.
- The library ships no JavaScript. State classes (`active`, `open`,
  `collapsed`, `selected`, `show`, `aria-checked`) are the contract; the
  toggling is the consumer's.
