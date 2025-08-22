import { describe, it, expect } from 'vitest'
import { Mulberry32 } from '../src/engine/rng'

describe('Mulberry32 determinism', () => {
  it('produces the same sequence for the same seed', () => {
    const a = new Mulberry32(1234)
    const b = new Mulberry32(1234)
    const seqA = [a.next(), a.next(0,1), a.next(5), a.next(1,5)]
    const seqB = [b.next(), b.next(0,1), b.next(5), b.next(1,5)]
    expect(seqA).toEqual(seqB)
  })
})
