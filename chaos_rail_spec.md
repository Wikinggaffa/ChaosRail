# Chaos Rail - Full Game Design Document (Detailed for Implementation)

## 0) Scope & Tech
- **Engine/Platform**: TBD (likely GameMaker Studio 2, Desktop build, 16:9 aspect, 60 FPS render).
- **Determinism/Replays**: Yes — simulation uses fixed timestep & seeded randomness for replays/debug.
- **Tickrate**: 50 ms (20 ticks/s).
- **Rendering**: 60 FPS.

---

## 1) World & Line Geometry
- **Line**: Single track with 14 stations + 2 endpoints + 1 depot.
- **Passing rules**: Trains can only pass each other in stations.
- **Block system**: Only one train allowed in a line segment between stations.
- **Speeds**:
  - Cruise: 60 km/h.
  - Accel/decel: 0.6 m/s².
  - Approaching station: max 25 km/h within 300 m.

### Station Order (North → South)
1. Odense
2. Odense Sygehus
3. Fruens Bøge
4. Hjallese
5. Højby Fyn
6. Årslev
7. Pederstrup
8. Ringe
9. Rudme
10. Kværndrup
11. Stenstrup
12. Stenstrup Syd
13. Svendborg Vest
14. Svendborg

### Segment Travel Times (Minutes from timetable)
- Odense → Odense Sygehus: 4 min
- Odense Sygehus → Fruens Bøge: 2 min
- Fruens Bøge → Hjallese: 3 min
- Hjallese → Højby Fyn: 5 min
- Højby Fyn → Årslev: 5 min
- Årslev → Pederstrup: 2 min
- Pederstrup → Ringe: 5 min
- Ringe dwell: 2 min
- Ringe → Rudme: 4 min
- Rudme → Kværndrup: 3 min
- Kværndrup → Stenstrup: 4 min
- Stenstrup → Stenstrup Syd: 2 min
- Stenstrup Syd → Svendborg Vest: 2 min
- Svendborg Vest → Svendborg: 4 min

### Scaled Travel Times (Game Seconds)
(54 min real → 300 s game; factor ≈ 10.8)
- Odense → Odense Sygehus: 22 s
- Odense Sygehus → Fruens Bøge: 11 s
- Fruens Bøge → Hjallese: 17 s
- Hjallese → Højby Fyn: 28 s
- Højby Fyn → Årslev: 28 s
- Årslev → Pederstrup: 11 s
- Pederstrup → Ringe: 28 s
- Ringe dwell: 11 s
- Ringe → Rudme: 22 s
- Rudme → Kværndrup: 17 s
- Kværndrup → Stenstrup: 22 s
- Stenstrup → Stenstrup Syd: 11 s
- Stenstrup Syd → Svendborg Vest: 11 s
- Svendborg Vest → Svendborg: 22 s

---

## 2) Game Loop & Time
- **Day length**: 300 s.
- **Flow**: Day intro → 5 min gameplay → End-of-day report.
- **End-of-day reset**:
  - All remaining passengers disappear (reset).
  - Broken trains go to depot for repair (not available next day).
  - Active trains return to depot automatically.

---

## 3) Trains
- **State machine**: Depot → Dispatched → Running → Dwell → Turnback → (optional Breakdown) → Return.
- **Capacity**:
  - Nominal: 150 pax.
  - Crush: 180 pax (boarding stops once exceeded).
- **Dwell time**:
  - Formula: 6 s + 0.35 s per passenger boarding/alighting.
  - Clamp: 12–18 s.
- **Turnback rules**: Only at endpoints; 20 s layover before reversing (automatic at end stations).

---

## 4) Passenger System
- **Spawn curve**:
  - Ramp-up → Peak → Ramp-down (exact formulas TBD).
  - Noise: ±15% random per tick.
- **Station types**:
  - Small, Medium, Hotspot (spawn multipliers TBD).
- **Destination choice**:
  - Weighted by distance (shorter trips more likely).
- **Queues**:
  - FIFO.
  - No abandonment (they will wait indefinitely).
- **Boarding order**:
  - Strict FIFO.

---

## 5) Frustration & Scoring
- **Frustration rules**:
  - Waiting: +0.02/s.
  - Skip: +8.
  - Cancel: +10.
  - Forced off: +12.
  - Decay: −0.03/s when on train.
- **Satisfaction formula**:
  - Passenger satisfaction = 100 − avg(frustration).
- **Thresholds**:
  - Win: ≥60% satisfied.
  - Lose: <20% satisfied.
- **Report stats**:
  - Passengers carried, avg wait, on-time %, satisfaction, action penalties.

---

## 6) Disruptions
- **Breakdowns**:
  - Hazard: 0.6 × day% per minute.
  - Duration: 60–120 s.
  - Effect: Train blocks section, no passing possible.
  - After repair: Train removed from service for the day.
- **Delays**:
  - (TBD: could be speed reductions or dwell inflation).

---

## 7) Player Actions & Limits
- **Deploy Train:** Add a trainset from depot to one of the two endpoints (max 5 trains in total).
- **Skip Stop:** Train passes a station without stopping; onboard passengers destined for it get frustrated.
- **Reverse Direction:** Change direction, but only after reaching the next station (automatic at endpoints).
- **Cancel Train:** Train runs empty without boarding passengers, but still blocks line capacity until depot at end station.
- **Force Empty:** Eject all passengers at a station; they rejoin queue, frustrated.

---

## 8) UI/UX
- **Screens**:
  - Main menu.
  - Day intro.
  - In-game HUD.
  - End-of-day report.
- **HUD**:
  - Timer, satisfaction meter, fleet panel, passenger counts, action buttons.
- **Indicators**:
  - Passenger dots + numeric counts.
  - Station badges (small/medium/hotspot).

---

## 9) Content & Difficulty
- **Campaign = 7 days**.
- **Progression**:
  - Day 1: Tutorial.
  - Day 3: Introduce breakdowns/delays.
  - Day 5: Overload.
  - Day 7: Chaos finale.
- **Difficulty scaling**: Spawn rate & breakdown hazard rise each day.

---

## 10) Systems & Architecture
- **Entities**: Train, Station, Passenger, Line segment.
- **Simulation**: Event queue (arrivals, departures, breakdowns).
- **Save/load**: Day progress, difficulty state.
- **Performance**: Optimize for ~2000 passengers simultaneously.

---

## 11) Audio & Visual
- **Art style**: Pixel.
- **Sprites**: Train (normal/delayed/broken), stations, passenger dots.
- **Sounds**: Boarding, door chime, breakdown alert, stingers.
- **Animations**: Door cycles, breakdown smoke, crowd buildup.

---

## 12) Debug & Telemetry
- **Debug overlays**: spawn rate, block occupancy, frustration heatmap.
- **Telemetry**: passenger stats, action usage.
- **Edge cases**: all trains broken, 0 demand, end-of-day passengers mid-train, simultaneous conflicting actions.

