import {
  championMatchId,
  roundLabels,
  roundOrder
} from './bracket-data.js';
import { getChampion, getMatchTeams } from './bracket-engine.js';

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function groupMatchesByRound(matches) {
  const groups = new Map(roundOrder.map((round) => [round, []]));

  for (const match of matches) {
    if (!groups.has(match.round)) {
      groups.set(match.round, []);
    }

    groups.get(match.round).push(match);
  }

  return groups;
}

function renderTeamButton(match, slot, team, isSelected) {
  if (!team) {
    const label = slot.winnerOf ? `Winner M${slot.winnerOf}` : 'Awaiting team';

    return `
      <button class="team-button is-placeholder" type="button" disabled>
        <span class="team-name">${escapeHtml(label)}</span>
      </button>
    `;
  }

  const selectedClass = isSelected ? ' is-selected' : '';

  return `
    <button
      class="team-button${selectedClass}"
      type="button"
      data-match-id="${escapeHtml(match.id)}"
      data-team-id="${escapeHtml(team.id)}"
      aria-pressed="${isSelected ? 'true' : 'false'}"
    >
      <span class="team-code">${escapeHtml(team.id)}</span>
      <span class="team-copy">
        <span class="team-name">${escapeHtml(team.name)}</span>
        <span class="team-seed">${escapeHtml(team.seed)}</span>
      </span>
    </button>
  `;
}

function renderMatch(match, state, matches, teams) {
  const visibleTeams = getMatchTeams(match.id, state, matches, teams);
  const selectedTeamId = state.picks[match.id];

  const teamButtons = match.slots
    .map((slot, index) =>
      renderTeamButton(
        match,
        slot,
        visibleTeams[index],
        visibleTeams[index]?.id === selectedTeamId
      )
    )
    .join('');

  return `
    <article class="match-card" data-match-id="${escapeHtml(match.id)}">
      <header class="match-header">
        <span class="match-id">M${escapeHtml(match.id)}</span>
        <span class="match-date">${escapeHtml(match.date)}</span>
      </header>
      <div class="team-list">
        ${teamButtons}
      </div>
      <p class="match-status">${escapeHtml(match.status)}</p>
    </article>
  `;
}

function renderRound(round, roundMatches, state, matches, teams) {
  return `
    <section class="round-column" aria-labelledby="round-${escapeHtml(round)}">
      <h2 id="round-${escapeHtml(round)}">${escapeHtml(roundLabels[round] ?? round)}</h2>
      <div class="round-stack">
        ${roundMatches
          .map((match) => renderMatch(match, state, matches, teams))
          .join('')}
      </div>
    </section>
  `;
}

function renderChampionPanel(state, teams) {
  const champion = getChampion(state, teams);

  return `
    <section class="champion-column" aria-labelledby="champion-heading">
      <h2 id="champion-heading">Champion</h2>
      <div class="champion-card">
        <span class="champion-label">Projected champion</span>
        <strong class="champion-name">
          ${champion ? escapeHtml(champion.name) : `Winner M${championMatchId}`}
        </strong>
        <span class="champion-hint">
          ${champion ? 'Final path complete' : 'Pick the final winner to crown a champion'}
        </span>
      </div>
    </section>
  `;
}

export function renderBracket(state, matches, teams) {
  const groups = groupMatchesByRound(matches);
  const roundsHtml = roundOrder
    .map((round) =>
      renderRound(round, groups.get(round) ?? [], state, matches, teams)
    )
    .join('');

  return `
    <div class="bracket-board" aria-label="2026 World Cup knockout bracket">
      ${roundsHtml}
      ${renderChampionPanel(state, teams)}
    </div>
  `;
}

export function renderSourceMeta(sourceMeta) {
  const links = sourceMeta.links
    .map(
      (link) =>
        `<a href="${escapeHtml(link.url)}" target="_blank" rel="noreferrer">${escapeHtml(link.label)}</a>`
    )
    .join('<span aria-hidden="true"> / </span>');

  return `
    <p>
      Data snapshot: <strong>${escapeHtml(sourceMeta.snapshotDate)}</strong>
      (${escapeHtml(sourceMeta.timezone)}). ${escapeHtml(sourceMeta.note)}
    </p>
    <p class="source-links">${links}</p>
  `;
}
