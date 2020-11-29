import * as _ from "lodash";
import { Point } from "paper";

const ROW = 0;
const COL = 1;

type Point = {
  x: number;
  y: number;
};

type CellId = [number, number];
type CellEntry = {
  id: string;
};
export class MazePatternMaker1 {
  rng: () => number;
  rows: number;
  cols: number;
  rowRepeat: number;
  colRepeat: number;
  mirrorRows: boolean;
  mirrorCols: boolean;
  tile: Record<string, CellEntry>;
  currentCellName = 0;
  idealMinChainSize: number;
  maxChainSize: number;
  finalRows: number;
  finalCols: number;

  constructor({
    rows,
    cols,
    rowRepeat,
    colRepeat,
    mirrorRows,
    mirrorCols,
    rng,
    maxChainSize,
    idealMinChainSize,
  }: {
    rows: number;
    cols: number;
    rowRepeat: number;
    colRepeat: number;
    mirrorRows: boolean;
    mirrorCols: boolean;
    maxChainSize: number;
    rng: () => number;
    idealMinChainSize: number;
  }) {
    this.rows = rows;
    this.cols = cols;
    this.rowRepeat = rowRepeat;
    this.colRepeat = colRepeat;
    this.mirrorRows = mirrorRows;
    this.mirrorCols = mirrorCols;
    this.tile = {};
    this.rng = rng;
    this.maxChainSize = maxChainSize;
    this.idealMinChainSize = idealMinChainSize;

    this.finalRows = this.rows * this.rowRepeat;
    this.finalCols = this.cols * this.colRepeat;
  }

  private sample<T>(items: T[]): T {
    return items[Math.floor(this.rng()*items.length)];
  }

  private makeKey(cellId: CellId) {
    return `${cellId[ROW]}_${cellId[COL]}`;
  }

  private isSquareOpen(cellId: CellId) {
    return _.isEmpty(this.tile[this.makeKey(cellId)]);
  }

  private getOpenSquare(): CellId | undefined {
    const horizon: CellId[] = [];
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.isSquareOpen([r, c])) {
          horizon.push([r, c]);
        }
      }
    }
    if (_.isEmpty(horizon)) {
      return undefined;
    }
    return this.sample(horizon);
  }

  private printGrid(grid: number[][]) {
    var buffer = "";
    for (var i = 0; i < grid.length; i++) {
      for (var x = 0; x < grid[i].length; x++) {
        buffer += grid[i][x].toString().padStart(3);
      }
      buffer += "\n\n";
    }
    // console.log(buffer);
  }

  private makeSquare(cell: CellId): Point[] {
    const rowSize = 1 / this.finalRows;
    const colSize = 1 / this.finalCols;

    const topLeft = [rowSize * cell[ROW], colSize * cell[COL]];

    return [
      { y: topLeft[0], x: topLeft[1] },
      { y: topLeft[0] + rowSize, x: topLeft[1] },
      { y: topLeft[0] + rowSize, x: topLeft[1] + colSize },
      { y: topLeft[0], x: topLeft[1] + colSize },
    ];
  }

  private makeFinalDesign(): Record<number, Point[][]> {
    const finalGrid = [];

    for (let r = 0; r < this.finalRows; r++) {
      finalGrid[r] = [];
    }

    // generate the full, possibly mirrored grid from our one initial tile
    for (let r = 0; r < this.finalRows; r++) {
      for (let c = 0; c < this.finalCols; c++) {
        let relativeR = r % this.rows;
        let relativeC = c % this.cols;

        if (this.mirrorRows && Math.floor(r / this.rows) % 2 == 0) {
          relativeR = this.rows - 1 - relativeR;
        }

        if (this.mirrorCols && Math.floor(c / this.cols) % 2 == 0) {
          relativeC = this.cols - 1 - relativeC;
        }

        finalGrid[r][c] = this.tile[this.makeKey([relativeR, relativeC])].id;
      }
    }

    // Go over the grid, generate a square for each, add it to a hash map and then we're
    // going to do a cascaded union
    const labelsToSquares: Record<number, Point[][]> = {};
    for (let r = 0; r < this.finalRows; r++) {
      for (let c = 0; c < this.finalCols; c++) {
        const square = this.makeSquare([r, c]);
        const label = finalGrid[r][c];
        if (!labelsToSquares[label]) {
          labelsToSquares[label] = [];
        }
        labelsToSquares[label].push(square);
      }
    }

    return labelsToSquares;
  }

  private getNeighbor(
    cellId: CellId,
    rowIncr: number,
    colIncr: number
  ): CellId {
    let newRow = (cellId[ROW] + rowIncr) % this.rows;
    if (newRow === -1) {
      newRow = this.rows - 1;
    }

    let newCol = (cellId[COL] + colIncr) % this.cols;
    if (newCol === -1) {
      newCol = this.cols - 1;
    }

    return [newRow, newCol];
  }

  private getOpenNeighbors(cellId: CellId): CellId[] {
    return [
      this.getNeighbor(cellId, 1, 0),
      this.getNeighbor(cellId, 0, 1),
      this.getNeighbor(cellId, -1, 0),
      this.getNeighbor(cellId, 0, -1),
    ].filter((c) => this.isSquareOpen(c));
  }

  private labelSquare(cellId: CellId) {
    this.tile[this.makeKey(cellId)] = { id: this.currentCellName.toString() };
  }

  private printTile() {
    let output = "";

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const label = this.tile[this.makeKey([r, c])];
        output += (label !== undefined ? label.id : "-").padStart(3);
        output += " ";
      }
      output += "\n\n";
    }
    // console.log(output);
  }

  makeDesign(): Record<number, Point[][]> {
      let done = false;
    while (!done) {
      this.currentCellName += 1;

      // pick a square to color in
      let seedSquare = this.getOpenSquare();
      let chainSize = 1;
      let stopThisChain = false;
      if (seedSquare === undefined) {
        this.printTile();
        done = true;
        break;
      }

      // console.log("starting at ", { seedSquare });
      this.labelSquare(seedSquare);
      while (!stopThisChain) {
        const openNeighbors = this.getOpenNeighbors(seedSquare);
        // console.log({ openNeighbors });
        if (_.isEmpty(openNeighbors)) {
            // stop because we are stuck
          stopThisChain = true;
        } else {
          seedSquare = this.sample(openNeighbors);
          this.labelSquare(seedSquare);
          chainSize += 1;

          // stop if we're past the max chain size OR 
          // if 
          stopThisChain = (chainSize >= this.maxChainSize) ||
            ((chainSize >= this.idealMinChainSize) && (this.rng() > 0.5));
        }
        this.printTile();
      }
      this.printTile();
      if (this.currentCellName > 20) {
        return;
      }
    }
    return this.makeFinalDesign();
  }
}
// var seedrandom = require('seedrandom');
// const rng = new seedrandom("hey2");
// new MazePatternMaker1({
//   rows: 3,
//   cols: 3,
//   rowRepeat: 1,
//   colRepeat: 1,
//   rng: () => rng(),
//   mirrorRows: false,
//   mirrorCols: true,
//   maxChainSize: 5,
//   idealMinChainSize: 3,
// }).makeDesign();
