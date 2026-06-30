function cleanLockedResults(lockedResults = {}) {
  return Object.fromEntries(
    Object.entries(lockedResults)
      .filter(([, result]) => result?.winnerId)
      .map(([matchId, result]) => [
        matchId,
        {
          ...result,
          winnerId: result.winnerId
        }
      ])
  );
}

export function mergeResultPayload(current, payload = {}) {
  const nextLockedResults = {
    ...current.lockedResults,
    ...cleanLockedResults(payload.lockedResults)
  };
  const matchStatuses = payload.matchStatuses ?? {};
  const nextMatches = current.matches.map((match) => {
    const lockedStatus = nextLockedResults[match.id]?.score;
    const status = matchStatuses[match.id] ?? lockedStatus ?? match.status;

    if (status === match.status) {
      return match;
    }

    return {
      ...match,
      status
    };
  });
  const nextSourceMeta = {
    ...current.sourceMeta,
    snapshotDate: payload.snapshotDate ?? current.sourceMeta.snapshotDate,
    timezone: payload.timezone ?? current.sourceMeta.timezone,
    note: payload.note ?? current.sourceMeta.note
  };

  return {
    matches: nextMatches,
    sourceMeta: nextSourceMeta,
    lockedResults: nextLockedResults
  };
}

export async function fetchResultPayload(url = './data/results.json') {
  const separator = url.includes('?') ? '&' : '?';
  const response = await fetch(`${url}${separator}ts=${Date.now()}`, {
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error(`同步失败：HTTP ${response.status}`);
  }

  return response.json();
}
