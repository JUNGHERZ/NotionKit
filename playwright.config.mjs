import { defineConfig } from '@playwright/test';

// Regression tests for the stylesheet. They run against the repository root
// served statically – notionkit.css, the built notionkit-styles.js and the
// demo pages – so build first: `npm run build && npm test`.
export default defineConfig({
  testDir: 'test',
  testMatch: /.*\.spec\.mjs/,
  outputDir: 'test/.artifacts/results',
  fullyParallel: true,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:4174',
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  },
  webServer: {
    command: 'node test/server.mjs 4174',
    url: 'http://127.0.0.1:4174/package.json',
    reuseExistingServer: true,
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});
