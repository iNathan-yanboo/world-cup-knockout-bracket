# World Cup Knockout Bracket Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static HTML 2026 World Cup knockout bracket where users click winners from Round of 32 to champion.

**Architecture:** Keep match data static and separate from state logic. Use a pure bracket engine for selection, propagation, reset, and validation, then render the derived state into a vanilla HTML/CSS UI.

**Tech Stack:** Static HTML, CSS, browser ES modules, Node.js built-in test runner.

---

## File Structure

- Create `package.json`: declare ESM mode and test/dev scripts.
- Create `index.html`: page shell with bracket mount point and source metadata.
- Create `src/bracket-data.js`: teams, match graph, default pick for M73, source links.
- Create `src/bracket-engine.js`: pure functions for resolving slots, selecting winners, clearing dependent picks, resetting, champion derivation, and data validation.
- Create `src/render-view.js`: pure HTML rendering helpers for bracket columns and match cards.
- Create `src/main.js`: browser event handling and state updates.
- Create `src/styles.css`: responsive dashboard bracket layout.
- Create `tests/bracket-engine.test.mjs`: engine behavior tests.
- Create `tests/render-view.test.mjs`: rendering behavior tests.
- Create `README.md`: local run and deployment instructions.

## Task 1: Engine Tests First

**Files:**
- Create: `package.json`
- Create: `tests/bracket-engine.test.mjs`

- [ ] **Step 1: Create the test harness and failing engine tests**

```json
{
  "name": "world-cup-knockout-bracket",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "node --test tests/*.test.mjs",
    "dev": "python3 -m http.server 4173"
  }
}
```

```js
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
```

- [ ] **Step 2: Run tests and verify RED**

Run: `npm test`

Expected: FAIL with module-not-found for `../src/bracket-engine.js` or `../src/bracket-data.js`.

## Task 2: Static Data And Engine

**Files:**
- Create: `src/bracket-data.js`
- Create: `src/bracket-engine.js`
- Test: `tests/bracket-engine.test.mjs`

- [ ] **Step 1: Implement static data and pure engine**

Create data for teams, sources, matches M73-M104, and `defaultPicks = { '73': 'CAN' }`.

Create engine functions with these signatures:

```js
export function createInitialState(defaultPicks = {}) {}
export function getMatchTeams(matchId, state, matches, teams) {}
export function selectWinner(matchId, teamId, state, matches) {}
export function getChampion(state, teams) {}
export function validateBracket(matches, teams) {}
```

`selectWinner` must return a new state object, reject unavailable team selections by returning the old state, and clear picks for all downstream matches that depend on the changed match.

- [ ] **Step 2: Run tests and verify GREEN**

Run: `npm test`

Expected: PASS for `tests/bracket-engine.test.mjs`.

- [ ] **Step 3: Commit engine implementation**

```bash
git add package.json tests/bracket-engine.test.mjs src/bracket-data.js src/bracket-engine.js
git commit -m "feat: add bracket data and engine"
```

## Task 3: Render Tests And View Renderer

**Files:**
- Create: `tests/render-view.test.mjs`
- Create: `src/render-view.js`
- Test: `tests/render-view.test.mjs`

- [ ] **Step 1: Create failing render tests**

```js
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
```

- [ ] **Step 2: Run tests and verify RED**

Run: `npm test`

Expected: FAIL with module-not-found for `../src/render-view.js`.

- [ ] **Step 3: Implement pure renderer**

Create `renderBracket(state, matches, teams)` and `renderSourceMeta(sourceMeta)`. Escape dynamic text, render unresolved slots as disabled buttons, and group matches by `round`.

- [ ] **Step 4: Run tests and verify GREEN**

Run: `npm test`

Expected: PASS for engine and render tests.

- [ ] **Step 5: Commit renderer implementation**

```bash
git add tests/render-view.test.mjs src/render-view.js
git commit -m "feat: render interactive bracket view"
```

## Task 4: Browser Page And Styling

**Files:**
- Create: `index.html`
- Create: `src/main.js`
- Create: `src/styles.css`
- Create: `README.md`

- [ ] **Step 1: Add browser shell and event binding**

`index.html` should mount the app immediately and load `src/main.js` as a module.

`src/main.js` should:

- Initialize state from `defaultPicks`.
- Render bracket HTML and source metadata.
- Listen for clicks on `[data-team-id]`.
- Call `selectWinner`.
- Re-render after each accepted pick.
- Reset state when the reset button is clicked.

- [ ] **Step 2: Add responsive styling**

`src/styles.css` should:

- Use a dark sports dashboard palette.
- Keep the bracket as horizontally scrollable columns.
- Make team buttons obvious, accessible, and stable in size.
- Use selected, disabled, and placeholder states.
- Keep controls sticky on small screens.

- [ ] **Step 3: Add README**

Include this README content:

````md
# World Cup Knockout Bracket

Static 2026 FIFA World Cup knockout bracket. Click teams to advance winners through to champion.

## Run locally

```bash
npm test
npm run dev
```

Open http://localhost:4173

## Deploy

- GitHub Pages: publish the repository root.
- Vercel: import the repository as a static project. No build command is required.
````

- [ ] **Step 4: Run automated tests**

Run: `npm test`

Expected: PASS for all tests.

- [ ] **Step 5: Commit browser UI**

```bash
git add index.html src/main.js src/styles.css README.md
git commit -m "feat: add static bracket page"
```

## Task 5: Manual Browser Verification

**Files:**
- No source changes expected unless verification finds an issue.

- [ ] **Step 1: Start local server**

Run: `npm run dev`

Expected: server serves the project at `http://localhost:4173`.

- [ ] **Step 2: Verify interaction in browser**

Open `http://localhost:4173`.

Click a path through the bracket, including M104, and verify:

- Winners appear in the correct next match.
- Changing an early winner clears dependent later picks.
- Champion card updates after final selection.
- Reset restores Canada as M73 winner and clears manual picks.

- [ ] **Step 3: Verify responsive layout**

Check desktop width and mobile width. The bracket should be scrollable without text overlap.

- [ ] **Step 4: Run final checks**

Run:

```bash
npm test
git diff --check
git status --short
```

Expected:

- `npm test` passes.
- `git diff --check` reports no whitespace errors.
- `git status --short` only shows intentional committed or final uncommitted changes.
