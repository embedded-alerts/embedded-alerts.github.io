import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync, readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const page = readFileSync('src/pages/index.astro', 'utf8');

test('site uses a pinned Astro build with artifact verification', () => {
  assert.equal(pkg.dependencies.astro, '7.1.4');
  assert.equal(pkg.scripts.build, 'astro build && node scripts/verify-built-site.mjs');
  assert.equal(existsSync('scripts/verify-built-site.mjs'), true);
});

test('site is not configured as Jekyll', () => {
  assert.equal(existsSync('_config.yml'), false);
  assert.equal(existsSync('_layouts'), false);
  assert.equal(existsSync('_includes'), false);
});

test('native Astro page owns metadata and styling', () => {
  assert.match(page, /import ['"]\.\.\/styles\/global\.css['"]/);
  assert.match(page, /<meta name="description"/);
  assert.match(page, /<link rel="canonical"/);
  assert.match(page, /<title>Embedded Alerts/);
  assert.doesNotMatch(page, /index\.html\?raw/);
  assert.doesNotMatch(page, /<head\s+set:html=/);
});

test('landing page includes product storytelling sections', () => {
  assert.match(page, /id="platform"/);
  assert.match(page, /id="workflow"/);
  assert.match(page, /id="integrations"/);
  assert.match(page, /Embedded Alerts/);
});

test('Pages workflow installs without assuming a lockfile', () => {
  const pages = readFileSync('.github/workflows/pages.yml', 'utf8');
  assert.match(pages, /npm install --no-audit --no-fund/);
  assert.doesNotMatch(pages, /npm ci/);
});
