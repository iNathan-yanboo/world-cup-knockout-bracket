import test from 'node:test';
import assert from 'node:assert/strict';

import {
  applyPinchZoom,
  getPointerCenter,
  getPointerDistance
} from '../src/viewport-gestures.js';

test('calculates two-pointer distance and center for pinch gestures', () => {
  const pointers = [
    { x: 10, y: 20 },
    { x: 110, y: 220 }
  ];

  assert.equal(getPointerDistance(pointers), 223.60679774997897);
  assert.deepEqual(getPointerCenter(pointers), { x: 60, y: 120 });
});

test('pinch zoom keeps the original content point under the gesture center', () => {
  const nextView = applyPinchZoom({
    startView: { x: 10, y: 30, scale: 0.4 },
    startDistance: 100,
    startCenter: { x: 160, y: 240 },
    currentPointers: [
      { x: 110, y: 240 },
      { x: 310, y: 240 }
    ]
  });

  assert.equal(nextView.scale, 0.8);
  assert.deepEqual(nextView, { x: -90, y: -180, scale: 0.8 });
});

test('pinch zoom respects the mobile zoom bounds', () => {
  const nextView = applyPinchZoom({
    startView: { x: 0, y: 0, scale: 0.4 },
    startDistance: 100,
    startCenter: { x: 100, y: 100 },
    currentPointers: [
      { x: 99, y: 100 },
      { x: 101, y: 100 }
    ]
  });

  assert.equal(nextView.scale, 0.24);
});
