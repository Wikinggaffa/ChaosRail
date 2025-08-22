export class Mulberry32 {
  private seed: number

  constructor(seed: number){ this.seed = seed >>> 0 }

  private gen(): number {
    let t = this.seed += 0x6D2B79F5
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }

  next(min?: number, max?: number): number {
    const r = this.gen()
    if(min === undefined && max === undefined) return r
    if(max === undefined){ max = min!; min = 0 }
    return (min as number) + r * ((max as number) - (min as number))
  }

  nextInt(max: number){ return Math.floor(this.gen() * max) }
  range(min: number, max: number){ return min + (max - min) * this.gen() }
}
