// sitemap.xml, robots.txt and llms.txt for the GitHub Pages site.
import { writeFileSync, readFileSync } from 'fs';
const pkg = JSON.parse(readFileSync('package.json', 'utf-8'));
const SITE = 'https://notionkit.jungherz.com';
const today = new Date().toISOString().slice(0, 10);

const pages = [
  ['index.html', 1.0], ['docs.html', 0.9], ['showcase.html', 0.8], ['app.html', 0.8], ['elements-poc.html', 0.5],
  ['de/index.html', 0.9], ['de/docs.html', 0.8], ['de/showcase.html', 0.7], ['de/app.html', 0.7],
];
const alt = p => {
  const de = p.startsWith('de/'); const base = de ? p.slice(3) : p;
  if (base === 'elements-poc.html') return '';
  return `\n    <xhtml:link rel="alternate" hreflang="en" href="${SITE}/${base}"/>` +
         `\n    <xhtml:link rel="alternate" hreflang="de" href="${SITE}/de/${base}"/>` +
         `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/${base}"/>`;
};
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pages.map(([p, prio]) => `  <url>
    <loc>${SITE}/${p === 'index.html' ? '' : p}</loc>
    <lastmod>${today}</lastmod>
    <priority>${prio.toFixed(1)}</priority>${alt(p)}
  </url>`).join('\n')}
</urlset>
`;
writeFileSync('sitemap.xml', sitemap);

writeFileSync('robots.txt', `User-agent: *
Allow: /
Disallow: /tools/

Sitemap: ${SITE}/sitemap.xml
`);

// https://llmstxt.org – a short, LLM-friendly map of the project.
writeFileSync('llms.txt', `# NotionKit

> A pure CSS component library (v${pkg.version}) in the Notion idiom – app shell, page tree, document, database views, forms, settings, overlays, collaboration and AI surfaces. ~100 \`nk-*\` classes, \`--nk-*\` design tokens, light & dark mode, no JavaScript, no build step. npm: \`@jungherz-de/notionkit\`.

The theme is one attribute: \`<html data-theme="dark">\`. Re-branding is one declaration: \`:root { --nk-accent: … }\`. The library ships state classes (\`active\`, \`open\`, \`collapsed\`, \`selected\`, \`show\`, \`aria-checked\`) but no behaviour. It ships no editor: mount TipTap, BlockNote or Novel into \`.nk-block-host\`.

## Start here

- [SKILL.md](${SITE}/SKILL.md): the complete AI reference – every component with copy-paste markup, token tables for both themes, state classes, six complete app skeletons, editor and web-component contracts, common mistakes. Read this first when generating NotionKit markup.
- [Documentation](${SITE}/docs.html): the same content with live previews and per-component mobile behaviour.
- [notionkit.css](${SITE}/notionkit.css): the stylesheet itself – token block first, component block second, commented.

## Reference

- [Showcase](${SITE}/showcase.html): every component isolated, both themes.
- [Demo app](${SITE}/app.html): a realistic workspace app with a live TipTap editor.
- [theme-override.css](${SITE}/theme-override.css): three example palettes and a measured high-contrast block.
- [README](${SITE}/README.md): installation (CDN, npm), quick start, component tables, browser support.
- [Elements proof of concept](${SITE}/elements-poc.html): web components adopting the component sheet; the seed of NotionKit Elements.

## Optional

- [German documentation](${SITE}/de/docs.html)
- [GitHub repository](https://github.com/JUNGHERZ/NotionKit)
- [npm package](https://www.npmjs.com/package/@jungherz-de/notionkit)
`);
console.log(`✅ sitemap.xml (${pages.length} URLs), robots.txt, llms.txt generated`);
