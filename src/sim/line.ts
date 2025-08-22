import type { Line, Station, Segment, Tuning } from './types'

export async function loadJSON<T>(url: string): Promise<T>{
  const r = await fetch(url)
  if(!r.ok) throw new Error(`Failed to load ${url}: ${r.status}`)
  return r.json() as Promise<T>
}

// TODO: cache results if needed
export async function loadLine(): Promise<Line>{
  const [stations, segments, tuning] = await Promise.all([
    loadJSON<Station[]>('/data/stations.json'),
    loadJSON<Segment[]>('/data/segments.json'),
    loadJSON<Tuning>('/data/tuning.json'),
  ])
  return { stations, segments, endpoints: tuning.line.endpoints as [number,number], depotStationId: tuning.line.depotStationId }
}
