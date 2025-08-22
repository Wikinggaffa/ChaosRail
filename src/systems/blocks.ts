import type { Train, Line } from '../sim/types';

const blocks = new Set<number>();

export function isBlockOccupied(segmentId: number): boolean {
  return blocks.has(segmentId);
}

export function occupyBlock(segmentId: number) {
  blocks.add(segmentId);
}

export function releaseBlock(segmentId: number) {
  blocks.delete(segmentId);
}
