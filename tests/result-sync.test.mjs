import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { lockedResults, matches, sourceMeta } from '../src/bracket-data.js';
import { mergeResultPayload } from '../src/result-sync.js';

test('merges synced result payload into source metadata, matches, and locked results', () => {
  const payload = {
    snapshotDate: '2026-07-01',
    timezone: 'Asia/Shanghai',
    note: '自动同步赛果快照。',
    lockedResults: {
      '75': {
        winnerId: 'MAR',
        score: '摩洛哥 2-1 荷兰',
        confirmedAt: '2026-07-01'
      }
    },
    matchStatuses: {
      '75': '摩洛哥 2-1 荷兰'
    }
  };

  const merged = mergeResultPayload(
    { matches, sourceMeta, lockedResults },
    payload
  );

  assert.equal(merged.sourceMeta.snapshotDate, '2026-07-01');
  assert.equal(merged.sourceMeta.note, '自动同步赛果快照。');
  assert.equal(merged.lockedResults['73'].winnerId, 'CAN');
  assert.equal(merged.lockedResults['75'].winnerId, 'MAR');
  assert.equal(merged.matches.find((match) => match.id === '75').status, '摩洛哥 2-1 荷兰');
});

test('ships a static results JSON payload for cloud-hosted auto sync', () => {
  const payload = JSON.parse(
    readFileSync(new URL('../data/results.json', import.meta.url), 'utf8')
  );

  assert.equal(payload.snapshotDate, '2026-06-30');
  assert.equal(payload.lockedResults['74'].winnerId, 'PAR');
  assert.equal(payload.lockedResults['76'].winnerId, 'BRA');
});
