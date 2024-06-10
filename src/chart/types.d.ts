
export interface OfficialChart {
  fileVersion: number,
  songsName: string,
  themes: OfficialChartTheme[],
  challengeTimes: OfficialChartChallengeTime[],
  bPM: number,
  bpmShifts: OfficialChartTimePoint[],
  offset: number,
  lines: OfficialChartLine[],
  canvasMoves: OfficialChartCanvasMove[],
  cameraMove: OfficialChartCameraMove,
}

export interface OfficialChartTheme {
  colorsList: OfficialChartColor[],
}

export interface OfficialChartColor {
  r: number,
  g: number,
  b: number,
  a: number,
}

export interface OfficialChartChallengeTime {
  checkPoint: number,
  start: number,
  end: number,
  transTime: number,
}

export interface OfficialChartTimePoint {
  time: number,
  value: number,
  easeType: number,
  floorPosition: number,
}

export interface OfficialChartLine {
  linePoints: OfficialChartLinePoint[],
  notes: OfficialChartNote[],
  judgeRingColor: OfficialChartLineColor[],
  lineColor: OfficialChartLineColor[],
}

export interface OfficialChartLinePoint {
  time: number,
  xPosition: number,
  color: OfficialChartColor,
  easeType: number,
  canvasIndex: number,
  floorPosition: number,
}

export interface OfficialChartNote {
  type: number,
  time: number,
  floorPosition: number,
  otherInformations: OfficialChartNoteInfo | [],
}

export interface OfficialChartNoteInfo extends Array {
  1: number,
  2: number,
  3: number,
}

export interface OfficialChartLineColor {
  startColor: OfficialChartColor,
  endColor: OfficialChartColor,
  time: number,
}

export interface OfficialChartCanvasMove {
  index: number,
  xPositionKeyPoints: OfficialChartTimePoint[],
  speedKeyPoints: OfficialChartTimePoint[],

}

export interface OfficialChartCameraMove {
  scaleKeyPoints: OfficialChartTimePoint[],
  xPositionKeyPoints: OfficialChartTimePoint[],
}
