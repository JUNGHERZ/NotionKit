# Changelog

All notable changes to NotionKit are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow
[Semantic Versioning](https://semver.org/).

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
