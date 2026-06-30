# Bracket Screenshot Export Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static-client PNG export for the full World Cup knockout bracket canvas with domain and copyright attribution.

**Architecture:** Add one focused export module used by `src/main.js`. The module resolves full canvas dimensions, reads the current bracket DOM, redraws cards/connectors/labels/images into an offscreen canvas, adds a footer, and triggers a PNG download.

**Tech Stack:** Static HTML, browser DOM APIs, canvas, Node test runner.

---

## File Structure

- Modify `index.html`: add the `导出图片` toolbar button.
- Create `src/snapshot-export.js`: export metadata helpers, DOM-to-canvas rendering, image loading, PNG download.
- Modify `src/main.js`: wire the toolbar button to `exportBracketSnapshot`.
- Modify `src/styles.css`: add export-only styles and button busy state polish.
- Create `tests/snapshot-export.test.mjs`: lock dimensions, footer attribution, and markup behavior.
- Modify `README.md`: document the export feature.

### Task 1: Export Helper Tests

**Files:**
- Create: `tests/snapshot-export.test.mjs`
- Create: `src/snapshot-export.js`

- [ ] **Step 1: Write the failing test**

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/snapshot-export.test.mjs`

Expected: FAIL because `src/snapshot-export.js` does not exist or does not export the helpers.

- [ ] **Step 3: Write minimal implementation**

Create `src/snapshot-export.js` with the helper exports, then add DOM export functions used by the app.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/snapshot-export.test.mjs`

Expected: PASS.

### Task 2: Toolbar Integration

**Files:**
- Modify: `index.html`
- Modify: `src/main.js`
- Modify: `src/styles.css`
- Modify: `README.md`

- [ ] **Step 1: Add button markup**

Add `<button class="tool-button" id="export-snapshot" type="button">导出图片</button>` near the sync/reset controls.

- [ ] **Step 2: Wire click handler**

Import `exportBracketSnapshot` in `src/main.js`, read `#export-snapshot`, and call the exporter with `domain: 'worldcup.inathan.wang'`, `owner: 'iNathan'`, and the active snapshot date.

- [ ] **Step 3: Add UI states**

Disable the button while exporting and set text to `导出中`; restore to `导出图片` on success and briefly show `导出失败` on failure.

- [ ] **Step 4: Document usage**

Add a README section describing that export captures the full bracket canvas, not the visible browser viewport.

### Task 3: Verification

**Files:**
- Verify all touched files.

- [ ] **Step 1: Run all tests**

Run: `npm test`

Expected: all tests pass.

- [ ] **Step 2: Run syntax and whitespace checks**

Run: `node --check src/main.js && node --check src/render-view.js && node --check src/snapshot-export.js && git diff --check`

Expected: exit 0.

- [ ] **Step 3: Browser verify**

Open `http://localhost:4173/?v=snapshot-export-1`, click `导出图片`, and confirm the export path creates a PNG without relying on the current viewport.
