import { championMatchId } from './bracket-data.js';

function buildMatchMap(matches) {
  return new Map(matches.map((match) => [match.id, match]));
}

function resolveSlotTeamId(slot, state) {
  if (slot.teamId) {
    return slot.teamId;
  }

  if (slot.winnerOf) {
    return state.picks[slot.winnerOf] ?? null;
  }

  return null;
}

function dependsOn(matchId, targetMatchId, matchMap, seen = new Set()) {
  if (matchId === targetMatchId) {
    return true;
  }

  if (seen.has(matchId)) {
    return false;
  }

  seen.add(matchId);
  const match = matchMap.get(matchId);

  if (!match) {
    return false;
  }

  return match.slots.some((slot) => {
    if (!slot.winnerOf) {
      return false;
    }

    return dependsOn(slot.winnerOf, targetMatchId, matchMap, seen);
  });
}

export function createInitialState(defaultPicks = {}) {
  return {
    picks: { ...defaultPicks }
  };
}

export function getMatchTeams(matchId, state, matches, teams) {
  const match = buildMatchMap(matches).get(matchId);

  if (!match) {
    return [];
  }

  return match.slots.map((slot) => {
    const teamId = resolveSlotTeamId(slot, state);
    return teamId ? teams[teamId] ?? null : null;
  });
}

export function selectWinner(matchId, teamId, state, matches) {
  const matchMap = buildMatchMap(matches);
  const match = matchMap.get(matchId);

  if (!match) {
    return state;
  }

  const availableTeamIds = match.slots
    .map((slot) => resolveSlotTeamId(slot, state))
    .filter(Boolean);

  if (!availableTeamIds.includes(teamId)) {
    return state;
  }

  if (state.picks[matchId] === teamId) {
    return state;
  }

  const nextPicks = {
    ...state.picks,
    [matchId]: teamId
  };

  for (const downstreamMatch of matches) {
    if (
      downstreamMatch.id !== matchId &&
      nextPicks[downstreamMatch.id] &&
      dependsOn(downstreamMatch.id, matchId, matchMap)
    ) {
      delete nextPicks[downstreamMatch.id];
    }
  }

  return {
    picks: nextPicks
  };
}

export function getChampion(state, teams) {
  const championTeamId = state.picks[championMatchId];
  return championTeamId ? teams[championTeamId] ?? null : null;
}

export function validateBracket(matches, teams) {
  const issues = [];
  const matchMap = buildMatchMap(matches);
  const matchIds = new Set();

  for (const match of matches) {
    if (matchIds.has(match.id)) {
      issues.push(`Duplicate match id ${match.id}`);
    }

    matchIds.add(match.id);

    if (!Array.isArray(match.slots) || match.slots.length !== 2) {
      issues.push(`Match ${match.id} must have exactly two slots`);
      continue;
    }

    for (const slot of match.slots) {
      if (slot.teamId && !teams[slot.teamId]) {
        issues.push(`Match ${match.id} references missing team ${slot.teamId}`);
      }

      if (slot.winnerOf && !matchMap.has(slot.winnerOf)) {
        issues.push(`Match ${match.id} references missing match ${slot.winnerOf}`);
      }

      if (!slot.teamId && !slot.winnerOf) {
        issues.push(`Match ${match.id} has an empty slot`);
      }
    }
  }

  return issues;
}
