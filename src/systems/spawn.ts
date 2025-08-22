import type { Station, Tuning, Passenger, StationType, Line } from '../sim/types';
import { Mulberry32 } from '../engine/rng';

let passengerId = 0;

export function spawnPassengers(
  station: Station,
  line: Line,
  tuning: Tuning,
  rng: Mulberry32,
  dayPercent: number,
  dt: number
): Passenger[] {
  const stationType: StationType = station.type;
  const baseRate = tuning.spawn.basePerMin[stationType] / 60; // per second
  const curve = getCurveValue(tuning.spawn.curve, dayPercent);
  const noise = rng.next(tuning.spawn.tickNoiseUniform[0], tuning.spawn.tickNoiseUniform[1]);
  const spawnRate = baseRate * curve * noise;

  const numToSpawn = Math.floor(spawnRate * dt);
  const passengers: Passenger[] = [];
  const stationIds = line.stations.map(s => s.id);

  for (let i = 0; i < numToSpawn; i++) {
    let destId = station.id;
    while (destId === station.id) {
      destId = stationIds[Math.floor(rng.next(0, stationIds.length))];
    }

    passengers.push({
      id: passengerId++,
      originId: station.id,
      destId,
      frustration: 0,
      state: 'Queue',
    });
  }

  return passengers;
}

function getCurveValue(
  curve: { segments: { t0: number, t1: number, v0: number, v1: number }[] },
  t: number
): number {
  for (const segment of curve.segments) {
    if (t >= segment.t0 && t <= segment.t1) {
      const p = (t - segment.t0) / (segment.t1 - segment.t0);
      return segment.v0 + p * (segment.v1 - segment.v0);
    }
  }
  return 0;
}
