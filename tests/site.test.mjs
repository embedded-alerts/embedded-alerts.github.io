import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync, readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const page = readFileSync('src/pages/index.astro', 'utf8');
const ci = readFileSync('.github/workflows/ci.yml', 'utf8');
const pages = readFileSync('.github/workflows/pages.yml', 'utf8');

test('site uses a pinned Astro build and committed dependency lock', () => {
  assert.equal(pkg.dependencies.astro, '7.1.4');
  assert.equal(pkg.scripts.build, 'astro build && node scripts/verify-built-site.mjs');
  assert.equal(existsSync('package-lock.json'), true);
  assert.equal(existsSync('scripts/verify-built-site.mjs'), true);
});

test('site is not configured as Jekyll', () => {
  assert.equal(existsSync('_config.yml'), false);
  assert.equal(existsSync('_layouts'), false);
  assert.equal(existsSync('_includes'), false);
});

test('native Astro source owns the complete document', () => {
  assert.match(page, /<!doctype html>/i);
  assert.match(page, /<head>/i);
  assert.match(page, /<body>/i);
  assert.match(page, /<meta name="description"/);
  assert.match(page, /<link rel="canonical"/);
  assert.match(page, /<link rel="icon" href="\/favicon\.svg"/);
  assert.match(page, /<title>Embedded Alerts/);
  assert.doesNotMatch(page, /index\.html\?raw/);
  assert.doesNotMatch(page, /set:html/);
});

test('landing page preserves its product-specific story', () => {
  assert.match(page, /id="platform"/);
  assert.match(page, /id="workflow"/);
  assert.match(page, /id="integrations"/);
  assert.match(page, /Embedded Alerts/);
  assert.match(page, /<style>/);
});

test('CI and Pages use locked installs in test-before-build order', () => {
  for (const workflow of [ci, pages]) {
    assert.match(workflow, /npm ci --ignore-scripts --no-audit --no-fund/);
    assert.doesNotMatch(workflow, /npm install/);
    assert.ok(workflow.indexOf('npm ci') < workflow.indexOf('npm test'));
    assert.ok(workflow.indexOf('npm test') < workflow.indexOf('npm run build'));
  }
});

test('third-party actions are pinned to full commit SHAs', () => {
  for (const workflow of [ci, pages]) {
    const references = [...workflow.matchAll(/uses:\s+([^\s#]+)/g)].map((match) => match[1]);
    assert.ok(references.length > 0);
    for (const reference of references) {
      assert.match(reference, /@[0-9a-f]{40}$/);
    }
  }
});
