import { Sprite, Container, Texture } from 'pixi.js';

const DebugNoteTextureCache = await (() => new Promise<Texture>(async (res, rej) => {
  const pointSize = 26;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { alpha: true });

  if (!ctx) return rej('Your browser does not support <canvas>');

  canvas.width = canvas.height = pointSize * 2;
  ctx.clearRect(0, 0, pointSize * 2, pointSize * 2);
  ctx.beginPath();
  ctx.arc(pointSize, pointSize, pointSize, 0, Math.PI * 2);
  ctx.fillStyle = '#4a3d53';
  ctx.fill();

  const result = Texture.from(await createImageBitmap(canvas));
  res(result);
}))();

export class GameChartNote {
  readonly type: number;
  readonly time: number;
  readonly floorPosition: number;

  sprite!: Sprite;

  constructor(type: number, time: number, floorPosition: number) {
    this.type = type;
    this.time = time;
    this.floorPosition = floorPosition;
  }

  createSprite(stage: Container) {
    this.sprite = new Sprite(DebugNoteTextureCache);

    this.sprite.anchor.set(0.5);

    stage.addChild(this.sprite);
  }
}