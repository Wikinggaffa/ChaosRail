# Chaos Rail – Starter (Vite + TypeScript)

What this is:
- A compile-ready project scaffold for browser + Canvas 2D.
- JSON data packs (stations, segments, campaignDays, tuning, uiLayout) under `public/data/`.
- TypeScript interfaces + stubs so AI code assistants can implement systems safely.

Quick start
1) Install Node LTS (>=18).
2) `npm i`
3) `npm run dev` → open http://localhost:5173
4) You should see a blank canvas with a HUD frame and tick counter.

How to use with an AI code assistant (ChatGPT / Gemini in VS Code)
- Open this folder in VS Code.
- Use the prompts in `AI_PROMPTS.md` step-by-step.
- The files contain TODOs guiding what to implement next.
- Run `npm test` occasionally; vitest has a couple of sanity checks.

Project shape
- `src/engine` – time loop, event queue, RNG
- `src/sim` – pure data types + line model
- `src/systems` – boarding, blocks, breakdowns, delays, scoring
- `src/ui` – canvas renderer + HUD
- `src/scenes` – Game orchestration
- `public/data` – JSON packs

Acceptance (minimum):
- Fixed timestep 20 Hz; seedable RNG determinism.
- Dwell formula, capacity clamps, block exclusivity, endpoint turnbacks.
- Frustration math + penalties.
- Breakdown hazard behavior.
- End-of-day report with satisfaction >=60% considered a win.
