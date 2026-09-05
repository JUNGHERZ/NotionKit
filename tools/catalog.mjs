// The single source for showcase.html and docs.html, in both languages.
// `html` receives the phrase dictionary for the language being rendered.

export const GROUPS = [
  { id: 'shell',    prd: '5.1',  title: { en: 'App shell & layout',      de: 'App-Shell & Layout' } },
  { id: 'nav',      prd: '5.2',  title: { en: 'Navigation / page tree',  de: 'Navigation / Seitenbaum' } },
  { id: 'page',     prd: '5.3',  title: { en: 'Page shell & document',   de: 'Seiten-Shell & Dokument' } },
  { id: 'content',  prd: '5.4',  title: { en: 'Content elements',        de: 'Inhalts-Elemente' } },
  { id: 'database', prd: '5.5',  title: { en: 'Database views',          de: 'Datenbank-Views' } },
  { id: 'forms',    prd: '5.6',  title: { en: 'Forms & settings',        de: 'Formulare & Einstellungen' } },
  { id: 'modal',    prd: '5.7',  title: { en: 'Settings modal',          de: 'Einstellungs-Modal' } },
  { id: 'overlay',  prd: '5.8',  title: { en: 'Overlays & menus',        de: 'Overlays & Menüs' } },
  { id: 'gallery',  prd: '5.9',  title: { en: 'Gallery & productivity',  de: 'Galerie & Produktivität' } },
  { id: 'collab',   prd: '5.10', title: { en: 'Collaboration & AI',      de: 'Kollaboration & KI' } },
  { id: 'editor',   prd: '5.11', title: { en: 'Editor adapter',          de: 'Editor-Adapter' } },
];

export const CATALOG = [
// ============================================================ 5.1 APP SHELL
{
  id: 'nk-app', group: 'shell', classes: ['nk-app', 'nk-sidebar', 'nk-sidebar-scroll', 'nk-sidebar-footer', 'nk-main'],
  title: { en: 'App shell', de: 'App-Shell' },
  desc: {
    en: '<code>nk-app</code> is a full-height flex row: sidebar left, main column right. It is the outermost element of a workspace app and the only place a fixed height belongs. Inside the sidebar, <code>nk-sidebar-scroll</code> is the scrolling tree area and <code>nk-sidebar-footer</code> the pinned bottom (Settings, Trash).',
    de: '<code>nk-app</code> ist eine flex-Zeile über die volle Höhe: Sidebar links, Hauptspalte rechts. Es ist das äußerste Element einer Workspace-App und der einzige Ort, an den eine feste Höhe gehört. In der Sidebar ist <code>nk-sidebar-scroll</code> der scrollende Baumbereich und <code>nk-sidebar-footer</code> der fixierte Fuß (Einstellungen, Papierkorb).',
  },
  mobile: {
    en: 'Below 860px the sidebar is hidden entirely and the main column takes the full width. An off-canvas drawer is the consumer’s job – NotionKit Elements ships one as <code class="nk-inline-code">&lt;nk-sidebar open&gt;</code>.',
    de: 'Unter 860px verschwindet die Sidebar vollständig, die Hauptspalte nimmt die volle Breite. Eine Off-Canvas-Schublade ist Sache des Consumers – NotionKit Elements liefert sie als <code class="nk-inline-code">&lt;nk-sidebar open&gt;</code>.',
  },
  frame: 340,
  html: W => `<div class="nk-app" style="height:100%">
  <aside class="nk-sidebar">
    <div class="nk-workspace"><div class="avatar">A</div>${W.workspace}<span class="chev">⌄</span></div>
    <div class="nk-sidebar-scroll">
      <div class="nk-tree-item"><span class="icon">🔍</span><span class="label">${W.search}</span></div>
      <div class="nk-tree-item active"><span class="icon">🏠</span><span class="label">${W.home}</span></div>
      <div class="nk-tree-item"><span class="icon">📥</span><span class="label">${W.inbox}</span></div>
    </div>
    <div class="nk-sidebar-footer">
      <div class="nk-tree-item"><span class="icon">⚙️</span><span class="label">${W.settings}</span></div>
    </div>
  </aside>
  <main class="nk-main">
    <header class="nk-topbar">
      <div class="nk-breadcrumb"><span class="crumb current">📊 ${W.projectOverview}</span></div>
      <div class="nk-topbar-actions"><button class="nk-topbar-btn nk-share-btn">${W.share}</button></div>
    </header>
    <div class="nk-page-scroll"><div class="nk-page" style="padding-top:16px">
      <h1 class="nk-page-title" style="font-size:28px">${W.pageTitle}</h1>
      <p class="lead">${W.lead}</p>
    </div></div>
  </main>
</div>`,
},
{
  id: 'nk-workspace', group: 'shell', classes: ['nk-workspace', 'avatar', 'chev'],
  title: { en: 'Workspace switcher', de: 'Workspace-Umschalter' },
  desc: {
    en: 'Sits at the very top of the sidebar. The avatar gradient is mixed from <code>--nk-decor-purple</code> and <code>--nk-decor-blue</code>, so it survives a re-brand untouched.',
    de: 'Sitzt ganz oben in der Sidebar. Der Avatar-Verlauf wird aus <code>--nk-decor-purple</code> und <code>--nk-decor-blue</code> gemischt und übersteht ein Rebranding unverändert.',
  },
  mobile: { en: 'Hidden together with the sidebar below 860px.', de: 'Verschwindet unter 860px zusammen mit der Sidebar.' },
  html: W => `<div class="nk-workspace" style="background:var(--nk-bg-sidebar);max-width:244px">
  <div class="avatar">A</div>${W.workspace}<span class="chev">⌄</span>
</div>`,
},
{
  id: 'nk-topbar', group: 'shell', classes: ['nk-topbar', 'nk-topbar-actions', 'nk-topbar-btn', 'nk-share-btn', 'nk-theme-toggle'],
  title: { en: 'Topbar', de: 'Topbar' },
  desc: {
    en: 'A 45px-high row holding the breadcrumb on the left and actions on the right. <code>nk-topbar-actions</code> pushes itself right with <code>margin-left:auto</code>, so you never need a spacer.',
    de: 'Eine 45px hohe Zeile: links der Breadcrumb, rechts die Aktionen. <code>nk-topbar-actions</code> schiebt sich per <code>margin-left:auto</code> nach rechts – ein Platzhalter ist nie nötig.',
  },
  mobile: { en: 'Stays put. The breadcrumb wraps its crumbs; drop crumbs yourself if the trail gets long.', de: 'Bleibt bestehen. Der Breadcrumb bricht um; lange Pfade kürzt der Consumer selbst.' },
  html: W => `<header class="nk-topbar" style="border:1px solid var(--nk-border);border-radius:var(--nk-radius)">
  <div class="nk-breadcrumb">
    <span class="crumb">📊 ${W.projectOverview}</span><span class="sep">/</span><span class="crumb current">🚀 ${W.roadmap}</span>
  </div>
  <div class="nk-topbar-actions">
    <button class="nk-topbar-btn">💬</button>
    <button class="nk-topbar-btn nk-share-btn">${W.share}</button>
    <button class="nk-topbar-btn">⭐</button>
    <button class="nk-topbar-btn nk-theme-toggle">🌙</button>
    <button class="nk-topbar-btn">⋯</button>
  </div>
</header>`,
},
{
  id: 'nk-breadcrumb', group: 'shell', classes: ['nk-breadcrumb', 'crumb', 'sep', 'current'],
  title: { en: 'Breadcrumb', de: 'Breadcrumb' },
  desc: {
    en: 'Each step is a <code>.crumb</code>; the last one carries <code>.current</code> and turns from secondary to primary text. Separators are <code>.sep</code>.',
    de: 'Jede Stufe ist ein <code>.crumb</code>; die letzte trägt <code>.current</code> und wechselt von sekundärer zu primärer Textfarbe. Trenner sind <code>.sep</code>.',
  },
  mobile: { en: 'Wraps rather than truncating. Shorten the trail server-side on small screens.', de: 'Bricht um, statt zu kürzen. Auf kleinen Schirmen den Pfad serverseitig kürzen.' },
  html: W => `<div class="nk-breadcrumb">
  <span class="crumb">📊 ${W.projectOverview}</span><span class="sep">/</span>
  <span class="crumb">📚 ${W.knowledgeBase}</span><span class="sep">/</span>
  <span class="crumb current">🚀 ${W.roadmap}</span>
</div>`,
},
{
  id: 'nk-section-label', group: 'shell', classes: ['nk-section-label', 'plus'],
  title: { en: 'Section label', de: 'Abschnitts-Label' },
  desc: {
    en: 'The small uppercase caption between sidebar groups. Its <code>.plus</code> affordance only appears on hover — a quiet way to keep an add action reachable without decorating the rail.',
    de: 'Die kleine Versal-Beschriftung zwischen Sidebar-Gruppen. Das <code>.plus</code> erscheint erst beim Hovern – so bleibt die Hinzufügen-Aktion erreichbar, ohne die Leiste zu schmücken.',
  },
  mobile: { en: 'Hidden inside the settings nav below 860px, where the nav collapses to icons.', de: 'In der Settings-Navigation unter 860px ausgeblendet, wo diese auf Icons zusammenschrumpft.' },
  html: W => `<div style="background:var(--nk-bg-sidebar);border-radius:var(--nk-radius);padding:4px 8px;max-width:244px">
  <div class="nk-section-label">${W.favourites}<span class="plus">＋</span></div>
  <div class="nk-tree-item"><span class="icon">📊</span><span class="label">${W.projectOverview}</span></div>
</div>`,
},
,
// ============================================================ 5.2 NAVIGATION
{
  id: 'nk-tree-item', group: 'nav', classes: ['nk-tree-item', 'icon', 'label', 'actions', 'active', 'compact'],
  title: { en: 'Tree item', de: 'Baum-Eintrag' },
  desc: {
    en: 'The workhorse of the sidebar. Minimum height is 28px, the label truncates with an ellipsis, and the <code>.actions</code> block stays hidden until hover. Add <code>.active</code> for the current page.',
    de: 'Das Arbeitstier der Sidebar. Mindesthöhe 28px, das Label kürzt mit Ellipse, und der <code>.actions</code>-Block bleibt bis zum Hovern verborgen. <code>.active</code> markiert die aktuelle Seite.',
  },
  mobile: {
    en: 'Reaches 28px, below the 44px touch target. In a touch-first off-canvas drawer raise <code>min-height</code> on the item; the class does not force a height.',
    de: 'Kommt auf 28px und liegt damit unter dem 44px-Touch-Ziel. In einer Touch-Schublade <code>min-height</code> am Eintrag anheben – die Klasse erzwingt keine Höhe.',
  },
  html: W => `<div style="background:var(--nk-bg-sidebar);border-radius:var(--nk-radius);padding:6px 8px;max-width:244px">
  <div class="nk-tree-item active"><span class="icon">📊</span><span class="label">${W.projectOverview}</span><span class="actions"><span>＋</span><span>⋯</span></span></div>
  <div class="nk-tree-item"><span class="icon">📚</span><span class="label">${W.knowledgeBase}</span><span class="actions"><span>＋</span><span>⋯</span></span></div>
  <div class="nk-tree-item"><span class="icon">🎨</span><span class="label">${W.designSystem}</span><span class="actions"><span>＋</span><span>⋯</span></span></div>
</div>`,
},
{
  id: 'nk-tree-children', group: 'nav', classes: ['nk-tree-children', 'collapsed', 'nk-toggle-arrow', 'open'],
  title: { en: 'Nested tree & toggle arrow', de: 'Unterbaum & Toggle-Pfeil' },
  desc: {
    en: 'Children indent under a guide line. Add <code>.collapsed</code> to fold them away and <code>.open</code> to the arrow to rotate it 90°. Both are plain state classes — the toggling is yours.',
    de: 'Kinder rücken unter einer Führungslinie ein. <code>.collapsed</code> klappt sie weg, <code>.open</code> am Pfeil dreht ihn um 90°. Beides sind reine Zustandsklassen – das Umschalten übernimmst du.',
  },
  mobile: { en: 'Unchanged; the indent stays at 14px so deep trees still fit a narrow rail.', de: 'Unverändert; die Einrückung bleibt bei 14px, damit tiefe Bäume in eine schmale Leiste passen.' },
  html: W => `<div style="background:var(--nk-bg-sidebar);border-radius:var(--nk-radius);padding:6px 8px;max-width:244px">
  <div class="nk-tree-item"><span class="nk-toggle-arrow open">▶</span><span class="icon">📚</span><span class="label">${W.knowledgeBase}</span></div>
  <div class="nk-tree-children">
    <div class="nk-tree-item"><span class="icon">📄</span><span class="label">${W.meetingNotes}</span></div>
    <div class="nk-tree-item"><span class="icon">🎨</span><span class="label">${W.designSystem}</span></div>
  </div>
  <div class="nk-tree-item"><span class="nk-toggle-arrow">▶</span><span class="icon">🗂️</span><span class="label">${W.pages}</span></div>
  <div class="nk-tree-children collapsed"><div class="nk-tree-item"><span class="label">—</span></div></div>
</div>`,
},
{
  id: 'nk-kbd', group: 'nav', classes: ['nk-kbd-hint', 'nk-kbd'],
  title: { en: 'Keyboard hint', de: 'Tastatur-Hinweis' },
  desc: {
    en: '<code>nk-kbd-hint</code> pushes a shortcut to the right edge of a row; <code>nk-kbd</code> is the key cap itself. Prefixed on purpose — a bare <code>kbd</code> rule would leak into the host page.',
    de: '<code>nk-kbd-hint</code> schiebt ein Kürzel an den rechten Rand einer Zeile; <code>nk-kbd</code> ist die Taste selbst. Bewusst präfixiert – eine nackte <code>kbd</code>-Regel würde in die Host-Seite lecken.',
  },
  mobile: { en: 'Keep it, but do not rely on it: touch devices have no such shortcut.', de: 'Kann bleiben, trägt aber nicht: Touch-Geräte haben dieses Kürzel nicht.' },
  html: W => `<div style="background:var(--nk-bg-sidebar);border-radius:var(--nk-radius);padding:6px 8px;max-width:244px">
  <div class="nk-tree-item"><span class="icon">🔍</span><span class="label">${W.search}</span><span class="nk-kbd-hint"><kbd class="nk-kbd">⌘</kbd><kbd class="nk-kbd">K</kbd></span></div>
</div>`,
},
// ============================================================ 5.3 PAGE
{
  id: 'nk-page', group: 'page', classes: ['nk-page-scroll', 'nk-page', 'nk-page-icon', 'nk-page-title', 'nk-page-meta'],
  title: { en: 'Page column', de: 'Seitenspalte' },
  desc: {
    en: 'The document column: <code>max-width: 760px</code> with auto margins, never a fixed width. The icon pulls itself up over the cover with a negative margin; the title is <code>contenteditable</code>-ready.',
    de: 'Die Dokumentspalte: <code>max-width: 760px</code> mit Auto-Rändern, nie eine feste Breite. Das Icon zieht sich per negativem Rand über das Cover; der Titel ist <code>contenteditable</code>-fähig.',
  },
  mobile: { en: 'Side padding drops from 64px to 24px below 860px. The 760px cap simply never binds.', de: 'Der Seitenabstand fällt unter 860px von 64px auf 24px. Die 760px-Grenze greift dort schlicht nicht.' },
  frame: 320,
  html: W => `<div class="nk-page-scroll" style="height:100%">
  <div class="nk-cover" style="height:120px"></div>
  <div class="nk-page" style="padding-bottom:24px">
    <div class="nk-page-icon">🚀</div>
    <h1 class="nk-page-title" contenteditable="true">${W.pageTitle}</h1>
    <div class="nk-page-meta"><span>👤 ${W.author}</span><span>📅 ${W.created}</span></div>
    <p class="lead">${W.lead}</p>
  </div>
</div>`,
},
{
  id: 'nk-cover', group: 'page', classes: ['nk-cover'],
  title: { en: 'Cover', de: 'Cover' },
  desc: {
    en: 'A 200px decorative band above the page. Three radial gradients mixed from the <code>--nk-decor-*</code> tokens over <code>--nk-bg-callout</code>. Swap the whole <code>background</code> for a photo.',
    de: 'Ein 200px hohes Zierband über der Seite. Drei radiale Verläufe, gemischt aus den <code>--nk-decor-*</code>-Tokens über <code>--nk-bg-callout</code>. Für ein Foto den ganzen <code>background</code> ersetzen.',
  },
  mobile: { en: 'Fixed 200px height, full bleed. Reduce it yourself if it eats too much of a short screen.', de: 'Feste 200px Höhe, randlos. Auf kurzen Schirmen bei Bedarf selbst reduzieren.' },
  html: () => `<div class="nk-cover" style="border-radius:var(--nk-radius)"></div>`,
},
{
  id: 'nk-heading', group: 'page', classes: ['nk-heading', 'lead'],
  title: { en: 'Headings & lead', de: 'Überschriften & Lead' },
  desc: {
    en: '<code>nk-heading</code> is the in-document section heading — a flex row, so an emoji sits on the baseline without extra markup. <code>p.lead</code> is the larger intro paragraph inside <code>nk-page</code>.',
    de: '<code>nk-heading</code> ist die Abschnitts-Überschrift im Dokument – eine flex-Zeile, damit ein Emoji ohne Zusatz-Markup auf der Grundlinie sitzt. <code>p.lead</code> ist der größere Einstiegsabsatz in <code>nk-page</code>.',
  },
  mobile: { en: 'Unchanged. The page title stays 40px; override it if that is too loud on a phone.', de: 'Unverändert. Der Seitentitel bleibt 40px; bei Bedarf auf dem Handy selbst verkleinern.' },
  html: W => `<div class="nk-page" style="padding:0;max-width:none">
  <h2 class="nk-heading">✅ ${W.heading}</h2>
  <p class="lead">${W.lead}</p>
</div>`,
}
,
// ============================================================ 5.4 CONTENT
{
  id: 'nk-callout', group: 'content', classes: ['nk-callout', 'c-icon'],
  title: { en: 'Callout', de: 'Callout' },
  desc: {
    en: 'A tinted block for the one thought that must not be missed. The icon is a <code>.c-icon</code> child and has a <code>::slotted()</code> twin, so <code>&lt;nk-callout&gt;</code> can accept it through a slot.',
    de: 'Ein getönter Block für den einen Gedanken, der nicht übersehen werden darf. Das Icon ist ein <code>.c-icon</code>-Kind und hat einen <code>::slotted()</code>-Zwilling – <code>&lt;nk-callout&gt;</code> kann es später per Slot annehmen.',
  },
  mobile: { en: 'Flows naturally; the icon stays on the first line because the row is <code>align-items: flex-start</code>.', de: 'Fließt natürlich; das Icon bleibt in der ersten Zeile, weil die Zeile <code>align-items: flex-start</code> nutzt.' },
  html: W => `<div class="nk-callout"><span class="c-icon">💡</span><div>${W.calloutBody}</div></div>`,
},
{
  id: 'nk-todo', group: 'content', classes: ['nk-todo'],
  title: { en: 'To-do', de: 'To-do' },
  desc: {
    en: 'A checkbox with a custom checkmark. The sibling selector <code>input:checked + span</code> strikes the label through — both halves live inside one component, so it survives the move into a shadow root.',
    de: 'Eine Checkbox mit eigenem Haken. Der Geschwister-Selektor <code>input:checked + span</code> streicht das Label durch – beide Hälften liegen in einer Komponente und überstehen den Umzug in einen Shadow Root.',
  },
  mobile: { en: 'The 16px box is below the touch minimum. Wrap it in a <code>&lt;label&gt;</code> so the whole row is tappable.', de: 'Die 16px-Box liegt unter dem Touch-Minimum. In ein <code>&lt;label&gt;</code> packen, damit die ganze Zeile tippbar ist.' },
  html: W => `<div>
  <label class="nk-todo"><input type="checkbox" checked><span>${W.todo1}</span></label>
  <label class="nk-todo"><input type="checkbox" checked><span>${W.todo2}</span></label>
  <label class="nk-todo"><input type="checkbox"><span>${W.todo3}</span></label>
</div>`,
},
{
  id: 'nk-toggle', group: 'content', classes: ['nk-toggle', 'toggle-body'],
  title: { en: 'Toggle', de: 'Toggle' },
  desc: {
    en: 'Built on native <code>&lt;details&gt;</code>/<code>&lt;summary&gt;</code>, so it opens and closes without a line of JavaScript. The marker is a <code>::before</code> that rotates on <code>[open]</code>.',
    de: 'Auf nativem <code>&lt;details&gt;</code>/<code>&lt;summary&gt;</code> gebaut – öffnet und schließt ohne eine Zeile JavaScript. Der Marker ist ein <code>::before</code>, das sich bei <code>[open]</code> dreht.',
  },
  mobile: { en: 'The summary row is comfortably tappable. Native behaviour on all platforms.', de: 'Die Summary-Zeile ist bequem tippbar. Natives Verhalten auf allen Plattformen.' },
  html: W => `<details class="nk-toggle" open>
  <summary>${W.toggleSummary}</summary>
  <div class="toggle-body">${W.toggleBody}</div>
</details>`,
},
{
  id: 'nk-quote', group: 'content', classes: ['nk-quote', 'q-cite', 'nk-divider'],
  title: { en: 'Quote & divider', de: 'Zitat & Trenner' },
  desc: {
    en: 'A block quote with a solid left rule, plus the horizontal divider. <code>nk-divider</code> is meant for an <code>&lt;hr&gt;</code> and resets the element’s own border.',
    de: 'Ein Blockzitat mit durchgezogener linker Linie, dazu der waagerechte Trenner. <code>nk-divider</code> ist für ein <code>&lt;hr&gt;</code> gedacht und setzt dessen eigenen Rahmen zurück.',
  },
  mobile: { en: 'Unchanged.', de: 'Unverändert.' },
  html: W => `<blockquote class="nk-quote">${W.quote}<cite class="q-cite">${W.quoteCite}</cite></blockquote>
<hr class="nk-divider">`,
},
{
  id: 'nk-mention', group: 'content', classes: ['nk-mention', 'person', 'page', 'date', 'mini-avatar'],
  title: { en: 'Inline mentions', de: 'Inline-Erwähnungen' },
  desc: {
    en: 'Three variants inside running text: <code>.person</code> with a mini avatar, <code>.page</code> underlined in a hairline, <code>.date</code> in the orange tag colour. All are <code>inline-flex</code> and never break mid-mention.',
    de: 'Drei Varianten im Fließtext: <code>.person</code> mit Mini-Avatar, <code>.page</code> haarfein unterstrichen, <code>.date</code> in der orangen Tag-Farbe. Alle sind <code>inline-flex</code> und brechen nie mitten in der Erwähnung.',
  },
  mobile: { en: '<code>white-space: nowrap</code> keeps each mention whole; the paragraph wraps around it.', de: '<code>white-space: nowrap</code> hält jede Erwähnung zusammen; der Absatz bricht darum herum.' },
  html: W => `<p style="line-height:1.9">
  <span class="nk-mention person"><span class="mini-avatar" style="background:var(--nk-decor-purple)">SL</span>${W.mentionPerson}</span>
  <span class="nk-mention page">📄 ${W.knowledgeBase}</span>
  <span class="nk-mention date">📅 ${W.mentionDate}</span>
</p>`,
},
{
  id: 'nk-code', group: 'content', classes: ['nk-code', 'lang', 'tag', 'attr', 'nk-inline-code'],
  title: { en: 'Code', de: 'Code' },
  desc: {
    en: 'A block with a language badge in the corner and two colour hooks — <code>.tag</code> takes the accent, <code>.attr</code> the orange tag colour. <code>nk-inline-code</code> is the in-sentence variant.',
    de: 'Ein Block mit Sprach-Badge in der Ecke und zwei Farb-Haken – <code>.tag</code> nimmt den Akzent, <code>.attr</code> die orange Tag-Farbe. <code>nk-inline-code</code> ist die Variante im Satz.',
  },
  mobile: { en: '<code>white-space: pre</code> plus <code>overflow-x: auto</code>: long lines scroll inside the block instead of pushing the page sideways.', de: '<code>white-space: pre</code> plus <code>overflow-x: auto</code>: Lange Zeilen scrollen im Block, statt die Seite zu verschieben.' },
  html: () => `<div class="nk-code"><span class="lang">html</span><span class="tag">&lt;div</span> <span class="attr">class=</span>"nk-callout"<span class="tag">&gt;</span>
  <span class="tag">&lt;span</span> <span class="attr">class=</span>"c-icon"<span class="tag">&gt;</span>💡<span class="tag">&lt;/span&gt;</span>
<span class="tag">&lt;/div&gt;</span></div>
<p>Inline: <code class="nk-inline-code">--nk-accent</code></p>`,
},
// ============================================================ 5.5 DATABASE
{
  id: 'nk-db-tabs', group: 'database', classes: ['nk-database', 'nk-db-tabs', 'nk-db-tab', 'active', 'badge'],
  title: { en: 'View tabs', de: 'View-Reiter' },
  desc: {
    en: 'The strip above a database. The active tab is marked by a 2px underline in text colour, not by a fill. The <code>.badge</code> child carries the row count.',
    de: 'Die Leiste über einer Datenbank. Der aktive Reiter wird durch eine 2px-Unterlinie in Textfarbe markiert, nicht durch eine Füllung. Das <code>.badge</code>-Kind trägt die Zeilenzahl.',
  },
  mobile: { en: 'Add <code>overflow-x: auto</code> to the strip when you have more than three or four views.', de: 'Bei mehr als drei, vier Views <code>overflow-x: auto</code> an die Leiste geben.' },
  html: W => `<div class="nk-database">
  <div class="nk-db-tabs">
    <div class="nk-db-tab active">▦ ${W.table}<span class="badge">4</span></div>
    <div class="nk-db-tab">▤ ${W.board}</div>
    <div class="nk-db-tab">🖼 ${W.gallery}</div>
  </div>
</div>`,
},
{
  id: 'nk-table', group: 'database', classes: ['nk-table-wrap', 'nk-table', 'th-icon', 'row-title', 'date-cell', 'person-cell', 'nk-new-row'],
  title: { en: 'Table view', de: 'Tabellen-Ansicht' },
  desc: {
    en: 'Header cells are quiet and clickable, rows highlight on hover, and every cell is <code>white-space: nowrap</code> so columns keep their shape. <code>.nk-new-row</code> is the add affordance at the bottom (inside <code>.nk-table</code> the short form <code>.new-row</code> still works).',
    de: 'Kopfzellen sind ruhig und klickbar, Zeilen heben sich beim Hovern hervor, und jede Zelle ist <code>white-space: nowrap</code>, damit Spalten ihre Form behalten. <code>.nk-new-row</code> ist die Hinzufügen-Zeile unten (innerhalb von <code>.nk-table</code> funktioniert die Kurzform <code>.new-row</code> weiter).',
  },
  mobile: {
    en: 'This is the key one: <code>nk-table-wrap</code> scrolls horizontally so the table never forces the page wider. Always wrap the table.',
    de: 'Das ist der entscheidende Fall: <code>nk-table-wrap</code> scrollt horizontal, damit die Tabelle die Seite nie breiter macht. Die Tabelle immer einwickeln.',
  },
  html: W => `<div class="nk-table-wrap"><table class="nk-table">
  <thead><tr>
    <th><span class="th-icon">📄</span>${W.name}</th><th><span class="th-icon">◉</span>${W.status}</th>
    <th><span class="th-icon">👤</span>${W.owner}</th><th><span class="th-icon">📅</span>${W.due}</th>
    <th><span class="th-icon">📊</span>${W.progress}</th>
  </tr></thead>
  <tbody>
    <tr><td><span class="row-title">🚀 ${W.roadmap}</span></td><td><span class="nk-tag green">${W.done}</span></td>
        <td><span class="person-cell"><span class="mini-avatar" style="background:var(--nk-decor-purple)">SL</span>Sara</span></td>
        <td class="date-cell">12.05.2026</td>
        <td><span class="nk-progress"><i style="width:100%"></i></span><span class="nk-progress-label">100 %</span></td></tr>
    <tr><td><span class="row-title">🎨 ${W.designSystem}</span></td><td><span class="nk-tag blue">${W.inProgress}</span></td>
        <td><span class="person-cell"><span class="mini-avatar" style="background:var(--nk-decor-blue)">TW</span>Tom</span></td>
        <td class="date-cell">20.05.2026</td>
        <td><span class="nk-progress"><i style="width:65%"></i></span><span class="nk-progress-label">65 %</span></td></tr>
  </tbody>
</table>
<div class="nk-new-row">＋ ${W.newPage}</div></div>`,
},
{
  id: 'nk-tag', group: 'database', classes: ['nk-tag', 'blue', 'green', 'orange', 'purple'],
  title: { en: 'Tags', de: 'Tags' },
  desc: {
    en: 'Four semantic colours, each a background/text pair per theme. The pairs are tuned separately for light and dark rather than being derived by opacity.',
    de: 'Vier semantische Farben, je ein Hintergrund/Text-Paar pro Theme. Die Paare sind für Hell und Dunkel getrennt abgestimmt, nicht per Deckkraft abgeleitet.',
  },
  mobile: { en: 'Unchanged. Inline-block, so a row of tags wraps.', de: 'Unverändert. Inline-block, eine Tag-Reihe bricht also um.' },
  html: W => `<span class="nk-tag blue">${W.inProgress}</span>
<span class="nk-tag green">${W.done}</span>
<span class="nk-tag orange">${W.planned}</span>
<span class="nk-tag purple">${W.designSystem}</span>`,
},
{
  id: 'nk-progress', group: 'database', classes: ['nk-progress', 'nk-progress-label'],
  title: { en: 'Progress bar', de: 'Fortschrittsbalken' },
  desc: {
    en: 'A 6px rail whose fill is an <code>&lt;i&gt;</code> with a percentage width. Track and fill use the blue tag pair, so a re-theme carries them along.',
    de: 'Eine 6px-Schiene, deren Füllung ein <code>&lt;i&gt;</code> mit Prozentbreite ist. Schiene und Füllung nutzen das blaue Tag-Paar und ziehen bei einem Theme-Wechsel mit.',
  },
  mobile: { en: 'Fixed 110px width so it stays legible in a table cell. Override for full-width use.', de: 'Feste 110px Breite, damit er in einer Tabellenzelle lesbar bleibt. Für volle Breite überschreiben.' },
  html: () => `<span class="nk-progress"><i style="width:65%"></i></span><span class="nk-progress-label">65 %</span><br><br>
<span class="nk-progress"><i style="width:20%"></i></span><span class="nk-progress-label">20 %</span>`,
},
{
  id: 'nk-board', group: 'database', classes: ['nk-board', 'nk-board-col', 'nk-board-col-header', 'count', 'nk-card', 'card-title', 'card-meta'],
  title: { en: 'Board view', de: 'Board-Ansicht' },
  desc: {
    en: 'Fixed 220px columns in a horizontally scrolling row. <code>nk-board</code> is <code>display:none</code> by default so it can sit next to a table view; add <code>.active</code> to show it.',
    de: 'Feste 220px-Spalten in einer horizontal scrollenden Zeile. <code>nk-board</code> ist standardmäßig <code>display:none</code>, damit es neben einer Tabellen-Ansicht liegen kann; <code>.active</code> zeigt es.',
  },
  mobile: { en: 'Columns scroll horizontally rather than stacking — the board stays a board.', de: 'Die Spalten scrollen horizontal, statt zu stapeln – das Board bleibt ein Board.' },
  html: W => `<div class="nk-board active">
  <div class="nk-board-col">
    <div class="nk-board-col-header"><span class="nk-tag orange">${W.planned}</span><span class="count">1</span></div>
    <div class="nk-card"><div class="card-title">🖥 ${W.boardView}</div><div class="card-meta"><span class="mini-avatar" style="background:var(--nk-decor-blue);width:18px;height:18px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:9px;color:var(--nk-on-accent)">TW</span>28.05.</div></div>
  </div>
  <div class="nk-board-col">
    <div class="nk-board-col-header"><span class="nk-tag blue">${W.inProgress}</span><span class="count">1</span></div>
    <div class="nk-card"><div class="card-title">🎨 ${W.designSystem}</div><div class="card-meta"><span class="nk-progress" style="width:70px"><i style="width:65%"></i></span></div></div>
  </div>
  <div class="nk-board-col">
    <div class="nk-board-col-header"><span class="nk-tag green">${W.done}</span><span class="count">1</span></div>
    <div class="nk-card"><div class="card-title">🚀 ${W.roadmap}</div><div class="card-meta">12.05.</div></div>
  </div>
</div>`,
}
,
// ============================================================ 5.6 FORMS
{
  id: 'nk-input', group: 'forms', classes: ['nk-input', 'nk-textarea', 'nk-select', 'wide'],
  title: { en: 'Inputs, textarea, select', de: 'Inputs, Textarea, Select' },
  desc: {
    en: 'One shared shape for all three. The focus ring is <code>color-mix(in srgb, var(--nk-accent) 25%, transparent)</code>, so it re-brands with the accent. <code>.wide</code> makes an input fill its row.',
    de: 'Eine gemeinsame Form für alle drei. Der Fokusring ist <code>color-mix(in srgb, var(--nk-accent) 25%, transparent)</code> und färbt sich mit dem Akzent um. <code>.wide</code> füllt die Zeile.',
  },
  mobile: { en: '<code>min-width: 210px</code> can overflow a narrow field row — pair it with <code>.wide</code> or let <code>nk-field</code> wrap.', de: '<code>min-width: 210px</code> kann eine schmale Feldzeile sprengen – mit <code>.wide</code> kombinieren oder <code>nk-field</code> umbrechen lassen.' },
  html: W => `<div style="display:flex;flex-direction:column;gap:10px;max-width:340px">
  <input class="nk-input wide" value="${W.placeholderName}">
  <select class="nk-select wide"><option>${W.option1}</option><option>${W.option2}</option><option>${W.option3}</option></select>
  <textarea class="nk-textarea wide" placeholder="${W.placeholderAbout}"></textarea>
</div>`,
},
{
  id: 'nk-btn', group: 'forms', classes: ['nk-btn', 'primary', 'secondary', 'danger', 'danger-solid', 'small'],
  title: { en: 'Buttons', de: 'Buttons' },
  desc: {
    en: 'Five variants. Hover is an opacity shift on the filled ones and a background wash on the outlined ones — never a hue change. <code>.small</code> combines with any variant.',
    de: 'Fünf Varianten. Hover ist bei gefüllten Buttons eine Deckkraft-Änderung, bei umrandeten ein Hintergrund-Hauch – nie ein Farbwechsel. <code>.small</code> lässt sich mit jeder Variante kombinieren.',
  },
  mobile: { en: 'Height lands near 30px, under the 44px touch target. Raise the padding for touch-first screens.', de: 'Die Höhe liegt bei rund 30px, unter dem 44px-Touch-Ziel. Für Touch-Oberflächen das Padding anheben.' },
  html: W => `<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
  <button class="nk-btn primary">${W.save}</button>
  <button class="nk-btn secondary">${W.discard}</button>
  <button class="nk-btn danger">${W.deleteIt}</button>
  <button class="nk-btn danger-solid">${W.deleteIt}</button>
  <button class="nk-btn secondary small">${W.remove}</button>
</div>`,
},
{
  id: 'nk-switch', group: 'forms', classes: ['nk-switch', 'aria-checked'],
  title: { en: 'Switch', de: 'Switch' },
  desc: {
    en: 'Works two ways: as an <code>&lt;input type="checkbox"&gt;</code> via <code>:checked</code>, or as a <code>&lt;button role="switch"&gt;</code> via <code>aria-checked="true"</code>. The button form is the accessible default.',
    de: 'Funktioniert auf zwei Wegen: als <code>&lt;input type="checkbox"&gt;</code> über <code>:checked</code> oder als <code>&lt;button role="switch"&gt;</code> über <code>aria-checked="true"</code>. Die Button-Form ist der barrierefreie Standard.',
  },
  mobile: { en: '34×20px, so give it a larger tap area by making the whole <code>nk-field</code> row clickable.', de: '34×20px – die Trefferfläche vergrößern, indem die ganze <code>nk-field</code>-Zeile klickbar wird.' },
  html: W => `<div style="max-width:420px">
  <div class="nk-field"><div><div class="f-label">${W.compactView}</div><div class="f-desc">${W.compactDesc}</div></div>
    <div class="f-control"><button class="nk-switch" role="switch" aria-checked="true"></button></div></div>
  <div class="nk-field"><div><div class="f-label">${W.reduceMotion}</div></div>
    <div class="f-control"><button class="nk-switch" role="switch" aria-checked="false"></button></div></div>
</div>`,
},
{
  id: 'nk-check', group: 'forms', classes: ['nk-check'],
  title: { en: 'Checkbox & radio', de: 'Checkbox & Radio' },
  desc: {
    en: 'The same 16px box for both; the radio variant is detected by <code>[type="radio"]</code> and becomes a circle with a dot. Marks are <code>::after</code> content, not images.',
    de: 'Dieselbe 16px-Box für beides; die Radio-Variante wird über <code>[type="radio"]</code> erkannt und wird zum Kreis mit Punkt. Die Marken sind <code>::after</code>-Inhalte, keine Bilder.',
  },
  mobile: { en: 'The label wraps the input, so the whole row is the tap target.', de: 'Das Label umschließt das Input, die ganze Zeile ist also die Trefferfläche.' },
  html: W => `<div style="display:flex;gap:32px;flex-wrap:wrap">
  <div>
    <label class="nk-check"><input type="checkbox" checked>${W.option1}</label>
    <label class="nk-check"><input type="checkbox">${W.option2}</label>
  </div>
  <div>
    <label class="nk-check"><input type="radio" name="nkdemo" checked>${W.option1}</label>
    <label class="nk-check"><input type="radio" name="nkdemo">${W.option3}</label>
  </div>
</div>`,
},
{
  id: 'nk-slider', group: 'forms', classes: ['nk-slider', 'nk-slider-value'],
  title: { en: 'Slider', de: 'Slider' },
  desc: {
    en: 'A native range input tinted with <code>accent-color: var(--nk-accent)</code> — no custom track markup, so it keeps native keyboard and screen-reader behaviour. <code>nk-slider-value</code> is the readout.',
    de: 'Ein natives Range-Input, eingefärbt per <code>accent-color: var(--nk-accent)</code> – kein eigenes Schienen-Markup, also bleiben Tastatur und Screenreader nativ. <code>nk-slider-value</code> ist die Anzeige.',
  },
  mobile: { en: 'Native thumb sizing gives a comfortable touch target on every platform.', de: 'Die native Reglergröße liefert auf jeder Plattform eine bequeme Trefferfläche.' },
  html: W => `<div><input class="nk-slider" type="range" min="80" max="140" value="100">
<div class="nk-slider-value">${W.textSize}: 100 %</div></div>`,
},
{
  id: 'nk-field', group: 'forms', classes: ['nk-field', 'f-label', 'f-desc', 'f-control'],
  title: { en: 'Field row', de: 'Feld-Zeile' },
  desc: {
    en: 'The settings-row primitive: label and description on the left, control on the right, pushed apart by <code>justify-content: space-between</code>. Stack these to build a whole settings pane.',
    de: 'Das Grundelement einer Einstellungszeile: Label und Beschreibung links, Bedienelement rechts, auseinandergeschoben per <code>justify-content: space-between</code>. Gestapelt ergeben sie ein ganzes Einstellungs-Pane.',
  },
  mobile: { en: 'The 24px gap keeps both sides apart; add <code>flex-wrap: wrap</code> yourself if the control needs its own line.', de: 'Der 24px-Abstand hält beide Seiten getrennt; bei Bedarf selbst <code>flex-wrap: wrap</code> ergänzen, damit das Bedienelement eine eigene Zeile bekommt.' },
  html: W => `<div style="max-width:460px">
  <div class="nk-field"><div><div class="f-label">${W.displayName}</div><div class="f-desc">${W.displayNameDesc}</div></div>
    <div class="f-control"><input class="nk-input" value="${W.placeholderName}"></div></div>
  <div class="nk-field"><div><div class="f-label">${W.email}</div></div>
    <div class="f-control"><input class="nk-input" value="ada@acme.com"></div></div>
</div>`,
},
{
  id: 'nk-profile-row', group: 'forms', classes: ['nk-profile-row', 'big-avatar'],
  title: { en: 'Profile row', de: 'Profil-Zeile' },
  desc: {
    en: 'A 56px avatar with the two actions beside it. The gradient matches every other avatar in the system because they all read the same two decor tokens.',
    de: 'Ein 56px-Avatar mit zwei Aktionen daneben. Der Verlauf passt zu jedem anderen Avatar im System, weil alle dieselben zwei Decor-Tokens lesen.',
  },
  mobile: { en: 'Unchanged; the buttons wrap under the avatar on very narrow screens.', de: 'Unverändert; auf sehr schmalen Schirmen rutschen die Buttons unter den Avatar.' },
  html: W => `<div class="nk-profile-row">
  <div class="big-avatar">AL</div>
  <div style="display:flex;gap:8px;flex-wrap:wrap">
    <button class="nk-btn secondary small">${W.remove === 'Remove' ? 'Upload image' : 'Bild hochladen'}</button>
    <button class="nk-btn secondary small">${W.remove}</button>
  </div>
</div>`,
},
{
  id: 'nk-model-card', group: 'forms', classes: ['nk-model-card', 'selected', 'm-radio', 'm-name', 'm-desc'],
  title: { en: 'Model card', de: 'Modell-Karte' },
  desc: {
    en: 'A radio group rendered as cards. The selected card mixes 6 % of the accent into its background and gets an accent border — both derived, so a re-brand carries them.',
    de: 'Eine Radio-Gruppe als Karten. Die ausgewählte Karte mischt 6 % des Akzents in ihren Hintergrund und bekommt einen Akzent-Rahmen – beides abgeleitet und damit rebranding-fest.',
  },
  mobile: { en: 'Full width by nature; the description wraps under the name.', de: 'Von Haus aus volle Breite; die Beschreibung bricht unter den Namen um.' },
  html: W => `<div style="max-width:460px">
  <div class="nk-model-card selected"><div class="m-radio"></div><div>
    <div class="m-name">${W.modelName}<span class="nk-tag green">${W.modelRecommended}</span></div>
    <div class="m-desc">${W.modelDesc}</div></div></div>
  <div class="nk-model-card"><div class="m-radio"></div><div>
    <div class="m-name">Mona Deep</div><div class="m-desc">${W.modelDesc}</div></div></div>
</div>`,
},
{
  id: 'nk-danger-zone', group: 'forms', classes: ['nk-danger-zone', 'dz-title'],
  title: { en: 'Danger zone', de: 'Gefahrenbereich' },
  desc: {
    en: 'Border and title read <code>--nk-danger</code>; the border is 40 % of it via <code>color-mix()</code>, so there is no second red to keep in sync.',
    de: 'Rahmen und Titel lesen <code>--nk-danger</code>; der Rahmen ist 40 % davon per <code>color-mix()</code> – es gibt kein zweites Rot, das synchron gehalten werden müsste.',
  },
  mobile: { en: 'Unchanged.', de: 'Unverändert.' },
  html: W => `<div class="nk-danger-zone" style="margin-top:0;max-width:460px">
  <div class="dz-title">${W.dangerTitle}</div>
  <div class="nk-field" style="padding-top:0">
    <div><div class="f-label">${W.deleteIt}</div><div class="f-desc">${W.dangerText}</div></div>
    <div class="f-control"><button class="nk-btn danger-solid small">${W.deleteIt}</button></div>
  </div>
</div>`,
},
{
  id: 'nk-member-row', group: 'forms', classes: ['nk-member-list', 'nk-member-row', 'm-mail'],
  title: { en: 'Member rows', de: 'Mitglieder-Zeilen' },
  desc: {
    en: 'Rows separated by a hairline. The “no border on the last row” rule is scoped to the <code>nk-member-list</code> container and has a <code>::slotted()</code> twin, so it keeps working when a future element projects the rows.',
    de: 'Zeilen, getrennt durch eine Haarlinie. Die Regel „letzte Zeile ohne Rahmen“ hängt am Container <code>nk-member-list</code> und hat einen <code>::slotted()</code>-Zwilling – sie funktioniert also weiter, wenn ein künftiges Element die Zeilen projiziert.',
  },
  mobile: { en: 'The role select is pushed right by <code>margin-left:auto</code>; on narrow rows let it wrap.', de: 'Das Rollen-Select wird per <code>margin-left:auto</code> nach rechts geschoben; in schmalen Zeilen umbrechen lassen.' },
  html: W => `<div class="nk-member-list" style="max-width:460px">
  <div class="nk-member-row"><span class="mini-avatar" style="background:var(--nk-decor-purple)">AL</span>
    <div><div>${W.author}</div><div class="m-mail">ada@acme.com</div></div>
    <select class="nk-select"><option>${W.memberAdmin}</option><option>${W.memberRole}</option></select></div>
  <div class="nk-member-row"><span class="mini-avatar" style="background:var(--nk-decor-blue)">TW</span>
    <div><div>Tom Weber</div><div class="m-mail">tom@acme.com</div></div>
    <select class="nk-select"><option>${W.memberRole}</option></select></div>
</div>`,
}
,
// ============================================================ 5.7 SETTINGS MODAL
{
  id: 'nk-modal', group: 'modal', classes: ['nk-modal-backdrop', 'open', 'nk-modal', 'nk-settings-nav', 'nk-settings-user', 'avatar', 'u-text', 'name', 'mail', 'nk-settings-content', 'nk-settings-pane', 'active'],
  title: { en: 'Settings modal', de: 'Einstellungs-Modal' },
  desc: {
    en: 'A two-column overlay: nav left, panes right. The backdrop starts at <code>opacity: 0; pointer-events: none</code>; adding <code>.open</code> fades it in and scales the modal from 0.98 to 1. Panes switch with <code>.active</code>. The modal sizes itself – <code>min(960px, 92vw)</code> by <code>min(640px, 86vh)</code> – so it needs no inline dimensions.',
    de: 'Ein zweispaltiges Overlay: Navigation links, Panes rechts. Der Backdrop startet mit <code>opacity: 0; pointer-events: none</code>; <code>.open</code> blendet ihn ein und skaliert das Modal von 0.98 auf 1. Panes wechseln über <code>.active</code>. Das Modal bemisst sich selbst – <code>min(960px, 92vw)</code> mal <code>min(640px, 86vh)</code> – und braucht keine Inline-Maße.',
  },
  mobile: {
    en: 'Below 860px the nav shrinks to a 60px icon rail — labels, section labels and the user’s name/mail block (<code>.u-text</code>) are hidden, and content padding drops to 24px.',
    de: 'Unter 860px schrumpft die Navigation auf eine 60px-Icon-Leiste – Labels, Abschnitts-Label und der Name/Mail-Block des Nutzers (<code>.u-text</code>) verschwinden, das Inhalts-Padding fällt auf 24px.',
  },
  frame: 380, relativeFrame: true,
  html: W => `<div class="nk-modal-backdrop open" style="position:absolute;border-radius:var(--nk-radius)">
  <div class="nk-modal" style="width:96%;height:92%">
    <nav class="nk-settings-nav">
      <div class="nk-settings-user"><div class="avatar">AL</div>
        <div class="u-text"><div class="name">${W.author}</div><div class="mail">ada@acme.com</div></div></div>
      <div class="nk-section-label">${W.settings}</div>
      <div class="nk-tree-item active"><span class="icon">👤</span><span class="label">${W.displayName}</span></div>
      <div class="nk-tree-item"><span class="icon">🎨</span><span class="label">${W.option1}/${W.option2}</span></div>
      <div class="nk-tree-item"><span class="icon">🤖</span><span class="label">${W.ai}</span></div>
    </nav>
    <div class="nk-settings-content" style="padding:24px 28px">
      <div class="nk-settings-pane active">
        <h2>${W.displayName}</h2>
        <div class="nk-field"><div><div class="f-label">${W.displayName}</div><div class="f-desc">${W.displayNameDesc}</div></div>
          <div class="f-control"><input class="nk-input" value="${W.placeholderName}"></div></div>
        <div class="nk-field"><div><div class="f-label">${W.compactView}</div></div>
          <div class="f-control"><button class="nk-switch" role="switch" aria-checked="true"></button></div></div>
      </div>
    </div>
  </div>
</div>`,
},
// ============================================================ 5.8 OVERLAYS
{
  id: 'nk-pop', group: 'overlay', classes: ['nk-pop'],
  title: { en: 'Popover base', de: 'Popover-Basis' },
  desc: {
    en: 'The shared surface under every floating panel: page background, 10px radius, the three-layer menu shadow. Positioning is the consumer’s job — the class only supplies the surface.',
    de: 'Die gemeinsame Fläche unter jedem schwebenden Panel: Seitenhintergrund, 10px Radius, der dreilagige Menü-Schatten. Die Positionierung übernimmt der Consumer – die Klasse liefert nur die Fläche.',
  },
  mobile: { en: 'Fixed 296px width. On a phone, either widen it or anchor it to the viewport edge.', de: 'Feste 296px Breite. Auf dem Handy entweder verbreitern oder am Viewport-Rand verankern.' },
  html: W => `<div class="nk-pop" style="width:240px">
  <div class="nk-menu-label">${W.actions}</div>
  <div class="nk-menu-item"><span class="m-icon">✏️</span>${W.rename}</div>
</div>`,
},
{
  id: 'nk-emoji-grid', group: 'overlay', classes: ['nk-emoji-search', 'nk-emoji-grid', 'nk-emoji-cats'],
  title: { en: 'Emoji picker', de: 'Emoji-Picker' },
  desc: {
    en: 'An eight-column grid inside <code>nk-pop</code>, with a filter field above and a greyed-out category strip below. Categories light up on hover or with <code>.active</code>.',
    de: 'Ein achtspaltiges Raster in <code>nk-pop</code>, darüber ein Filterfeld, darunter eine ausgegraute Kategorieleiste. Kategorien leuchten beim Hovern oder mit <code>.active</code> auf.',
  },
  mobile: { en: 'The grid is fluid; only the 296px popover width is fixed, so widen the popover rather than the grid.', de: 'Das Raster ist fließend; fix ist nur die 296px-Popover-Breite – also das Popover verbreitern, nicht das Raster.' },
  html: W => `<div class="nk-pop">
  <input class="nk-emoji-search" placeholder="${W.search} …">
  <div class="nk-emoji-grid">
    ${'🚀 📊 💡 ✅ 🎨 📚 🗂️ 🔍 📥 ⚙️ 🧩 🌙 ☀️ 📅 👤 💬'.split(' ').map(e => `<span>${e}</span>`).join('')}
  </div>
  <div class="nk-emoji-cats"><span class="active">🕐</span><span>😀</span><span>🐶</span><span>🍎</span><span>⚽</span><span>🚗</span><span>💡</span></div>
</div>`,
},
{
  id: 'nk-menu', group: 'overlay', classes: ['nk-menu', 'nk-menu-item', 'm-icon', 'm-shortcut', 'danger', 'nk-menu-sep', 'nk-menu-label'],
  title: { en: 'Context menu', de: 'Kontextmenü' },
  desc: {
    en: 'Combine <code>nk-pop</code> with <code>nk-menu</code>. Items take an <code>.m-icon</code> on the left and an <code>.m-shortcut</code> pushed right; <code>.danger</code> turns an item red.',
    de: '<code>nk-pop</code> mit <code>nk-menu</code> kombinieren. Einträge nehmen links ein <code>.m-icon</code> und rechts ein <code>.m-shortcut</code>; <code>.danger</code> färbt einen Eintrag rot.',
  },
  mobile: { en: 'Shortcuts are meaningless on touch — hide the <code>.m-shortcut</code> spans there.', de: 'Kürzel sind auf Touch bedeutungslos – die <code>.m-shortcut</code>-Spans dort ausblenden.' },
  html: W => `<div class="nk-pop nk-menu">
  <div class="nk-menu-label">${W.pages}</div>
  <div class="nk-menu-item"><span class="m-icon">✏️</span>${W.rename}<span class="m-shortcut">⌘⇧R</span></div>
  <div class="nk-menu-item"><span class="m-icon">📄</span>${W.duplicate}<span class="m-shortcut">⌘D</span></div>
  <div class="nk-menu-item"><span class="m-icon">🔗</span>${W.copyLink}<span class="m-shortcut">⌘L</span></div>
  <div class="nk-menu-sep"></div>
  <div class="nk-menu-item danger"><span class="m-icon">🗑</span>${W.moveToTrash}</div>
</div>`,
},
{
  id: 'nk-cmdk', group: 'overlay', classes: ['nk-cmdk-backdrop', 'nk-cmdk', 'nk-cmdk-input-row', 'nk-cmdk-list', 'nk-cmdk-group', 'nk-cmdk-item', 'selected', 'nk-cmdk-empty', 'nk-cmdk-footer'],
  title: { en: 'Command palette', de: 'Befehlspalette' },
  desc: {
    en: 'A ⌘K palette: input row, grouped list, footer with key hints. The keyboard-highlighted row carries <code>.selected</code> — that is the class your arrow-key handler moves around.',
    de: 'Eine ⌘K-Palette: Eingabezeile, gruppierte Liste, Fußzeile mit Tastenhinweisen. Die per Tastatur hervorgehobene Zeile trägt <code>.selected</code> – diese Klasse verschiebt dein Pfeiltasten-Handler.',
  },
  mobile: {
    en: 'The backdrop’s <code>padding-top</code> drops from 14vh to 6vh and the palette widens to <code>min(560px, 96vw)</code>, so it fills a phone screen instead of floating in the middle.',
    de: 'Das <code>padding-top</code> des Backdrops fällt von 14vh auf 6vh, und die Palette verbreitert sich auf <code>min(560px, 96vw)</code> – sie füllt den Handyschirm, statt mittig zu schweben.',
  },
  frame: 400, relativeFrame: true,
  html: W => `<div class="nk-cmdk-backdrop open" style="position:absolute;padding-top:22px;border-radius:var(--nk-radius)">
<div class="nk-cmdk" style="width:min(460px, 92%)">
  <div class="nk-cmdk-input-row"><span>🔍</span><input placeholder="${W.cmdkPlaceholder}"></div>
  <div class="nk-cmdk-list">
    <div class="nk-cmdk-group">${W.pages}</div>
    <div class="nk-cmdk-item selected"><span class="m-icon">📊</span>${W.projectOverview}</div>
    <div class="nk-cmdk-item"><span class="m-icon">📚</span>${W.knowledgeBase}</div>
    <div class="nk-cmdk-group">${W.actions}</div>
    <div class="nk-cmdk-item"><span class="m-icon">＋</span>${W.newPageCmd}<span class="m-shortcut">⌘N</span></div>
    <div class="nk-cmdk-item"><span class="m-icon">⚙️</span>${W.openSettings}<span class="m-shortcut">⌘,</span></div>
  </div>
  <div class="nk-cmdk-footer">
    <span><kbd class="nk-kbd">↑</kbd><kbd class="nk-kbd">↓</kbd> ${W.navigate}</span>
    <span><kbd class="nk-kbd">↵</kbd> ${W.open}</span>
    <span><kbd class="nk-kbd">⌘</kbd><kbd class="nk-kbd">K</kbd> ${W.toggle}</span>
  </div>
</div>
</div>`,
},
{
  id: 'nk-cmdk-empty', group: 'overlay', classes: ['nk-cmdk-empty'],
  title: { en: 'Palette: no results', de: 'Palette: keine Treffer' },
  desc: {
    en: 'What the list shows when the filter matches nothing. Quote the query back so the person can see what was searched for.',
    de: 'Was die Liste zeigt, wenn der Filter nichts trifft. Die Eingabe zurückzitieren, damit sichtbar ist, wonach gesucht wurde.',
  },
  mobile: { en: 'Same as the palette: full width, reduced top padding.', de: 'Wie die Palette: volle Breite, reduziertes oberes Padding.' },
  html: W => `<div class="nk-cmdk" style="box-shadow:none;border:1px solid var(--nk-border);width:min(460px,100%)">
  <div class="nk-cmdk-input-row"><span>🔍</span><input value="xyzzy" placeholder="${W.cmdkPlaceholder}"></div>
  <div class="nk-cmdk-list"><div class="nk-cmdk-empty">${W.noResults} “xyzzy”</div></div>
</div>`,
},
{
  id: 'nk-toast', group: 'overlay', classes: ['nk-toast', 'show'],
  title: { en: 'Toast', de: 'Toast' },
  desc: {
    en: 'Fixed to the bottom centre, inverted (text colour as background). It sits off-screen until <code>.show</code> is added, then slides up. <code>pointer-events: none</code> keeps it from stealing clicks.',
    de: 'Unten mittig fixiert, invertiert (Textfarbe als Hintergrund). Er sitzt außerhalb des Bildes, bis <code>.show</code> ergänzt wird, und fährt dann hoch. <code>pointer-events: none</code> verhindert, dass er Klicks abfängt.',
  },
  mobile: { en: 'Centred by <code>translateX(-50%)</code>, so it stays centred at any width.', de: 'Per <code>translateX(-50%)</code> zentriert und bleibt es in jeder Breite.' },
  html: W => `<div class="nk-toast show" style="position:relative;bottom:auto;left:auto;transform:none;display:inline-flex">✓ <span>${W.toastMsg}</span></div>`,
}
,
// ============================================================ 5.9 GALLERY
{
  id: 'nk-gallery-grid', group: 'gallery', classes: ['nk-gallery-grid', 'nk-g-item'],
  title: { en: 'Gallery grid', de: 'Galerie-Raster' },
  desc: {
    en: 'A fluid <code>repeat(auto-fit, minmax(min(280px, 100%), 1fr))</code> grid. There is no breakpoint here on purpose: the number of columns follows the container, not the viewport.',
    de: 'Ein fließendes <code>repeat(auto-fit, minmax(min(280px, 100%), 1fr))</code>-Raster. Bewusst ohne Breakpoint: Die Spaltenzahl folgt dem Container, nicht dem Viewport.',
  },
  mobile: { en: 'Falls to one column as soon as the container drops under ~600px — no media query involved.', de: 'Fällt auf eine Spalte, sobald der Container unter ~600px rutscht – ganz ohne Media Query.' },
  html: W => `<div class="nk-gallery-grid">
  <div class="nk-g-item"><h4>${W.activePages}</h4><div class="nk-stat"><div class="s-label">${W.thisWeek}</div><div class="s-value">128</div></div></div>
  <div class="nk-g-item"><h4>${W.openTasks}</h4><div class="nk-stat"><div class="s-label">${W.thisWeek}</div><div class="s-value">17</div></div></div>
</div>`,
},
{
  id: 'nk-tabs', group: 'gallery', classes: ['nk-tabs', 'nk-tab', 'active', 'nk-tab-panel'],
  title: { en: 'Tabs', de: 'Reiter' },
  desc: {
    en: 'In-page tabs, visually the quieter sibling of the database view tabs. Show and hide the panels yourself; the library only styles them.',
    de: 'Reiter innerhalb der Seite, optisch das ruhigere Geschwister der Datenbank-Reiter. Das Ein- und Ausblenden der Panels übernimmst du; die Library stylt nur.',
  },
  mobile: { en: 'Add <code>overflow-x: auto</code> to <code>nk-tabs</code> when the strip gets long.', de: 'Bei langer Leiste <code>overflow-x: auto</code> an <code>nk-tabs</code> geben.' },
  html: W => `<div>
  <div class="nk-tabs"><div class="nk-tab active">📝 ${W.notes}</div><div class="nk-tab">✅ ${W.tasks}</div><div class="nk-tab">📎 ${W.files}</div></div>
  <div class="nk-tab-panel">${W.tabPanelBody}</div>
</div>`,
},
{
  id: 'nk-template-btn', group: 'gallery', classes: ['nk-template-btn'],
  title: { en: 'Template button', de: 'Template-Button' },
  desc: {
    en: 'A full-width, left-aligned button on the callout background — the “insert a prepared block” affordance inside a document.',
    de: 'Ein linksbündiger Button über die volle Breite auf Callout-Hintergrund – die Geste „vorbereiteten Block einfügen“ im Dokument.',
  },
  mobile: { en: 'Full width by default, so nothing to adjust.', de: 'Von Haus aus volle Breite – nichts anzupassen.' },
  html: W => `<div style="max-width:420px">
  <button class="nk-template-btn">${W.insertWeek}</button>
  <button class="nk-template-btn">${W.insertMinutes}</button>
</div>`,
},
{
  id: 'nk-stats', group: 'gallery', classes: ['nk-stats', 'nk-stat', 's-label', 's-value', 's-delta', 'up', 'down'],
  title: { en: 'Stat cards', de: 'Statistik-Karten' },
  desc: {
    en: 'Equal-width cards in a flex row. <code>.s-delta.up</code> takes the green tag colour, <code>.down</code> takes <code>--nk-danger</code> — so the direction is a class, never an inline style.',
    de: 'Gleich breite Karten in einer flex-Zeile. <code>.s-delta.up</code> nimmt die grüne Tag-Farbe, <code>.down</code> nimmt <code>--nk-danger</code> – die Richtung ist eine Klasse, nie ein Inline-Style.',
  },
  mobile: { en: 'The row does not wrap on its own; the 860px breakpoint adds <code>flex-wrap: wrap</code> so cards stack.', de: 'Die Zeile bricht nicht von selbst um; der 860px-Breakpoint ergänzt <code>flex-wrap: wrap</code>, damit die Karten stapeln.' },
  html: W => `<div class="nk-stats">
  <div class="nk-stat"><div class="s-label">${W.activePages}</div><div class="s-value">128</div><div class="s-delta up">▲ 12 ${W.thisWeek}</div></div>
  <div class="nk-stat"><div class="s-label">${W.aiRequests}</div><div class="s-value">1 204</div><div class="s-delta up">▲ 8 %</div></div>
  <div class="nk-stat"><div class="s-label">${W.openTasks}</div><div class="s-value">17</div><div class="s-delta down">▼ 5 ${W.sinceYesterday}</div></div>
</div>`,
},
{
  id: 'nk-synced', group: 'gallery', classes: ['nk-synced', 'synced-badge'],
  title: { en: 'Synced block', de: 'Synced-Block' },
  desc: {
    en: 'Content mirrored across several pages, marked by a danger-coloured outline and a badge notched into the top edge. The border is 55 % of <code>--nk-danger</code>.',
    de: 'Inhalt, der auf mehreren Seiten gespiegelt wird – markiert durch eine Kontur in Danger-Farbe und ein Badge, das in die Oberkante eingelassen ist. Der Rahmen sind 55 % von <code>--nk-danger</code>.',
  },
  mobile: { en: 'The badge is absolutely positioned at the top-right and stays there at any width.', de: 'Das Badge ist oben rechts absolut positioniert und bleibt dort in jeder Breite.' },
  html: W => `<div class="nk-synced" style="max-width:420px">
  <span class="synced-badge">${W.syncedBadge}</span>
  ${W.syncedBody}
</div>`,
},
{
  id: 'nk-segmented', group: 'gallery', classes: ['nk-segmented', 'active'],
  title: { en: 'Segmented control', de: 'Segment-Auswahl' },
  desc: {
    en: 'A small set of mutually exclusive options. The active segment lifts out of the track with the page background and a one-pixel shadow.',
    de: 'Eine kleine Menge sich ausschließender Optionen. Das aktive Segment hebt sich mit dem Seitenhintergrund und einem Ein-Pixel-Schatten aus der Schiene.',
  },
  mobile: { en: '<code>inline-flex</code>, so it shrinks to its content; keep it to three or four segments.', de: '<code>inline-flex</code>, es schrumpft also auf seinen Inhalt; bei drei, vier Segmenten bleiben.' },
  html: W => `<div class="nk-segmented">
  <button class="active">${W.week}</button><button>${W.month}</button><button>${W.quarter}</button>
</div>`,
},
{
  id: 'nk-banner', group: 'gallery', classes: ['nk-banner', 'info', 'success', 'warning', 'b-action'],
  title: { en: 'Banner', de: 'Banner' },
  desc: {
    en: 'A full-width notice in three semantic tones, each reusing a tag colour pair. <code>.b-action</code> pushes an underlined action to the right edge.',
    de: 'Ein Hinweis über die volle Breite in drei semantischen Tönen, jeder nutzt ein Tag-Farbpaar wieder. <code>.b-action</code> schiebt eine unterstrichene Aktion an den rechten Rand.',
  },
  mobile: { en: 'The action stays on the same line; wrap the banner content yourself if it gets crowded.', de: 'Die Aktion bleibt in derselben Zeile; bei Enge den Banner-Inhalt selbst umbrechen lassen.' },
  html: W => `<div class="nk-banner info">ℹ️ ${W.bannerInfo}<span class="b-action">${W.bannerAction}</span></div>
<div class="nk-banner success">✅ ${W.bannerSuccess}</div>
<div class="nk-banner warning">⚠️ ${W.bannerWarning}<span class="b-action">${W.bannerAction}</span></div>`,
},
{
  id: 'nk-avatar-group', group: 'gallery', classes: ['nk-avatar-group', 'mini-avatar', 'more'],
  title: { en: 'Avatar group', de: 'Avatar-Gruppe' },
  desc: {
    en: 'Overlapping avatars with a page-coloured ring, so they read as a stack. The <code>:first-child</code> reset lives inside the group and has a <code>::slotted()</code> twin.',
    de: 'Überlappende Avatare mit einem Ring in Seitenfarbe, damit sie als Stapel lesbar sind. Der <code>:first-child</code>-Reset liegt in der Gruppe und hat einen <code>::slotted()</code>-Zwilling.',
  },
  mobile: { en: 'Unchanged. Cap the count and let <code>.more</code> carry the remainder.', de: 'Unverändert. Die Anzahl deckeln und den Rest über <code>.more</code> anzeigen.' },
  html: W => `<div style="display:flex;align-items:center;gap:10px">
  <div class="nk-avatar-group">
    <span class="mini-avatar" style="background:var(--nk-decor-purple)">AL</span>
    <span class="mini-avatar" style="background:var(--nk-decor-blue)">TW</span>
    <span class="mini-avatar" style="background:var(--nk-tag-green-text)">SL</span>
    <span class="mini-avatar more">+2</span>
  </div>
  <span style="font-size:13px;color:var(--nk-text-tertiary)">${W.peopleAccess}</span>
</div>`,
},
{
  id: 'nk-skeleton', group: 'gallery', classes: ['nk-skeleton'],
  title: { en: 'Skeleton', de: 'Skelett' },
  desc: {
    en: 'A shimmering placeholder. Set width and height yourself. Under <code>prefers-reduced-motion: reduce</code> the animation stops and it falls back to a flat callout-coloured block.',
    de: 'Ein schimmernder Platzhalter. Breite und Höhe setzt du selbst. Unter <code>prefers-reduced-motion: reduce</code> steht die Animation still und es bleibt ein flacher Block in Callout-Farbe.',
  },
  mobile: { en: 'Use percentage widths so the placeholder matches the content it stands in for.', de: 'Prozentbreiten nutzen, damit der Platzhalter zum vertretenen Inhalt passt.' },
  html: () => `<div style="max-width:420px">
  <div class="nk-skeleton" style="height:22px;width:55%"></div>
  <div class="nk-skeleton" style="height:13px;width:100%"></div>
  <div class="nk-skeleton" style="height:13px;width:88%"></div>
  <div class="nk-skeleton" style="height:13px;width:40%"></div>
</div>`,
},
{
  id: 'nk-empty', group: 'gallery', classes: ['nk-empty', 'e-icon', 'e-title', 'e-desc'],
  title: { en: 'Empty state', de: 'Leerzustand' },
  desc: {
    en: 'A dashed frame with icon, title and one explanatory line. Meant to hold exactly one action — the way out of the empty state.',
    de: 'Ein gestrichelter Rahmen mit Icon, Titel und einer erklärenden Zeile. Gedacht für genau eine Aktion – den Weg aus dem Leerzustand heraus.',
  },
  mobile: { en: 'Centred and fluid; padding drops naturally with the container.', de: 'Zentriert und fließend; das Padding folgt dem Container.' },
  html: W => `<div class="nk-empty" style="max-width:420px">
  <div class="e-icon">🗂️</div>
  <div class="e-title">${W.emptyTitle}</div>
  <div class="e-desc">${W.emptyDesc}</div>
  <button class="nk-btn secondary small">${W.emptyBtn}</button>
</div>`,
},
// ============================================================ 5.10 COLLAB & AI
{
  id: 'nk-comments', group: 'collab', classes: ['nk-comments', 'nk-comment', 'c-head', 'c-body', 'nk-comment-input'],
  title: { en: 'Comment thread', de: 'Kommentar-Faden' },
  desc: {
    en: 'A thread hanging off a left rule, as it would beside a paragraph. Each comment is an avatar plus a head (name and time) and a body.',
    de: 'Ein Faden an einer linken Linie, wie er neben einem Absatz stehen würde. Jeder Kommentar besteht aus Avatar, Kopf (Name und Zeit) und Rumpf.',
  },
  mobile: { en: 'The 18px indent stays; place the thread below the paragraph rather than beside it on narrow screens.', de: 'Die 18px-Einrückung bleibt; auf schmalen Schirmen den Faden unter den Absatz setzen statt daneben.' },
  html: W => `<div class="nk-comments" style="max-width:420px">
  <div class="nk-comment">
    <span class="mini-avatar" style="background:var(--nk-decor-purple)">SL</span>
    <div><div class="c-head"><b>${W.commentAuthor}</b> ${W.commentWhen}</div><div class="c-body">${W.commentBody}</div></div>
  </div>
  <div class="nk-comment-input">
    <input class="nk-input" placeholder="${W.commentPlaceholder}"><button class="nk-btn primary small">${W.send}</button>
  </div>
</div>`,
},
{
  id: 'nk-ai-thread', group: 'collab', classes: ['nk-ai-thread', 'nk-ai-msg', 'user', 'a-name', 'a-body', 'nk-ai-actions', 'nk-ai-input-row', 'nk-ai-send'],
  title: { en: 'AI thread', de: 'KI-Faden' },
  desc: {
    en: 'An assistant conversation as part of the document, not a floating widget. <code>.user</code> gives the message the gradient avatar; the assistant keeps the neutral callout circle. The input row glows on <code>:focus-within</code>.',
    de: 'Ein Assistenten-Gespräch als Teil des Dokuments, kein schwebendes Widget. <code>.user</code> gibt der Nachricht den Verlauf-Avatar; der Assistent behält den neutralen Callout-Kreis. Die Eingabezeile leuchtet bei <code>:focus-within</code> auf.',
  },
  mobile: { en: 'Flows naturally. The input row is a flex line with a fixed 26px send button.', de: 'Fließt natürlich. Die Eingabezeile ist eine flex-Zeile mit fixem 26px-Sendeknopf.' },
  html: W => `<div style="max-width:460px">
  <div class="nk-ai-thread">
    <div class="nk-ai-msg user">
      <span class="mini-avatar">AL</span>
      <div><div class="a-name">${W.you}</div><div class="a-body">${W.aiUser}</div></div>
    </div>
    <div class="nk-ai-msg">
      <span class="mini-avatar">🤖</span>
      <div><div class="a-name">${W.ai} <span>${W.aiSuffix}</span></div>
        <div class="a-body">${W.aiReply}</div>
        <div class="nk-ai-actions"><button>${W.aiCopy}</button><button>${W.aiRephrase}</button></div></div>
    </div>
  </div>
  <div class="nk-ai-input-row">
    <input placeholder="${W.aiPlaceholder}"><button class="nk-ai-send">↑</button>
  </div>
</div>`,
},
// ============================================================ 5.11 EDITOR
{
  id: 'nk-block-host', group: 'editor', classes: ['nk-block-host', 'nk-block-handle', 'nk-block-actions', 'nk-drop-target'],
  title: { en: 'Block host', de: 'Block-Host' },
  desc: {
    en: 'The optical shell an editor is mounted into. It supplies the hover wash, the focus ring on <code>:focus-within</code>, a slot for a drag handle to the left of the column, and <code>.nk-drop-target</code> for drag feedback. It is behaviour-free by design.',
    de: 'Die optische Hülle, in die ein Editor eingehängt wird. Sie liefert den Hover-Hauch, den Fokusring bei <code>:focus-within</code>, einen Platz für ein Drag-Handle links der Spalte und <code>.nk-drop-target</code> für Drag-Rückmeldung. Sie ist bewusst funktionsfrei.',
  },
  mobile: { en: 'The handle sits at <code>left: -26px</code>, outside the column. On narrow screens hide it and use a long-press menu.', de: 'Das Handle sitzt bei <code>left: -26px</code>, außerhalb der Spalte. Auf schmalen Schirmen ausblenden und stattdessen ein Long-Press-Menü nutzen.' },
  note: {
    en: 'This preview is the static shell only — the ＋ / ⠿ rail here does nothing. The working version, with slash menu, drag &amp; drop and block menu, is the live editor in the <a href="docs.html#editor">docs</a>.',
    de: 'Diese Vorschau ist nur die statische Hülle – die ＋ / ⠿-Leiste hier tut nichts. Die funktionierende Fassung mit Slash-Menü, Drag &amp; Drop und Blockmenü ist der Live-Editor in der <a href="docs.html#editor">Doku</a>.',
  },
  html: W => `<div style="padding-left:48px;max-width:460px">
  <div class="nk-block-host">
    <div class="nk-block-actions show" style="top:6px;left:-46px;pointer-events:none" aria-hidden="true"><button type="button" tabindex="-1">＋</button><button type="button" class="drag" tabindex="-1">⠿</button></div>
    <div style="padding:4px 2px;line-height:1.6">${W.calloutBody.replace(/<\/?b>/g, '')}</div>
  </div>
  <div class="nk-block-host nk-drop-target">
    <span class="nk-block-handle">⠿</span>
    <div style="padding:4px 2px;color:var(--nk-text-tertiary)">${W.editorPlaceholder}</div>
  </div>
</div>`,
},
{
  id: 'nk-slash-menu', group: 'editor', classes: ['nk-slash-menu', 'nk-slash-menu-label', 'nk-slash-item', 'selected', 'nk-bubble-menu'],
  title: { en: 'Slash menu & bubble toolbar', de: 'Slash-Menü & Bubble-Toolbar' },
  desc: {
    en: 'Give your editor’s floating containers these classes and they inherit the NotionKit popover look. The same rules also target <code>.bn-suggestion-menu</code> and <code>.tippy-box</code> inside a block host, so TipTap and BlockNote need no extra markup.',
    de: 'Gib den schwebenden Containern deines Editors diese Klassen, und sie erben die NotionKit-Popover-Optik. Dieselben Regeln greifen in einem Block-Host auch auf <code>.bn-suggestion-menu</code> und <code>.tippy-box</code> – TipTap und BlockNote brauchen also kein Zusatz-Markup.',
  },
  mobile: { en: 'Fixed 280px width. Anchor it to the viewport edge on a phone rather than to the caret.', de: 'Feste 280px Breite. Auf dem Handy am Viewport-Rand verankern statt am Cursor.' },
  note: {
    en: 'Static markup for the look. The live, keyboard-driven version runs in the <a href="docs.html#editor">docs editor</a> — type <code>/</code> there.',
    de: 'Statisches Markup für die Optik. Die lebende, tastaturgesteuerte Fassung läuft im <a href="docs.html#editor">Doku-Editor</a> – dort <code>/</code> tippen.',
  },
  html: W => `<div style="display:flex;gap:20px;flex-wrap:wrap;align-items:flex-start">
  <div class="nk-slash-menu" style="box-shadow:none;border:1px solid var(--nk-border)">
    <div class="nk-slash-menu-label">${W.slashBasic}</div>
    <div class="nk-slash-item selected"><span class="m-icon">H1</span><div><div>${W.slashHeading}</div><div class="m-desc">${W.slashHeadingDesc}</div></div></div>
    <div class="nk-slash-item"><span class="m-icon">☑</span><div><div>${W.slashTodo}</div><div class="m-desc">${W.slashTodoDesc}</div></div></div>
    <div class="nk-slash-item"><span class="m-icon">&lt;/&gt;</span><div><div>${W.slashCode}</div><div class="m-desc">${W.slashCodeDesc}</div></div></div>
  </div>
  <div class="nk-bubble-menu" style="box-shadow:none;border:1px solid var(--nk-border)">
    <button class="active"><b>B</b></button><button><i>I</i></button><button><s>S</s></button><button>&lt;/&gt;</button><button>🔗</button>
  </div>
</div>`,
},
];
