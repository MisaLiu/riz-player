import { Ticker } from 'pixi.js';
import { resumeAudioCtx } from './utils';

export class GameAudioClock {
  public time: number = 0;

  private _offsets: Array<number> = [];
  private _sum: number = 0;

  private readonly _ctx: AudioContext;
  private readonly _ticker: Ticker;

  constructor(audioCtx: AudioContext, ticker: Ticker) {
    resumeAudioCtx(audioCtx);

    this._ctx = audioCtx;
    this._ticker = ticker;

    this._initTicker();
  }

  private _initTicker() {
    if (this._ctx.state === 'running') this._ticker.add(() => this._calcTick());
    else this._ctx.addEventListener('statechange', () => {
      if (this._ctx.state !== 'running') return;
      this._ticker.add(() => this._calcTick());
    });
  }

  private _calcTick() {
    const realTime = performance.now() / 1000;
    const delta = realTime - this._ctx.currentTime;

    this._offsets.push(delta);
    this._sum += delta;

    while (this._offsets.length > 60) {
      this._sum -= this._offsets.shift()!;
    }

    this.time = realTime - this._sum / this._offsets.length;
  }
}