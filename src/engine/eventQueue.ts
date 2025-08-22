// Minimal event queue stub. TODO: implement priorities & timestamps.
export type SimEvent = { t: number, type: string, payload?: any }
export class EventQueue {
  private q: SimEvent[] = []
  push(e: SimEvent){ this.q.push(e); this.q.sort((a,b)=>a.t-b.t) }
  peek(): SimEvent | undefined { return this.q[0] }
  pop(): SimEvent | undefined { return this.q.shift() }
  clear(){ this.q.length = 0 }
  get size(){ return this.q.length }
}
