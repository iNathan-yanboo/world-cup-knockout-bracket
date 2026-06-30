import { roundLabels } from './bracket-data.js';
import { getChampion, getMatchTeams } from './bracket-engine.js';

const canvas = { width: 3400, height: 2000 };
const cardWidth = 288;
const cardCenterY = 79;
const rowStart = 170;
const rowGap = 220;
const finalPosition = { x: 1551, y: 940 };
const center = { x: 1505, y: 420, width: 390, height: 360 };
const xByRound = {
  left32: 100,
  left16: 445,
  left8: 810,
  left4: 1145,
  right4: 1957,
  right8: 2292,
  right16: 2657,
  right32: 3002
};

const leftOrder = ['74', '77', '73', '75', '83', '84', '81', '82'];
const rightOrder = ['76', '78', '79', '80', '86', '88', '85', '87'];
const links = [
  ['74', '89'], ['77', '89'], ['73', '90'], ['75', '90'], ['83', '93'], ['84', '93'], ['81', '94'], ['82', '94'],
  ['89', '97'], ['90', '97'], ['93', '98'], ['94', '98'], ['97', '101'], ['98', '101'], ['101', '104'],
  ['76', '91'], ['78', '91'], ['79', '92'], ['80', '92'], ['86', '95'], ['88', '95'], ['85', '96'], ['87', '96'],
  ['91', '99'], ['92', '99'], ['95', '100'], ['96', '100'], ['99', '102'], ['100', '102'], ['102', '104'],
  ['104', 'champion-winner']
];

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function buildPositions() {
  const positions = {};

  leftOrder.forEach((id, index) => {
    positions[id] = { side: 'left', x: xByRound.left32, y: rowStart + index * rowGap };
  });

  rightOrder.forEach((id, index) => {
    positions[id] = { side: 'right', x: xByRound.right32, y: rowStart + index * rowGap };
  });

  function centerY(a, b) {
    return (positions[a].y + positions[b].y) / 2;
  }

  Object.assign(positions, {
    89: { side: 'left', x: xByRound.left16, y: centerY('74', '77') },
    90: { side: 'left', x: xByRound.left16, y: centerY('73', '75') },
    93: { side: 'left', x: xByRound.left16, y: centerY('83', '84') },
    94: { side: 'left', x: xByRound.left16, y: centerY('81', '82') },
    91: { side: 'right', x: xByRound.right16, y: centerY('76', '78') },
    92: { side: 'right', x: xByRound.right16, y: centerY('79', '80') },
    95: { side: 'right', x: xByRound.right16, y: centerY('86', '88') },
    96: { side: 'right', x: xByRound.right16, y: centerY('85', '87') }
  });

  Object.assign(positions, {
    97: { side: 'left', x: xByRound.left8, y: centerY('89', '90') },
    98: { side: 'left', x: xByRound.left8, y: centerY('93', '94') },
    99: { side: 'right', x: xByRound.right8, y: centerY('91', '92') },
    100: { side: 'right', x: xByRound.right8, y: centerY('95', '96') }
  });

  Object.assign(positions, {
    101: { side: 'left', x: xByRound.left4, y: centerY('97', '98') },
    102: { side: 'right', x: xByRound.right4, y: centerY('99', '100') }
  });

  Object.assign(positions, {
    104: {
      side: 'center',
      x: finalPosition.x,
      y: finalPosition.y
    },
    'champion-winner': {
      side: 'winner',
      x: center.x,
      y: center.y
    }
  });

  return positions;
}

const positions = buildPositions();

function formatDate(date) {
  const match = /^(Jun|Jul) (\d{1,2})$/.exec(date);

  if (!match) {
    return date;
  }

  const month = match[1] === 'Jun' ? '6' : '7';
  return `${month}月${match[2]}日`;
}

function flagUrl(team) {
  return `https://flagcdn.com/w80/${team.flag}.png`;
}

function teamName(team) {
  return team.nameZh ?? team.name;
}

function placeholderLabel(slot) {
  if (slot?.winnerOf) {
    return `胜者 M${slot.winnerOf}`;
  }

  return '待定球队';
}

function renderTeamButton(match, slot, team, isSelected, lockedResult) {
  const isLocked = Boolean(lockedResult?.winnerId);

  if (!team) {
    return `
      <button class="team-button is-placeholder" type="button" disabled>
        <span class="placeholder-flag"></span>
        <span class="team-name">${escapeHtml(placeholderLabel(slot))}</span>
        <span class="team-code">待定</span>
      </button>
    `;
  }

  const selectedClass = isSelected ? ' is-selected' : '';
  const lockedClass = isLocked ? ' is-locked' : '';
  const lockedAttributes = isLocked ? ' disabled' : '';
  const ariaLabel = isLocked
    ? `M${match.id} 已确认，${teamName(team)}${isSelected ? '晋级' : '未晋级'}`
    : `选择 ${teamName(team)} 作为 M${match.id} 胜者`;

  return `
    <button
      class="team-button${selectedClass}${lockedClass}"
      type="button"
      data-match-id="${escapeHtml(match.id)}"
      data-team-id="${escapeHtml(team.id)}"
      aria-pressed="${isSelected ? 'true' : 'false'}"
      aria-label="${escapeHtml(ariaLabel)}"
      ${lockedAttributes}
    >
      <img class="flag" src="${escapeHtml(flagUrl(team))}" alt="">
      <span class="team-name">${escapeHtml(teamName(team))}</span>
      <span class="team-code">${escapeHtml(team.id)}</span>
    </button>
  `;
}

function renderMatch(match, state, matches, teams, lockedResults) {
  const pos = positions[match.id];

  if (!pos) {
    return '';
  }

  const visibleTeams = getMatchTeams(match.id, state, matches, teams);
  const selectedTeamId = state.picks[match.id];
  const lockedResult = lockedResults[match.id];
  const statusText = lockedResult?.score
    ? `已确认 · ${lockedResult.score}`
    : match.status;
  const teamButtons = match.slots
    .map((slot, index) =>
      renderTeamButton(
        match,
        slot,
        visibleTeams[index],
        visibleTeams[index]?.id === selectedTeamId,
        lockedResult
      )
    )
    .join('');
  const classNames = ['match-card'];

  if (lockedResult?.winnerId) {
    classNames.push('is-locked');
  }

  if (match.round === 'final') {
    classNames.push('is-final');
  } else if (match.round !== 'round32') {
    classNames.push('is-next');
  }

  return `
    <article
      class="${classNames.join(' ')}"
      style="left:${pos.x}px;top:${pos.y}px"
      data-match-id="${escapeHtml(match.id)}"
    >
      <header class="match-header">
        <span class="match-id">M${escapeHtml(match.id)}</span>
        <span class="match-date">${escapeHtml(formatDate(match.date))}</span>
      </header>
      <p class="match-status">${escapeHtml(statusText)}</p>
      <div class="team-list">
        ${teamButtons}
      </div>
    </article>
  `;
}

function renderChampion(state, teams) {
  const champion = getChampion(state, teams);
  const championFlag = champion
    ? `<img class="champion-flag" src="${escapeHtml(flagUrl(champion))}" alt="">`
    : '<span class="champion-flag is-placeholder"></span>';

  return `
    <section class="champion-hub champion-showcase" style="left:${center.x}px;top:${center.y}px" data-stage="champion">
      <img class="trophy-burst" src="./assets/champion-trophy-burst.png" alt="" aria-hidden="true">
      <div class="champion-copy">
        <div class="champion-ring">冠</div>
        <span class="champion-label">总冠军</span>
        <strong class="champion-name">${champion ? escapeHtml(teamName(champion)) : '世界冠军'}</strong>
        <div class="champion-team-card">
          ${championFlag}
          <span>${champion ? escapeHtml(teamName(champion)) : '等待决赛胜者'}</span>
          <span class="champion-code">${champion ? escapeHtml(champion.id) : '待定'}</span>
        </div>
      </div>
    </section>
  `;
}

function renderLabels() {
  const labels = [
    ['左半区 32强', xByRound.left32, 96, ''],
    [roundLabels.round16, xByRound.left16, 96, ''],
    [roundLabels.quarterfinal, xByRound.left8, 96, ''],
    [roundLabels.semifinal, xByRound.left4, 96, ''],
    ['右半区 32强', xByRound.right32, 96, 'is-right'],
    [roundLabels.round16, xByRound.right16, 96, 'is-right'],
    [roundLabels.quarterfinal, xByRound.right8, 96, 'is-right'],
    [roundLabels.semifinal, xByRound.right4, 96, 'is-right'],
    [roundLabels.final, finalPosition.x, finalPosition.y - 48, 'is-center'],
    ['总冠军', center.x + 70, center.y - 52, 'is-center']
  ];

  return `
    <div class="zone-label" style="left:${xByRound.left32}px;top:56px">左半区 · 八组对阵</div>
    <div class="zone-label" style="left:${xByRound.right32 - 72}px;top:56px;text-align:right">右半区 · 八组对阵</div>
    ${labels
      .map(
        ([label, x, y, className]) =>
          `<div class="round-label ${className}" style="left:${x}px;top:${y}px">${escapeHtml(label)}</div>`
      )
      .join('')}
  `;
}

function connectorPath(from, to, state) {
  const fromPos = positions[from];
  const toPos = positions[to];
  const active = state.picks[from] ? ' is-active' : '';

  if (to === 'champion-winner') {
    const fromX = fromPos.x + cardWidth / 2;
    const fromY = fromPos.y;
    const toX = center.x + center.width / 2;
    const toY = center.y + center.height;
    return `<path class="connector connector-to-champion${active}" d="M ${fromX} ${fromY} C ${fromX} ${fromY - 92}, ${toX} ${toY + 92}, ${toX} ${toY}" />`;
  }

  const fromIsRight = fromPos.side === 'right';
  const toIsCenterRight = to === 'champion-right';
  const fromX = fromIsRight ? fromPos.x : fromPos.x + cardWidth;
  const fromY = fromPos.y + cardCenterY;
  const toX = toIsCenterRight
    ? toPos.x
    : fromIsRight
      ? toPos.x + cardWidth
      : toPos.x;
  const toY = toPos.y + cardCenterY;
  const curve = Math.max(72, Math.abs(toX - fromX) * 0.5);
  const c1 = fromIsRight ? fromX - curve : fromX + curve;
  const c2 = fromIsRight ? toX + curve : toX - curve;

  return `<path class="connector${active}" d="M ${fromX} ${fromY} C ${c1} ${fromY}, ${c2} ${toY}, ${toX} ${toY}" />`;
}

export function renderBracket(state, matches, teams, lockedResults = {}) {
  const matchNodes = matches
    .map((match) => renderMatch(match, state, matches, teams, lockedResults))
    .join('');
  const connectorNodes = links
    .map(([from, to]) => connectorPath(from, to, state))
    .join('');

  return `
    <section class="bracket-viewport" id="bracket-viewport" aria-label="淘汰赛画布">
      <div class="field-mark"></div>
      <div class="center-circle"></div>
      <div class="bracket-canvas" id="bracket-canvas" style="width:${canvas.width}px;height:${canvas.height}px">
        <svg class="connectors" viewBox="0 0 ${canvas.width} ${canvas.height}" aria-hidden="true">
          ${connectorNodes}
        </svg>
        <div class="nodes">
          ${renderLabels()}
          ${matchNodes}
          ${renderChampion(state, teams)}
        </div>
      </div>
    </section>
  `;
}

export function renderSourceMeta(sourceMeta, syncStatus = null) {
  const links = sourceMeta.links
    .map(
      (link) =>
        `<a href="${escapeHtml(link.url)}" target="_blank" rel="noreferrer">${escapeHtml(link.label)}</a>`
    )
    .join('<span aria-hidden="true"> / </span>');
  const syncText = syncStatus?.message ?? '使用内置快照';

  return `
    <p>
      数据快照：<strong>${escapeHtml(sourceMeta.snapshotDate)}</strong>
      （${escapeHtml(sourceMeta.timezone)}）。${escapeHtml(sourceMeta.note)}
    </p>
    <p class="source-links">${links}</p>
    <p class="sync-status" data-sync-state="${escapeHtml(syncStatus?.state ?? 'idle')}">${escapeHtml(syncText)}</p>
  `;
}
