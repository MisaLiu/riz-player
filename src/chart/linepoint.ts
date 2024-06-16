
export class GameChartLinePoint {
  readonly time: number;
  readonly xPosition: number;
  readonly color: unknown;
  readonly easeType: number;
  readonly canvasIndex: number;
  readonly floorPosition: number;

  constructor(
    time: number,
    xPosition: number,
    color: unknown,
    easeType: number,
    canvasIndex: number,
    floorPosition: number
  ) {
    this.time = time;
    this.xPosition = xPosition;
    this.color = color;
    this.easeType = easeType;
    this.canvasIndex = canvasIndex;
    this.floorPosition = floorPosition;
  }
}
