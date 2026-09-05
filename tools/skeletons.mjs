// The six app skeletons for SKILL.md §5. Each is a complete document.
const CDN = 'https://cdn.jsdelivr.net/npm/@jungherz-de/notionkit@1/notionkit.min.css';
const head = (title) => `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="stylesheet" href="${CDN}">
</head>`;

export const SKELETONS = [
{
  n: 1, title: 'Workspace app',
  when: 'The default for Notion-like document apps: a page tree on the left, one document at a time on the right, an editor mounted into the page. Pick this when *pages* are the primary object.',
  html: `${head('Workspace')}
<body class="nk-body">
<div class="nk-app">

  <aside class="nk-sidebar">
    <div class="nk-workspace"><div class="avatar">A</div>Acme Inc<span class="chev">⌄</span></div>
    <div class="nk-sidebar-scroll">
      <div class="nk-tree-item"><span class="icon">🔍</span><span class="label">Search</span><span class="nk-kbd-hint"><kbd class="nk-kbd">⌘</kbd><kbd class="nk-kbd">K</kbd></span></div>
      <div class="nk-tree-item"><span class="icon">🏠</span><span class="label">Home</span></div>
      <div class="nk-section-label">Pages<span class="plus">＋</span></div>
      <div class="nk-tree-item active"><span class="nk-toggle-arrow open">▶</span><span class="icon">🚀</span><span class="label">Roadmap</span><span class="actions"><span>＋</span><span>⋯</span></span></div>
      <div class="nk-tree-children">
        <div class="nk-tree-item"><span class="icon">📄</span><span class="label">Q3 goals</span></div>
      </div>
      <div class="nk-tree-item"><span class="icon">📚</span><span class="label">Knowledge base</span></div>
    </div>
    <div class="nk-sidebar-footer">
      <div class="nk-tree-item"><span class="icon">⚙️</span><span class="label">Settings</span></div>
    </div>
  </aside>

  <main class="nk-main">
    <header class="nk-topbar">
      <div class="nk-breadcrumb"><span class="crumb">🚀 Roadmap</span><span class="sep">/</span><span class="crumb current">📄 Q3 goals</span></div>
      <div class="nk-topbar-actions">
        <button class="nk-topbar-btn nk-share-btn">Share</button>
        <button class="nk-topbar-btn nk-theme-toggle" id="themeToggle">🌙</button>
        <button class="nk-topbar-btn">⋯</button>
      </div>
    </header>
    <div class="nk-page-scroll">
      <div class="nk-cover"></div>
      <div class="nk-page">
        <div class="nk-page-icon">📄</div>
        <h1 class="nk-page-title" contenteditable="true">Q3 goals</h1>
        <div class="nk-page-meta"><span>👤 Ada Lovelace</span><span>📅 Created 12 May 2026</span></div>
        <div class="nk-callout"><span class="c-icon">💡</span><div><b>Core idea:</b> NotionKit draws the shell; the editor below is TipTap.</div></div>

        <!-- The editor surface. Mount TipTap/BlockNote/Novel into this host (§6). -->
        <div class="nk-block-host" id="editor"></div>
      </div>
    </div>
  </main>

</div>

<script>
  // The whole theme contract: one attribute on <html>.
  document.getElementById('themeToggle').addEventListener('click', () => {
    const r = document.documentElement;
    r.setAttribute('data-theme', r.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });
</script>
</body>
</html>`,
},
{
  n: 2, title: 'Database app',
  when: 'Structured, data-centric apps – a CRM, a tracker, an editorial calendar – where the main space is a table or board and pages are secondary. Pick this when *rows* are the primary object.',
  html: `${head('Tracker')}
<body class="nk-body">
<div class="nk-app">

  <aside class="nk-sidebar">
    <div class="nk-workspace"><div class="avatar">T</div>Tracker<span class="chev">⌄</span></div>
    <div class="nk-sidebar-scroll">
      <div class="nk-section-label">Databases</div>
      <div class="nk-tree-item active"><span class="icon">🗃️</span><span class="label">Projects</span></div>
      <div class="nk-tree-item"><span class="icon">👥</span><span class="label">Contacts</span></div>
    </div>
  </aside>

  <main class="nk-main">
    <header class="nk-topbar">
      <div class="nk-breadcrumb"><span class="crumb current">🗃️ Projects</span></div>
      <div class="nk-topbar-actions"><button class="nk-btn primary small">＋ New</button></div>
    </header>
    <div class="nk-page-scroll">
      <div class="nk-page" style="max-width: none">
        <h1 class="nk-page-title">Projects</h1>

        <div class="nk-database">
          <div class="nk-db-tabs">
            <div class="nk-db-tab active" data-view="table">▦ Table<span class="badge">2</span></div>
            <div class="nk-db-tab" data-view="board">▤ Board</div>
          </div>

          <div class="nk-table-wrap" id="view-table"><table class="nk-table">
            <thead><tr>
              <th><span class="th-icon">📄</span>Name</th><th><span class="th-icon">◉</span>Status</th>
              <th><span class="th-icon">👤</span>Owner</th><th><span class="th-icon">📊</span>Progress</th>
            </tr></thead>
            <tbody>
              <tr><td><span class="row-title">🚀 Roadmap</span></td><td><span class="nk-tag green">Done</span></td>
                  <td><span class="person-cell"><span class="mini-avatar" style="background:var(--nk-decor-purple)">AL</span>Ada</span></td>
                  <td><span class="nk-progress"><i style="width:100%"></i></span><span class="nk-progress-label">100 %</span></td></tr>
              <tr><td><span class="row-title">🎨 Design system</span></td><td><span class="nk-tag blue">In progress</span></td>
                  <td><span class="person-cell"><span class="mini-avatar" style="background:var(--nk-decor-blue)">TW</span>Tom</span></td>
                  <td><span class="nk-progress"><i style="width:65%"></i></span><span class="nk-progress-label">65 %</span></td></tr>
            </tbody>
          </table><div class="nk-new-row">＋ New row</div></div>

          <div class="nk-board" id="view-board">
            <div class="nk-board-col">
              <div class="nk-board-col-header"><span class="nk-tag blue">In progress</span><span class="count">1</span></div>
              <div class="nk-card"><div class="card-title">🎨 Design system</div><div class="card-meta">Tom · 20 May</div></div>
            </div>
            <div class="nk-board-col">
              <div class="nk-board-col-header"><span class="nk-tag green">Done</span><span class="count">1</span></div>
              <div class="nk-card"><div class="card-title">🚀 Roadmap</div><div class="card-meta">Ada · 12 May</div></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </main>

</div>

<script>
  // View switch contract: .active on the tab, .active on the board (it is display:none by default).
  document.querySelectorAll('.nk-db-tab').forEach(tab => tab.addEventListener('click', () => {
    document.querySelectorAll('.nk-db-tab').forEach(t => t.classList.toggle('active', t === tab));
    const board = tab.dataset.view === 'board';
    document.getElementById('view-table').hidden = board;
    document.getElementById('view-board').classList.toggle('active', board);
  }));
</script>
</body>
</html>`,
},
{
  n: 3, title: 'Settings modal integration',
  when: 'You have an app already and need the settings overlay – nav on the left, panes on the right, opened from anywhere. Pick this to add settings to skeleton 1 or 2; the open/close contract is the single class `open`.',
  html: `${head('Settings')}
<body class="nk-body">

<button class="nk-btn secondary" id="openSettings" style="margin: 24px">⚙️ Open settings</button>

<!-- Backdrop + modal. Hidden until .open is added to the backdrop. -->
<div class="nk-modal-backdrop" id="settings">
  <div class="nk-modal" role="dialog" aria-modal="true" aria-labelledby="settingsTitle">

    <nav class="nk-settings-nav">
      <div class="nk-settings-user">
        <div class="avatar">AL</div>
        <div class="u-text"><div class="name">Ada Lovelace</div><div class="mail">ada@acme.com</div></div>
      </div>
      <div class="nk-section-label">Account</div>
      <div class="nk-tree-item active" data-pane="profile"><span class="icon">👤</span><span class="label">My profile</span></div>
      <div class="nk-tree-item" data-pane="appearance"><span class="icon">🎨</span><span class="label">Appearance</span></div>
      <div class="nk-section-label">Workspace</div>
      <div class="nk-tree-item" data-pane="general"><span class="icon">🏢</span><span class="label">General</span></div>
    </nav>

    <div class="nk-settings-content">
      <div class="nk-settings-pane active" id="pane-profile">
        <h2 id="settingsTitle">My profile</h2>
        <div class="nk-profile-row"><div class="big-avatar">AL</div><div><button class="nk-btn secondary small">Upload image</button></div></div>
        <div class="nk-field"><div><div class="f-label">Display name</div><div class="f-desc">How you appear in the workspace.</div></div>
          <div class="f-control"><input class="nk-input" value="Ada Lovelace"></div></div>
        <div class="nk-field"><div><div class="f-label">Email</div></div>
          <div class="f-control"><input class="nk-input" value="ada@acme.com"></div></div>
        <div style="display:flex;gap:8px;margin-top:16px"><button class="nk-btn primary">Save changes</button><button class="nk-btn secondary">Discard</button></div>
      </div>

      <div class="nk-settings-pane" id="pane-appearance">
        <h2>Appearance</h2>
        <div class="nk-field"><div><div class="f-label">Theme</div><div class="f-desc">Light, dark, or follow the system.</div></div>
          <div class="f-control"><select class="nk-select"><option>Light</option><option>Dark</option><option>System</option></select></div></div>
        <div class="nk-field"><div><div class="f-label">Compact view</div></div>
          <div class="f-control"><button class="nk-switch" role="switch" aria-checked="false"></button></div></div>
      </div>

      <div class="nk-settings-pane" id="pane-general">
        <h2>General</h2>
        <div class="nk-field"><div><div class="f-label">Workspace name</div></div>
          <div class="f-control"><input class="nk-input" value="Acme Inc"></div></div>
        <div class="nk-danger-zone">
          <div class="dz-title">⚠️ Danger zone</div>
          <div class="nk-field" style="padding-top:0"><div><div class="f-label">Delete workspace</div><div class="f-desc">Irreversibly removes all pages, databases and members.</div></div>
            <div class="f-control"><button class="nk-btn danger-solid small">Delete</button></div></div>
        </div>
      </div>
    </div>

  </div>
</div>

<script>
  const backdrop = document.getElementById('settings');
  const open  = () => backdrop.classList.add('open');
  const close = () => backdrop.classList.remove('open');
  document.getElementById('openSettings').addEventListener('click', open);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) close(); });   // click outside
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  // Pane switch: .active on the nav item and on the matching pane.
  document.querySelectorAll('.nk-settings-nav [data-pane]').forEach(item => item.addEventListener('click', () => {
    document.querySelectorAll('.nk-settings-nav [data-pane]').forEach(i => i.classList.toggle('active', i === item));
    document.querySelectorAll('.nk-settings-pane').forEach(p => p.classList.toggle('active', p.id === 'pane-' + item.dataset.pane));
  }));

  // Switch contract: flip aria-checked; the library draws the state.
  document.querySelectorAll('.nk-switch[role="switch"]').forEach(sw => sw.addEventListener('click', () =>
    sw.setAttribute('aria-checked', sw.getAttribute('aria-checked') === 'true' ? 'false' : 'true')));
</script>
</body>
</html>`,
},
{
  n: 4, title: 'AI chat page',
  when: 'Assistant-centred apps where the conversation *is* the document: a page with a thread and an input row, optionally with a sidebar of past threads. Pick this when the assistant, not a page tree, is the centre of gravity.',
  html: `${head('Assistant')}
<body class="nk-body">
<div class="nk-app">

  <aside class="nk-sidebar">
    <div class="nk-workspace"><div class="avatar">✨</div>Mona<span class="chev">⌄</span></div>
    <div class="nk-sidebar-scroll">
      <div class="nk-tree-item"><span class="icon">＋</span><span class="label">New thread</span></div>
      <div class="nk-section-label">Recent</div>
      <div class="nk-tree-item active"><span class="icon">💬</span><span class="label">Open tasks summary</span></div>
      <div class="nk-tree-item"><span class="icon">💬</span><span class="label">Draft the release notes</span></div>
    </div>
  </aside>

  <main class="nk-main">
    <header class="nk-topbar">
      <div class="nk-breadcrumb"><span class="crumb current">💬 Open tasks summary</span></div>
      <div class="nk-topbar-actions"><button class="nk-topbar-btn">⋯</button></div>
    </header>
    <div class="nk-page-scroll">
      <div class="nk-page" style="padding-top: 24px">

        <div class="nk-ai-thread" id="thread">
          <div class="nk-ai-msg user">
            <span class="mini-avatar">AL</span>
            <div><div class="a-name">You</div><div class="a-body">Summarise the open tasks for this project.</div></div>
          </div>
          <div class="nk-ai-msg">
            <span class="mini-avatar">✨</span>
            <div>
              <div class="a-name">Mona <span>· AI</span></div>
              <div class="a-body">Two tasks are open: the table view sits at 65 %, the board with drag and drop is planned.</div>
              <div class="nk-ai-actions"><button>📋 Copy</button><button>↻ Rephrase</button><button>👍</button></div>
            </div>
          </div>
        </div>

        <div class="nk-ai-input-row">
          <span>✨</span>
          <input id="prompt" placeholder="Ask Mona something …">
          <button class="nk-ai-send" id="send">↑</button>
        </div>

      </div>
    </div>
  </main>

</div>

<script>
  // Append a user message; the reply comes from your backend.
  document.getElementById('send').addEventListener('click', () => {
    const input = document.getElementById('prompt');
    if (!input.value.trim()) return;
    document.getElementById('thread').insertAdjacentHTML('beforeend',
      '<div class="nk-ai-msg user"><span class="mini-avatar">AL</span><div><div class="a-name">You</div><div class="a-body"></div></div></div>');
    document.querySelector('#thread .nk-ai-msg:last-child .a-body').textContent = input.value;
    input.value = '';
  });
</script>
</body>
</html>`,
},
{
  n: 5, title: 'Form / onboarding page',
  when: 'An app – or a step of one – made entirely of form elements: onboarding, a profile wizard, a preferences page. No sidebar, no editor. Pick this to see that NotionKit stands on its own without a document surface.',
  html: `${head('Welcome')}
<body class="nk-body">
<div class="nk-page" style="padding-top: 48px">

  <h1 class="nk-page-title">Welcome to Acme</h1>
  <p class="lead">Three quick questions and your workspace is ready.</p>

  <div class="nk-banner info">ℹ️ You can change all of this later in Settings.<span class="b-action">Skip</span></div>

  <h2 class="nk-heading">1 · About you</h2>
  <div class="nk-field"><div><div class="f-label">Display name</div><div class="f-desc">How teammates see you.</div></div>
    <div class="f-control"><input class="nk-input" placeholder="Ada Lovelace"></div></div>
  <div class="nk-field"><div><div class="f-label">Role</div></div>
    <div class="f-control"><select class="nk-select"><option>Engineering</option><option>Design</option><option>Product</option></select></div></div>
  <div class="nk-field"><div><div class="f-label">About me</div><div class="f-desc">A short line for your profile.</div></div>
    <div class="f-control"><textarea class="nk-textarea" placeholder="A few words …"></textarea></div></div>

  <h2 class="nk-heading">2 · Preferences</h2>
  <div class="nk-field"><div><div class="f-label">Email digest</div><div class="f-desc">A weekly summary of activity.</div></div>
    <div class="f-control"><button class="nk-switch" role="switch" aria-checked="true"></button></div></div>
  <div class="nk-field"><div><div class="f-label">Reduce motion</div></div>
    <div class="f-control"><button class="nk-switch" role="switch" aria-checked="false"></button></div></div>
  <div class="nk-field"><div><div class="f-label">Density</div></div>
    <div class="f-control"><div class="nk-segmented"><button class="active">Comfortable</button><button>Compact</button></div></div></div>

  <h2 class="nk-heading">3 · Assistant</h2>
  <div class="nk-model-card selected"><div class="m-radio"></div><div>
    <div class="m-name">Mona Standard <span class="nk-tag green">Recommended</span></div>
    <div class="m-desc">A balanced model for everyday work.</div></div></div>
  <div class="nk-model-card"><div class="m-radio"></div><div>
    <div class="m-name">Mona Deep</div>
    <div class="m-desc">More depth for long documents. Answers more slowly.</div></div></div>

  <label class="nk-check" style="margin-top:16px"><input type="checkbox"> I agree to the terms</label>

  <hr class="nk-divider">
  <div style="display:flex;gap:8px"><button class="nk-btn primary">Create workspace</button><button class="nk-btn secondary">Back</button></div>

</div>
</body>
</html>`,
},
{
  n: 6, title: 'Landing / documentation page',
  when: 'A public page in the NotionKit look – documentation, a knowledge base article, a product page. A narrow page column without a sidebar or app shell; callouts, code, toggles, quotes. The precursor of NotionKit Web.',
  html: `${head('Getting started')}
<body class="nk-body">
<div class="nk-page" style="padding-top: 56px">

  <div class="nk-page-icon">📚</div>
  <h1 class="nk-page-title">Getting started</h1>
  <div class="nk-page-meta"><span>Updated 12 May 2026</span><span class="nk-tag blue">v1.0</span></div>
  <p class="lead">Everything you need to ship your first page with NotionKit, in about five minutes.</p>

  <div class="nk-callout"><span class="c-icon">💡</span><div><b>One stylesheet.</b> No build step, no JavaScript, no framework lock-in.</div></div>

  <h2 class="nk-heading">Install</h2>
  <div class="nk-code"><span class="lang">html</span>&lt;link rel="stylesheet" href="notionkit.css"&gt;</div>

  <h2 class="nk-heading">Set the theme</h2>
  <p>Put <code class="nk-inline-code">data-theme="dark"</code> on <code class="nk-inline-code">&lt;html&gt;</code>. Light is the default.</p>

  <details class="nk-toggle" open>
    <summary>Why is there no editor?</summary>
    <div class="toggle-body">A block editor is its own product. NotionKit ships the shell – <code class="nk-inline-code">nk-block-host</code> – and you mount TipTap, BlockNote or Novel into it.</div>
  </details>

  <blockquote class="nk-quote">Design is not just what it looks like. Design is how it works.<cite class="q-cite">— Steve Jobs</cite></blockquote>

  <hr class="nk-divider">

  <div class="nk-tabs"><div class="nk-tab active">Docs</div><div class="nk-tab">Showcase</div><div class="nk-tab">Changelog</div></div>
  <div class="nk-tab-panel">Panel content follows the tab strip and inherits the calm body type.</div>

  <div class="nk-empty" style="margin-top:32px">
    <div class="e-icon">💬</div><div class="e-title">No comments yet</div><div class="e-desc">Be the first to leave a note on this page.</div>
    <button class="nk-btn secondary small">＋ Comment</button>
  </div>

</div>
</body>
</html>`,
},
];
