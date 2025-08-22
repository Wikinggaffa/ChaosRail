import type { Train, Station, Passenger, Tuning, Line } from '../sim/types';

// TODO: Implement FIFO boarding/alighting.
// dwellSec = clamp(min, base + perPax*(board + alight*2), max)
// Stop boarding if onboard > capacityCrush.
export function computeDwellSeconds(board: number, alight: number, base: number, per: number, min: number, max: number){
  const v = base + per * (board + alight * 2)
  return Math.max(min, Math.min(max, v))
}

export function handleBoarding(train: Train, station: Station, queue: Passenger[], tuning: Tuning, line: Line) {
  // Alighting passengers
  const alightingPassengers = train.passengers.filter(p => p.destId === station.id);
  train.passengers = train.passengers.filter(p => p.destId !== station.id);
  const alight = alightingPassengers.length;
  train.onboard -= alight;

  // Boarding passengers
  const boardingPassengers = queue.filter(p => {
    const originStation = line.stations.find(s => s.id === p.originId);
    const destStation = line.stations.find(s => s.id === p.destId);
    if (!originStation || !destStation) {
      return false;
    }
    return (destStation.order - originStation.order) * train.dir > 0;
  });

  const space = train.capacityCrush - train.onboard;
  const numToBoard = Math.min(boardingPassengers.length, space);
  const boarding = boardingPassengers.slice(0, numToBoard);

  for (const p of boarding) {
    p.state = 'OnTrain';
    train.passengers.push(p);
    const index = queue.indexOf(p);
    if (index > -1) {
      queue.splice(index, 1);
    }
  }
  train.onboard += boarding.length;

  const dwellTime = computeDwellSeconds(
    boarding.length,
    alight,
    tuning.dwell.baseSec,
    tuning.dwell.perPaxSec,
    tuning.dwell.minSec,
    tuning.dwell.maxSec
  );

  train.state = 'Dwell';
  train.nextEventTime = dwellTime;
}
