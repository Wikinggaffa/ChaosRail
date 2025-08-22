import { Renderer } from '../ui/renderer'
import { Mulberry32 } from '../engine/rng'
import { loadLine, loadJSON } from '../sim/line'
import type { Tuning, Line, Train, Passenger, Station } from '../sim/types'
import { EventQueue } from '../engine/eventQueue'
import { updateTrainMovement } from '../systems/movement'
import { handleBoarding } from '../systems/boarding'
import { spawnPassengers } from '../systems/spawn'
import { occupyBlock } from '../systems/blocks'
import { BreakdownSystem } from '../systems/breakdowns'
import { DelaySystem } from '../systems/delays'
import { updateFrustration, computeSatisfaction } from '../systems/scoring'

export class Game {
  private renderer: Renderer
  public tick = 0
  private rng = new Mulberry32(1337)
  private tuning!: Tuning
  private line!: Line
  private trains: Train[] = []
  private passengers: Passenger[] = []
  private stationQueues: Map<number, Passenger[]> = new Map()
  private eventQueue = new EventQueue()
  private dayTime = 0;
  private selectedTrain: Train | null = null;
  private breakdownSystem!: BreakdownSystem;
  private delaySystem!: DelaySystem;
  private satisfaction = 100;
  private isDayOver = false;

  constructor(private canvas: HTMLCanvasElement){
    this.renderer = new Renderer(canvas)
    // Kick off async data load; keep minimal until ready.
    this.init()
    this.canvas.addEventListener('click', this.handleClick.bind(this));
  }

  private async init(){
    this.tuning = await loadJSON<Tuning>('/data/tuning.json')
    this.line = await loadLine()
    this.breakdownSystem = new BreakdownSystem(this.tuning, this.rng);
    this.delaySystem = new DelaySystem(this.tuning, this.rng);

    for (const station of this.line.stations) {
      this.stationQueues.set(station.id, []);
    }

    for (let i = 0; i < this.tuning.line.maxTrains; i++) {
      const segmentIndex = i * 2;
      const train: Train = {
        id: i,
        state: 'Running',
        dir: 1,
        segmentIndex,
        onboard: 0,
        passengers: [],
        capacityNominal: this.tuning.capacity.nominal,
        capacityCrush: this.tuning.capacity.crush,
        nextEventTime: this.line.segments[segmentIndex].travelSec,
      };
      this.trains.push(train);
      occupyBlock(segmentIndex);
    }
  }

  update(dt: number){
    if (this.isDayOver) {
      return;
    }

    this.tick++
    this.dayTime += dt;
    const dayPercent = this.dayTime / this.tuning.sim.dayLengthSec;

    // Spawn passengers
    for (const station of this.line.stations) {
      const newPassengers = spawnPassengers(station, this.line, this.tuning, this.rng, dayPercent, dt);
      this.passengers.push(...newPassengers);
      const queue = this.stationQueues.get(station.id)!;
      queue.push(...newPassengers);
    }

    updateFrustration(this.passengers, this.tuning, dt);

    this.breakdownSystem.update(this.trains, dayPercent, dt);
    this.delaySystem.applyDelays(this.trains, dt);

    for (const train of this.trains) {
      if (train.state === 'Running') {
        updateTrainMovement(train, this.line, dt);
        if (train.nextEventTime <= 0) {
          const segment = this.line.segments[train.segmentIndex];
          const station = this.line.stations.find(s => s.id === segment.toId);
          if (station) {
            handleBoarding(train, station, this.stationQueues.get(station.id)!, this.tuning, this.line);
          }
        }
      } else if (train.state === 'Dwell') {
        train.nextEventTime -= dt;
        if (train.nextEventTime <= 0) {
          train.state = 'Running';
        }
      }
    }

    if (this.dayTime >= this.tuning.sim.dayLengthSec) {
      this.endDay();
    }
  }

  render(alpha: number){
    this.renderer.clear()
    this.renderer.draw(this.trains, this.line, this.selectedTrain, this.satisfaction);

    if (this.isDayOver) {
      this.renderer.drawEndDayReport(this.satisfaction);
    }
  }

  private handleClick(event: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Check if a train was clicked
    for (const train of this.trains) {
      const segment = this.line.segments[train.segmentIndex];
      const from = this.line.stations.find(s => s.id === segment.fromId);
      const to = this.line.stations.find(s => s.id === segment.toId);
      if (from && to) {
        const trainX = (from.order + (to.order - from.order) * (1 - train.nextEventTime / segment.travelSec)) * 50 + 25;
        if (x >= trainX - 24 && x <= trainX + 24 && y >= 100 - 8 && y <= 100 + 8) {
          this.selectedTrain = train;
          return;
        }
      }
    }

    // Check if an action button was clicked
    if (this.selectedTrain) {
      const actions = this.tuning.hud.actions;
      for (let i = 0; i < actions.order.length; i++) {
        const action = actions.order[i];
        const buttonX = this.canvas.width + actions.x - (actions.order.length - i) * (actions.buttonSize + actions.gap);
        const buttonY = this.canvas.height + actions.y - actions.buttonSize;
        if (x >= buttonX && x <= buttonX + actions.buttonSize && y >= buttonY && y <= buttonY + actions.buttonSize) {
          this.handleAction(action);
          return;
        }
      }
    }

    this.selectedTrain = null;
  }

  private handleAction(action: string) {
    if (!this.selectedTrain) {
      return;
    }

    switch (action) {
      case 'reverse':
        this.selectedTrain.dir *= -1;
        break;
      case 'skip':
        // TODO
        break;
      case 'cancel':
        // TODO
        break;
      case 'forceEmpty':
        this.selectedTrain.passengers = [];
        this.selectedTrain.onboard = 0;
        break;
    }

    this.selectedTrain = null;
  }

  private endDay() {
    let totalFrustration = 0;
    for (const p of this.passengers) {
      totalFrustration += p.frustration;
    }
    const avgFrustration = this.passengers.length > 0 ? totalFrustration / this.passengers.length : 0;
    this.satisfaction = computeSatisfaction(avgFrustration);
    this.isDayOver = true;
  }
}
