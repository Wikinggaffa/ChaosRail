import type { Train, Tuning } from '../sim/types';
import { Mulberry32 } from '../engine/rng';
import { occupyBlock, releaseBlock } from './blocks';

export class BreakdownSystem {
  constructor(private tuning: Tuning, private rng: Mulberry32) {}

  update(trains: Train[], dayPercent: number, dt: number) {
    for (const train of trains) {
      if (train.state === 'Running') {
        const lambda = 0.6 * dayPercent / 60; // per second
        if (this.rng.next(0, 1) < lambda * dt) {
          train.state = 'Breakdown';
          const duration = this.rng.next(this.tuning.hazard.durationSecRange[0], this.tuning.hazard.durationSecRange[1]);
          train.nextEventTime = duration;
          occupyBlock(train.segmentIndex);
        }
      } else if (train.state === 'Breakdown') {
        train.nextEventTime -= dt;
        if (train.nextEventTime <= 0) {
          train.state = 'Removed';
          releaseBlock(train.segmentIndex);
        }
      }
    }
  }
}
