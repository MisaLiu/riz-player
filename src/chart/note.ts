
export class GameChartNote {
  readonly type: number;
  readonly time: number;
  readonly floorPosition: number;

  constructor(type: number, time: number, floorPosition: number) {
    this.type = type;
    this.time = time;
    this.floorPosition = floorPosition;
  }
}