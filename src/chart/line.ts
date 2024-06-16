import { GameChartLinePoint } from './linepoint';
import { GameChartNote } from './note';

export class GameChartLine {
  readonly points: GameChartLinePoint[];
  readonly notes: GameChartNote[];

  // _floorPosition: number = 0;

  constructor() {
    this.points = [];
    this.notes = [];
  }
}