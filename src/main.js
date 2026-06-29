import { defaultPicks, matches, sourceMeta, teams } from './bracket-data.js';
import { createInitialState, selectWinner } from './bracket-engine.js';
import { renderBracket, renderSourceMeta } from './render-view.js';

const bracketRoot = document.querySelector('#bracket-root');
const sourceRoot = document.querySelector('#source-root');
const resetButton = document.querySelector('#reset-picks');

let state = createInitialState(defaultPicks);

function renderApp() {
  bracketRoot.innerHTML = renderBracket(state, matches, teams);
  sourceRoot.innerHTML = renderSourceMeta(sourceMeta);
}

bracketRoot.addEventListener('click', (event) => {
  const teamButton = event.target.closest('[data-match-id][data-team-id]');

  if (!teamButton) {
    return;
  }

  const nextState = selectWinner(
    teamButton.dataset.matchId,
    teamButton.dataset.teamId,
    state,
    matches
  );

  if (nextState === state) {
    return;
  }

  state = nextState;
  renderApp();
});

resetButton.addEventListener('click', () => {
  state = createInitialState(defaultPicks);
  renderApp();
});

renderApp();
