import type { Train, Line, Segment } from '../sim/types';
import { isBlockOccupied, occupyBlock, releaseBlock } from './blocks';

export function updateTrainMovement(train: Train, line: Line, dt: number) {
  if (train.state !== 'Running') {
    return;
  }

  train.nextEventTime -= dt;

  if (train.nextEventTime <= 0) {
    const currentSegment = line.segments[train.segmentIndex];
    const nextSegmentIndex = train.segmentIndex + train.dir;
    const nextSegment = line.segments[nextSegmentIndex];

    if (nextSegment) {
      if (!isBlockOccupied(nextSegmentIndex)) {
        releaseBlock(train.segmentIndex);
        occupyBlock(nextSegmentIndex);
        train.segmentIndex = nextSegmentIndex;
        train.nextEventTime = nextSegment.travelSec;
      }
    } else {
      // End of the line, turn back
      train.dir *= -1;
      const nextSegmentIndex = train.segmentIndex + train.dir;
      if (!isBlockOccupied(nextSegmentIndex)) {
        releaseBlock(train.segmentIndex);
        occupyBlock(nextSegmentIndex);
        train.segmentIndex = nextSegmentIndex;
        train.nextEventTime = line.segments[train.segmentIndex].travelSec;
      }
    }
  }
}
