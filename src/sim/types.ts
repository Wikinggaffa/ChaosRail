export type StationType = 'small'|'medium'|'hotspot'

export interface Station {
  id: number
  name: string
  type: StationType
  order: number
  todMultiplier: number
}

export interface Segment {
  fromId: number
  toId: number
  travelSec: number
  bidirectional: boolean
  hasStationDwell: boolean
  name: string
}

export type TrainState = 'Depot'|'Running'|'Dwell'|'Turnback'|'Breakdown'|'Removed'

export interface Train {
  id: number
  state: TrainState
  dir: 1|-1
  segmentIndex: number    // index in Line.segmentsOrdered for current direction
  onboard: number
  passengers: Passenger[]
  capacityNominal: number
  capacityCrush: number
  nextEventTime: number   // absolute sim time for next event
}

export interface Passenger {
  id: number
  originId: number
  destId: number
  frustration: number
  state: 'Queue'|'Boarding'|'OnTrain'|'Alight'|'Done'
}

export interface Line {
  stations: Station[]
  segments: Segment[]
  endpoints: [number, number]
  depotStationId: number
}

export interface Tuning {
  sim: { tickMs: number, dayLengthSec: number, rngSeed: number }
  line: { endpoints:[number, number], depotStationId:number, maxTrains:number }
  capacity: { nominal:number, crush:number }
  dwell: { baseSec:number, perPaxSec:number, minSec:number, maxSec:number, specialStationIds: Record<string, number> }
  turnback: { layoverSec:number, endpointsOnly:boolean }
  frustration: { waitingPerSec:number, onTrainDecayPerSec:number, skipPenalty:number, cancelPenalty:number, forceOffPenalty:number }
  hazard: { baseRateFormula:string, durationSecRange:[number,number], trainRemovedAfterRepair:boolean }
  delays: { speedFactor:number, dwellFactor:number, durationSecRange:[number,number] }
  spawn: {
    basePerMin: Record<StationType, number>
    dayScaleByDay: number[]
    curve: { type:'piecewise_linear', segments: {t0:number,t1:number,v0:number,v1:number}[] }
    tickNoiseUniform: [number, number]
  }
  ui: { satisfactionZones: [ [number, number, string], [number, number, string], [number, number, string] ] }
}
