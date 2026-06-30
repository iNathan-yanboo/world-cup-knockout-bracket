import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');

test('disables text selection while dragging the bracket canvas', () => {
  const viewportRule = /\.bracket-viewport\s*\{(?<body>[^}]*)\}/.exec(css);

  assert.ok(viewportRule);
  assert.match(viewportRule.groups.body, /user-select:\s*none;/);
});

test('keeps the mobile header compact so the canvas remains visible', () => {
  const mobileRule = /@media \(max-width: 860px\) \{(?<body>[\s\S]*)\n\}/.exec(css);

  assert.ok(mobileRule);
  assert.match(mobileRule.groups.body, /\.eyebrow\s*\{[^}]*display:\s*none;/);
  assert.match(mobileRule.groups.body, /\.snapshot-line\s*\{[^}]*display:\s*none;/);
  assert.match(mobileRule.groups.body, /\.toolbar\s*\{[^}]*flex-wrap:\s*nowrap;/);
  assert.match(mobileRule.groups.body, /\.toolbar\s*\{[^}]*overflow-x:\s*auto;/);
  assert.match(mobileRule.groups.body, /\.tool-button,\s*\n\s*\.zoom-readout\s*\{[^}]*min-height:\s*34px;/);
});
