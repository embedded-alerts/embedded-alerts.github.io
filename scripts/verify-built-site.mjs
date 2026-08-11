import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const outputUrl = new URL('../dist/index.html', import.meta.url);
const html = readFileSync(outputUrl, 'utf8');
const head = html.match(/<head(?:\s[^>]*)?>([\s\S]*?)<\/head>/i)?.[1] ?? '';
const body = html.match(/<body(?:\s[^>]*)?>([\s\S]*?)<\/body>/i)?.[1] ?? '';

assert.ok(head.trim().length > 0, 'Astro output must contain a non-empty <head>.');
assert.match(head, /<title>[^<]+<\/title>/i, 'Astro output must contain a page title.');
assert.match(head, /<meta[^>]+name=["']description["']/i, 'Astro output must contain a meta description.');
assert.match(head, /<link[^>]+rel=["']canonical["']/i, 'Astro output must contain a canonical link.');
assert.ok(
  /<style(?:\s|>)/i.test(head) || /<link[^>]+rel=["']stylesheet["']/i.test(head),
  'Astro output must contain inline or linked CSS.',
);
assert.ok(body.trim().length > 200, 'Astro output body is unexpectedly empty.');
assert.doesNotMatch(html, /(?:src|href)=["'][^"']*\/src\//i, 'Built output must not reference source-only paths.');

console.log('Verified built GitHub Pages artifact: head, metadata, CSS, and body are present.');
