import { GameAudio } from '.';
import { GameAudioClock } from './clock';

export enum GameAudioClipStatus {
  STOP = -1,
  PLAY = 0,
  PAUSE = 1,
}

export class GameAudioClip {
  readonly name: string;
  readonly source: AudioBuffer;
  private _buffer?: AudioBufferSourceNode;
  private readonly _ctx: AudioContext;
  private readonly _gain: GainNode;
  private readonly _clock: GameAudioClock;

  status: GameAudioClipStatus = GameAudioClipStatus.STOP;
  startTime: number = NaN;
  pauseTime: number = NaN;

  constructor(audio: GameAudio, name: string, audioBuffer?: AudioBuffer) {
    if (!audioBuffer) throw new Error('Invaild AudioBuffer, unsupported audio type or corrupted audio file');

    this.name = name;
    this.source = audioBuffer;
    this._ctx = audio.ctx;
    this._gain = this._ctx.createGain();
    this._clock = audio.clock;

    this._gain.connect(audio.gain);
  }

  play(noTimer: boolean = false) {
    this._connectBuffer(noTimer);

    if (!noTimer) {
      if (isNaN(this.pauseTime)) {
        this.startTime = this._clock.time;
        this._buffer!.start(0, 0);
      } else {
        const pausedTime = this.pauseTime - this.startTime;
        this.startTime = this._clock.time - pausedTime;
        this._buffer!.start(0, pausedTime);
      }
    } else {
      this._buffer!.start(0, 0);
    }

    this.pauseTime = NaN;
    this.status = GameAudioClipStatus.PLAY;
  }

  pause() {
    this._disconnectBuffer();

    this.pauseTime = this._clock.time;
    this.status = GameAudioClipStatus.PAUSE;
  }

  stop() {
    this._disconnectBuffer();

    this.startTime = NaN;
    this.pauseTime = NaN;
    this.status = GameAudioClipStatus.STOP;
  }

  destroy() {
    if (this._buffer) this.stop();
    this._gain.disconnect();
  }

  private _connectBuffer(noTimer: boolean = false) {
    this._buffer = this._ctx.createBufferSource();
    this._buffer.buffer = this.source;
    this._buffer.connect(this._gain);

    if (!noTimer) {
      this._buffer.onended = () => {
        this.stop();
      };
    }
  }

  private _disconnectBuffer() {
    this._buffer!.disconnect();
    this._buffer!.onended = null;
    this._buffer = undefined;
  }

  get volume() {
    return this._gain.gain.value;
  }

  set volume(volume: number) {
    this._gain.gain.value = volume;
  }

  get speed() {
    return this._buffer ? this._buffer.playbackRate.value : NaN;
  }

  set speed(speed: number) {
    this._buffer!.playbackRate.value = speed;
  }
}
