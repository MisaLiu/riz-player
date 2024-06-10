import { autoDetectRenderer, Text, Container, Ticker } from 'pixi.js';
import '@/styles/index.css';
import { GameAudio } from './audio';
import { GameAudioClip } from './audio/clip';

const initApp = async () => {
  const renderer = await autoDetectRenderer({
    preference: 'webgpu',
    // Normal Pixi.js renderer options
    antialias: true,
    autoDensity: true,
    backgroundColor: 0xffffff,
    resolution: window.devicePixelRatio,
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
    hello: true,
  });
  const stage = new Container();
  const audio = new GameAudio();

  let testAudio: GameAudioClip;

  const text = new Text({
    text: 'Hello world ;)',
    style: {
      fontSize: 24,
    }
  });

  text.anchor.x = 0.5;
  text.anchor.y = 0.5;

  text.position.x = renderer.width / 2;
  text.position.y = renderer.height / 2;

  stage.addChild(text);

  // Refresh renderer
  Ticker.shared.add(() => {
    renderer.render(stage);
  });

  // Add canvas to HTML
  renderer.canvas.classList.add('app');
  document.body.appendChild(renderer.canvas);

  // For debug
  globalThis.__PIXI_RENDERER__ = renderer;
  globalThis.__PIXI_STAGE__ = stage;

  // Resizer
  window.addEventListener('resize', () => {
    renderer.resize(document.documentElement.clientWidth, document.documentElement.clientHeight, window.devicePixelRatio);

    text.position.x = renderer.width / 2;
    text.position.y = renderer.height / 2;
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
};

initApp();