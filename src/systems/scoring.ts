import type { Passenger, Tuning } from '../sim/types';

// TODO: Track frustration deltas and compute satisfaction.
export function computeSatisfaction(avgFrustration: number){ return Math.max(0, 100 - avgFrustration) }

export function updateFrustration(passengers: Passenger[], tuning: Tuning, dt: number) {
  for (const p of passengers) {
    if (p.state === 'Queue') {
      p.frustration += tuning.frustration.waitingPerSec * dt;
    } else if (p.state === 'OnTrain') {
      p.frustration -= tuning.frustration.onTrainDecayPerSec * dt;
    }
  }
}
