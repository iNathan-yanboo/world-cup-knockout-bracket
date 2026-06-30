import {
  defaultPicks,
  lockedResults,
  matches as baseMatches,
  sourceMeta as baseSourceMeta,
  teams
} from './bracket-data.js';
import {
  applyLockedResults,
  createInitialState,
  getLockedPicks,
  selectWinner
} from './bracket-engine.js';
import { fetchResultPayload, mergeResultPayload } from './result-sync.js';
import { renderBracket, renderSourceMeta } from './render-view.js';
import { exportBracketSnapshot } from './snapshot-export.js';
import {
  applyPinchZoom,
  clampScale,
  getPointerCenter,
  getPointerDistance
} from './viewport-gestures.js';

const bracketRoot = document.querySelector('#bracket-root');
const sourceRoot = document.querySelector('#source-root');
const resetButton = document.querySelector('#reset-picks');
const resetViewButton = document.querySelector('#reset-view');
const zoomInButton = document.querySelector('#zoom-in');
const zoomOutButton = document.querySelector('#zoom-out');
const zoomReadout = document.querySelector('#zoom-readout');
const syncButton = document.querySelector('#sync-results');
const exportButton = document.querySelector('#export-snapshot');

let state = createInitialState(defaultPicks);
let activeMatches = baseMatches;
let activeSourceMeta = baseSourceMeta;
let activeLockedResults = { ...lockedResults };
let syncStatus = { state: 'idle', message: '使用内置快照，正在自动同步' };
let view = { x: 6, y: 36, scale: 0.39 };
let drag = null;
let pinch = null;
const activePointers = new Map();
let exportStatusTimer = null;

function applyView() {
  const canvas = document.querySelector('#bracket-canvas');

  if (!canvas) {
    return;
  }

  canvas.style.transform = `translate(${view.x}px, ${view.y}px) scale(${view.scale})`;
  zoomReadout.textContent = `${Math.round(view.scale * 100)}%`;
}

function zoom(delta) {
  view.scale = clampScale(view.scale + delta);
  applyView();
}

function resetView() {
  view = { x: 6, y: 36, scale: 0.39 };
  applyView();
}

function renderApp() {
  bracketRoot.innerHTML = renderBracket(state, activeMatches, teams, activeLockedResults);
  sourceRoot.innerHTML = renderSourceMeta(activeSourceMeta, syncStatus);
  syncButton.disabled = syncStatus.state === 'syncing';
  syncButton.textContent = syncStatus.state === 'syncing' ? '同步中' : '同步赛果';
  applyView();
}

async function syncResults() {
  syncStatus = { state: 'syncing', message: '正在同步赛果...' };
  renderApp();

  try {
    const payload = await fetchResultPayload(globalThis.BRACKET_RESULTS_URL);
    const merged = mergeResultPayload(
      {
        matches: activeMatches,
        sourceMeta: activeSourceMeta,
        lockedResults: activeLockedResults
      },
      payload
    );

    activeMatches = merged.matches;
    activeSourceMeta = merged.sourceMeta;
    activeLockedResults = merged.lockedResults;
    state = applyLockedResults(state, activeLockedResults, activeMatches);
    syncStatus = {
      state: 'synced',
      message: `已同步至 ${activeSourceMeta.snapshotDate}`
    };
  } catch (error) {
    syncStatus = {
      state: 'failed',
      message: `${error.message}，继续使用内置快照`
    };
  }

  renderApp();
}

function setExportButtonState(label, disabled = false) {
  exportButton.textContent = label;
  exportButton.disabled = disabled;
}

function scheduleExportButtonReset() {
  window.clearTimeout(exportStatusTimer);
  exportStatusTimer = window.setTimeout(() => {
    setExportButtonState('导出图片');
  }, 1800);
}

async function exportSnapshot() {
  window.clearTimeout(exportStatusTimer);
  setExportButtonState('导出中', true);

  try {
    await exportBracketSnapshot({
      domain: 'worldcup.inathan.wang',
      repoUrl: 'https://github.com/iNathan-yanboo/world-cup-knockout-bracket',
      snapshotDate: activeSourceMeta.snapshotDate
    });
    setExportButtonState('已导出');
  } catch (error) {
    console.error(error);
    setExportButtonState('导出失败');
  }

  scheduleExportButtonReset();
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
    activeMatches,
    activeLockedResults
  );

  if (nextState === state) {
    return;
  }

  state = nextState;
  renderApp();
});

resetButton.addEventListener('click', () => {
  state = createInitialState(getLockedPicks(activeLockedResults));
  renderApp();
});

syncButton.addEventListener('click', syncResults);
exportButton.addEventListener('click', exportSnapshot);
zoomInButton.addEventListener('click', () => zoom(0.08));
zoomOutButton.addEventListener('click', () => zoom(-0.08));
resetViewButton.addEventListener('click', resetView);

function getActivePointerList() {
  return [...activePointers.values()];
}

function pointerFromEvent(event) {
  return {
    pointerId: event.pointerId,
    x: event.clientX,
    y: event.clientY
  };
}

function startDrag(pointer, viewport) {
  drag = {
    pointerId: pointer.pointerId,
    x: pointer.x,
    y: pointer.y,
    startX: view.x,
    startY: view.y,
    viewport
  };
  pinch = null;
}

function startPinch(viewport) {
  const pointers = getActivePointerList();

  if (pointers.length < 2) {
    return;
  }

  pinch = {
    startView: { ...view },
    startDistance: getPointerDistance(pointers),
    startCenter: getPointerCenter(pointers),
    viewport
  };
  drag = null;
}

bracketRoot.addEventListener('pointerdown', (event) => {
  const viewport = event.target.closest('.bracket-viewport');

  if (!viewport || event.target.closest('button, a')) {
    return;
  }

  event.preventDefault();
  document.getSelection()?.removeAllRanges();

  const pointer = pointerFromEvent(event);

  activePointers.set(event.pointerId, pointer);
  viewport.classList.add('is-dragging');
  viewport.setPointerCapture(event.pointerId);

  if (activePointers.size >= 2) {
    startPinch(viewport);
    return;
  }

  startDrag(pointer, viewport);
});

document.addEventListener('pointermove', (event) => {
  if (!activePointers.has(event.pointerId)) {
    return;
  }

  event.preventDefault();
  activePointers.set(event.pointerId, pointerFromEvent(event));

  if (pinch && activePointers.size >= 2) {
    view = applyPinchZoom({
      ...pinch,
      currentPointers: getActivePointerList()
    });
    applyView();
    return;
  }

  if (!drag || drag.pointerId !== event.pointerId) {
    return;
  }

  view.x = drag.startX + event.clientX - drag.x;
  view.y = drag.startY + event.clientY - drag.y;
  applyView();
});

function endDrag(event) {
  if (!activePointers.has(event.pointerId) && !drag && !pinch) {
    return;
  }

  const viewport = drag?.viewport ?? pinch?.viewport;
  activePointers.delete(event.pointerId);

  if (pinch && activePointers.size >= 2) {
    startPinch(pinch.viewport);
    return;
  }

  if (activePointers.size === 1 && viewport) {
    startDrag(getActivePointerList()[0], viewport);
    return;
  }

  viewport?.classList.remove('is-dragging');
  drag = null;
  pinch = null;
}

document.addEventListener('pointerup', endDrag);
document.addEventListener('pointercancel', endDrag);

bracketRoot.addEventListener(
  'wheel',
  (event) => {
    if (!event.target.closest('.bracket-viewport')) {
      return;
    }

    event.preventDefault();
    zoom(event.deltaY > 0 ? -0.04 : 0.04);
  },
  { passive: false }
);

renderApp();
syncResults();
