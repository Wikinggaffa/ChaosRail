# **Game Design Document — Chaos Rail (Odense–Svendborg Inspired)**

---

## 1. Core Concept

- A **7-day campaign**, each day lasting about **5 minutes of real time**.
- Player manages a **limited fleet of trainsets** (e.g., 3) to serve passengers across a line of 14 stations.
- Each day resets: passengers disappear overnight, trains return to depot.
- **Broken trains** are kept in depot for repairs and unavailable until fixed.
- The challenge is to keep passengers moving, avoid frustration, and survive through Day 7.

---

## 2. Daily Flow

1. **Morning start:**

   - Player sees all trains in depot.
   - Passenger spawning begins at stations.
   - Player drags trainsets from depot to start stations (endpoints).

2. **During the day (5 minutes):**

   - Passengers spawn continuously but at variable rates.
   - Trains pick up, transport, and drop off passengers.
   - Random disruptions occur (delays, breakdowns).
   - Player may control train behaviors with limited actions.

3. **End of day:**

   - All remaining passengers disappear (reset).
   - Broken trains go to depot for repair (not available next day).
   - Performance stats shown (passengers carried, satisfaction, delays).

---

## 3. Player Actions

- **Deploy Train:** Drag a trainset from depot to one of the two endpoints.
- **Skip Stop:** Train passes a station without stopping; onboard passengers destined for it get frustrated.
- **Reverse Direction:** Change direction, but only after reaching the next station.
- **Cancel Train:** Train runs empty without boarding passengers, but still blocks line capacity.
- **Force Empty:** Eject all passengers at a station; they rejoin queue, frustrated.

---

## 4. Opposing Forces

- **Passenger buildup:** Stations accumulate waiting passengers over time.
- **Delays:** Trains may run slower or dwell longer.
- **Breakdowns:** A train may fail and be unavailable until repaired.
- **Limited fleet:** Only a few trains available per day.
- **Passenger frustration:** Grows with wait time or failed trips.

---

## 5. Passenger System & Spawn Logic

A unified description of how passengers behave and spawn each day:

- **Time-of-day curve (per 5-minute day):**

  - **First 60 sec:** Low spawn (10–20% of base rate).
  - **Next 180 sec (middle):** Peak spawn (150% of base rate).
  - **Final 60 sec:** Decline to 30% of base rate.

- **Base spawn rates (per station, per minute):**

  - **Small stops:** 2–5 passengers/min.
  - **Medium stations:** 5–10 passengers/min.
  - **Hotspots (Odensoup, Ringer, Svenburger):** 10–20 passengers/min.

- **Station roles:**

  - Hotspots: ×2 base demand.
  - Medium: baseline demand.
  - Small: ×0.5 demand.

- **Random variance:** Each tick, ±15% noise for unpredictability.

- **Destination logic:**

  - Each passenger chooses a station further down the line (in train’s direction).
  - Short trips are more common than long-distance rides.

- **Frustration factors:**

  - Waiting too long.
  - Being skipped, canceled, or forced off.

This merged system ensures:

- Natural rush-hour peaks and quiet starts/ends.
- Hotspots feel crowded and require planning.
- Medium and small stops contribute realistically without overwhelming flow.

---

## 6. Stations (Humorous Names)

1. Odensoup (Odense) — Hotspot
2. Soup Hospital (Odense Sygehus)
3. Fruity Bøge (Fruens Bøge)
4. Jellysee (Hjallese)
5. Highbee (Højby)
6. Årsløve (Årslev)
7. Pedestrup (Pederstrup)
8. Ringer (Ringe) — Hotspot
9. Rumble (Rudme)
10. Quirndrop (Kværndrup)
11. Stenstuck (Stenstrup)
12. Stenstuck Syd (Stenstrup Syd)
13. Svenbus Vest (Svendborg Vest)
14. Svenburger (Svendborg) — Hotspot

---

## 7. Win / Lose Conditions

- **Win:** Survive all 7 days with passenger satisfaction ≥ threshold (e.g., 60%).
- **Lose:**
  - Satisfaction falls below critical (e.g., 20%).
  - Too many breakdowns → not enough trains to run service.
  - End of Day 7 but targets unmet → soft loss (mocked by in-game newspaper).

---

## 8. Style & Feel

- **Schematic map** with simple station nodes.
- **Pixel-style trains** (normal, delayed, broken).
- **Passengers as dots**, growing queues.
- **Humor:** silly station names, sarcastic flavor text.
- **Play length:** 35 minutes total for full 7-day campaign.

---

## 9. Capacity vs spawn system

- **Capacity vs spawn (peak should overload):** Use 3 trainsets, each **160 pax** nominal (120 seated + 40 standing), **180** crush. Dwell **12–18 s**, doors ≈ **3 pax/s** (≈ **36–54** pax/stop when queues allow). With 14 stations and short segments, assume **\~45–50 pax/min per train** sustained → fleet throughput **\~135–150 pax/min**.
  - **Line‑wide spawn (from §5 ranges at midpoints):** small (6×3.5=**21**), medium (5×7.5=**37.5**), hotspots (3×15=**45**) ⇒ **\~103.5 pax/min base**; peak ×1.5 ⇒ **\~155 pax/min**.
  - **Result:** Peak demand **(\~155)** > max throughput **(\~135–150)** ⇒ **backlog guaranteed** at peak even with perfect play; off‑peak gradually clears. Keep this gap (**+5–20%**) to ensure pressure; raise/lower by tweaking §5 ranges.
- Decide breakdown probabilities per day (increasing over time).

10. Breakdown \
    -Breakdown probabilities per day: Day 1 = 2% per train per day, Day 2 = 3%, Day 3 = 4%, Day 4 = 5%, Day 5 = 6%, Day 6 = 7%, Day 7 = 8%.\
    -A train broken down is out for the rest of the day.
