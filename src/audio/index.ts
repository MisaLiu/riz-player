import { Ticker } from 'pixi.js';
import { GameAudioClip } from './clip';
import { resumeAudioCtx } from './utils';
import { GameAudioClock } from './clock';

const AudioCtx = window.AudioContext || window.webkitAudioContext;
const GlobalAudioCtx = new AudioCtx();
const GlobalAudioClock = new GameAudioClock(GlobalAudioCtx, Ticker.system);

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

  clock: GameAudioClock = GlobalAudioClock;

  clips: Record<string, GameAudioClip> = {};

  constructor() {
    this.ctx = GlobalAudioCtx;
    this.gain = this.ctx.createGain();

    this.gain.connect(this.ctx.destination);
    resumeAudioCtx(this.ctx);
  }

  add(name: string, src: string | File | ArrayBuffer) {
    return new Promise<GameAudioClip>(async (res, rej) => {
      try {
        let arrayBuffer: ArrayBuffer;

        if (typeof src === 'string') arrayBuffer = await downloadFile(src);
        else if (src instanceof File) arrayBuffer = await fileToArrayBuffer(src);
        else arrayBuffer = src;

        const track = await this.ctx.decodeAudioData(arrayBuffer);
        const clip = new GameAudioClip(this, name, track);

        if (this.clips[name]) console.warn('[Audio]', `Name '${name}' already in use, overriding...`);
        this.clips[name] = clip;

        res(clip);
      } catch (e) {
        rej(e);
      }
    });
  }

  remove(name: string) {
    if (!this.clips[name]) return;

    this.clips[name].destroy();
    delete this.clips[name];
  }

  play(name: string) {
    if (!this.clips[name]) return;
    this.clips[name].play();
  }

  pause(name: string) {
    if (!this.clips[name]) return;
    this.clips[name].pause();
  }

  stop(name: string) {
    if (!this.clips[name]) return;
    this.clips[name].stop();
  }

  get volume() {
    return this.gain.gain.value;
  }

  set volume(volume: number) {
    this.gain.gain.value = volume;
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
