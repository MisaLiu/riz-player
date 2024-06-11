import { autoDetectRenderer, isWebGPUSupported , Container, Ticker } from 'pixi.js';
import type { Renderer, AutoDetectOptions } from 'pixi.js';

const DefaultRendererOptions: Partial<AutoDetectOptions> = {
  preference: 'webgpu',
  antialias: true,
  autoDensity: true,
  backgroundColor: 0xffffff,
  resolution: window.devicePixelRatio,
  width: document.documentElement.clientWidth,
  height: document.documentElement.clientHeight,
  hello: true,
};
let isWebGPUAvailable: boolean = false;
isWebGPUSupported().then((result) => isWebGPUAvailable = result);

export class GameRenderer {
  renderer!: Renderer;
  readonly stage: Container;
  readonly ticker: Ticker;

  constructor() {
    this.stage = new Container;
    this.ticker = Ticker.shared;
  }

  init(options: Partial<AutoDetectOptions> = {}) {
    const newInitOptions = { ...DefaultRendererOptions, ...options };

    return new Promise<void>((res, rej) => {
      autoDetectRenderer(newInitOptions)
        .then((renderer) => {
          this.renderer = renderer;

          this.ticker.start();
          this.ticker.add(() => {
            this.renderer.render(this.stage);
          });

          res();
        }).catch((e) => {
          rej(e);
        });
    });
  }

  resize(width: number, height: number, resolution: number = window.devicePixelRatio) {
    this.renderer.resize(width, height, resolution);
  }

  get canvas() {
    return this.renderer.canvas;
  }

  get width() {
    return this.renderer.width;
  }

  get height() {
    return this.renderer.height;
  }
}
