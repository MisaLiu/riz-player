import { Container } from 'pixi.js';
import { GameChartNote } from './note';
import type { OfficialChart } from './types';
import { GameChartLine } from './line';
import { GameChartLinePoint } from './linepoint';

const TimeSorter = (a: { time: number; }, b: { time: number; }) => a.time - b.time;

export class GameChart {
  readonly bpm: number;
  readonly offset: number = 0;
  readonly lines: GameChartLine[] = [];
  readonly notes: GameChartNote[] = [];

  constructor(bpm: number, offset: number) {
    this.bpm = bpm;
    this.offset = offset;
  }

  createSprites(stage: Container) {
    for (const note of this.notes) {
      note.createSprite(stage);
    }
  }
}

export const readChartFromOfficial = (chartRaw: OfficialChart) => {
  const chartOld = { ...chartRaw };
  const result = new GameChart(chartOld.bPM, chartOld.offset);
  const beatTime = 60 / chartOld.bPM;

  chartOld.lines.forEach((line) => {
    const newLine = new GameChartLine();

    line.linePoints.forEach((linePoint) => {
      linePoint.time = linePoint.time * beatTime;
      newLine.points.push(new GameChartLinePoint(
        linePoint.time,
        linePoint.xPosition,
        linePoint.color,
        linePoint.easeType,
        linePoint.canvasIndex,
        linePoint.floorPosition
      ));
    });
    newLine.points.sort(TimeSorter);

    line.notes.forEach((note) => {
      note.time = note.time * beatTime;
      const newNote = new GameChartNote(
        note.type,
        note.time,
        note.floorPosition,
        newLine
      );
      newLine.notes.push(newNote);
      result.notes.push(newNote);
    });
    newLine.notes.sort(TimeSorter);

    result.lines.push(newLine);
  });

  result.notes.sort(TimeSorter);
  return result;
};
