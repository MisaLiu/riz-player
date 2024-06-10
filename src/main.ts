import { autoDetectRenderer, Application, Text, Container, Ticker } from 'pixi.js';
import '@/styles/index.css';

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
};

initApp();