var makerjs = require("makerjs");

export class CanvasShim {
  lastX: number;
  lastY: number;
  pathsDict: any;
  pathIndex: number;

  constructor(pathsDict) {
    this.lastX = 0;
    this.lastY = 0;
    this.pathsDict = pathsDict;
    this.pathIndex = 0;
  }

  moveTo(x, y) {
    this.lastX = x;
    this.lastY = y;
  }
  lineTo(x, y) {
    this.pathsDict[this.pathIndex.toString()] = new makerjs.paths.Line(
      [this.lastX, this.lastY],
      [x, y]
    );
    this.pathIndex += 1;
  }
}
