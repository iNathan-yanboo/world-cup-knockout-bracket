import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createInitialState,
  getChampion,
  getMatchTeams,
  selectWinner,
  validateBracket
} from '../src/bracket-engine.js';
import { defaultPicks, matches, teams } from '../src/bracket-data.js';

test('snapshot data is internally valid', () => {
  const issues = validateBracket(matches, teams);
  assert.deepEqual(issues, []);
});

test('initial state preselects Canada for match 73 and places Canada in match 90', () => {
  const state = createInitialState(defaultPicks);
  const match90Teams = getMatchTeams('90', state, matches, teams);

  assert.equal(state.picks['73'], 'CAN');
  assert.deepEqual(
    match90Teams.map((team) => team && team.name),
    ['Canada', null]
  );
});

test('selecting winners propagates through every round to champion', () => {
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
