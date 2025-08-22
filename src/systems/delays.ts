import type { Train, Tuning } from '../sim/types';
import { Mulberry32 } from '../engine/rng';

export class DelaySystem {
  constructor(private tuning: Tuning, private rng: Mulberry32) {}

  applyDelays(trains: Train[], dt: number) {
    for (const train of trains) {
      if (train.state === 'Running') {
        // Simplified delay logic
        if (this.rng.next(0, 1) < 0.1 * dt) { // 10% chance of delay per second
          train.nextEventTime *= this.tuning.delays.speedFactor;
        }
      } else if (train.state === 'Dwell') {
        if (this.rng.next(0, 1) < 0.1 * dt) { // 10% chance of delay per second
          train.nextEventTime *= this.tuning.delays.dwellFactor;
        }
      }
    }
  }
}
