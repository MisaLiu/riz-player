import { Ticker } from 'pixi.js';
import { GameAudioClip } from './clip';
import { resumeAudioCtx } from './utils';

const AudioCtx = window.AudioContext || window.webkitAudioContext;
const GlobalAudioCtx = new AudioCtx();

const downloadFile = (url: string) => new Promise<ArrayBuffer>((res, rej) => {
  fetch(url)
    .then(e => e.arrayBuffer())
    .then(e => res(e))
    .catch(e => rej(e));
});

const fileToArrayBuffer = (file: File) => new Promise<ArrayBuffer>((res, rej) => {
  const reader = new FileReader();

  reader.onload = () => {
    if (!reader.result) return rej('Loaded empty content');
    res(reader.result as ArrayBuffer);
  };
  reader.onerror = (e) => {
    rej(e);
  };

  reader.readAsArrayBuffer(file);
});

export class GameAudio {
  ctx: AudioContext;
  gain: GainNode;

  ticker: Ticker = Ticker.system;

  clips: Record<string, GameAudioClip> = {};

  constructor() {
    this.ctx = GlobalAudioCtx;
    this.gain = this.ctx.createGain();

    this.gain.connect(this.ctx.destination);

    resumeAudioCtx(this.ctx);
  }

  add(name: string, src: string | File | ArrayBuffer) {
    return new Promise(async (res, rej) => {
      try {
        let arrayBuffer: ArrayBuffer;

        if (typeof src === 'string') arrayBuffer = await downloadFile(src);
        else if (src instanceof File) arrayBuffer = await fileToArrayBuffer(src);
        else arrayBuffer = src;

        const track = await this.ctx.decodeAudioData(arrayBuffer);
        const clip = new GameAudioClip(this, name, track);
        this.clips[name] = clip;

        res(clip);
      } catch (e) {
        rej(e);
      }
    });
  }

  remove(name: string) {
    if (!this.clips[name]) return;

    this.clips[name].buffer.disconnect();
    this.clips[name].gain.disconnect();

    delete this.clips[name];
  }

  private _calcTick() {

  }
}

// Auto resume AudioContext when clicking/touching
const handleWindowLoaded = () => {
  window.removeEventListener('load', handleWindowLoaded);

  if (GlobalAudioCtx.state === 'running') return;
  window.addEventListener('pointerdown', resumeAudio);
};

const resumeAudio = () => {
  resumeAudioCtx(GlobalAudioCtx);
};

GlobalAudioCtx.addEventListener('statechange', () => {
  if (GlobalAudioCtx.state !== 'running') return;

  console.log('[Audio]', 'Resume audio success');
  window.removeEventListener('pointerdown', resumeAudio);
});

window.addEventListener('load', handleWindowLoaded);
