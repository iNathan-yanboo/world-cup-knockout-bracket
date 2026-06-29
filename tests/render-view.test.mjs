import test from 'node:test';
import assert from 'node:assert/strict';

import { createInitialState, selectWinner } from '../src/bracket-engine.js';
import { defaultPicks, matches, sourceMeta, teams } from '../src/bracket-data.js';
import { renderBracket, renderSourceMeta } from '../src/render-view.js';

test('renders round columns and Canada as the selected default winner', () => {
  const state = createInitialState(defaultPicks);
  const html = renderBracket(state, matches, teams);

  assert.match(html, /Round of 32/);
  assert.match(html, /Champion/);
  assert.match(html, /data-match-id="73"/);
  assert.match(html, /Canada/);
  assert.match(html, /is-selected/);
});

test('renders placeholders for unresolved future slots', () => {
  const state = createInitialState(defaultPicks);
  const html = renderBracket(state, matches, teams);

  assert.match(html, /Winner M74/);
  assert.match(html, /is-placeholder/);
});

test('renders champion once final winner is selected', () => {
  let state = createInitialState(defaultPicks);

  for (const [matchId, teamId] of [
    ['74', 'GER'],
    ['77', 'FRA'],
    ['89', 'GER'],
    ['75', 'NED'],
    ['90', 'CAN'],
    ['97', 'GER'],
    ['83', 'POR'],
    ['84', 'ESP'],
    ['93', 'ESP'],
    ['81', 'USA'],
    ['82', 'BEL'],
    ['94', 'USA'],
    ['98', 'ESP'],
    ['101', 'GER'],
    ['76', 'BRA'],
    ['78', 'NOR'],
    ['91', 'BRA'],
    ['79', 'MEX'],
    ['80', 'ENG'],
    ['92', 'ENG'],
    ['99', 'BRA'],
    ['86', 'ARG'],
    ['88', 'EGY'],
    ['95', 'ARG'],
    ['85', 'SUI'],
    ['87', 'COL'],
    ['96', 'COL'],
    ['100', 'ARG'],
    ['102', 'ARG'],
    ['104', 'ARG']
  ]) {
    state = selectWinner(matchId, teamId, state, matches);
  }

  const html = renderBracket(state, matches, teams);
  assert.match(html, /Argentina/);
  assert.match(html, /champion-name/);
});

test('renders source metadata with snapshot date and source links', () => {
  const html = renderSourceMeta(sourceMeta);

  assert.match(html, /2026-06-29/);
  assert.match(html, /FIFA/);
  assert.match(html, /href=/);
});
