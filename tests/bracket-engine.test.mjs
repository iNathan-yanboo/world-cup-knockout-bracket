import test from 'node:test';
import assert from 'node:assert/strict';

import {
  applyLockedResults,
  createInitialState,
  getChampion,
  getLockedPicks,
  getMatchTeams,
  selectWinner,
  validateBracket
} from '../src/bracket-engine.js';
import { defaultPicks, lockedResults, matches, teams } from '../src/bracket-data.js';

test('snapshot data is internally valid', () => {
  const issues = validateBracket(matches, teams, lockedResults);
  assert.deepEqual(issues, []);
});

test('initial state preselects confirmed winners and propagates them into the next round', () => {
  const state = createInitialState(defaultPicks);
  const match89Teams = getMatchTeams('89', state, matches, teams);
  const match90Teams = getMatchTeams('90', state, matches, teams);
  const match91Teams = getMatchTeams('91', state, matches, teams);

  assert.equal(state.picks['73'], 'CAN');
  assert.equal(state.picks['74'], 'PAR');
  assert.equal(state.picks['75'], 'MAR');
  assert.equal(state.picks['76'], 'BRA');
  assert.deepEqual(getLockedPicks(lockedResults), defaultPicks);
  assert.deepEqual(
    match89Teams.map((team) => team && team.name),
    ['Paraguay', null]
  );
  assert.deepEqual(
    match90Teams.map((team) => team && team.name),
    ['Canada', 'Morocco']
  );
  assert.deepEqual(
    match91Teams.map((team) => team && team.name),
    ['Brazil', null]
  );
});

test('locked confirmed matches cannot be changed by manual selection', () => {
  const state = createInitialState(defaultPicks);
  const nextState = selectWinner('74', 'GER', state, matches, lockedResults);
  const nextMoroccoState = selectWinner('75', 'NED', state, matches, lockedResults);

  assert.strictEqual(nextState, state);
  assert.equal(nextState.picks['74'], 'PAR');
  assert.strictEqual(nextMoroccoState, state);
  assert.equal(nextMoroccoState.picks['75'], 'MAR');
});

test('applying synced locked results overrides stale manual picks and clears dependents', () => {
  let state = createInitialState({ '74': 'GER' });
  state = selectWinner('77', 'FRA', state, matches);
  state = selectWinner('89', 'GER', state, matches);

  const nextState = applyLockedResults(
    state,
    { '74': { winnerId: 'PAR', score: '巴拉圭 1-1 德国，点球 4-3 晋级' } },
    matches
  );

  assert.equal(nextState.picks['74'], 'PAR');
  assert.equal(nextState.picks['77'], 'FRA');
  assert.equal(nextState.picks['89'], undefined);
});

test('selecting winners propagates through every round to champion', () => {
  let state = createInitialState(defaultPicks);

  for (const [matchId, teamId] of [
    ['77', 'FRA'],
    ['89', 'PAR'],
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

  assert.equal(getChampion(state, teams)?.name, 'Argentina');
});

test('changing an earlier pick clears dependent downstream picks only', () => {
  let state = createInitialState(defaultPicks);
  state = selectWinner('75', 'NED', state, matches);
  state = selectWinner('90', 'NED', state, matches);
  state = selectWinner('74', 'GER', state, matches);
  state = selectWinner('77', 'FRA', state, matches);
  state = selectWinner('89', 'GER', state, matches);
  state = selectWinner('97', 'GER', state, matches);

  state = selectWinner('75', 'MAR', state, matches);

  assert.equal(state.picks['75'], 'MAR');
  assert.equal(state.picks['89'], 'GER');
  assert.equal(state.picks['90'], undefined);
  assert.equal(state.picks['97'], undefined);
});
