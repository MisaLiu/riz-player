import { GameChartNote } from './note';
import type { OfficialChart } from './types';

export class GameChart {
  readonly bpm: number;
  readonly offset: number = 0;
  readonly notes: GameChartNote[] = [];

  constructor(bpm: number, offset: number) {
    this.bpm = bpm;
    this.offset = offset;
  }
}

export const readChartFromOfficial = (chartRaw: OfficialChart) => {
  const chartOld = { ...chartRaw };
  const result = new GameChart(chartOld.bPM, chartOld.offset);
  const beatTime = 60 / chartOld.bPM;

  chartOld.lines.forEach((line) => {
    line.notes.forEach((note) => {
      note.time = note.time * beatTime;
      result.notes.push(new GameChartNote(note.type, note.time, note.floorPosition));
    });
  });

  result.notes.sort((a, b) => a.time - b.time);
  return result;
};
