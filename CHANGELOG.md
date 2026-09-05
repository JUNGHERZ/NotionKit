# Changelog

All notable changes to NotionKit are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow
[Semantic Versioning](https://semver.org/).

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
