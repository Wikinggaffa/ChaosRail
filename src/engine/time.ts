export type LoopHandlers = {
  update: (dt: number) => void  // dt in seconds
  render: (alpha: number) => void
  simHz?: number
}

export class FixedTimestepLoop {
  private readonly update
  private readonly render
  private readonly dt
  private acc = 0
  private running = false
  private last = 0

  constructor(h: LoopHandlers){
    this.update = h.update
    this.render = h.render
    const hz = h.simHz ?? 20
    this.dt = 1 / hz
  }

  start(){
    if(this.running) return
    this.running = true
    this.last = performance.now()
    const frame = (now: number) => {
      if(!this.running) return
      let delta = (now - this.last) / 1000
      if(delta > 0.25) delta = 0.25 // avoid spiral of death
      this.last = now
      this.acc += delta
      while(this.acc >= this.dt){
        this.update(this.dt)
        this.acc -= this.dt
      }
      const alpha = this.acc / this.dt
      this.render(alpha)
      requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }

  stop(){ this.running = false }
}
