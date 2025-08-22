import { FixedTimestepLoop } from './engine/time'
import { Game } from './scenes/Game'

const canvas = document.getElementById('view') as HTMLCanvasElement
const tickEl = document.getElementById('tick') as HTMLSpanElement

const game = new Game(canvas)

const loop = new FixedTimestepLoop({
  update: (dt) => {
    game.update(dt)
    tickEl.textContent = `tick: ${game.tick}`
  },
  render: (alpha) => game.render(alpha),
  simHz: 20
})

loop.start()
