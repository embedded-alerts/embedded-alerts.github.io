import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

const page = readFileSync('src/pages/index.astro', 'utf8');
const network = readFileSync('src/components/VentureNetwork.astro', 'utf8');
const expectedLinks = [
  'https://apostille-me.github.io/',
  'https://hacker-house-medellin.github.io/',
  'https://embedded-alerts.github.io/',
  'https://evento-globolo.github.io/',
  'https://github.com/agent-pontifex',
  'https://github.com/gha-indie-worker',
];

test('mounts the venture network from primary navigation', () => {
  assert.match(page, /import VentureNetwork/);
  assert.match(page, /href="#network"/);
  assert.match(page, /<VentureNetwork current="[a-z-]+" \/>/);
});

test('links the six youngest active non-test organizations', () => {
  assert.match(network, /id="network"/);
  assert.match(network, /Explore the six youngest active organizations/);
  for (const href of expectedLinks) assert.ok(network.includes(href), `missing venture link: ${href}`);
});

test('network remains responsive and motion-safe', () => {
  assert.match(network, /repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(network, /prefers-reduced-motion/);
});
