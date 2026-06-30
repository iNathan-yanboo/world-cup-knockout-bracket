import test from 'node:test';
import assert from 'node:assert/strict';

import { createInitialState, selectWinner } from '../src/bracket-engine.js';
import { defaultPicks, lockedResults, matches, sourceMeta, teams } from '../src/bracket-data.js';
import { renderBracket, renderSourceMeta } from '../src/render-view.js';

test('renders the split canvas bracket with confirmed locked winners', () => {
  const state = createInitialState(defaultPicks);
  const html = renderBracket(state, matches, teams, lockedResults);

  assert.match(html, /淘汰赛画布/);
  assert.match(html, /左半区 32强/);
  assert.match(html, /右半区 32强/);
  assert.match(html, /世界冠军/);
  assert.match(html, /champion-trophy-burst\.png/);
  assert.match(html, /class="match-card is-final"/);
  assert.match(html, /data-stage="champion"/);
  assert.match(html, /connector/);
  assert.match(html, /data-match-id="73"/);
  assert.match(html, /加拿大/);
  assert.match(html, /巴拉圭/);
  assert.match(html, /巴西/);
  assert.match(html, /已确认/);
  assert.match(html, /巴拉圭 1-1 德国，点球 4-3 晋级/);
  assert.match(html, /team-button is-selected is-locked/);
  assert.match(html, /disabled/);
  assert.match(html, /flagcdn\.com\/w80\/ca\.png/);
  assert.match(html, /is-selected/);
});

test('renders placeholders for unresolved future slots', () => {
  const state = createInitialState(defaultPicks);
  const html = renderBracket(state, matches, teams, lockedResults);

  assert.match(html, /胜者 M77/);
  assert.match(html, /is-placeholder/);
  assert.doesNotMatch(html, /Not played at snapshot time/);
  assert.doesNotMatch(html, /Winner M\d+/);
});

test('renders champion once final winner is selected', () => {
  let state = createInitialState(defaultPicks);

  for (const [matchId, teamId] of [
    ['77', 'FRA'],
    ['89', 'PAR'],
    ['75', 'NED'],
    ['90', 'CAN'],
    ['97', 'PAR'],
    ['83', 'POR'],
    ['84', 'ESP'],
    ['93', 'ESP'],
    ['81', 'USA'],
    ['82', 'BEL'],
    ['94', 'USA'],
    ['98', 'ESP'],
    ['101', 'PAR'],
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
    state = selectWinner(matchId, teamId, state, matches, lockedResults);
  }

  const html = renderBracket(state, matches, teams, lockedResults);
  assert.match(html, /阿根廷/);
  assert.match(html, /总冠军/);
  assert.match(html, /champion-flag/);
  assert.match(html, /flagcdn\.com\/w80\/ar\.png/);
  assert.match(html, /champion-name/);
});

test('places the champion showcase above the final card with a connector', () => {
  const state = createInitialState(defaultPicks);
  const html = renderBracket(state, matches, teams, lockedResults);
  const finalBlock = [...html.matchAll(/<article[\s\S]*?<\/article>/g)]
    .map((match) => match[0])
    .find((block) => block.includes('data-match-id="104"'));
  const championBlock = /<section class="champion-hub[\s\S]*?<\/section>/.exec(html)?.[0];
  const finalTop = Number(/top:(\d+)px/.exec(finalBlock)?.[1]);
  const championTop = Number(/top:(\d+)px/.exec(championBlock)?.[1]);

  assert.ok(championTop < finalTop);
  assert.match(html, /connector-to-champion/);
});

test('renders source metadata with snapshot date and source links', () => {
  const html = renderSourceMeta(sourceMeta, { state: 'synced', message: '已同步至 2026-06-30' });

  assert.match(html, /2026-06-30/);
  assert.match(html, /FIFA/);
  assert.match(html, /href=/);
  assert.match(html, /已同步至 2026-06-30/);
});
