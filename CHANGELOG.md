# Changelog

All notable changes to NotionKit are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow
[Semantic Versioning](https://semver.org/).

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
