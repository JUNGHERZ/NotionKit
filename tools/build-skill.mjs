// Generates SKILL.md – the AI/LLM reference – from the same sources as the
// docs: tokens straight from notionkit.css, components from catalog.mjs.
// Prose (skeletons, rules, mistakes) lives here.
import { writeFileSync, readFileSync } from 'fs';
import { CATALOG, GROUPS } from './catalog.mjs';
import { WORDS } from './words.mjs';
import { tidy } from './highlight.mjs';
import { readTokens, TOKEN_MEANING, STATES, CONTRAST } from './reference.mjs';
import { SKELETONS } from './skeletons.mjs';

const pkg = JSON.parse(readFileSync('package.json', 'utf-8'));
const { light, dark } = readTokens();
const W = WORDS.en;

// Preview markup carries a few inline styles that only exist to size the
// isolated preview. Data-driven ones (progress width, avatar colour) stay.
const clean = html => html
  .replace(/<(\w+)([^>]*?) style="([^"]*)"/g, (m, tag, attrs, v) =>
    (tag === 'i' && /width:\s*\d+%/.test(v)) || /background:\s*var\(--nk-(decor|tag)/.test(v) ? m : `<${tag}${attrs}`)
  .replace(/ contenteditable="true"/g, '')
  .replace(/\n\s*\n/g, '\n');

const code = (src, lang = 'html') => '```' + lang + '\n' + tidy(src) + '\n```';
const md = s => s.replace(/<code>/g, '`').replace(/<\/code>/g, '`').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/<\/?b>/g, '**').replace(/<a [^>]*>|<\/a>/g, '');

const tokenTable = () => {
  const rows = Object.entries(light).map(([k, v]) => `| \`${k}\` | \`${v}\` | ${dark[k] ? '`' + dark[k] + '`' : '— (inherits)'} | ${(TOKEN_MEANING[k] || {}).en || ''} |`);
  return ['| Token | Light (`:root`) | Dark (`[data-theme="dark"]`) | Meaning |', '|---|---|---|---|', ...rows].join('\n');
};

const componentEntry = e => `### ${e.title.en} — \`.${e.id}\`

${md(e.desc.en)}

${code(clean(e.html(W)))}

- **Classes:** ${e.classes.map(c => '`.' + c + '`').join(', ')}
- **On a small screen:** ${md(e.mobile.en)}${e.note ? `\n- **Note:** ${md(e.note.en)}` : ''}
`;

const catalog = GROUPS.map(g => {
  const items = CATALOG.filter(c => c.group === g.id);
  return `## ${g.title.en} (PRD ${g.prd})\n\n${items.map(componentEntry).join('\n')}`;
}).join('\n');

const quickRef = GROUPS.map(g => {
  const cls = [...new Set(CATALOG.filter(c => c.group === g.id).flatMap(c => c.classes))];
  return `| ${g.title.en} | ${cls.map(c => '`' + c + '`').join(' ')} |`;
}).join('\n');

const states = STATES.map(s => `| \`${s.cls}\` | ${s.on.split(', ').map(x => '`' + x + '`').join(', ')} | ${s.en} |`).join('\n');
const contrast = CONTRAST.map(c => `| \`${c.pair}\` | ${c.light.toFixed(2)} | ${c.dark.toFixed(2)} | ${c.body ? (c.light >= 4.5 && c.dark >= 4.5 ? '✓' : '✗') : '—'} |`).join('\n');

const out = `---
name: notionkit-css
description: NotionKit is a pure CSS component library (v${pkg.version}) in the Notion idiom – app shell, page tree, document, database views, forms, settings, overlays, collaboration and AI surfaces. ~100 components, light & dark mode, design tokens, no JavaScript. Use this reference whenever generating HTML that uses NotionKit classes to get structure, nesting, modifiers, state classes and tokens right.
---

# NotionKit CSS – AI Component Reference

> **Purpose:** An AI-optimised reference for generating correct NotionKit markup. It replaces reading \`docs.html\` and gives you copy-paste structures, nesting rules, state classes, six complete app skeletons and the editor and web-component integration contracts.
>
> Generated from the same sources as the documentation (\`tools/build-skill.mjs\`) – the token tables below are read straight out of \`notionkit.css\`.

---

## 1. Setup & Boilerplate

### Including the library

${code(`<!-- CDN (recommended) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@jungherz-de/notionkit@${pkg.version.split('.')[0]}/notionkit.min.css">

<!-- Local -->
<link rel="stylesheet" href="notionkit.css">

<!-- Optional: your own theme, loaded after the library -->
<link rel="stylesheet" href="theme-override.css">`)}

${code(`npm install @jungherz-de/notionkit`, 'bash')}

### Minimal template

${code(`<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@jungherz-de/notionkit@1/notionkit.min.css">
</head>
<body class="nk-body">
  <!-- NotionKit markup goes here -->
</body>
</html>`)}

### Naming convention

- **Component classes:** \`nk-*\` (\`nk-app\`, \`nk-tree-item\`, \`nk-callout\`). Every one of them is a future \`<nk-*>\` custom element with the same stem.
- **Child parts:** short unprefixed classes *inside* a component (\`.icon\`, \`.label\`, \`.c-icon\`, \`.m-shortcut\`, \`.f-label\`). They only mean something inside their parent.
- **Modifiers:** plain classes on the component (\`.primary\`, \`.danger\`, \`.small\`, \`.blue\`, \`.info\`). No BEM double-dash.
- **State classes:** \`.active\`, \`.open\`, \`.collapsed\`, \`.selected\`, \`.show\` plus the attribute \`aria-checked="true"\`. See §4.
- **Tokens:** \`--nk-*\` custom properties. Never a hex literal in your own component CSS – derive with \`color-mix()\`.
- There are **no** unprefixed global rules. \`.nk-body\` is opt-in and the only thing that touches \`<body>\`.

### Theming

${code(`<html data-theme="light">   <!-- default; the attribute may be omitted -->
<html data-theme="dark">`)}

Switch at runtime with \`document.documentElement.setAttribute('data-theme', 'dark')\`. The token blocks also set \`color-scheme\`, so native widgets (date pickers, selects, scrollbars) follow.

### The body class

\`class="nk-body"\` on \`<body>\` sets the font stack, 14px base size, page background, text colour and antialiasing. Without it NotionKit changes nothing outside its own classes – useful when embedding into an existing page.

---

## 2. Design Tokens

All visual values are custom properties. \`:root\` holds the light theme, \`[data-theme="dark"]\` overrides what differs. Values that are not overridden (metrics, fonts, decor colours) inherit.

${tokenTable()}

### Re-branding

One declaration. Focus rings, checked states, the selected model card, the primary button and the danger hover are all \`color-mix()\`ed from tokens, so they follow:

${code(`:root {
  --nk-accent: #16a34a;          /* the brand colour */
  --nk-danger: #dc2626;          /* optional: destructive actions */
  --nk-decor-purple: #7c3aed;    /* optional: avatar gradient / cover */
  --nk-decor-blue:   #2563eb;
}`, 'css')}

Declare on \`:root\`, not on a subtree: a custom property is replaced where it is declared, and a value set on a subtree never reaches tokens inherited from \`:root\`. See \`theme-override.css\` for three example themes and a high-contrast block.

### Contrast (measured)

Body text clears WCAG AA in both themes. The secondary layers keep Notion's own values, which sit below 4.5:1 – \`theme-override.css\` has a high-contrast block that lifts them.

| Pair | Light | Dark | AA body text |
|---|---|---|---|
${contrast}

---

## 3. Component Catalog

Every snippet below is real markup from the documentation previews. A few inline \`style\` attributes remain where the value is data (a progress width, an avatar colour) – keep those; everything else is classes.

${catalog}

---

## 4. State Classes

NotionKit ships states, not behaviour. Add and remove these yourself; there is no JavaScript in the library.

| Class / attribute | Applies to | Effect |
|---|---|---|
${states}

Rules of thumb:
- **Table ↔ board switch:** \`.active\` on the tab; the board is \`display:none\` until it gets \`.active\`; hide the table with the \`hidden\` attribute on \`.nk-table-wrap\`. There is deliberately no state class for hiding a table – \`hidden\` is the platform's.
- **Tree subtree:** the item that owns a subtree carries the \`.nk-toggle-arrow\`; its children are the *next sibling* \`.nk-tree-children\`. Toggle \`.open\` on the arrow and \`.collapsed\` on that sibling together; make the whole item the click target, not just the 16px arrow.
- \`.active\` = *where the user is* (current page, current tab). \`.selected\` = *transient highlight* (keyboard row in a palette, chosen option).
- Overlays start invisible and non-interactive; \`.open\` is the only thing you toggle.
- Switches: prefer \`<button class="nk-switch" role="switch" aria-checked="true">\` – the state is announced to assistive technology. \`<input type="checkbox" class="nk-switch">\` works via \`:checked\`.

---

## 5. App Skeletons (composition patterns)

Six complete, runnable documents. Each starts with a decision block. Copy one, delete what you do not need.

${SKELETONS.map(s => `### 5.${s.n} ${s.title}

**When to use this skeleton?** ${s.when}

${code(s.html)}
`).join('\n')}

---

## 6. Editor Integration

NotionKit ships **no editor**. \`.nk-block-host\` is the optical shell; a themed adapter layer scoped inside it styles the DOM of the common open-source editors. The contract is one class on the host element. Do not build editor markup by hand.

### TipTap / ProseMirror (vanilla JS – primary path)

${code(`<div class="nk-block-host" id="editor"></div>

<script type="module">
  import { Editor } from 'https://esm.sh/@tiptap/core@2.27.3';
  import StarterKit from 'https://esm.sh/@tiptap/starter-kit@2.27.3';
  import Placeholder from 'https://esm.sh/@tiptap/extension-placeholder@2.27.3';

  new Editor({
    element: document.getElementById('editor'),
    extensions: [StarterKit, Placeholder.configure({ placeholder: 'Type "/" for commands …' })],
    content: '<p>Hello NotionKit.</p>',
  });
</script>`)}

Pin **one** TipTap version for every import – two copies of \`@tiptap/core\` on a page break extensions. Use an *inline* module (or a bundler); a module *file* is CORS-blocked when the page is opened from \`file://\`.

The full recipe – slash menu on \`@tiptap/suggestion\`, bubble toolbar, ＋ / ⠿ block handle with drag & drop and a block menu – is \`docs-editor.js\` in the repository (~300 lines). It puts these classes on its DOM and lets the stylesheet do the rest: \`.nk-slash-menu\` / \`.nk-slash-menu-label\` / \`.nk-slash-item.selected\`, \`.nk-bubble-menu\`, \`.nk-block-actions\`, \`.nk-pop.nk-menu\`.

### BlockNote (React)

${code(`<div class="nk-block-host">
  <BlockNoteView editor={editor} theme="light" />
</div>`, 'jsx')}

\`.bn-container\`, \`.bn-editor\`, \`.bn-block-content\`, side menu and drag handle are covered; \`.bn-suggestion-menu\` picks up the slash-menu look automatically.

### Novel (Next.js)

${code(`<div class="nk-block-host">
  <EditorContent className="novel-editor" />
</div>`, 'jsx')}

Novel is ProseMirror-based, so the TipTap rules already apply; \`.novel-editor\` / \`.novel-prose\` get font and colour and the prose width cap is released.

---

## 7. Rules & Common Mistakes

### ✅ Always

- Put \`data-theme\` on \`<html>\` – nowhere else. Web components mirror it from there.
- Wrap tables in \`.nk-table-wrap\`; boards scroll horizontally on their own. Never let a table widen the page.
- Use \`max-width\` + auto margins for columns (\`.nk-page\` is 760px max, never 760px wide).
- Use \`.nk-field\` rows to build settings; \`.nk-settings-pane\` holds a stack of them.
- Give every overlay its backdrop: \`.nk-modal-backdrop > .nk-modal\`, \`.nk-cmdk-backdrop > .nk-cmdk\`.
- Derive colours with \`color-mix(in srgb, var(--nk-accent) 25%, transparent)\` when you need a tint.
- Pass icons **directly** into a slot (\`<span slot="icon">💡</span>\`), never wrapped in another element.
- **Layout wrappers are yours.** NotionKit ships no utility classes on purpose. A \`<div style="display:flex;gap:8px">\` around two buttons, or \`style="max-width:none"\` on \`.nk-page\` for a data-centric screen, is the intended way – inline *layout* is fine. Inline *colour* or *state* is not (use tokens and state classes).

### ❌ Common mistakes

| Mistake | Do this instead |
|---|---|
| Fixed widths (\`width: 1200px\`, device mockups, a second breakpoint) | Fluid layouts; the single breakpoint at 860px is already in the library |
| Building editor markup by hand (\`contenteditable\` divs, custom toolbars) | Mount TipTap/BlockNote/Novel into \`.nk-block-host\` |
| Re-creating states with inline styles (\`style="display:block"\` on a pane) | Toggle \`.active\` / \`.open\` / \`.collapsed\` / \`.selected\` / \`.show\` |
| Hex colours in component CSS (\`#2383e2\`) | \`var(--nk-accent)\` or a \`color-mix()\` of it |
| Setting tokens on a subtree (\`.my-app { --nk-accent: … }\`) | Declare on \`:root\` |
| \`* { margin: 0 }\` or a global \`body\` rule copied from the demo | \`class="nk-body"\` on \`<body>\`; the reset is scoped to \`[class*="nk-"]\` |
| \`kbd\`, \`button\`, \`table\` styled globally | \`.nk-kbd\`, \`.nk-btn\`, \`.nk-table\` |
| \`<a class="nk-btn">\` losing its look | Works – \`a.nk-btn\` resets the underline; keep \`.primary\`/\`.secondary\` |
| Tree items 28px tall on a touch device | Raise \`min-height\` on \`.nk-tree-item\` in a touch drawer; the class does not force it |
| Wrapping a slotted icon (\`<span slot="icon"><svg/></span>\`) | \`::slotted()\` only matches the assigned node – pass the icon itself |

---

## 8. Quick Class Reference

| Group | Classes |
|---|---|
${quickRef}

---

## 9. Web Components / Shadow DOM

The stylesheet ships split in two so a custom element can adopt the component rules without re-declaring tokens inside its shadow root.

${code(`import { componentsSheet, tokensCss } from '@jungherz-de/notionkit/notionkit-styles.js';

// Tokens once, on the document, inside a layer – a brand stylesheet wins
// regardless of load order.
const tokens = new CSSStyleSheet();
tokens.replaceSync(\`@layer notionkit-defaults { \${tokensCss} }\`);
document.adoptedStyleSheets = [...document.adoptedStyleSheets, tokens];

class NkCallout extends HTMLElement {
  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.adoptedStyleSheets = [componentsSheet];       // components only
    root.innerHTML = \`<div class="nk-callout"><slot name="icon"></slot><div><slot></slot></div></div>\`;
  }
}
customElements.define('nk-callout', NkCallout);`, 'js')}

- **Exports:** \`css\` / \`nkSheet\` (everything), \`tokensCss\` / \`tokensSheet\`, \`componentsCss\` / \`componentsSheet\`.
- **Why not adopt \`nkSheet\`:** the token blocks would match the element's own theme wrapper and re-declare every token locally, and a matching rule beats an inherited value – the consumer's \`:root { --nk-accent }\` never arrives.
- **\`::slotted()\` twins:** every rule that styles content a consumer passes in has a twin (\`.nk-callout .c-icon, .nk-callout ::slotted(.c-icon)\`). Slotted content must be the assigned node itself; the outer document's rules win over \`::slotted()\`.
- **Theme in the shadow root:** mirror \`data-theme\` from \`<html>\` onto a \`display: contents\` wrapper inside the root (a single \`MutationObserver\` on \`<html>\` for all instances) so \`color-scheme\` and any \`[data-theme]\`-keyed rule apply.
- A working proof of concept: \`elements-poc.html\` + \`nk-callout.js\` in the repository.

---

## 10. Roadmap: NotionKit Elements

A web-component layer (\`@jungherz-de/notionkit-elements\`) is planned on top of this CSS. Keep generated code API-stable by following these conventions now:

| CSS today | Element tomorrow |
|---|---|
| \`.nk-callout\` | \`<nk-callout>\` – same stem for every component |
| modifier class \`.nk-btn.primary\` | attribute \`<nk-btn variant="primary">\` |
| state class \`.nk-tree-item.active\` | boolean attribute \`<nk-tree-item active>\` |
| child part \`.icon\` inside \`.nk-tree-item\` | \`<span slot="icon">\` |
| click handler on a tree item | event \`nk-select\` |
| view tab switch | event \`nk-view-change\` |
| palette pick | event \`nk-command\` |
| \`.nk-block-host\` + TipTap | \`<nk-editor>\` (thin TipTap wrapper) |

---

## 11. Custom Theming

Load \`theme-override.css\` after the library and uncomment what you need. It ships three example themes (Forest, Slate, Sunset), a high-contrast block that lifts every measured pair to ≥ 4.5:1, and blank templates for metrics and typography.

*NotionKit v${pkg.version} · MIT · Jungherz GmbH*
`;

writeFileSync('SKILL.md', out);
console.log(`✅ SKILL.md generated (${(Buffer.byteLength(out) / 1024).toFixed(1)} KB, ${CATALOG.length} components, ${SKELETONS.length} skeletons)`);
