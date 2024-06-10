import { GameAudio } from '.';

export class GameAudioClip {
  readonly name: string;
  readonly source: AudioBuffer;
  readonly buffer: AudioBufferSourceNode;
  readonly gain: GainNode;

  constructor(audio: GameAudio, name: string, audioBuffer?: AudioBuffer) {
    if (!audioBuffer) throw new Error('Invaild AudioBuffer, unsupported audio type of corrupted audio file');

    this.name = name;
    this.source = audioBuffer;
    this.buffer = audio.ctx.createBufferSource();
    this.gain = audio.ctx.createGain();

    this.buffer.buffer = this.source;

    this.buffer.connect(this.gain);
    this.gain.connect(audio.gain);
  }
}
