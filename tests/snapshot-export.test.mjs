import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildExportFooter,
  buildSnapshotFilename,
  resolveCanvasSize
} from '../src/snapshot-export.js';

test('resolves export dimensions from the full bracket canvas', () => {
  const canvas = {
    offsetWidth: 3400,
    offsetHeight: 2000,
    getBoundingClientRect: () => ({ width: 782, height: 460 })
  };

  assert.deepEqual(resolveCanvasSize(canvas), { width: 3400, height: 2000 });
});

test('builds attribution footer for exported bracket images', () => {
  const footer = buildExportFooter({
    domain: 'worldcup.inathan.wang',
    owner: 'iNathan',
    snapshotDate: '2026-06-30',
    generatedAt: new Date('2026-06-30T12:00:00Z')
  });

  assert.match(footer, /worldcup\.inathan\.wang/);
  assert.match(footer, /© 2026 iNathan/);
  assert.match(footer, /数据快照：2026-06-30/);
});

test('builds a stable png filename', () => {
  assert.equal(
    buildSnapshotFilename(new Date('2026-06-30T12:34:56Z')),
    'world-cup-bracket-2026-06-30.png'
  );
});
