import type { Train, Line } from '../sim/types';
import { loadJSON } from '../sim/line';

// TODO: move to a more appropriate place
export interface UiLayout {
  colors: Record<string, string>;
  sprites: Record<string, { w: number, h: number, r: number }>;
  hud: {
    actions: {
      order: string[];
      buttonSize: number;
      gap: number;
      anchor: string;
      x: number;
      y: number;
    },
    satisfaction: {
      anchor: string;
      x: number;
      y: number;
      width: number;
      height: number;
    }
  }
}

export class Renderer {
  private ctx: CanvasRenderingContext2D
  private uiLayout!: UiLayout;

  constructor(private canvas: HTMLCanvasElement){
    const ctx = canvas.getContext('2d')
    if(!ctx) throw new Error('Canvas 2D not supported')
    this.ctx = ctx
    this.init();
  }

  private async init() {
    this.uiLayout = await loadJSON<UiLayout>('/data/uiLayout.json');
  }

  clear(){
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
  }

  draw(trains: Train[], line: Line, selectedTrain: Train | null, satisfaction: number) {
    if (!this.uiLayout) {
      return;
    }

    // Draw segments
    this.ctx.strokeStyle = this.uiLayout.colors.hudBg;
    this.ctx.lineWidth = 2;
    for (const segment of line.segments) {
      const from = line.stations.find(s => s.id === segment.fromId);
      const to = line.stations.find(s => s.id === segment.toId);
      if (from && to) {
        this.ctx.beginPath();
        this.ctx.moveTo(from.order * 50 + 25, 100);
        this.ctx.lineTo(to.order * 50 + 25, 100);
        this.ctx.stroke();
      }
    }

    // Draw stations
    for (const station of line.stations) {
      this.ctx.fillStyle = this.uiLayout.colors.hudBg;
      this.ctx.beginPath();
      this.ctx.arc(station.order * 50 + 25, 100, this.uiLayout.sprites.station.r, 0, 2 * Math.PI);
      this.ctx.fill();
    }

    // Draw trains
    for (const train of trains) {
      if (train.state === 'Running') {
        const segment = line.segments[train.segmentIndex];
        const from = line.stations.find(s => s.id === segment.fromId);
        const to = line.stations.find(s => s.id === segment.toId);
        if (from && to) {
          const x = (from.order + (to.order - from.order) * (1 - train.nextEventTime / segment.travelSec)) * 50 + 25;
          this.ctx.fillStyle = train === selectedTrain ? this.uiLayout.colors.warning : this.uiLayout.colors.ok;
          this.ctx.fillRect(x - this.uiLayout.sprites.train.w / 2, 100 - this.uiLayout.sprites.train.h / 2, this.uiLayout.sprites.train.w, this.uiLayout.sprites.train.h);
        }
      }
    }

    // Draw actions
    if (selectedTrain) {
      const actions = this.uiLayout.hud.actions;
      for (let i = 0; i < actions.order.length; i++) {
        const action = actions.order[i];
        const x = this.canvas.width + actions.x - (actions.order.length - i) * (actions.buttonSize + actions.gap);
        const y = this.canvas.height + actions.y - actions.buttonSize;
        this.ctx.fillStyle = this.uiLayout.colors.hudBg;
        this.ctx.fillRect(x, y, actions.buttonSize, actions.buttonSize);
        this.ctx.fillStyle = this.uiLayout.colors.hudText;
        this.ctx.font = '12px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(action, x + actions.buttonSize / 2, y + actions.buttonSize / 2);
      }
    }

    // Draw satisfaction
    const satisfactionLayout = this.uiLayout.hud.satisfaction;
    this.ctx.fillStyle = this.uiLayout.colors.hudBg;
    this.ctx.fillRect(satisfactionLayout.x, satisfactionLayout.y, satisfactionLayout.width, satisfactionLayout.height);
    this.ctx.fillStyle = this.uiLayout.colors.ok;
    this.ctx.fillRect(satisfactionLayout.x, satisfactionLayout.y, satisfactionLayout.width * (satisfaction / 100), satisfactionLayout.height);
    this.ctx.fillStyle = this.uiLayout.colors.hudText;
    this.ctx.font = '12px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(`Satisfaction: ${satisfaction.toFixed(0)}%`, satisfactionLayout.x + satisfactionLayout.width / 2, satisfactionLayout.y + satisfactionLayout.height / 2);
  }

  drawEndDayReport(satisfaction: number) {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = this.uiLayout.colors.hudText;
    this.ctx.font = '32px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('End of Day', this.canvas.width / 2, this.canvas.height / 2 - 50);

    this.ctx.font = '24px sans-serif';
    this.ctx.fillText(`Final Satisfaction: ${satisfaction.toFixed(0)}%`, this.canvas.widh / 2, this.canvas.height / 2);

    const message = satisfaction >= 60 ? 'You Win!' : 'You Lose!';
    this.ctx.font = '48px sans-serif';
    this.ctx.fillStyle = satisfaction >= 60 ? this.uiLayout.colors.ok : this.uiLayout.colors.danger;
    this.ctx.fillText(message, this.canvas.width / 2, this.canvas.height / 2 + 50);
  }
}
