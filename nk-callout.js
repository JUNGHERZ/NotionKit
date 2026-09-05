// ============================================================
// NotionKit Elements – proof of concept
//
// Two custom elements that adopt the NotionKit *components* sheet
// into their shadow roots and re-theme through data-theme on <html>.
// This is the pattern NotionKit Elements (project 2) will build on;
// it exists here to prove the CSS foundation is elements-ready.
//
// The three rules it demonstrates:
//   1. Adopt componentsSheet, never nkSheet. The full sheet would
//      re-declare every --nk-* token inside the shadow root, and a
//      matching rule beats an inherited value – the page's own
//      `:root { --nk-accent: … }` would never arrive.
//   2. Put tokensCss on the document once, inside a cascade layer,
//      so an ordinary (unlayered) brand stylesheet wins regardless of
//      load order – and notionkit.css, if present, wins too.
//   3. Mirror data-theme from <html> onto a display:contents wrapper
//      inside the root, so color-scheme and any [data-theme]-keyed
//      rule apply. Token *values* need no mirroring – they inherit.
//
// Requires a build (`npm run build`) so notionkit-styles.js exists,
// and a server: module imports do not work from file://.
// ============================================================
import { componentsSheet, tokensCss } from './notionkit-styles.js';

// ---- 2. Default tokens on the document, once ------------------------------
const FLAG = '__nkDefaultTokensInjected';
if (typeof document !== 'undefined' && !globalThis[FLAG]) {
  globalThis[FLAG] = true;
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(`@layer notionkit-defaults { ${tokensCss} }`);
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];   // append, never assign
}

// ---- 3. One observer, every instance ---------------------------------------
const instances = new Set();
const currentTheme = () => document.documentElement.getAttribute('data-theme') || 'light';
new MutationObserver(() => {
  const t = currentTheme();
  for (const el of instances) el._wrapper.setAttribute('data-theme', t);
}).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

// ---- Host defaults: block display, hidden works, wrapper is layout-neutral
const hostSheet = new CSSStyleSheet();
hostSheet.replaceSync(`:host { display: block; } :host([hidden]) { display: none; } .nk-wrapper { display: contents; }`);
const inlineHostSheet = new CSSStyleSheet();
inlineHostSheet.replaceSync(`:host { display: inline-block; } :host([hidden]) { display: none; } .nk-wrapper { display: contents; }`);

class NkElement extends HTMLElement {
  static get displayInline() { return false; }
  constructor() {
    super();
    this._root = this.attachShadow({ mode: 'open' });
    this._root.adoptedStyleSheets = [componentsSheet, this.constructor.displayInline ? inlineHostSheet : hostSheet];   // 1.
    this._wrapper = document.createElement('div');
    this._wrapper.className = 'nk-wrapper';
    this._wrapper.setAttribute('data-theme', currentTheme());
    this._root.appendChild(this._wrapper);
  }
  connectedCallback() {
    if (!this._rendered) { this._rendered = true; this.render(); }
    instances.add(this);
  }
  disconnectedCallback() { instances.delete(this); }
  render() {}
}

// <nk-callout icon="💡">text</nk-callout>  or  <nk-callout><span slot="icon">💡</span>text</nk-callout>
// The .c-icon rule has a ::slotted([slot="icon"]) twin in notionkit.css –
// that twin is what sizes an icon passed in from the light DOM.
export class NkCallout extends NkElement {
  static get observedAttributes() { return ['icon']; }
  render() {
    this._box = document.createElement('div');
    this._box.className = 'nk-callout';
    this._box.innerHTML = `<slot name="icon"><span class="c-icon"></span></slot><div><slot></slot></div>`;
    this._wrapper.appendChild(this._box);
    this._syncIcon();
  }
  attributeChangedCallback() { if (this._rendered) this._syncIcon(); }
  _syncIcon() { const fb = this._box?.querySelector('.c-icon'); if (fb) fb.textContent = this.getAttribute('icon') || '💡'; }
  get icon() { return this.getAttribute('icon'); }
  set icon(v) { this.setAttribute('icon', v); }
}

// <nk-tag color="blue">Text</nk-tag>  – modifier class .blue becomes attribute color="blue"
const TAG_COLORS = ['blue', 'green', 'orange', 'purple'];
export class NkTag extends NkElement {
  static get displayInline() { return true; }
  static get observedAttributes() { return ['color']; }
  render() {
    this._tag = document.createElement('span');
    this._tag.appendChild(document.createElement('slot'));
    this._wrapper.appendChild(this._tag);
    this._syncClass();
  }
  attributeChangedCallback() { if (this._rendered) this._syncClass(); }
  _syncClass() {
    const c = this.getAttribute('color');
    this._tag.className = 'nk-tag' + (TAG_COLORS.includes(c) ? ' ' + c : '');
  }
}

customElements.define('nk-callout', NkCallout);
customElements.define('nk-tag', NkTag);
