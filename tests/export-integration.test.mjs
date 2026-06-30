import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const indexHtml = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const mainJs = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');

test('exposes a toolbar action for exporting the full bracket image', () => {
  assert.match(indexHtml, /id="export-snapshot"/);
  assert.match(indexHtml, />导出图片</);
});

test('wires snapshot export to the production domain attribution', () => {
  assert.match(mainJs, /exportBracketSnapshot/);
  assert.match(mainJs, /worldcup\.inathan\.wang/);
  assert.match(mainJs, /activeSourceMeta\.snapshotDate/);
});
