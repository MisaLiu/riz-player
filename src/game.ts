import { Ticker } from 'pixi.js';
import { GameRenderer } from './renderer';
import { GameChart } from './chart';
import { GameAudio } from './audio';
import { GameAudioClip } from './audio/clip';

export const DebugStartGame = (renderer: GameRenderer, chart: GameChart, audio: GameAudio, clip: GameAudioClip) => {
  const ticker = new Ticker();

  chart.createSprites(renderer.containers.game);
  ticker.add(() => {
    const currentTime = audio.clock.time - clip.startTime;
    const { width, height } = renderer.renderer;
    const widthHalf = width / 2;

    for (const note of chart.notes) {
      const timeBetween = note.time - currentTime;

      note.sprite.x = widthHalf;
      note.sprite.y = height - (timeBetween * 1000);
    }
  });

  ticker.start();
  clip.play();
};
