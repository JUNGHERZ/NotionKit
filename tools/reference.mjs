import { readFileSync } from 'fs';

/** Reads the token blocks straight out of notionkit.css so the tables cannot drift. */
export function readTokens(cssPath = 'notionkit.css') {
  // Strip comments first: the file header explains the two-block structure and
  // mentions `:root {` in prose, which would otherwise be found first.
  const css = readFileSync(cssPath, 'utf-8').replace(/\/\*[\s\S]*?\*\//g, '');
  const block = (sel) => {
    const at = css.indexOf(sel + ' {');
    let depth = 0;
    for (let i = at; i < css.length; i++) {
      if (css[i] === '{') depth++;
      else if (css[i] === '}') { depth--; if (depth === 0) return css.slice(at, i); }
    }
    throw new Error('block not found: ' + sel);
  };
  const parse = (text) => {
    const out = {};
    for (const m of text.matchAll(/(--nk-[a-z0-9-]+)\s*:\s*([^;]+);/g)) out[m[1]] = m[2].trim();
    return out;
  };
  const light = parse(block(':root'));
  const dark = parse(block('[data-theme="dark"]'));
  return { light, dark };
}

export const TOKEN_MEANING = {
  '--nk-bg': { en: 'Page background', de: 'Seitenhintergrund' },
  '--nk-bg-sidebar': { en: 'Sidebar and settings nav', de: 'Sidebar und Settings-Navigation' },
  '--nk-bg-hover': { en: 'Hover wash — a darkening, never a hue change', de: 'Hover-Hauch – eine Verdunkelung, nie ein Farbwechsel' },
  '--nk-bg-active': { en: 'Active/selected row', de: 'Aktive/ausgewählte Zeile' },
  '--nk-bg-callout': { en: 'Callouts, badges, key caps, segmented track', de: 'Callouts, Badges, Tasten, Segment-Schiene' },
  '--nk-bg-code': { en: 'Code block background', de: 'Hintergrund von Code-Blöcken' },
  '--nk-bg-card': { en: 'Board cards — separate from --nk-bg so dark mode can lift them', de: 'Board-Karten – getrennt von --nk-bg, damit Dark Mode sie abheben kann' },
  '--nk-text': { en: 'Body text. Never pure black', de: 'Fließtext. Nie reines Schwarz' },
  '--nk-text-secondary': { en: 'Secondary text, inactive tree items', de: 'Sekundärtext, inaktive Baum-Einträge' },
  '--nk-text-tertiary': { en: 'Meta, placeholders, captions', de: 'Meta, Platzhalter, Bildunterschriften' },
  '--nk-border': { en: 'Hairline separators', de: 'Haarlinien-Trenner' },
  '--nk-border-strong': { en: 'Input borders, scrollbar thumbs, dashed frames', de: 'Input-Rahmen, Scrollbar-Griffe, gestrichelte Rahmen' },
  '--nk-accent': { en: 'The one brand colour. Everything accented is mixed from it', de: 'Die eine Markenfarbe. Alles Akzentuierte wird daraus gemischt' },
  '--nk-on-accent': { en: 'Text and marks on top of the accent or danger fill', de: 'Text und Marken auf Akzent- oder Danger-Füllung' },
  '--nk-danger': { en: 'Destructive actions, inline code, negative deltas', de: 'Destruktive Aktionen, Inline-Code, negative Deltas' },
  '--nk-tag-blue-bg': { en: 'Tag background, also the progress track', de: 'Tag-Hintergrund, zugleich Fortschritts-Schiene' },
  '--nk-tag-blue-text': { en: 'Tag text, also the progress fill', de: 'Tag-Text, zugleich Fortschritts-Füllung' },
  '--nk-tag-green-bg': { en: 'Tag background', de: 'Tag-Hintergrund' },
  '--nk-tag-green-text': { en: 'Tag text, also the positive delta', de: 'Tag-Text, zugleich positives Delta' },
  '--nk-tag-orange-bg': { en: 'Tag background', de: 'Tag-Hintergrund' },
  '--nk-tag-orange-text': { en: 'Tag text, also date mentions and code attributes', de: 'Tag-Text, zugleich Datums-Erwähnungen und Code-Attribute' },
  '--nk-tag-purple-bg': { en: 'Tag background', de: 'Tag-Hintergrund' },
  '--nk-tag-purple-text': { en: 'Tag text', de: 'Tag-Text' },
  '--nk-decor-purple': { en: 'Avatar gradient start and cover. Same in both themes on purpose', de: 'Avatar-Verlauf-Start und Cover. Bewusst in beiden Themes gleich' },
  '--nk-decor-blue': { en: 'Avatar gradient end and cover', de: 'Avatar-Verlauf-Ende und Cover' },
  '--nk-decor-orange': { en: 'Cover accent', de: 'Cover-Akzent' },
  '--nk-scrim': { en: 'Modal backdrop', de: 'Modal-Backdrop' },
  '--nk-scrim-soft': { en: 'Command palette backdrop, one step lighter', de: 'Backdrop der Befehlspalette, eine Stufe heller' },
  '--nk-sidebar-width': { en: 'Sidebar width, also its min-width', de: 'Sidebar-Breite, zugleich ihre min-width' },
  '--nk-radius': { en: 'Control radius. Cards and modals use 8–12px directly', de: 'Radius für Bedienelemente. Karten und Modals nutzen direkt 8–12px' },
  '--nk-font': { en: 'System font stack', de: 'System-Schriftstapel' },
  '--nk-font-mono': { en: 'Monospace stack for code', de: 'Monospace-Stapel für Code' },
  '--nk-shadow-menu': { en: 'Three-layer shadow for every floating surface', de: 'Dreilagiger Schatten für jede schwebende Fläche' },
  '--nk-shadow-card': { en: 'Board card lift. `none` in dark mode', de: 'Abheben der Board-Karte. Im Dark Mode `none`' },
  '--nk-shadow-knob': { en: 'Switch knob', de: 'Switch-Knopf' },
  '--nk-shadow-segment': { en: 'Active segment', de: 'Aktives Segment' },
  'color-scheme': { en: 'Tells the browser which scheme its own widgets should use', de: 'Sagt dem Browser, welches Schema seine eigenen Widgets nutzen sollen' },
};

export const STATES = [
  { cls: 'active', on: 'nk-tree-item, nk-db-tab, nk-tab, nk-settings-pane, nk-segmented button, nk-emoji-cats span, nk-board, nk-bubble-menu button',
    en: 'Marks the current item. Tree items get the active background, tabs get the underline, panes become visible.',
    de: 'Markiert das aktuelle Element. Baum-Einträge bekommen den Aktiv-Hintergrund, Reiter die Unterlinie, Panes werden sichtbar.' },
  { cls: 'open', on: 'nk-modal-backdrop, nk-cmdk-backdrop, nk-toggle-arrow',
    en: 'Fades the overlay in and makes it interactive; rotates the toggle arrow by 90°.',
    de: 'Blendet das Overlay ein und macht es bedienbar; dreht den Toggle-Pfeil um 90°.' },
  { cls: 'collapsed', on: 'nk-tree-children',
    en: 'Folds a subtree away with display: none.', de: 'Klappt einen Unterbaum per display: none weg.' },
  { cls: 'selected', on: 'nk-cmdk-item, nk-model-card, nk-slash-item',
    en: 'The keyboard-highlighted or chosen option. Distinct from active: selection is transient, active is where you are.',
    de: 'Die per Tastatur hervorgehobene oder gewählte Option. Anders als active: Auswahl ist flüchtig, active ist der Ort, an dem du bist.' },
  { cls: 'show', on: 'nk-toast',
    en: 'Slides the toast up from below and fades it in.', de: 'Fährt den Toast von unten hoch und blendet ihn ein.' },
  { cls: 'aria-checked="true"', on: 'nk-switch (button form)',
    en: 'Fills the track with the accent and slides the knob. An attribute, not a class, so the state is also announced to assistive technology.',
    de: 'Füllt die Schiene mit dem Akzent und schiebt den Knopf. Ein Attribut, keine Klasse – der Zustand wird so auch an assistive Technik gemeldet.' },
  { cls: ':checked', on: 'nk-todo input, nk-check input, nk-switch (input form)',
    en: 'Native state. Draws the custom checkmark or dot and strikes a to-do label through.',
    de: 'Nativer Zustand. Zeichnet Haken oder Punkt und streicht ein To-do-Label durch.' },
  { cls: 'nk-drop-target', on: 'nk-block-host',
    en: 'Drag feedback: a 2px accent line above the block.', de: 'Drag-Rückmeldung: eine 2px-Akzentlinie über dem Block.' },
];

// Measured with the sRGB relative-luminance formula against the surface the
// pair actually sits on. See tools/contrast.mjs.
export const CONTRAST = [
  { pair: '--nk-text / --nk-bg', light: 12.26, dark: 11.78, body: true },
  { pair: '--nk-text / --nk-bg-sidebar', light: 11.35, dark: 11.06, body: true },
  { pair: '--nk-text-secondary / --nk-bg', light: 4.19, dark: 4.63, body: true },
  { pair: '--nk-text-tertiary / --nk-bg', light: 2.49, dark: 2.53, body: false },
  { pair: '--nk-accent / --nk-bg', light: 3.88, dark: 5.83, body: false },
  { pair: '--nk-on-accent / --nk-accent', light: 3.88, dark: 3.01, body: true },
  { pair: '--nk-danger / --nk-bg', light: 3.48, dark: 5.05, body: true },
  { pair: 'tag blue', light: 3.95, dark: 4.57, body: false },
  { pair: 'tag green', light: 3.99, dark: 4.48, body: false },
  { pair: 'tag orange', light: 2.83, dark: 6.82, body: false },
  { pair: 'tag purple', light: 4.09, dark: 3.84, body: false },
];
