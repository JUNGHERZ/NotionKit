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

// Month sheets for the date picker and the calendar view, written out the
// way the demo's script writes them – for the docs, with `today` fixed so
// the pages do not change from day to day. Weeks start on Monday.
const pad2 = n => String(n).padStart(2, '0');
const isoDay = d => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
function isoWeekOf(d) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7));
  return Math.ceil(((t - Date.UTC(t.getUTCFullYear(), 0, 1)) / 864e5 + 1) / 7);
}
const CHEVRON = { prev: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>', next: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>' };
function monthOf(W, month) {
  const fmt = (o, d) => new Intl.DateTimeFormat(W.locale, o).format(d);
  const [y, m] = month.split('-').map(Number), first = new Date(y, m - 1, 1), offset = (first.getDay() + 6) % 7;
  const weekdays = Array.from({ length: 7 }, (_, i) => fmt({ weekday: 'short' }, new Date(2026, 5, 1 + i)).replace('.', ''));
  return { fmt, m, first, weekdays, day: i => new Date(y, m - 1, 1 - offset + i), rows: Math.ceil((offset + new Date(y, m, 0).getDate()) / 7) };
}
const calHead = (W, title, cls) => `<div class="${cls}-head"><div class="${cls}-title">${title}</div><button class="cal-nav">${W.calToday}</button><button class="cal-nav" aria-label="${W.calPrev}">${CHEVRON.prev}</button><button class="cal-nav" aria-label="${W.calNext}">${CHEVRON.next}</button></div>`;
function calendarMarkup(W, { month, value, start, end, today, off = {}, marks = {}, foot = '' }) {
  const g = monthOf(W, month);
  const rows = [`<span class="cal-wd">${W.calWeek}</span>` + g.weekdays.map(w => `<span class="cal-wd">${w.slice(0, 2)}</span>`).join('')];
  for (let r = 0; r < 6; r++) {
    let row = `<span class="cal-week">${isoWeekOf(g.day(r * 7))}</span>`;
    for (let c = 0; c < 7; c++) {
      const d = g.day(r * 7 + c), iso = isoDay(d), dots = (marks[iso] || []).map(t => `<i class="${t}"></i>`).join('');
      const cls = ['cal-day', d.getMonth() !== g.m - 1 && 'out', (d.getDay() % 6 === 0 || off[iso]) && 'off', iso === today && 'today',
        iso === value && 'selected', iso === start && 'start', iso === end && 'end', start && end && iso > start && iso < end && 'in-range'].filter(Boolean).join(' ');
      row += `<button class="${cls}"${off[iso] ? ` title="${off[iso]}"` : ''}>${d.getDate()}${dots ? `<span class="cal-marks">${dots}</span>` : ''}</button>`;
    }
    rows.push(row);
  }
  return `<div class="nk-calendar weeks">
    ${calHead(W, g.fmt({ month: 'long', year: 'numeric' }, g.first), 'cal')}
    <div class="cal-grid">
      ${rows.join('\n      ')}
    </div>${foot}
  </div>`;
}
function calendarViewMarkup(W, { month, today, items = {} }) {
  const g = monthOf(W, month);
  const rows = [`<div class="cv-wd">${W.calWeek}</div>` + g.weekdays.map(w => `<div class="cv-wd">${w}</div>`).join('')];
  for (let r = 0; r < g.rows; r++) {
    let row = `<div class="cv-week">${isoWeekOf(g.day(r * 7))}</div>`;
    for (let c = 0; c < 7; c++) {
      const d = g.day(r * 7 + c), iso = isoDay(d);
      const cls = ['cv-day', d.getMonth() !== g.m - 1 && 'out', iso === today && 'today'].filter(Boolean).join(' ');
      row += `<div class="${cls}"><span class="cv-num">${d.getDate()}</span>${(items[iso] || []).map(t => `<button class="cv-item">${t}</button>`).join('')}</div>`;
    }
    rows.push(row);
  }
  return `<div class="nk-calendar-view weeks">
  ${calHead(W, g.fmt({ month: 'long', year: 'numeric' }, g.first), 'cv')}
  <div class="cv-grid">
    ${rows.join('\n    ')}
  </div>
</div>`;
}

export const CATALOG = [
// ============================================================ 5.1 APP SHELL
{
  id: 'nk-app', group: 'shell', classes: ['nk-app', 'nk-sidebar', 'nk-sidebar-scroll', 'nk-sidebar-footer', 'nk-main', 'nk-sidebar-backdrop', 'nk-sidebar-toggle', 'open'],
  title: { en: 'App shell', de: 'App-Shell' },
  desc: {
    en: '<code>nk-app</code> is a full-height flex row: sidebar left, main column right. It is the outermost element of a workspace app and the only place a fixed height belongs. Inside the sidebar, <code>nk-sidebar-scroll</code> is the scrolling tree area and <code>nk-sidebar-footer</code> the pinned bottom (Settings, Trash).',
    de: '<code>nk-app</code> ist eine flex-Zeile über die volle Höhe: Sidebar links, Hauptspalte rechts. Es ist das äußerste Element einer Workspace-App und der einzige Ort, an den eine feste Höhe gehört. In der Sidebar ist <code>nk-sidebar-scroll</code> der scrollende Baumbereich und <code>nk-sidebar-footer</code> der fixierte Fuß (Einstellungen, Papierkorb).',
  },
  mobile: {
    en: 'Below 860px the sidebar steps aside and the main column takes the full width. <code>.open</code> brings it back as an off-canvas drawer over the page, with a <code>.nk-sidebar-backdrop</code> as its scrim: it slides in and the scrim fades, CSS only. The ☰ that opens it is a <code>.nk-topbar-btn.nk-sidebar-toggle</code> at the start of the topbar, shown on phones only; toggle <code>.open</code> on sidebar and backdrop, close on the backdrop, Escape and a chosen page. The height is <code>100dvh</code> with a <code>100vh</code> fallback, so a standalone PWA on iOS does not count the status bar into the shell. Safe areas are handled per surface, not on <code>nk-app</code>: topbar, page, sidebar and tab bar pad their content by the left/right insets (Dynamic Island in landscape) while their backgrounds run edge to edge.',
    de: 'Unter 860px tritt die Sidebar zur Seite, die Hauptspalte nimmt die volle Breite. <code>.open</code> holt sie als Off-Canvas-Schublade über die Seite zurück, mit einem <code>.nk-sidebar-backdrop</code> als Abdunklung: Sie gleitet herein und die Abdunklung blendet ein, nur mit CSS. Das ☰, das sie öffnet, ist ein <code>.nk-topbar-btn.nk-sidebar-toggle</code> am Anfang der Topbar, nur auf dem Telefon sichtbar; <code>.open</code> an Sidebar und Backdrop umschalten, schließen über den Backdrop, Escape und eine gewählte Seite. Die Höhe ist <code>100dvh</code> mit <code>100vh</code>-Fallback, damit eine Standalone-PWA auf iOS die Statusleiste nicht in die Shell einrechnet. Safe-Areas behandelt jede Fläche selbst, nicht <code>nk-app</code>: Topbar, Seite, Sidebar und Tab-Bar rücken ihren Inhalt um die linken/rechten Insets ein (Dynamic Island im Querformat), ihre Hintergründe laufen weiter bis zum Rand.',
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
      <button class="nk-topbar-btn nk-sidebar-toggle" aria-label="Menu">☰</button>
      <div class="nk-breadcrumb"><span class="crumb current">📊 ${W.projectOverview}</span></div>
      <div class="nk-topbar-actions"><button class="nk-topbar-btn nk-share-btn">${W.share}</button></div>
    </header>
    <div class="nk-page-scroll"><div class="nk-page" style="padding-top:16px">
      <h1 class="nk-page-title" style="font-size:28px">${W.pageTitle}</h1>
      <p class="lead">${W.lead}</p>
    </div></div>
  </main>
</div>`,
  after: W => `<pre class="nk-code"><span class="lang">html</span>&lt;div class="nk-sidebar-backdrop open"&gt;&lt;/div&gt;   &lt;!-- phones: the drawer's scrim --&gt;
&lt;aside class="nk-sidebar open"&gt;…&lt;/aside&gt;         &lt;!-- slides in over the page --&gt;
&lt;button class="nk-topbar-btn nk-sidebar-toggle" aria-label="Menu"&gt;☰&lt;/button&gt;</pre>`,
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
  id: 'nk-topbar', group: 'shell', classes: ['nk-topbar', 'nk-topbar-actions', 'nk-topbar-btn', 'nk-topbar-meta', 'nk-share-btn', 'nk-theme-toggle'],
  title: { en: 'Topbar', de: 'Topbar' },
  desc: {
    en: 'A 44px-high row holding the breadcrumb on the left and actions on the right. <code>nk-topbar-actions</code> pushes itself right with <code>margin-left:auto</code>, so you never need a spacer. Passive text among the actions – "Edited 2 min ago" – is <code>nk-topbar-meta</code>.',
    de: 'Eine 44px hohe Zeile: links der Breadcrumb, rechts die Aktionen. <code>nk-topbar-actions</code> schiebt sich per <code>margin-left:auto</code> nach rechts – ein Platzhalter ist nie nötig. Reiner Text zwischen den Aktionen – „Bearbeitet vor 2 Min.“ – ist <code>nk-topbar-meta</code>.',
  },
  mobile: { en: 'Below 860px the topbar keeps the page and its actions, as Notion\'s mobile app does: only the last crumb stays and ends in an ellipsis, <code>nk-topbar-meta</code> hides.', de: 'Unter 860px bleiben die Seite und ihre Aktionen, wie in Notions Mobil-App: Nur der letzte Crumb bleibt und endet mit Auslassungspunkten, <code>nk-topbar-meta</code> wird ausgeblendet.' },
  html: W => `<header class="nk-topbar" style="border:1px solid var(--nk-border);border-radius:var(--nk-radius)">
  <div class="nk-breadcrumb">
    <span class="crumb">📊 ${W.projectOverview}</span><span class="sep">/</span><span class="crumb current">🚀 ${W.roadmap}</span>
  </div>
  <div class="nk-topbar-actions">
    <span class="nk-topbar-meta">${W.lastEdited}</span>
    <button class="nk-topbar-btn">💬</button>
    <button class="nk-topbar-btn nk-share-btn">${W.share}</button>
    <button class="nk-topbar-btn">⭐</button>
    <button class="nk-topbar-btn nk-theme-toggle">🌙</button>
    <button class="nk-topbar-btn">⋯</button>
  </div>
</header>`,
},
{
  id: 'nk-tab-bar', group: 'shell', classes: ['nk-tab-bar', 'nk-tab-bar-item', 'nk-tab-bar-spacer', 'icon', 'label', 'active', 'always', 'fixed', 'floating'],
  title: { en: 'Tab bar (mobile)', de: 'Tab-Bar (mobil)' },
  desc: {
    en: 'The thumb-reachable twin of the sidebar for phones and installed PWAs: up to five destinations in a row, each an icon over a short label, the current one in <code>--nk-accent</code>. Put it last inside <code>nk-main</code> – it sits below the scrolling page and never moves. In a document that scrolls itself it sticks to the viewport bottom. <code>floating</code> makes it a capsule; <code>fixed</code> pins it to the viewport bottom for standalone PWAs, with a <code>.nk-tab-bar-spacer</code> right after it keeping its height (<code>--nk-tab-bar-height</code> plus the safe area) in the flow. The fifth item usually opens the sidebar as a drawer.',
    de: 'Der daumenfreundliche Zwilling der Sidebar für Telefone und installierte PWAs: bis zu fünf Ziele in einer Reihe, jedes ein Icon über einer kurzen Beschriftung, das aktuelle in <code>--nk-accent</code>. Als letztes Kind von <code>nk-main</code> sitzt sie unter der scrollenden Seite und bewegt sich nie. In einem Dokument, das selbst scrollt, klebt sie am unteren Viewport-Rand. <code>floating</code> macht sie zur Kapsel; <code>fixed</code> heftet sie für Standalone-PWAs an den unteren Viewport-Rand, ein <code>.nk-tab-bar-spacer</code> direkt dahinter hält ihre Höhe (<code>--nk-tab-bar-height</code> plus Safe-Area) im Fluss frei. Der fünfte Eintrag öffnet meist die Sidebar als Schublade.',
  },
  mobile: {
    en: 'Visible only below 860px – above, the sidebar takes over and the bar is <code>display: none</code>. <code>always</code> shows it at every width, as in this preview. On phones with a home indicator the bottom padding is the larger of 6px and <code>env(safe-area-inset-bottom)</code>, so the labels end where iOS ends its own tab bar; in landscape the side padding grows to the left/right insets (Dynamic Island) while the background still runs edge to edge.',
    de: 'Nur unter 860px sichtbar – darüber übernimmt die Sidebar, die Bar ist <code>display: none</code>. <code>always</code> zeigt sie in jeder Breite, wie in dieser Vorschau. Auf Telefonen mit Home-Indikator ist das untere Padding das Größere aus 6px und <code>env(safe-area-inset-bottom)</code>, die Beschriftungen enden also dort, wo iOS seine eigene Tab-Bar enden lässt; im Querformat wächst das seitliche Padding auf die linken/rechten Insets (Dynamic Island), der Hintergrund läuft weiter bis zum Rand.',
  },
  html: W => `<div style="max-width:390px;border:1px solid var(--nk-border);border-radius:12px;overflow:hidden">
  <nav class="nk-tab-bar always">
    <button class="nk-tab-bar-item active"><span class="icon">🏠</span><span class="label">${W.home}</span></button>
    <button class="nk-tab-bar-item"><span class="icon">📥</span><span class="label">${W.inbox}</span></button>
    <button class="nk-tab-bar-item"><span class="icon">🔍</span><span class="label">${W.search}</span></button>
    <button class="nk-tab-bar-item"><span class="icon">⚙️</span><span class="label">${W.settings}</span></button>
    <button class="nk-tab-bar-item"><span class="icon">☰</span><span class="label">${W.more}</span></button>
  </nav>
</div>
<pre class="nk-code" style="margin-top:12px"><span class="lang">html</span>&lt;nav class="nk-tab-bar fixed"&gt;…&lt;/nav&gt;&lt;div class="nk-tab-bar-spacer"&gt;&lt;/div&gt;</pre>`,
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
  id: 'nk-page', group: 'page', classes: ['nk-page-scroll', 'nk-page', 'nk-page-icon', 'nk-page-title', 'nk-page-meta', 'covered', 'full', 'small'],
  title: { en: 'Page column & page options', de: 'Seitenspalte & Seitenoptionen' },
  desc: {
    en: 'The document column: <code>max-width: 760px</code> with auto margins, never a fixed width. After a cover (<code>.nk-cover + .nk-page</code>, or <code>.nk-page.covered</code>) the icon pulls itself up over it with a negative margin and the page has no top padding; without one the page keeps 24px top padding and the icon sits inside it, fully visible. The title is <code>contenteditable</code>-ready. Notion\'s two page options are classes on the page: <code>full</code> lifts the 760px cap so the column fills the window, <code>small</code> sets the document text from 16px to 14px, and headings, lead, prose and editor follow because they are sized in em. Title, properties, tables and controls keep their size. In Notion these are options of the single page, in its ⋯ menu, not app settings.',
    de: 'Die Dokumentspalte: <code>max-width: 760px</code> mit Auto-Rändern, nie eine feste Breite. Nach einem Cover (<code>.nk-cover + .nk-page</code> oder <code>.nk-page.covered</code>) zieht sich das Icon per negativem Rand darüber und die Seite hat kein oberes Padding; ohne Cover behält die Seite 24px oberes Padding und das Icon sitzt darin, ganz sichtbar. Der Titel ist <code>contenteditable</code>-fähig. Notions zwei Seitenoptionen sind Klassen an der Seite: <code>full</code> hebt die 760px-Grenze auf, die Spalte füllt das Fenster, <code>small</code> setzt den Dokumenttext von 16px auf 14px, und Überschriften, Lead, Prosa und Editor ziehen mit, weil sie in em bemessen sind. Titel, Eigenschaften, Tabellen und Bedienelemente behalten ihre Größe. In Notion sind das Optionen der einzelnen Seite, in ihrem ⋯-Menü, keine App-Einstellungen.',
  },
  mobile: { en: 'Side padding drops from 64px to 24px below 860px. The 760px cap simply never binds, so <code>full</code> changes nothing there; <code>small</code> still does.', de: 'Der Seitenabstand fällt unter 860px von 64px auf 24px. Die 760px-Grenze greift dort schlicht nicht, <code>full</code> ändert dort also nichts; <code>small</code> schon.' },
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
  id: 'nk-props', group: 'page', classes: ['nk-props', 'nk-prop', 'p-name', 'p-icon', 'p-value'],
  title: { en: 'Page properties', de: 'Seiteneigenschaften' },
  desc: {
    en: 'The properties under the title of a database page – the pattern Notion is known for. One <code>.nk-prop</code> per row: the name with its type icon in a 160px column, the value beside it, both 34px tall with the hover wash, as each half opens its own editor in Notion. Values are ordinary markup: tags, an avatar with a name, a date, a <code>.nk-progress.wide</code>. It replaces <code>.nk-page-meta</code> on a page that is a row. Written as <code>&lt;dl&gt;</code>, <code>&lt;dt&gt;</code> and <code>&lt;dd&gt;</code> it is a description list for assistive technology as well; plain <code>&lt;div&gt;</code>s work the same.',
    de: 'Die Eigenschaften unter dem Titel einer Datenbankseite – das Muster, für das Notion bekannt ist. Ein <code>.nk-prop</code> pro Zeile: der Name mit seinem Typ-Icon in einer 160px-Spalte, daneben der Wert, beide 34px hoch mit Hover-Hauch, weil in Notion jede Hälfte ihren eigenen Editor öffnet. Werte sind gewöhnliches Markup: Tags, ein Avatar mit Namen, ein Datum, ein <code>.nk-progress.wide</code>. Es ersetzt <code>.nk-page-meta</code> auf einer Seite, die eine Zeile ist. Als <code>&lt;dl&gt;</code>, <code>&lt;dt&gt;</code> und <code>&lt;dd&gt;</code> geschrieben ist es auch für assistive Technik eine Beschreibungsliste; schlichte <code>&lt;div&gt;</code>s funktionieren genauso.',
  },
  mobile: { en: 'Below 860px each property stacks: the name above its value, both flush left, so the value gets the whole width.', de: 'Unter 860px stapelt sich jede Eigenschaft: der Name über seinem Wert, beide linksbündig, damit der Wert die ganze Breite bekommt.' },
  html: W => `<dl class="nk-props" style="max-width:520px">
  <div class="nk-prop"><dt class="p-name"><span class="p-icon">◉</span>${W.status}</dt><dd class="p-value"><span class="nk-tag blue">${W.inProgress}</span></dd></div>
  <div class="nk-prop"><dt class="p-name"><span class="p-icon">👤</span>${W.owner}</dt><dd class="p-value"><span class="nk-avatar small purple">AL</span>${W.author}</dd></div>
  <div class="nk-prop"><dt class="p-name"><span class="p-icon">📅</span>${W.due}</dt><dd class="p-value">${W.dueDate}</dd></div>
  <div class="nk-prop"><dt class="p-name"><span class="p-icon">🏷️</span>${W.tags}</dt><dd class="p-value"><span class="nk-tag purple">${W.designSystem}</span><span class="nk-tag">CSS</span></dd></div>
  <div class="nk-prop"><dt class="p-name"><span class="p-icon">▰</span>${W.progress}</dt><dd class="p-value"><span class="nk-progress wide"><i style="width:65%"></i></span><span class="nk-progress-label">65 %</span></dd></div>
</dl>`,
},
{
  id: 'nk-cover', group: 'page', classes: ['nk-cover'],
  title: { en: 'Cover', de: 'Cover' },
  desc: {
    en: 'A 200px decorative band above the page. Three radial gradients mixed from the <code>--nk-decor-*</code> tokens over <code>--nk-bg-callout</code>. For a picture put an <code>&lt;img&gt;</code> inside: it fills the band and is cropped, never stretched, and <code>object-position</code> moves the crop, as Notion\'s “Reposition” does. The gradient stays underneath while it loads.',
    de: 'Ein 200px hohes Zierband über der Seite. Drei radiale Verläufe, gemischt aus den <code>--nk-decor-*</code>-Tokens über <code>--nk-bg-callout</code>. Für ein Bild ein <code>&lt;img&gt;</code> hineinsetzen: Es füllt das Band und wird beschnitten, nie verzerrt, und <code>object-position</code> verschiebt den Ausschnitt wie Notions „Neu positionieren“. Der Verlauf bleibt darunter, solange es lädt.',
  },
  mobile: { en: 'Fixed 200px height, full bleed. Reduce it yourself if it eats too much of a short screen.', de: 'Feste 200px Höhe, randlos. Auf kurzen Schirmen bei Bedarf selbst reduzieren.' },
  html: W => `<div class="nk-cover" style="border-radius:var(--nk-radius)"></div>
<div class="nk-cover" style="height:120px;border-radius:var(--nk-radius);margin-top:12px"><img src="${W.asset}covers/meadow.svg" alt=""></div>`,
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
  id: 'nk-bookmark', group: 'content', classes: ['nk-bookmark', 'bm-text', 'bm-title', 'bm-desc', 'bm-url', 'bm-favicon', 'bm-cover'],
  title: { en: 'Bookmark', de: 'Bookmark' },
  desc: {
    en: 'Notion\'s link block: <code>.bm-title</code>, two lines of <code>.bm-desc</code> and the <code>.bm-url</code> with its <code>.bm-favicon</code> on the left, the preview image in <code>.bm-cover</code> on the right – a third of the box, 240px at most, so a 1200×630 <code>og:image</code> fits nearly whole. The whole box is the link, an <code>&lt;a&gt;</code>; fill it from the page\'s <code>og:title</code>, <code>og:description</code> and <code>og:image</code>. Without an image the text takes the width, without a description the box gets lower. Also the way to show how a shared link will look.',
    de: 'Notions Link-Block: <code>.bm-title</code>, zwei Zeilen <code>.bm-desc</code> und die <code>.bm-url</code> mit ihrem <code>.bm-favicon</code> links, das Vorschaubild in <code>.bm-cover</code> rechts – ein Drittel der Box, höchstens 240px, sodass ein <code>og:image</code> in 1200×630 fast ganz hineinpasst. Die ganze Box ist der Link, ein <code>&lt;a&gt;</code>; gefüllt aus <code>og:title</code>, <code>og:description</code> und <code>og:image</code> der Seite. Ohne Bild nimmt der Text die Breite, ohne Beschreibung wird die Box niedriger. Auch der Weg, zu zeigen, wie ein geteilter Link aussehen wird.',
  },
  mobile: { en: 'The image keeps its third and is cropped at the centre; title and address end in an ellipsis, the description in two lines.', de: 'Das Bild behält sein Drittel und wird mittig beschnitten; Titel und Adresse enden mit Auslassungspunkten, die Beschreibung nach zwei Zeilen.' },
  html: W => `<a class="nk-bookmark" href="https://notionkit.jungherz.com" target="_blank" rel="noopener" style="max-width:600px">
  <span class="bm-text">
    <span class="bm-title">${W.bmTitle}</span>
    <span class="bm-desc">${W.bmDesc}</span>
    <span class="bm-url"><img class="bm-favicon" src="${W.asset}favicon.svg" alt=""><span>https://notionkit.jungherz.com</span></span>
  </span>
  <span class="bm-cover"><img src="${W.asset}covers/notionkit-og.jpg" alt=""></span>
</a>`,
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
  <span class="nk-mention person"><span class="nk-avatar purple">SL</span>${W.mentionPerson}</span>
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
{
  id: 'nk-prose', group: 'content', classes: ['nk-prose'],
  title: { en: 'Prose', de: 'Prosa' },
  desc: {
    en: 'Text the app did not write tag by tag – rendered Markdown, help pages, the HTML an editor saved – takes the document look from one class on its container: headings, paragraphs, lists, task lists, links, inline code, code blocks, quotes, rules, pictures and tables. It reads the very same rules as the editor adapter, so a page shown for reading and the same page in TipTap match to the pixel. Sizes are in em and follow what the text sits in: 16px on a page, 14px with <code>small</code> or in the app chrome. No outer margin on the first and last block, so it sits flush in a panel. An empty paragraph keeps its line, as it had it in the editor.',
    de: 'Text, den die App nicht Tag für Tag geschrieben hat – gerendertes Markdown, Hilfeseiten, das HTML, das ein Editor gespeichert hat – bekommt die Dokument-Optik von einer Klasse an seinem Container: Überschriften, Absätze, Listen, Aufgabenlisten, Links, Inline-Code, Code-Blöcke, Zitate, Trenner, Bilder und Tabellen. Es liest genau dieselben Regeln wie der Editor-Adapter, eine Seite zum Lesen und dieselbe Seite in TipTap decken sich also auf den Pixel. Die Größen sind in em und folgen dem, worin der Text steht: 16px auf einer Seite, 14px mit <code>small</code> oder in der App-Oberfläche. Kein äußerer Rand am ersten und letzten Block, es sitzt also bündig in einem Panel. Ein leerer Absatz behält seine Zeile, wie er sie im Editor hatte.',
  },
  mobile: { en: 'Flows with the column; a wide table scrolls in its own box instead of widening the page.', de: 'Fließt mit der Spalte; eine breite Tabelle scrollt in ihrem eigenen Kasten, statt die Seite zu verbreitern.' },
  note: {
    en: 'Class only, on purpose: <code>::slotted()</code> reaches the slotted node and never a paragraph inside it, so a <code>&lt;nk-prose&gt;</code> element could not style its content. Put the class on a light-DOM container, also inside NotionKit Elements.',
    de: 'Bewusst nur als Klasse: <code>::slotted()</code> erreicht den geslotteten Knoten, nie einen Absatz darin, ein <code>&lt;nk-prose&gt;</code>-Element könnte seinen Inhalt also nicht stylen. Die Klasse gehört an einen Container im Light DOM, auch in NotionKit Elements.',
  },
  html: W => `<div class="nk-page" style="padding:0;max-width:560px;margin:0"><div class="nk-prose">
  <h2>${W.proseTitle}</h2>
  <p>${W.proseBody}</p>
  <ul><li>${W.proseItem1}</li><li>${W.proseItem2}</li></ul>
  <blockquote>${W.proseQuote}</blockquote>
  <table><thead><tr><th>${W.proseCol1}</th><th>${W.proseCol2}</th></tr></thead><tbody><tr><td><code>full</code></td><td>${W.fullWidth}</td></tr><tr><td><code>small</code></td><td>${W.smallText}</td></tr></tbody></table>
</div></div>`,
},
// ============================================================ 5.5 DATABASE
{
  id: 'nk-db-tabs', group: 'database', classes: ['nk-database', 'nk-db-tabs', 'nk-db-tab', 'active', 'badge'],
  title: { en: 'View tabs', de: 'View-Reiter' },
  desc: {
    en: 'The strip above a database. The active view sits on the active wash as a pill, the others are plain words — no underline, no rule, as in Notion since 2025. The <code>.badge</code> child carries the row count.',
    de: 'Die Leiste über einer Datenbank. Die aktive View sitzt als Pille auf dem Aktiv-Hauch, die anderen sind schlichte Wörter – keine Unterlinie, keine Linie, wie in Notion seit 2025. Das <code>.badge</code>-Kind trägt die Zeilenzahl.',
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
  id: 'nk-db-toolbar', group: 'database', classes: ['nk-db-toolbar', 'tools', 'nk-db-tool', 'active', 'nk-filter-row', 'nk-filter-pill', 'add', 'fp-remove'],
  title: { en: 'Toolbar & filter pills', de: 'Werkzeugleiste & Filter-Pills' },
  desc: {
    en: 'The database header as Notion lays it out: view tabs on the left, the view\'s tools on the right – <code>.nk-db-tool</code> buttons for Filter, Sort and search, then “New”. A tool in effect takes <code>.active</code>, the accent. Under it, <code>.nk-filter-row</code> holds the filters in effect as <code>.nk-filter-pill</code>s – <code>.active</code> with an accent tint – and a quiet <code>.add</code> pill at the end. A pill is one button, or a box with the label button and a <code>.fp-remove</code> × when a filter can be removed in place.',
    de: 'Der Datenbank-Kopf, wie Notion ihn anordnet: links die View-Reiter, rechts die Werkzeuge der Ansicht – <code>.nk-db-tool</code>-Knöpfe für Filter, Sortieren und Suche, dann „Neu“. Ein Werkzeug, das wirkt, bekommt <code>.active</code>, den Akzent. Darunter hält <code>.nk-filter-row</code> die wirkenden Filter als <code>.nk-filter-pill</code>s – <code>.active</code> mit Akzent-Tönung – und am Ende eine ruhige <code>.add</code>-Pill. Eine Pill ist ein Knopf, oder ein Kasten mit dem Label-Knopf und einem <code>.fp-remove</code>-×, wenn sich ein Filter direkt entfernen lässt.',
  },
  mobile: { en: 'The tabs scroll sideways when the row gets narrow; the tools keep their place. The pills wrap onto further rows.', de: 'Wird die Zeile schmal, scrollen die Reiter seitwärts; die Werkzeuge behalten ihren Platz. Die Pills brechen in weitere Zeilen um.' },
  html: W => `<div class="nk-database" style="max-width:620px">
  <div class="nk-db-toolbar">
    <div class="nk-db-tabs">
      <div class="nk-db-tab active">▦ ${W.table}</div><div class="nk-db-tab">▤ ${W.board}</div><div class="nk-db-tab">☰ ${W.list}</div>
    </div>
    <div class="tools">
      <button class="nk-db-tool active">${W.filter}</button><button class="nk-db-tool">${W.sort}</button><button class="nk-db-tool" aria-label="${W.searchLabel}">🔍</button>
      <button class="nk-btn primary small">${W.newBtn}</button>
    </div>
  </div>
  <div class="nk-filter-row">
    <span class="nk-filter-pill active"><button>${W.statusOpen}</button><button class="fp-remove" aria-label="${W.removeFilter}">×</button></span>
    <button class="nk-filter-pill">${W.ownerMarcel} ▾</button>
    <button class="nk-filter-pill add">${W.addFilter}</button>
  </div>
</div>`,
},
{
  id: 'nk-table', group: 'database', classes: ['nk-table-wrap', 'nk-table', 'wrap', 'th-icon', 'row-title', 'date-cell', 'person-cell', 'num', 'nk-new-row'],
  title: { en: 'Table view', de: 'Tabellen-Ansicht' },
  desc: {
    en: '36px rows at 14px, hairlines between rows and columns, header cells quiet and clickable — measured on a live Notion table. Every cell is <code>white-space: nowrap</code> so columns keep their shape; <code>.wrap</code> on the table or on a cell lets text break, like Notion\'s “wrap column”. <code>.num</code> on a cell sets a number right-aligned in figures of equal width, as Notion does with a number property; the header stays left. <code>.nk-new-row</code> is the add affordance at the bottom (inside <code>.nk-table</code> the short form <code>.new-row</code> still works).',
    de: '36px-Zeilen bei 14px, Haarlinien zwischen Zeilen und Spalten, Kopfzellen ruhig und klickbar – an einer echten Notion-Tabelle gemessen. Jede Zelle ist <code>white-space: nowrap</code>, damit Spalten ihre Form behalten; <code>.wrap</code> auf der Tabelle oder einer Zelle lässt Text umbrechen, wie Notions „Spalte umbrechen“. <code>.num</code> an einer Zelle setzt eine Zahl rechtsbündig in gleich breiten Ziffern, wie Notion eine Zahl-Eigenschaft setzt; der Kopf bleibt links. <code>.nk-new-row</code> ist die Hinzufügen-Zeile unten (innerhalb von <code>.nk-table</code> funktioniert die Kurzform <code>.new-row</code> weiter).',
  },
  mobile: {
    en: 'This is the key one: <code>nk-table-wrap</code> scrolls horizontally so the table never forces the page wider. Always wrap the table.',
    de: 'Das ist der entscheidende Fall: <code>nk-table-wrap</code> scrollt horizontal, damit die Tabelle die Seite nie breiter macht. Die Tabelle immer einwickeln.',
  },
  html: W => `<div class="nk-table-wrap"><table class="nk-table">
  <thead><tr>
    <th><span class="th-icon">📄</span>${W.name}</th><th><span class="th-icon">◉</span>${W.status}</th>
    <th><span class="th-icon">👤</span>${W.owner}</th><th><span class="th-icon">📅</span>${W.due}</th>
    <th><span class="th-icon">📊</span>${W.progress}</th><th><span class="th-icon">#</span>${W.effort}</th>
  </tr></thead>
  <tbody>
    <tr><td><span class="row-title">🚀 ${W.roadmap}</span></td><td><span class="nk-tag green">${W.done}</span></td>
        <td><span class="person-cell"><span class="nk-avatar small purple">SL</span>Sara</span></td>
        <td class="date-cell">12.05.2026</td>
        <td><span class="nk-progress"><i style="width:100%"></i></span><span class="nk-progress-label">100 %</span></td><td class="num">${W.effort1}</td></tr>
    <tr><td><span class="row-title">🎨 ${W.designSystem}</span></td><td><span class="nk-tag blue">${W.inProgress}</span></td>
        <td><span class="person-cell"><span class="nk-avatar small blue">TW</span>Tom</span></td>
        <td class="date-cell">20.05.2026</td>
        <td><span class="nk-progress"><i style="width:65%"></i></span><span class="nk-progress-label">65 %</span></td><td class="num">${W.effort2}</td></tr>
    <tr><td><span class="row-title">📣 ${W.launch}</span></td><td><span class="nk-tag yellow">${W.planned}</span></td>
        <td><span class="person-cell"><span class="nk-avatar small orange">MK</span>Mia</span></td>
        <td class="date-cell">02.06.2026</td>
        <td><span class="nk-progress"><i style="width:10%"></i></span><span class="nk-progress-label">10 %</span></td><td class="num">${W.effort3}</td></tr>
  </tbody>
</table>
<div class="nk-new-row">${W.newPage}</div></div>`,
},
{
  id: 'nk-tag', group: 'database', classes: ['nk-tag', 'gray', 'brown', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'red'],
  title: { en: 'Tags', de: 'Tags' },
  desc: {
    en: 'The select option as Notion draws it: 20px tall, 3px corners, the cell\'s 14px, near-black text on a saturated fill (≥ 10:1 in light mode). Nine colours, each a background/text pair per theme; without a colour class it is the grey tag. For coloured <em>text</em> use the <code>--nk-color-*</code> mid-tones, for a soft surface the <code>--nk-tint-*</code> backgrounds.',
    de: 'Die Select-Option, wie Notion sie zeichnet: 20px hoch, 3px Ecken, die 14px der Zelle, fast schwarzer Text auf gesättigter Fläche (≥ 10:1 im Hellmodus). Neun Farben, je ein Hintergrund/Text-Paar pro Theme; ohne Farbklasse ist es der graue Tag. Für farbigen <em>Text</em> die <code>--nk-color-*</code>-Mitteltöne nehmen, für eine weiche Fläche die <code>--nk-tint-*</code>-Hintergründe.',
  },
  mobile: { en: 'Unchanged. Inline-flex with an ellipsis, so a long option is cut rather than the column widened.', de: 'Unverändert. Inline-flex mit Ellipse, eine lange Option wird also gekürzt statt die Spalte verbreitert.' },
  html: W => `<span class="nk-tag">${W.tagGray}</span>
<span class="nk-tag brown">${W.tagBrown}</span>
<span class="nk-tag orange">${W.planned}</span>
<span class="nk-tag yellow">${W.tagYellow}</span>
<span class="nk-tag green">${W.done}</span>
<span class="nk-tag blue">${W.inProgress}</span>
<span class="nk-tag purple">${W.designSystem}</span>
<span class="nk-tag pink">${W.tagPink}</span>
<span class="nk-tag red">${W.tagRed}</span>`,
},
{
  id: 'nk-progress', group: 'database', classes: ['nk-progress', 'nk-progress-label', 'wide'],
  title: { en: 'Progress bar', de: 'Fortschrittsbalken' },
  desc: {
    en: 'A 6px rail whose fill is an <code>&lt;i&gt;</code> with a percentage width. Track and fill use Notion\'s blue tint and mid-tone, so a re-theme carries them along. 110px wide in a cell; <code>wide</code> fills its row – a property value, a panel, a course overview – and in a flex row the label keeps its place beside it.',
    de: 'Eine 6px-Schiene, deren Füllung ein <code>&lt;i&gt;</code> mit Prozentbreite ist. Schiene und Füllung nutzen Notions blaue Tönung und den blauen Mittelton und ziehen bei einem Theme-Wechsel mit. 110px breit in einer Zelle; <code>wide</code> füllt seine Zeile – ein Eigenschaftswert, ein Panel, eine Kursübersicht – und in einer flex-Zeile behält das Label seinen Platz daneben.',
  },
  mobile: { en: 'The 110px bar stays legible in a table cell; <code>wide</code> follows its container.', de: 'Der 110px-Balken bleibt in einer Tabellenzelle lesbar; <code>wide</code> folgt seinem Container.' },
  html: () => `<span class="nk-progress"><i style="width:65%"></i></span><span class="nk-progress-label">65 %</span><br><br>
<span class="nk-progress"><i style="width:20%"></i></span><span class="nk-progress-label">20 %</span>
<div style="display:flex;align-items:center;max-width:360px;margin-top:14px"><span class="nk-progress wide"><i style="width:80%"></i></span><span class="nk-progress-label">80 %</span></div>`,
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
    <div class="nk-card"><div class="card-title">🖥 ${W.boardView}</div><div class="card-meta"><span class="nk-avatar small blue">TW</span>28.05.</div></div>
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
},
{
  id: 'nk-list', group: 'database', classes: ['nk-list', 'nk-list-item', 'l-icon', 'l-title', 'l-meta', 'last'],
  title: { en: 'List view', de: 'Listen-Ansicht' },
  desc: {
    en: 'The third database view: one line per row – icon, title and a few properties on the right – as Notion shows a database under “List”. Hairlines between rows and the hover wash across the whole row, like a table without columns; the last row drops its line. As an <code>&lt;a&gt;</code> each row is a real link. Put it in <code>.nk-database</code> under the view tabs, or use it on its own for any list of pages.',
    de: 'Die dritte Datenbank-Ansicht: eine Zeile pro Eintrag – Icon, Titel und rechts ein paar Eigenschaften –, wie Notion eine Datenbank unter „Liste“ zeigt. Haarlinien zwischen den Zeilen und der Hover-Hauch über die ganze Zeile, wie eine Tabelle ohne Spalten; die letzte Zeile verliert ihre Linie. Als <code>&lt;a&gt;</code> ist jede Zeile ein echter Link. In <code>.nk-database</code> unter die View-Reiter setzen oder allein für jede Liste von Seiten nutzen.',
  },
  mobile: { en: 'Stays one line per row: the title gives way first and ends in an ellipsis, the properties keep their place.', de: 'Bleibt eine Zeile pro Eintrag: Der Titel gibt zuerst nach und endet mit Auslassungspunkten, die Eigenschaften behalten ihren Platz.' },
  html: W => `<div class="nk-list" style="max-width:520px">
  <a class="nk-list-item" href="#"><span class="l-icon">🚀</span><span class="l-title">${W.roadmap}</span><span class="l-meta">12.05.2026 <span class="nk-tag green">${W.done}</span></span></a>
  <a class="nk-list-item" href="#"><span class="l-icon">🎨</span><span class="l-title">${W.designSystem}</span><span class="l-meta">20.05.2026 <span class="nk-tag blue">${W.inProgress}</span></span></a>
  <a class="nk-list-item" href="#"><span class="l-icon">📣</span><span class="l-title">${W.launch}</span><span class="l-meta">02.06.2026 <span class="nk-tag orange">${W.planned}</span></span></a>
</div>`,
}
,
// ============================================================ 5.6 FORMS
{
  id: 'nk-input', group: 'forms', classes: ['nk-input', 'nk-textarea', 'nk-select', 'wide'],
  title: { en: 'Inputs, textarea, select', de: 'Inputs, Textarea, Select' },
  desc: {
    en: 'One shared shape for all three: filled with <code>--nk-bg-input</code> inside a hairline, 32px tall at 14px — Notion\'s input, not an outlined white box. The focus ring is mixed from the accent, so it re-brands with it. <code>.wide</code> makes an input fill its row.',
    de: 'Eine gemeinsame Form für alle drei: gefüllt mit <code>--nk-bg-input</code> in einer Haarlinie, 32px hoch bei 14px – Notions Input, keine umrandete weiße Box. Der Fokusring wird aus dem Akzent gemischt und färbt sich mit ihm um. <code>.wide</code> füllt die Zeile.',
  },
  mobile: { en: '<code>min-width: 210px</code> can overflow a narrow field row — pair it with <code>.wide</code> or let <code>nk-field</code> wrap.', de: '<code>min-width: 210px</code> kann eine schmale Feldzeile sprengen – mit <code>.wide</code> kombinieren oder <code>nk-field</code> umbrechen lassen.' },
  html: W => `<div style="display:flex;flex-direction:column;gap:10px;max-width:340px">
  <input class="nk-input wide" value="${W.placeholderName}">
  <select class="nk-select wide"><option>${W.option1}</option><option>${W.option2}</option><option>${W.option3}</option></select>
  <textarea class="nk-textarea wide" placeholder="${W.placeholderAbout}"></textarea>
</div>`,
},
{
  id: 'nk-calendar-view', group: 'database', classes: ['nk-calendar-view', 'weeks', 'cv-head', 'cv-title', 'cv-grid', 'cv-wd', 'cv-week', 'cv-day', 'out', 'off', 'today', 'cv-num', 'cv-item'],
  title: { en: 'Calendar view', de: 'Kalender-Ansicht' },
  desc: {
    en: 'The database as Notion\'s month, a view tab like table, board and list: a head with the month and the date picker\'s <code>.cal-nav</code> buttons, the weekdays, and a <code>.cv-day</code> per day with its <code>.cv-num</code> top right – today\'s on a red pill – and the rows due that day as <code>.cv-item</code> cards. Days of the month before and after (<code>.out</code>) and days not worked (<code>.off</code>) are washed. <code>weeks</code> adds a column of ISO calendar weeks. The columns share the width, so seven always fit; an item\'s title ends in an ellipsis.',
    de: 'Die Datenbank als Notions Monat, ein View-Reiter wie Tabelle, Board und Liste: ein Kopf mit dem Monat und den <code>.cal-nav</code>-Knöpfen der Datumsauswahl, die Wochentage und ein <code>.cv-day</code> je Tag mit seiner <code>.cv-num</code> oben rechts – die von heute auf einer roten Pille – und den an diesem Tag fälligen Zeilen als <code>.cv-item</code>-Karten. Tage des Monats davor und danach (<code>.out</code>) und Tage, an denen nicht gearbeitet wird (<code>.off</code>), sind hinterlegt. <code>weeks</code> ergänzt eine Spalte mit ISO-Kalenderwochen. Die Spalten teilen sich die Breite, sieben passen also immer; der Titel eines Eintrags endet mit Auslassungspunkten.',
  },
  mobile: { en: 'Below 860px the days get lower (64px) and the cards smaller; seven columns still fit.', de: 'Unter 860px werden die Tage niedriger (64px) und die Karten kleiner; sieben Spalten passen weiter.' },
  html: W => calendarViewMarkup(W, { month: '2026-05', today: '2026-05-20', items: { '2026-05-08': [`🧭 ${W.calItem1}`], '2026-05-10': [`📄 ${W.calItem2}`], '2026-05-20': [`🗃️ ${W.calItem3}`, `▤ ${W.calItem4}`] } }),
},
{
  id: 'nk-copy-field', group: 'forms', classes: ['nk-copy-field', 'cf-value', 'cf-btn', 'copied', 'mono', 'wrap', 'wide'],
  title: { en: 'Copy field', de: 'Kopierfeld' },
  desc: {
    en: 'A value to take along – a link to share, an address, a key – in a field of its own, as tall as an input, with its actions inside on the right. <code>.cf-value</code> holds the text on one line with an ellipsis, and a click selects it whole; <code>.cf-btn</code>s are the quiet actions – Copy and, for a secret, Show. <code>.copied</code> on a button is the moment after, in green; the copying is your script. <code>mono</code> for addresses, keys and code, <code>wrap</code> lets a long value break with the actions on its first line, <code>wide</code> fills the row.',
    de: 'Ein Wert zum Mitnehmen – ein Link zum Teilen, eine Adresse, ein Schlüssel – in einem eigenen Feld, so hoch wie ein Eingabefeld, mit seinen Aktionen rechts darin. <code>.cf-value</code> hält den Text in einer Zeile mit Auslassungspunkten, ein Klick markiert ihn ganz; <code>.cf-btn</code>s sind die leisen Aktionen – Kopieren und, bei einem Geheimnis, Zeigen. <code>.copied</code> an einem Button ist der Moment danach, in Grün; das Kopieren übernimmt dein Skript. <code>mono</code> für Adressen, Schlüssel und Code, <code>wrap</code> lässt einen langen Wert umbrechen, die Aktionen bleiben in der ersten Zeile, <code>wide</code> füllt die Zeile.',
  },
  mobile: { en: 'Keeps to its column: the value is cut, never the actions.', de: 'Bleibt in seiner Spalte: Gekürzt wird der Wert, nie die Aktionen.' },
  html: W => `<div class="nk-copy-field" style="max-width:340px"><span class="cf-value">https://monahilft.notionkit.app</span><button class="cf-btn">${W.copy}</button></div>
<div class="nk-copy-field mono" style="max-width:340px;margin-top:10px"><span class="cf-value">ntn_••••••••••••••••••••</span><button class="cf-btn">${W.show}</button><button class="cf-btn copied">✓ ${W.copied}</button></div>`,
  after: W => `<pre class="nk-code"><span class="lang">js</span>btn.addEventListener('click', async () =&gt; {
  await navigator.clipboard.writeText(field.querySelector('.cf-value').textContent);
  btn.classList.add('copied');   // ${W.copyHint}
  setTimeout(() =&gt; btn.classList.remove('copied'), 1500);
});</pre>`,
},
{
  id: 'nk-calendar', group: 'forms', classes: ['nk-calendar', 'weeks', 'cal-head', 'cal-title', 'cal-nav', 'cal-grid', 'cal-wd', 'cal-week', 'cal-day', 'out', 'off', 'today', 'start', 'end', 'in-range', 'cal-marks', 'cal-foot'],
  title: { en: 'Date picker', de: 'Datumsauswahl' },
  desc: {
    en: 'Notion\'s month sheet for a date: a title with Today and ‹ ›, the weekdays, six rows of <code>.cal-day</code> buttons. The chosen day is <code>.selected</code> in the accent, today is red; a range runs from <code>.start</code> to <code>.end</code> over <code>.in-range</code> days in the accent\'s tint. <code>.off</code> greys a day that is not worked – a weekend, a holiday, with its name as <code>title</code> – and <code>.out</code> a day of the month before or after; <code>aria-disabled="true"</code> marks one outside the bounds. <code>.cal-marks</code> holds up to three dots in the nine colours (<code>i.blue</code>, <code>i.red</code> …), for deadlines or milestones. <code>weeks</code> adds the ISO calendar week in front of each row, <code>.cal-foot</code> a time field or actions under the sheet. Cells are 36px, so seven and the week column fill a <code>.nk-pop</code>; put it in <code>.nk-pop.floating.sheet</code> and it is a popover on the desktop and a sheet with 44px cells on a phone. The month, the keys and the value are your script – or <code>&lt;nk-calendar&gt;</code>.',
    de: 'Notions Monatsblatt für ein Datum: ein Titel mit Heute und ‹ ›, die Wochentage, sechs Reihen <code>.cal-day</code>-Knöpfe. Der gewählte Tag ist <code>.selected</code> im Akzent, heute ist rot; ein Zeitraum läuft von <code>.start</code> bis <code>.end</code> über <code>.in-range</code>-Tage in der Tönung des Akzents. <code>.off</code> graut einen Tag, an dem nicht gearbeitet wird – ein Wochenende, ein Feiertag, mit seinem Namen als <code>title</code> –, <code>.out</code> einen Tag des Monats davor oder danach; <code>aria-disabled="true"</code> markiert einen außerhalb der Grenzen. <code>.cal-marks</code> hält bis zu drei Punkte in den neun Farben (<code>i.blue</code>, <code>i.red</code> …), für Fristen oder Meilensteine. <code>weeks</code> stellt jeder Reihe die ISO-Kalenderwoche voran, <code>.cal-foot</code> ein Zeitfeld oder Aktionen unter das Blatt. Die Zellen sind 36px, sieben und die Wochenspalte füllen also ein <code>.nk-pop</code>; in <code>.nk-pop.floating.sheet</code> ist es auf dem Desktop ein Popover und auf dem Telefon ein Sheet mit 44px-Zellen. Monat, Tasten und Wert sind dein Skript – oder <code>&lt;nk-calendar&gt;</code>.',
  },
  mobile: { en: 'In a sheet the cells grow to 44px, a thumb\'s width; seven and the week column still fit a 390px screen.', de: 'In einem Sheet wachsen die Zellen auf 44px, eine Daumenbreite; sieben und die Wochenspalte passen weiter auf einen 390px-Schirm.' },
  html: W => `<div style="display:flex;gap:16px;flex-wrap:wrap;align-items:flex-start">
<div class="nk-pop">
  ${calendarMarkup(W, { month: '2026-06', value: '2026-06-02', today: '2026-06-17', off: { '2026-06-04': W.holidayCorpus }, marks: { '2026-06-02': ['blue'], '2026-06-11': ['orange', 'red'], '2026-06-24': ['green'] } })}
</div>
<div class="nk-pop">
  ${calendarMarkup(W, { month: '2026-06', start: '2026-06-08', end: '2026-06-12', today: '2026-06-17', off: { '2026-06-04': W.holidayCorpus }, foot: `\n    <div class="cal-foot"><input class="nk-input" type="time" value="09:30" aria-label="${W.calTime}"><button class="cal-nav">${W.calClear}</button></div>` })}
</div>
</div>`,
},
{
  id: 'nk-btn', group: 'forms', classes: ['nk-btn', 'primary', 'secondary', 'danger', 'danger-solid', 'small'],
  title: { en: 'Buttons', de: 'Buttons' },
  desc: {
    en: 'Five variants, 28px tall at 14px. <code>.secondary</code> and <code>.danger</code> are Notion\'s white button: the outline is <code>--nk-shadow-btn</code>, a 1px inset ring plus a 1px drop, not a border. Hover is an opacity shift on the filled ones and a wash on the white ones — never a hue change. <code>.small</code> (24px) combines with any variant.',
    de: 'Fünf Varianten, 28px hoch bei 14px. <code>.secondary</code> und <code>.danger</code> sind Notions weißer Button: die Kontur ist <code>--nk-shadow-btn</code>, ein 1px-Innenring plus 1px Schatten, kein Rahmen. Hover ist bei gefüllten Buttons eine Deckkraft-Änderung, bei weißen ein Hauch – nie ein Farbwechsel. <code>.small</code> (24px) lässt sich mit jeder Variante kombinieren.',
  },
  mobile: { en: 'Height lands at 28px, under the 44px touch target. Raise the padding for touch-first screens.', de: 'Die Höhe liegt bei 28px, unter dem 44px-Touch-Ziel. Für Touch-Oberflächen das Padding anheben.' },
  html: W => `<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
  <button class="nk-btn primary">${W.save}</button>
  <button class="nk-btn secondary">${W.discard}</button>
  <button class="nk-btn danger">${W.deleteIt}</button>
  <button class="nk-btn danger-solid">${W.deleteIt}</button>
  <button class="nk-btn secondary small">${W.remove}</button>
</div>`,
},
{
  id: 'nk-switch', group: 'forms', classes: ['nk-switch', 'nk-switch-label', 'aria-checked'],
  title: { en: 'Switch', de: 'Switch' },
  desc: {
    en: 'Works two ways: as an <code>&lt;input type="checkbox"&gt;</code> via <code>:checked</code>, or as a <code>&lt;button role="switch"&gt;</code> via <code>aria-checked="true"</code>. The button form is the accessible default. In a settings row the <code>nk-field</code> label names it; for several switches side by side wrap each in <code>label.nk-switch-label</code> with visible text – the text is part of the hit area.',
    de: 'Funktioniert auf zwei Wegen: als <code>&lt;input type="checkbox"&gt;</code> über <code>:checked</code> oder als <code>&lt;button role="switch"&gt;</code> über <code>aria-checked="true"</code>. Die Button-Form ist der barrierefreie Standard. In einer Einstellungszeile benennt das <code>nk-field</code>-Label den Schalter; für mehrere Schalter nebeneinander bekommt jeder ein <code>label.nk-switch-label</code> mit sichtbarem Text – der Text gehört zur Trefferfläche.',
  },
  mobile: { en: '34×20px, so give it a larger tap area by making the whole <code>nk-field</code> row clickable.', de: '34×20px – die Trefferfläche vergrößern, indem die ganze <code>nk-field</code>-Zeile klickbar wird.' },
  html: W => `<div style="max-width:420px">
  <div class="nk-field"><div><div class="f-label">${W.compactView}</div><div class="f-desc">${W.compactDesc}</div></div>
    <div class="f-control"><button class="nk-switch" role="switch" aria-checked="true"></button></div></div>
  <div class="nk-field"><div><div class="f-label">${W.reduceMotion}</div></div>
    <div class="f-control"><button class="nk-switch" role="switch" aria-checked="false"></button></div></div>
  <div style="display:flex;gap:20px;flex-wrap:wrap;padding:9px 0">
    <label class="nk-switch-label"><button class="nk-switch" role="switch" aria-checked="true"></button><span>${W.planned}</span></label>
    <label class="nk-switch-label"><button class="nk-switch" role="switch" aria-checked="false"></button><span>${W.inProgress}</span></label>
    <label class="nk-switch-label"><button class="nk-switch" role="switch" aria-checked="true"></button><span>${W.done}</span></label>
  </div>
</div>`,
},
{
  id: 'nk-check', group: 'forms', classes: ['nk-check'],
  title: { en: 'Checkbox & radio', de: 'Checkbox & Radio' },
  desc: {
    en: 'The same 16px box for both; the radio variant is detected by <code>[type="radio"]</code> and becomes a circle with a dot. Marks are <code>::after</code> content, not images. A label that wraps keeps the box beside its first line, as Notion does.',
    de: 'Dieselbe 16px-Box für beides; die Radio-Variante wird über <code>[type="radio"]</code> erkannt und wird zum Kreis mit Punkt. Die Marken sind <code>::after</code>-Inhalte, keine Bilder. Bricht ein Label um, bleibt die Box neben seiner ersten Zeile, wie in Notion.',
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
  <div style="max-width:260px">
    <label class="nk-check"><input type="checkbox" checked>${W.consentLong}</label>
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
  id: 'nk-field', group: 'forms', classes: ['nk-field', 'f-label', 'f-desc', 'f-control', 'stacked', 'compact'],
  title: { en: 'Field row', de: 'Feld-Zeile' },
  desc: {
    en: 'The settings-row primitive: label and description on the left, control on the right, pushed apart by <code>justify-content: space-between</code>. Stack these to build a whole settings pane. <code>stacked</code> puts the label above a full-width control – for textareas and long descriptions; <code>compact</code> shrinks the label to 12px tertiary text and drops the row padding. For several short fields side by side use <code>.nk-fields</code>.',
    de: 'Das Grundelement einer Einstellungszeile: Label und Beschreibung links, Bedienelement rechts, auseinandergeschoben per <code>justify-content: space-between</code>. Gestapelt ergeben sie ein ganzes Einstellungs-Pane. <code>stacked</code> setzt das Label über ein vollbreites Control – für Textareas und lange Beschreibungen; <code>compact</code> verkleinert das Label auf 12px tertiären Text und nimmt das Zeilen-Padding weg. Für mehrere kurze Felder nebeneinander gibt es <code>.nk-fields</code>.',
  },
  mobile: { en: 'Below 860px the row wraps: a control that does not fit beside its label moves below it, and no control grows past its column.', de: 'Unter 860px bricht die Zeile um: Ein Control, das nicht neben sein Label passt, rückt darunter, und kein Control wird breiter als seine Spalte.' },
  html: W => `<div style="max-width:460px">
  <div class="nk-field"><div><div class="f-label">${W.displayName}</div><div class="f-desc">${W.displayNameDesc}</div></div>
    <div class="f-control"><input class="nk-input" value="${W.placeholderName}"></div></div>
  <div class="nk-field"><div><div class="f-label">${W.email}</div></div>
    <div class="f-control"><input class="nk-input" value="ada@acme.com"></div></div>
  <div class="nk-field stacked"><div><div class="f-label">${W.aboutMe}</div></div>
    <div class="f-control"><textarea class="nk-textarea" rows="2" placeholder="${W.placeholderAbout}"></textarea></div></div>
</div>`,
},
{
  id: 'nk-fields', group: 'forms', classes: ['nk-fields'],
  title: { en: 'Field grid', de: 'Feldraster' },
  desc: {
    en: 'Several short fields in one row: a grid of <code>minmax(150px, 1fr)</code> columns that wraps as the width allows. Every direct <code>.nk-field</code> child becomes stacked and compact by itself – a 12px label above a full-width control – so nothing collides.',
    de: 'Mehrere kurze Felder in einer Zeile: ein Raster aus <code>minmax(150px, 1fr)</code>-Spalten, das umbricht, wie es die Breite erlaubt. Jedes direkte <code>.nk-field</code>-Kind wird von selbst gestapelt und kompakt – ein 12px-Label über einem vollbreiten Control –, damit nichts kollidiert.',
  },
  mobile: { en: 'Wraps to one or two columns on its own; no breakpoint needed.', de: 'Bricht von selbst auf ein oder zwei Spalten um; kein Breakpoint nötig.' },
  html: W => `<div class="nk-fields" style="max-width:520px">
  <div class="nk-field"><div><div class="f-label">${W.name}</div></div><div class="f-control"><input class="nk-input" value="${W.placeholderName}"></div></div>
  <div class="nk-field"><div><div class="f-label">${W.email}</div></div><div class="f-control"><input class="nk-input" value="ada@acme.com"></div></div>
  <div class="nk-field"><div><div class="f-label">${W.status}</div></div><div class="f-control"><select class="nk-select"><option>${W.inProgress}</option><option>${W.done}</option></select></div></div>
</div>`,
},
{
  id: 'nk-profile-row', group: 'forms', classes: ['nk-profile-row', 'big-avatar', 'square', 'pr-actions', 'pr-remove'],
  title: { en: 'Profile row & picture', de: 'Profil-Zeile & Bild' },
  desc: {
    en: 'A 56px avatar with its actions beside it, in <code>.pr-actions</code> – upload, change, and the quiet <code>.pr-remove</code>. The gradient matches every other avatar in the system because they all read the same two decor tokens; an <code>&lt;img&gt;</code> inside <code>.big-avatar</code> is a chosen picture, cropped to the circle. <code>square</code> makes it the rounded square of a workspace icon. Choosing the file – a hidden <code>&lt;input type="file"&gt;</code> opened from the button, EXIF rotation, scaling – is your script, or <code>&lt;nk-image-picker&gt;</code>.',
    de: 'Ein 56px-Avatar mit seinen Aktionen daneben, in <code>.pr-actions</code> – hochladen, ändern und das leise <code>.pr-remove</code>. Der Verlauf passt zu jedem anderen Avatar im System, weil alle dieselben zwei Decor-Tokens lesen; ein <code>&lt;img&gt;</code> in <code>.big-avatar</code> ist ein gewähltes Bild, auf den Kreis zugeschnitten. <code>square</code> macht daraus das abgerundete Quadrat eines Workspace-Icons. Die Datei zu wählen – ein verstecktes <code>&lt;input type="file"&gt;</code>, vom Button geöffnet, EXIF-Drehung, Skalierung – übernimmt dein Skript oder <code>&lt;nk-image-picker&gt;</code>.',
  },
  mobile: { en: 'Unchanged; the actions stay beside the avatar.', de: 'Unverändert; die Aktionen bleiben neben dem Avatar.' },
  html: W => `<div class="nk-profile-row">
  <div class="big-avatar">AL</div>
  <div class="pr-actions">
    <button class="nk-btn secondary small">${W.uploadImage}</button>
  </div>
</div>
<div class="nk-profile-row">
  <div class="big-avatar square"><img src="${W.asset}favicon.svg" alt=""></div>
  <div class="pr-actions">
    <button class="nk-btn secondary small">${W.changeImage}</button>
    <button class="nk-btn secondary small pr-remove">${W.remove}</button>
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
  mobile: { en: 'The name column shrinks first: a long address ends in an ellipsis and the role select keeps its place.', de: 'Die Namensspalte gibt zuerst nach: Eine lange Adresse endet mit Auslassungspunkten, die Rollen-Auswahl behält ihren Platz.' },
  html: W => `<div class="nk-member-list" style="max-width:460px">
  <div class="nk-member-row"><span class="nk-avatar purple">AL</span>
    <div><div>${W.author}</div><div class="m-mail">ada@acme.com</div></div>
    <select class="nk-select"><option>${W.memberAdmin}</option><option>${W.memberRole}</option></select></div>
  <div class="nk-member-row"><span class="nk-avatar blue">TW</span>
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
  id: 'nk-menu', group: 'overlay', classes: ['nk-menu', 'nk-menu-item', 'm-icon', 'm-shortcut', 'danger', 'nk-menu-sep', 'nk-menu-label', 'floating', 'sheet', 'open'],
  title: { en: 'Context menu', de: 'Kontextmenü' },
  desc: {
    en: 'Combine <code>nk-pop</code> with <code>nk-menu</code>. Items take an <code>.m-icon</code> on the left and an <code>.m-shortcut</code> pushed right; <code>.danger</code> turns an item red. A <code>.nk-switch</code> as the last child of an item sits on the right, like “Small text” and “Full width” in Notion\'s page menu. A menu that floats over the page takes <code>floating</code> and opens and closes with <code>.open</code>, the way the palette does: it fades in and settles from 4px higher and 98 %; closed it takes no clicks and no focus, and where it sits is yours. <code>sheet</code> makes it a bottom sheet on a phone, as Notion\'s mobile app opens every menu – the same markup, two presentations.',
    de: '<code>nk-pop</code> mit <code>nk-menu</code> kombinieren. Einträge nehmen links ein <code>.m-icon</code> und rechts ein <code>.m-shortcut</code>; <code>.danger</code> färbt einen Eintrag rot. Ein <code>.nk-switch</code> als letztes Kind eines Eintrags sitzt rechts, wie „Kleiner Text“ und „Volle Breite“ in Notions Seitenmenü. Ein Menü, das über der Seite schwebt, bekommt <code>floating</code> und öffnet und schließt über <code>.open</code> wie die Palette: Es blendet ein und setzt sich aus 4px Höhe und 98 % ab; geschlossen nimmt es weder Klicks noch Fokus an, und wo es sitzt, bestimmst du. <code>sheet</code> macht es auf dem Telefon zum Bottom Sheet, so wie Notions Mobil-App jedes Menü öffnet – dasselbe Markup, zwei Darstellungen.',
  },
  mobile: { en: 'Shortcuts are meaningless on touch — hide the <code>.m-shortcut</code> spans there. With <code>sheet</code> the menu becomes a bottom sheet below 860px: full width, a grabber, 40px rows, the page dimmed behind it; inline positioning is overruled.', de: 'Kürzel sind auf Touch bedeutungslos – die <code>.m-shortcut</code>-Spans dort ausblenden. Mit <code>sheet</code> wird das Menü unter 860px zum Bottom Sheet: volle Breite, ein Griff, 40px-Zeilen, die Seite dahinter abgedunkelt; eine Inline-Position wird übergangen.' },
  html: W => `<div class="nk-pop nk-menu">
  <div class="nk-menu-label">${W.pages}</div>
  <div class="nk-menu-item"><span class="m-icon">✏️</span>${W.rename}<span class="m-shortcut">⌘⇧R</span></div>
  <div class="nk-menu-item"><span class="m-icon">📄</span>${W.duplicate}<span class="m-shortcut">⌘D</span></div>
  <div class="nk-menu-item"><span class="m-icon">🔗</span>${W.copyLink}<span class="m-shortcut">⌘L</span></div>
  <div class="nk-menu-sep"></div>
  <div class="nk-menu-item"><span class="m-icon">🔡</span>${W.smallText}<button class="nk-switch" role="switch" aria-checked="true" aria-label="${W.smallText}"></button></div>
  <div class="nk-menu-sep"></div>
  <div class="nk-menu-item danger"><span class="m-icon">🗑</span>${W.moveToTrash}</div>
</div>
<pre class="nk-code" style="margin-top:12px"><span class="lang">html</span>&lt;div class="nk-pop nk-menu floating sheet open" style="position:fixed; top:48px; right:12px"&gt;…&lt;/div&gt;</pre>`,
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
  id: 'nk-sheet', group: 'overlay', classes: ['nk-sheet-backdrop', 'open', 'nk-sheet', 'sh-grabber', 'sh-title'],
  title: { en: 'Sheet', de: 'Sheet' },
  desc: {
    en: 'Notion\'s mobile surface for menus, properties and more: the phone\'s twin of the modal. The backdrop fades, the panel rises from the bottom edge with its top corners rounded and a <code>.sh-grabber</code> on top, and the home indicator keeps its distance. It lies above the tab bar. Like the modal it starts invisible and <code>.open</code> shows it; closed, the backdrop leaves the layout once it has faded. Up to 640px wide, centred on larger screens. Rows inside get 40px, a thumb\'s height. For a menu that is a popover on the desktop and a sheet on the phone, use <code>.nk-pop.sheet</code> instead.',
    de: 'Notions Mobil-Fläche für Menüs, Eigenschaften und mehr: der Telefon-Zwilling des Modals. Der Backdrop blendet ein, das Panel steigt von der Unterkante auf, mit gerundeten oberen Ecken und einem <code>.sh-grabber</code> oben, und der Home-Indikator behält seinen Abstand. Es liegt über der Tab-Leiste. Wie das Modal startet es unsichtbar, <code>.open</code> zeigt es; geschlossen verlässt der Backdrop nach dem Ausblenden das Layout. Bis 640px breit, auf größeren Schirmen zentriert. Zeilen darin bekommen 40px, eine Daumenhöhe. Für ein Menü, das auf dem Desktop Popover und auf dem Telefon Sheet ist, stattdessen <code>.nk-pop.sheet</code> nehmen.',
  },
  mobile: { en: 'Made for the phone: full width, bottom padding from the safe area, the content scrolls inside the sheet and never moves the page.', de: 'Fürs Telefon gemacht: volle Breite, unteres Padding aus der Safe Area, der Inhalt scrollt im Sheet und bewegt nie die Seite.' },
  frame: 360, relativeFrame: true,
  html: W => `<div class="nk-sheet-backdrop open" style="position:absolute;border-radius:var(--nk-radius)">
  <div class="nk-sheet" role="dialog" aria-modal="true" aria-label="${W.page}">
    <div class="sh-grabber"></div>
    <div class="sh-title">${W.page}</div>
    <div class="nk-menu-item"><span class="m-icon">🔡</span>${W.smallText}<button class="nk-switch" role="switch" aria-checked="true" aria-label="${W.smallText}"></button></div>
    <div class="nk-menu-item"><span class="m-icon">🔗</span>${W.copyLink}</div>
    <div class="nk-menu-item"><span class="m-icon">📄</span>${W.duplicate}</div>
    <div class="nk-menu-item danger"><span class="m-icon">🗑</span>${W.moveToTrash}</div>
  </div>
</div>`,
},
{
  id: 'nk-peek', group: 'overlay', classes: ['nk-peek-backdrop', 'open', 'nk-peek', 'pk-bar', 'pk-body'],
  title: { en: 'Side peek', de: 'Side Peek' },
  desc: {
    en: 'Notion\'s side peek: a database row opens in a panel at the right edge, full height, next to the table, which stays visible and usable – there is no scrim, the backdrop only holds the panel and lets clicks through. <code>.pk-bar</code> carries the actions – close with », open as page – and <code>.pk-body</code> the page: title in 32px, properties, prose, comments. <code>.open</code> on the backdrop slides the panel in; closed, it leaves the layout once it has slid out. It lies above the page and the tab bar and below the floating menus, so a menu opened in the peek shows over it. Closing is your script: », Escape, a click outside; a click on another row swaps the content.',
    de: 'Notions Side Peek: Eine Datenbankzeile öffnet sich in einem Panel am rechten Rand, in voller Höhe, neben der Tabelle, die sichtbar und bedienbar bleibt – es gibt keine Abdunklung, der Backdrop hält nur das Panel und lässt Klicks durch. <code>.pk-bar</code> trägt die Aktionen – Schließen mit », Als Seite öffnen –, <code>.pk-body</code> die Seite: Titel in 32px, Eigenschaften, Prosa, Kommentare. <code>.open</code> am Backdrop schiebt das Panel herein; geschlossen verlässt es das Layout, sobald es hinausgeglitten ist. Es liegt über Seite und Tab-Leiste und unter den schwebenden Menüs, sodass ein Menü aus dem Peek darüber erscheint. Das Schließen übernimmt dein Skript: », Escape, ein Klick daneben; ein Klick auf eine andere Zeile tauscht den Inhalt.',
  },
  mobile: { en: 'Below 860px it rises from the bottom edge as a sheet over a dimmed page – full width, a grabber, the title in 28px – and the dimmed page takes the tap that closes it.', de: 'Unter 860px steigt es als Sheet von der Unterkante über eine abgedunkelte Seite auf – volle Breite, ein Griff, der Titel in 28px –, und die abgedunkelte Seite nimmt den Tipp, der es schließt.' },
  frame: 420, relativeFrame: true,
  html: W => `<div class="nk-peek-backdrop open" style="position:absolute;border-radius:var(--nk-radius);overflow:hidden">
  <aside class="nk-peek" role="dialog" aria-label="${W.peekTitle}" style="width:min(440px, 100%)">
    <div class="pk-bar">
      <button class="nk-topbar-btn" aria-label="${W.close}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 17 5-5-5-5M13 17l5-5-5-5"/></svg></button>
      <button class="nk-topbar-btn" aria-label="${W.openPage}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg></button>
    </div>
    <div class="pk-body">
      <h1 class="nk-page-title">🗃️ ${W.peekTitle}</h1>
      <dl class="nk-props">
        <div class="nk-prop"><dt class="p-name"><span class="p-icon">◉</span>${W.status}</dt><dd class="p-value"><span class="nk-tag blue">${W.inProgress}</span></dd></div>
        <div class="nk-prop"><dt class="p-name"><span class="p-icon">📅</span>${W.due}</dt><dd class="p-value">20.05.2026</dd></div>
      </dl>
      <div class="nk-prose"><p>${W.peekText}</p></div>
    </div>
  </aside>
</div>`,
  after: W => `<pre class="nk-code"><span class="lang">js</span>row.addEventListener('click', () =&gt; peek.classList.add('open'));        // ${W.peekHintOpen}
closeBtn.addEventListener('click', () =&gt; peek.classList.remove('open'));
document.addEventListener('keydown', e =&gt; { if (e.key === 'Escape') peek.classList.remove('open'); });</pre>`,
},
{
  id: 'nk-toast', group: 'overlay', classes: ['nk-toast', 'show'],
  title: { en: 'Toast', de: 'Toast' },
  desc: {
    en: 'Fixed to the bottom centre, inverted (text colour as background). It sits off-screen until <code>.show</code> is added, then slides up. <code>pointer-events: none</code> keeps it from stealing clicks.',
    de: 'Unten mittig fixiert, invertiert (Textfarbe als Hintergrund). Er sitzt außerhalb des Bildes, bis <code>.show</code> ergänzt wird, und fährt dann hoch. <code>pointer-events: none</code> verhindert, dass er Klicks abfängt.',
  },
  mobile: { en: 'Centred by <code>translateX(-50%)</code>, so it stays centred at any width.', de: 'Per <code>translateX(-50%)</code> zentriert und bleibt es in jeder Breite.' },
  html: W => `<div class="nk-toast show" style="position:relative;bottom:auto;left:auto;transform:none;display:inline-flex;z-index:auto">✓ <span>${W.toastMsg}</span></div>`,
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
  id: 'nk-panel', group: 'gallery', classes: ['nk-panels', 'nk-panel'],
  title: { en: 'Panels', de: 'Panels' },
  desc: {
    en: 'A neutral surface for content that belongs together – the cards on Notion\'s Home, the boxes in its settings. Not <code>.nk-card</code>, which is the board card. <code>.nk-panels</code> sets several in a grid of columns at least 200px wide that share the row. Inside, an <code>&lt;h3&gt;</code> is the title and a <code>&lt;p&gt;</code> the quiet text; a <code>.nk-cover</code> as first child runs to the panel\'s edges, and a <code>.nk-page-icon</code> after it overlaps the cover – a page tile, as on Home under “Recently visited”. As an <code>&lt;a&gt;</code> or <code>&lt;button&gt;</code> the panel answers the pointer.',
    de: 'Eine neutrale Fläche für Inhalt, der zusammengehört – die Karten auf Notions Startseite, die Kästen in seinen Einstellungen. Nicht <code>.nk-card</code>, das ist die Board-Karte. <code>.nk-panels</code> setzt mehrere in ein Raster mit Spalten von mindestens 200px, die sich die Zeile teilen. Darin ist ein <code>&lt;h3&gt;</code> der Titel und ein <code>&lt;p&gt;</code> der ruhige Text; ein <code>.nk-cover</code> als erstes Kind läuft bis an die Ränder, ein <code>.nk-page-icon</code> danach überlappt das Cover – eine Seitenkachel wie auf der Startseite unter „Zuletzt besucht“. Als <code>&lt;a&gt;</code> oder <code>&lt;button&gt;</code> reagiert das Panel auf den Zeiger.',
  },
  mobile: { en: 'The grid falls to one column as soon as two 200px columns no longer fit – no breakpoint involved.', de: 'Das Raster fällt auf eine Spalte, sobald zwei 200px-Spalten nicht mehr passen – ganz ohne Breakpoint.' },
  html: W => `<div class="nk-panels">
  <a class="nk-panel" href="#">
    <div class="nk-cover"><img src="${W.asset}covers/aurora.svg" alt=""></div>
    <div class="nk-page-icon">🚀</div>
    <h3>${W.roadmap}</h3>
    <p>${W.minAgo}</p>
  </a>
  <a class="nk-panel" href="#">
    <div class="nk-cover"><img src="${W.asset}covers/dunes.svg" alt=""></div>
    <div class="nk-page-icon">📚</div>
    <h3>${W.knowledgeBase}</h3>
    <p>${W.yesterday}</p>
  </a>
  <div class="nk-panel">
    <h3>${W.weeklyReview}</h3>
    <p>${W.weeklyReviewText}</p>
    <div style="display:flex;align-items:center"><span class="nk-progress wide"><i style="width:60%"></i></span><span class="nk-progress-label">60 %</span></div>
  </div>
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
  id: 'nk-segmented', group: 'gallery', classes: ['nk-segmented', 'active', 'scroll', 'wrap'],
  title: { en: 'Segmented control', de: 'Segment-Auswahl' },
  desc: {
    en: 'A small set of mutually exclusive options. The active segment lifts out of the track with the page background and a one-pixel shadow. One row by default; <code>scroll</code> scrolls a long row horizontally with the scrollbar hidden, <code>wrap</code> breaks it onto further rows.',
    de: 'Eine kleine Menge sich ausschließender Optionen. Das aktive Segment hebt sich mit dem Seitenhintergrund und einem Ein-Pixel-Schatten aus der Schiene. Standard ist eine Zeile; <code>scroll</code> scrollt eine lange Zeile horizontal mit versteckter Scrollleiste, <code>wrap</code> bricht sie um.',
  },
  mobile: { en: '<code>inline-flex</code>, so it shrinks to its content. Five filter options are wider than a phone: give the control <code>scroll</code> (it stays one thumb-swipeable row, capped at the parent width) or <code>wrap</code>.', de: '<code>inline-flex</code>, es schrumpft also auf seinen Inhalt. Fünf Filteroptionen sind breiter als ein Telefon: dem Control <code>scroll</code> geben (eine wischbare Zeile, begrenzt auf die Elternbreite) oder <code>wrap</code>.' },
  html: W => `<div class="nk-segmented">
  <button class="active">${W.week}</button><button>${W.month}</button><button>${W.quarter}</button>
</div>
<div style="max-width:300px;margin-top:12px"><div class="nk-segmented scroll">
  <button class="active">${W.all}</button><button>⚠️ ${W.attention}</button><button>${W.failed}</button><button>${W.read}</button><button>${W.ignored}</button>
</div></div>
<div style="max-width:300px;margin-top:12px"><div class="nk-segmented wrap">
  <button class="active">${W.all}</button><button>⚠️ ${W.attention}</button><button>${W.failed}</button><button>${W.read}</button><button>${W.ignored}</button>
</div></div>`,
},
{
  id: 'nk-banner', group: 'gallery', classes: ['nk-banner', 'info', 'success', 'warning', 'danger', 'b-action'],
  title: { en: 'Banner', de: 'Banner' },
  desc: {
    en: 'A full-width notice in four tones, tinted the way Notion colours a block: a soft <code>--nk-tint-*</code> background under the normal text colour. <code>.b-action</code> pushes an underlined action to the right edge.',
    de: 'Ein Hinweis über die volle Breite in vier Tönen, getönt wie Notion einen Block färbt: ein weicher <code>--nk-tint-*</code>-Hintergrund unter der normalen Textfarbe. <code>.b-action</code> schiebt eine unterstrichene Aktion an den rechten Rand.',
  },
  mobile: { en: 'The action stays on the same line; wrap the banner content yourself if it gets crowded.', de: 'Die Aktion bleibt in derselben Zeile; bei Enge den Banner-Inhalt selbst umbrechen lassen.' },
  html: W => `<div class="nk-banner info">ℹ️ ${W.bannerInfo}<span class="b-action">${W.bannerAction}</span></div>
<div class="nk-banner success">✅ ${W.bannerSuccess}</div>
<div class="nk-banner warning">⚠️ ${W.bannerWarning}<span class="b-action">${W.bannerAction}</span></div>
<div class="nk-banner danger">⛔ ${W.bannerDanger}</div>`,
},
{
  id: 'nk-avatar-group', group: 'gallery', classes: ['nk-avatar-group', 'mini-avatar', 'more'],
  title: { en: 'Avatar group', de: 'Avatar-Gruppe' },
  desc: {
    en: 'Overlapping avatars with a page-coloured ring, so they read as a stack. The group sizes each <code>.nk-avatar</code> (or the older <code>.mini-avatar</code>) to 26px; <code>.more</code> carries the remainder. The <code>:first-child</code> reset lives inside the group and has a <code>::slotted()</code> twin.',
    de: 'Überlappende Avatare mit einem Ring in Seitenfarbe, damit sie als Stapel lesbar sind. Die Gruppe bringt jeden <code>.nk-avatar</code> (oder den älteren <code>.mini-avatar</code>) auf 26px; <code>.more</code> trägt den Rest. Der <code>:first-child</code>-Reset liegt in der Gruppe und hat einen <code>::slotted()</code>-Zwilling.',
  },
  mobile: { en: 'Unchanged. Cap the count and let <code>.more</code> carry the remainder.', de: 'Unverändert. Die Anzahl deckeln und den Rest über <code>.more</code> anzeigen.' },
  html: W => `<div style="display:flex;align-items:center;gap:10px">
  <div class="nk-avatar-group">
    <span class="nk-avatar purple">AL</span>
    <span class="nk-avatar blue">TW</span>
    <span class="nk-avatar green">SL</span>
    <span class="nk-avatar more">+2</span>
  </div>
  <span style="font-size:13px;color:var(--nk-text-tertiary)">${W.peopleAccess}</span>
</div>`,
},
{
  id: 'nk-avatar', group: 'gallery', classes: ['nk-avatar', 'small', 'large', 'xlarge', 'square', 'gray', 'brown', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'red'],
  title: { en: 'Avatar', de: 'Avatar' },
  desc: {
    en: 'A person or a workspace: initials, an emoji or a photo in a circle. 24px by default, <code>small</code> 20px as in cells and properties, <code>large</code> 32px, <code>xlarge</code> 56px as in a profile. Without a colour it takes the avatar gradient; the nine colour names take Notion\'s mid-tones, so no hex value ever lands in the markup. <code>square</code> gives it the corners of a workspace icon. It works on an <code>&lt;img&gt;</code> as well as on a box holding one. In a member row, a mention or an avatar group the place sizes it, as it always did.',
    de: 'Eine Person oder ein Workspace: Initialen, ein Emoji oder ein Foto in einem Kreis. 24px als Standard, <code>small</code> 20px wie in Zellen und Eigenschaften, <code>large</code> 32px, <code>xlarge</code> 56px wie in einem Profil. Ohne Farbe nimmt er den Avatar-Verlauf; die neun Farbnamen nehmen Notions Mitteltöne, ein Hex-Wert landet also nie im Markup. <code>square</code> gibt ihm die Ecken eines Workspace-Icons. Er funktioniert an einem <code>&lt;img&gt;</code> genauso wie an einem Kasten, der eines enthält. In einer Mitgliederzeile, einer Erwähnung oder einer Avatar-Gruppe bestimmt der Ort die Größe, wie bisher.',
  },
  mobile: { en: 'Unchanged. A fixed size, so a row of avatars never reflows.', de: 'Unverändert. Eine feste Größe, eine Reihe von Avataren fließt also nie um.' },
  html: W => `<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
  <span class="nk-avatar small blue">TW</span>
  <span class="nk-avatar">AL</span>
  <span class="nk-avatar green">SL</span>
  <span class="nk-avatar large orange">MK</span>
  <span class="nk-avatar xlarge purple">AL</span>
  <span class="nk-avatar large gray">🦊</span>
  <span class="nk-avatar large square">A</span>
  <span class="nk-avatar large"><img src="${W.asset}covers/tide.svg" alt=""></span>
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
  id: 'nk-empty', group: 'gallery', classes: ['nk-empty', 'e-icon', 'e-title', 'e-desc', 'e-actions'],
  title: { en: 'Empty state', de: 'Leerzustand' },
  desc: {
    en: 'A dashed frame with icon, title and one explanatory line, then the way out of the empty state. One action can stand on its own; several go into <code>.e-actions</code>, a centred row that wraps with 8px between the buttons.',
    de: 'Ein gestrichelter Rahmen mit Icon, Titel und einer erklärenden Zeile, darunter der Weg aus dem Leerzustand. Eine Aktion darf allein stehen; mehrere kommen in <code>.e-actions</code>, eine zentrierte Zeile, die mit 8px Abstand zwischen den Knöpfen umbricht.',
  },
  mobile: { en: 'Centred and fluid; padding drops naturally with the container.', de: 'Zentriert und fließend; das Padding folgt dem Container.' },
  html: W => `<div class="nk-empty" style="max-width:420px">
  <div class="e-icon">🗂️</div>
  <div class="e-title">${W.emptyTitle}</div>
  <div class="e-desc">${W.emptyDesc}</div>
  <div class="e-actions"><button class="nk-btn primary small">${W.emptyBtn}</button><button class="nk-btn secondary small">${W.importBtn}</button></div>
</div>`,
},
{
  id: 'nk-steps', group: 'gallery', classes: ['nk-steps', 'nk-step', 'st-mark', 'st-desc', 'done', 'current'],
  title: { en: 'Steps', de: 'Schritte' },
  desc: {
    en: 'Steps through a short flow – connecting an account, setting up a model – calm and vertical: a numbered circle per step joined by a hairline, done steps on the green tag with a check, the current one ringed in the accent and marked <code>aria-current="step"</code>, the rest quiet. <code>.st-desc</code> adds a line under a step. Not a Notion block; in Notion\'s idiom it is a numbered list with checks.',
    de: 'Schritte durch einen kurzen Ablauf – ein Konto verbinden, ein Modell einrichten –, ruhig und vertikal: ein nummerierter Kreis pro Schritt, verbunden durch eine Haarlinie, erledigte Schritte mit Haken auf dem grünen Tag, der aktuelle im Akzent umrandet und mit <code>aria-current="step"</code> markiert, der Rest leise. <code>.st-desc</code> ergänzt eine Zeile unter einem Schritt. Kein Notion-Block; in Notions Sprache ist es eine nummerierte Liste mit Haken.',
  },
  mobile: { en: 'Unchanged: vertical, so it never runs out of width.', de: 'Unverändert: vertikal, die Breite geht also nie aus.' },
  html: W => `<ol class="nk-steps" aria-label="${W.stepsLabel}">
  <li class="nk-step done"><span class="st-mark">✓</span><span>${W.stepProvider}<span class="st-desc">${W.stepProviderDesc}</span></span></li>
  <li class="nk-step current" aria-current="step"><span class="st-mark">2</span><span>${W.stepKey}</span></li>
  <li class="nk-step"><span class="st-mark">3</span><span>${W.stepTest}</span></li>
</ol>`,
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
    <span class="nk-avatar green">SL</span>
    <div><div class="c-head"><b>${W.commentAuthor}</b> ${W.commentWhen}</div><div class="c-body">${W.commentBody}</div></div>
  </div>
  <div class="nk-comment-input">
    <input class="nk-input" placeholder="${W.commentPlaceholder}"><button class="nk-btn primary small">${W.send}</button>
  </div>
</div>`,
},
{
  id: 'nk-ai-thread', group: 'collab', classes: ['nk-ai-thread', 'nk-ai-msg', 'user', 'bubble', 'a-name', 'a-body', 'nk-ai-actions', 'nk-ai-input-row', 'nk-ai-send'],
  title: { en: 'AI thread', de: 'KI-Faden' },
  desc: {
    en: 'An assistant conversation as part of the document, not a floating widget. <code>.user</code> gives the message the gradient avatar; the assistant keeps the neutral callout circle. <code>bubble</code> sets a message as a grey bubble without avatar or name – with <code>.user</code> on the right, the way Notion\'s AI chat shows your own question. The input row glows on <code>:focus-within</code>.',
    de: 'Ein Assistenten-Gespräch als Teil des Dokuments, kein schwebendes Widget. <code>.user</code> gibt der Nachricht den Verlauf-Avatar; der Assistent behält den neutralen Callout-Kreis. <code>bubble</code> setzt eine Nachricht als graue Blase ohne Avatar und Namen – mit <code>.user</code> rechts, so wie Notions KI-Chat die eigene Frage zeigt. Die Eingabezeile leuchtet bei <code>:focus-within</code> auf.',
  },
  mobile: { en: 'Flows naturally. The input row is a flex line with a fixed 26px send button.', de: 'Fließt natürlich. Die Eingabezeile ist eine flex-Zeile mit fixem 26px-Sendeknopf.' },
  html: W => `<div style="max-width:460px">
  <div class="nk-ai-thread">
    <div class="nk-ai-msg user">
      <span class="mini-avatar">AL</span>
      <div><div class="a-name">${W.you}</div><div class="a-body">${W.aiUser}</div></div>
    </div>
    <div class="nk-ai-msg user bubble"><div class="a-body">${W.bubbleQuestion}</div></div>
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
