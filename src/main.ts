import { Text } from 'pixi.js';
import '@/styles/index.css';
import { GameRenderer } from './renderer';
import { GameAudio } from './audio';
import { GameAudioClip } from './audio/clip';
import { GameChart, readChartFromOfficial } from './chart';
import { OfficialChart } from './chart/types';

interface ChartFiles {
  music?: GameAudioClip,
  chart?: GameChart,
}

const ChartFiles: ChartFiles = {};

const readFileAsText = (file: File) => new Promise<string>((res, rej) => {
  const reader = new FileReader();

  reader.onload = () => {
    res(reader.result as string);
  };

  reader.onerror = (e) => {
    rej(e);
  };

  reader.readAsText(file);
});

const app = new GameRenderer();
const audio = new GameAudio();
app.init().then(() => initApp());

const initApp = async () => {
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

  document.querySelector<HTMLInputElement>('#test-load-audio')!.addEventListener('input', function () {
    const file = this.files![0];
    if (!file) return;

    console.log(file);
    audio.add('chart_music', file)
      .then((e) => {
        ChartFiles.music = e;
        console.log(ChartFiles.music);
      });
  });

  document.querySelector<HTMLInputElement>('#test-load-chart')!.addEventListener('input', async function () {
    const file = this.files![0];
    if (!file) return;

    console.log(file);
    try {
      const fileRaw = await readFileAsText(file);
      const json = JSON.parse(fileRaw) as OfficialChart;
      ChartFiles.chart = readChartFromOfficial(json);

      console.log(ChartFiles.chart);
    } catch(e) {
      console.error(e);
    }
  });
};
