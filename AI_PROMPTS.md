# AI PROMPTS (paste into your code assistant)

## 0) Understand the spec
Read `/public/data/*` and `/src/sim/types.ts`. Confirm you understand dwell, capacity, blocks, and events.

## 1) Engine loop
Implement `src/engine/time.ts` FixedTimestepLoop.run() so update() is called at 20 Hz (dt=0.05) and render() at display refresh.

## 2) Data loading
Implement `src/sim/line.ts` to load `/public/data/*.json` and build a Line model (stations, segments, endpoints, depot).

## 3) Event queue + movement
Fill in `src/engine/eventQueue.ts` to schedule and process events. In `Game.ts`, simulate trains moving segment-by-segment honoring block exclusivity.

## 4) Dwell + boarding system
Implement `src/systems/boarding.ts` using the dwell formula and FIFO queues; respect capacity and special dwell at Ringe (id=7).

## 5) Passenger spawn model
Implement the spawn curve and per-station rates from tuning.json in `Game.ts` or a `spawn.ts` system.

## 6) Actions
Wire actions (Deploy, Skip, Reverse, Cancel, Force Empty) in `Game.ts` and reflect state in HUD.

## 7) Breakdowns & delays
Implement `breakdowns.ts` and `delays.ts` following tuning.json parameters.

## 8) Scoring & end-of-day
Add a report screen with stats; compute satisfaction = 100 - avg(frustration).

## 9) Determinism test
Complete `tests/determinism.test.ts` so a given seed + scripted actions yield identical stats across runs.

— Keep systems pure where possible, UI in `src/ui/*`, and use TODOs in files as checklists.
