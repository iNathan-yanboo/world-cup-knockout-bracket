# Bracket Screenshot Export Design

## Goal

Add a screenshot export feature that downloads the complete knockout bracket canvas as a PNG, independent of the current browser viewport, pan offset, or zoom level.

## User Experience

- Add a toolbar button labeled `导出图片`.
- Clicking it exports the full bracket canvas, including all current manual picks and locked results.
- The export includes attribution text with `worldcup.inathan.wang`, `© 2026 iNathan`, the generated time, and the current data snapshot date.
- While exporting, the button shows a short busy state. If image generation fails, the button shows a short failure state and the page remains usable.

## Architecture

The page remains a static HTML app with no build step. A new browser module owns export behavior:

- Read the intrinsic `#bracket-canvas` size instead of the visible `.bracket-viewport` size.
- Read match cards, labels, SVG connector paths, champion block, flags, and trophy image from the current DOM.
- Convert image assets to same-origin data URLs where possible before drawing.
- Redraw the bracket into an offscreen canvas at full canvas size, add an export footer, then download a PNG.

This keeps the screenshot independent from browser view state while avoiding browser `foreignObject` canvas-taint restrictions.

## Error Handling

- Missing canvas or invalid dimensions throws a clear error.
- Image loading failures draw a small placeholder flag so one remote flag failure does not block the whole export.
- The UI catches export errors, restores the button, and shows `导出失败`.

## Testing

- Unit-test export metadata so the output uses full canvas dimensions and includes domain/copyright attribution.
- Unit-test dimension resolution so viewport size is not used.
- Keep existing render and style tests passing.
- Browser-verify that clicking `导出图片` creates a PNG from the full canvas area.

## Self Review

- No placeholders or future-only requirements.
- Scope is limited to static PNG export; no server-side rendering or cloud storage is included.
- The export source is the current in-page bracket state, so synced results and manual picks are captured naturally.
