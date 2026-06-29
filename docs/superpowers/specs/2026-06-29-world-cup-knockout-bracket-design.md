# 2026 World Cup Knockout Bracket Design

## Goal

Create a deployable static HTML app that shows the current 2026 FIFA World Cup knockout bracket and lets a user manually click winners from the Round of 32 through to the champion.

The app should work as a standalone web page and be easy to host on GitHub Pages or Vercel without a backend.

## Data Snapshot

- Snapshot date: 2026-06-29, Asia/Shanghai.
- Tournament: 2026 FIFA World Cup.
- First knockout round: Round of 32.
- Sources checked: FIFA match schedule/bracket pages, ESPN bracket/schedule, FOX Sports bracket page, Al Jazeera Round of 32 schedule, and SB Nation Round of 32/Round of 16 route summary.
- Data policy: match data is static in the repository. If FIFA updates schedule, results, or kickoff details after this snapshot, update the data file and the source note in the UI.

## Round of 32 Match Data

| Match | Date | Pairing | Current status |
| --- | --- | --- | --- |
| 73 | Jun 28 | South Africa vs Canada | Canada won 1-0; preselect Canada but allow override |
| 74 | Jun 29 | Germany vs Paraguay | Not played at snapshot time |
| 75 | Jun 29 | Netherlands vs Morocco | Not played at snapshot time |
| 76 | Jun 29 | Brazil vs Japan | Not played at snapshot time |
| 77 | Jun 30 | France vs Sweden | Not played at snapshot time |
| 78 | Jun 30 | Ivory Coast vs Norway | Not played at snapshot time |
| 79 | Jun 30 | Mexico vs Ecuador | Not played at snapshot time |
| 80 | Jun 30 | England vs DR Congo | Not played at snapshot time |
| 81 | Jul 1 | USA vs Bosnia and Herzegovina | Not played at snapshot time |
| 82 | Jul 1 | Belgium vs Senegal | Not played at snapshot time |
| 83 | Jul 1 | Portugal vs Croatia | Not played at snapshot time |
| 84 | Jul 1 | Spain vs Austria | Not played at snapshot time |
| 85 | Jul 2 | Switzerland vs Algeria | Not played at snapshot time |
| 86 | Jul 2 | Argentina vs Cape Verde | Not played at snapshot time |
| 87 | Jul 2 | Colombia vs Ghana | Not played at snapshot time |
| 88 | Jul 3 | Australia vs Egypt | Not played at snapshot time |

## Official Advancement Path

Round of 16:

- M89: winner M74 vs winner M77
- M90: winner M73 vs winner M75
- M91: winner M76 vs winner M78
- M92: winner M79 vs winner M80
- M93: winner M83 vs winner M84
- M94: winner M81 vs winner M82
- M95: winner M86 vs winner M88
- M96: winner M85 vs winner M87

Quarterfinals:

- M97: winner M89 vs winner M90
- M98: winner M93 vs winner M94
- M99: winner M91 vs winner M92
- M100: winner M95 vs winner M96

Semifinals:

- M101: winner M97 vs winner M98
- M102: winner M99 vs winner M100

Final:

- M104: winner M101 vs winner M102

## Recommended Approach

Use a zero-backend, vanilla HTML/CSS/JavaScript project.

Why this is the best fit:

- The interaction is stateful but small; a framework would add deployment and build complexity without much benefit.
- GitHub Pages can serve the project directly from the repository root.
- Vercel can serve it as a static site.
- A small pure JavaScript bracket engine can be unit tested with Node's built-in test runner.

Alternative approaches considered:

- Vite + React: stronger component structure, but heavier than needed for a single bracket page.
- SVG-first bracket renderer: more control over connector lines, but more fragile on mobile and less ergonomic for text-heavy match cards.

## Product Behavior

The first screen is the bracket itself, not a landing page.

Expected interactions:

- Click either team in a match to select that team as the winner.
- The selected winner automatically appears in the next linked match.
- If the user changes an earlier winner, all dependent downstream selections are cleared.
- Match 73 starts with Canada selected because the result is already known at the snapshot time, but the user can override it for prediction/play purposes.
- A reset button clears all manual selections and restores the snapshot defaults.
- A compact source/status line shows when the data was last checked.

## UI Design

Layout:

- Desktop: horizontal bracket with columns for Round of 32, Round of 16, Quarterfinals, Semifinals, Final, and Champion.
- Mobile: horizontally scrollable bracket with sticky top controls.
- Each match card shows match number, date, status, and two team buttons.
- Empty future slots show readable placeholders such as "Winner M74" until the prior match is selected.

Visual tone:

- Sports dashboard style: dark field background, crisp match cards, restrained accent colors, and clear selected states.
- Use country names as text first. Avoid flag dependency because flag emoji rendering varies across platforms and can hurt alignment.

## Architecture

Files:

- `index.html`: static page shell and accessible DOM structure.
- `src/styles.css`: responsive bracket layout and interaction states.
- `src/bracket-data.js`: teams, matches, source metadata, and default winners.
- `src/bracket-engine.js`: pure functions for selection, propagation, reset, and derived rounds.
- `src/main.js`: DOM rendering and event binding.
- `tests/bracket-engine.test.mjs`: Node unit tests for winner propagation and downstream clearing.
- `README.md`: local run and deployment instructions.

State model:

- `matchesById`: static match definitions.
- `picks`: mutable map of `matchId -> teamId`.
- `slots`: each match team slot is either a concrete team id or a reference to a previous match winner.
- Rendering derives the visible teams from `matchesById` and `picks`; the DOM is not the source of truth.

## Error Handling

- If a slot depends on an unselected prior match, render a disabled placeholder.
- If data has an invalid match reference, tests should fail before deployment.
- If a user click would select an unavailable placeholder, ignore it.

## Testing And Debugging

Minimum verification:

- Unit test propagation from Round of 32 to Round of 16.
- Unit test downstream clearing when an earlier pick changes.
- Unit test reset restores default Canada selection for M73.
- Browser smoke test: open local page, click winners through to champion, verify champion card updates.
- Responsive check at desktop and mobile widths.

## Deployment

GitHub Pages:

- Serve the repository root or publish the static files from the main branch.

Vercel:

- Import the repository as a static project. No backend or environment variables are required.

## Self Review

- No placeholders remain in this spec.
- The first scope is intentionally static-data only; live API refresh is out of scope.
- The bracket path is explicitly modeled by match id so changing visual order will not break advancement.
- The known Canada result is represented as a resettable default rather than a locked result, preserving manual prediction behavior.
