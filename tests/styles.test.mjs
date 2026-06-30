import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');

test('disables text selection while dragging the bracket canvas', () => {
  const viewportRule = /\.bracket-viewport\s*\{(?<body>[^}]*)\}/.exec(css);

  assert.ok(viewportRule);
  assert.match(viewportRule.groups.body, /user-select:\s*none;/);
});
