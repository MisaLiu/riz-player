import { autoDetectRenderer, Text, Container, Ticker } from 'pixi.js';
import '@/styles/index.css';
import { GameRenderer } from './renderer';
import { GameAudio } from './audio';
import { GameAudioClip } from './audio/clip';

const app = new GameRenderer();
const audio = new GameAudio();
app.init().then(() => initApp());

const initApp = async () => {
  let testAudio: GameAudioClip;

  const text = new Text({
    text: 'Hello world ;)',
    style: {
      fontSize: 24,
    }
  });

  text.anchor.x = 0.5;
  text.anchor.y = 0.5;

  text.position.x = app.renderer.width / 2;
  text.position.y = app.renderer.height / 2;

  app.stage.addChild(text);

  // Add canvas to HTML
  app.canvas.classList.add('app');
  document.body.appendChild(app.canvas);

  // For debug
  globalThis.__PIXI_RENDERER__ = app.renderer;
  globalThis.__PIXI_STAGE__ = app.stage;

  // Resizer
  window.addEventListener('resize', () => {
    app.resize(document.documentElement.clientWidth, document.documentElement.clientHeight);

    text.position.x = app.renderer.width / 2;
    text.position.y = app.renderer.height / 2;
  });

  // Test audio module
  const updateAudioProgress = () => {
    if (!testAudio) return;
    text.text = `Progress: ${Math.round((audio.clock.time - testAudio.startTime) * 1000) / 1000}s`;
  };

  document.querySelector<HTMLInputElement>('#test-load-audio')!.addEventListener('input', function () {
    const file = this.files![0];
    if (!file) return;

    console.log(file);
    audio.add('test', file)
      .then((e) => {
        testAudio = e;

        console.log(e);
        e.play();
        Ticker.shared.add(updateAudioProgress);
      });
  });

  document.querySelector<HTMLInputElement>('#test-load-chart')!.addEventListener('input', function () {
    const file = this.files![0];
    if (!file) return;

    console.log(file);
  });
};
