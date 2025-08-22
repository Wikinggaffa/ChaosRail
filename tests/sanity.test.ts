import { describe, it, expect } from 'vitest'
import { computeDwellSeconds } from '../src/systems/boarding'
import { computeSatisfaction } from '../src/systems/scoring'

describe('formulas', () => {
  it('dwell clamps', () => {
    expect(computeDwellSeconds(0,0,6,0.35,12,18)).toBe(12)
    expect(computeDwellSeconds(20,10,6,0.35,12,18)).toBeCloseTo(18, 5)
  })
  it('satisfaction', () => {
    expect(computeSatisfaction(0)).toBe(100)
    expect(computeSatisfaction(40)).toBe(60)
  })
})
