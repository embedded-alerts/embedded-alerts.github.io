import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync, existsSync } from 'node:fs';
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const page = readFileSync('src/pages/index.astro', 'utf8');
test('site uses Astro dependency and scripts', () => { assert.ok(pkg.dependencies.astro); assert.equal(pkg.scripts.build, 'astro build'); });
test('site is not configured as Jekyll', () => { assert.equal(existsSync('_config.yml'), false); assert.equal(existsSync('_layouts'), false); assert.equal(existsSync('_includes'), false); });
test('landing page includes product storytelling sections', () => { assert.match(page, /id="platform"/); assert.match(page, /id="workflow"/); assert.match(page, /id="integrations"/); assert.match(page, /Embedded\ Alerts/); });

test('site pins Astro and deploys without a missing lockfile', () => {
  assert.equal(pkg.dependencies.astro, '7.1.4');
  const pages = readFileSync('.github/workflows/pages.yml', 'utf8');
  assert.match(pages, /npm install --no-audit --no-fund/);
  assert.doesNotMatch(pages, /npm ci/);
});
