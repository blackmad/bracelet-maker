import * as _ from "lodash";

const ROW = 0;
const COL = 1;

type Point = {
  x: number;
  y: number;
};

type CellId = [number, number];
type CellEntry = {
  type: "square" | "triangle1" | "triangle2";
  ids: string[];
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
  triangleChance: number;
  leftRightTriangleChance: number;
  minChainSize: number;
  omitTileChance: number;
  rowTileBoundary: boolean;
  colTileBoundary: boolean;

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
    triangleChance,
    leftRightTriangleChance,
    minChainSize,
    omitTileChance,
    rowTileBoundary,
    colTileBoundary,
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
    triangleChance: number;
    leftRightTriangleChance: number;
    minChainSize: number;
    omitTileChance: number;
    rowTileBoundary: boolean;
    colTileBoundary: boolean;
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

    this.triangleChance = triangleChance;
    this.leftRightTriangleChance = leftRightTriangleChance;
    this.minChainSize = minChainSize;

    this.omitTileChance = omitTileChance;

    this.rowTileBoundary = rowTileBoundary;
    this.colTileBoundary = colTileBoundary;

    if (this.rows * this.cols <= this.idealMinChainSize) {
      this.idealMinChainSize = Math.floor((this.rows * this.cols) * 0.75);
    }

    if (this.idealMinChainSize > this.maxChainSize) {
      this.maxChainSize = this.idealMinChainSize;
    }

  }

  private sample<T>(items: T[]): T {
    return items[Math.floor(this.rng() * items.length)];
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

  private makeTriangles1(cell: CellId): [Point[], Point[]] {
    const rowSize = 1;
    const colSize = 1;

    const topLeft = [rowSize * cell[ROW], colSize * cell[COL]];

    return [
      [
        { y: topLeft[0], x: topLeft[1] },
        { y: topLeft[0] + rowSize, x: topLeft[1] },
        { y: topLeft[0], x: topLeft[1] + colSize },
      ],
      [
        { y: topLeft[0] + rowSize, x: topLeft[1] + colSize },
        { y: topLeft[0] + rowSize, x: topLeft[1] },
        { y: topLeft[0], x: topLeft[1] + colSize },
      ],
    ];
  }

  private makeTriangles2(cell: CellId): [Point[], Point[]] {
    const rowSize = 1;
    const colSize = 1;

    const topLeft = [rowSize * cell[ROW], colSize * cell[COL]];

    return [
      [
        { y: topLeft[0], x: topLeft[1] },
        { y: topLeft[0] + rowSize, x: topLeft[1] + colSize },
        { y: topLeft[0], x: topLeft[1] + colSize },
      ],
      [
        { y: topLeft[0], x: topLeft[1] },
        { y: topLeft[0] + rowSize, x: topLeft[1] + colSize },
        { y: topLeft[0] + rowSize, x: topLeft[1] },
      ],
    ];
  }

  private makeFinalDesign(): Record<number, Point[][]> {
    const finalGrid: CellEntry[][] = [];

    // run through and randomly sprinkle in triangles
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.rng() < this.triangleChance) {
          const cellId: [number, number] = [r, c];
          const cellKey = this.makeKey(cellId);
          const existingTile = this.tile[cellKey];
          const neighbors = this.getNeighbors(cellId);
          const otherCellID = this.sample(neighbors);
          const otherCell = this.tile[this.makeKey(otherCellID)];
          // console.log(
          //   `splitting cell ${cellKey} into triangles for ${existingTile.ids[0]} --- ${otherCell.ids[0]}`
          // );
          this.tile[cellKey] = {
            ids: [existingTile.ids[0], otherCell.ids[0]],
            type:
              this.rng() > this.leftRightTriangleChance
                ? "triangle2"
                : "triangle1",
          };
        }
      }
    }

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const tileKey = this.makeKey([r,c]);
        for (let i = 0; i < this.tile[tileKey].ids.length; i++) {
          if (this.rng() < this.omitTileChance) {
            this.tile[tileKey].ids[i] = undefined;
          }
        }
      }
    }

    this.printTile();

    for (let r = 0; r < this.finalRows; r++) {
      finalGrid[r] = [];
    }

    // generate the full, possibly mirrored grid from our one initial tile
    for (let r = 0; r < this.finalRows; r++) {
      for (let c = 0; c < this.finalCols; c++) {
        let relativeR = r % this.rows;
        let relativeC = c % this.cols;

        const tileRow = Math.floor(r / this.rows);
        const tileCol = Math.floor(c / this.cols);

        const shouldMirrorRow =
          this.mirrorRows && tileRow % 2 == 0;
        const shouldMirrorCol =
          this.mirrorCols && tileCol % 2 == 0;

        if (shouldMirrorRow) {
          relativeR = this.rows - 1 - relativeR;
        }

        if (shouldMirrorCol) {
          relativeC = this.cols - 1 - relativeC;
        }

        const originalTile = this.tile[this.makeKey([relativeR, relativeC])];
        let type = originalTile.type;
        let ids = originalTile.ids;
        // this is sometimes wrong?????
        // oh is it like if it's both I shouldn't?????
        if (
          originalTile.type === "triangle1" &&
          (shouldMirrorCol || shouldMirrorRow)
        ) {
          type = "triangle2";
        }
        if (
          originalTile.type === "triangle2" &&
          (shouldMirrorCol || shouldMirrorRow)
        ) {
          type = "triangle1";
        }

        if (
          (originalTile.type === "triangle1" ||
            originalTile.type === "triangle2") &&
          shouldMirrorCol &&
          shouldMirrorRow
        ) {
          type = originalTile.type;
        }

        if (shouldMirrorRow) {
         ids = [...ids].reverse();
        }

        let rowTag = 'a';
        let colTag = 'a';
        if (this.rowTileBoundary) {
          rowTag = tileRow.toString();
        }
        if (this.colTileBoundary) {
          colTag = tileCol.toString();
        }

        finalGrid[r][c] = {
          type,
          ids: ids.map(id => id + '-' + rowTag + '-' + colTag)
        };
      }
    }

    const addShape = (label: string, shape: Point[]) => {
      if (!label) {
        return;
      }

      if (!labelsToSquares[label]) {
        labelsToSquares[label] = [];
      }

      labelsToSquares[label].push(shape);
    }

    // Go over the grid, generate a square for each, add it to a hash map and then we're
    // going to do a cascaded union
    const labelsToSquares: Record<number, Point[][]> = {};
    for (let r = 0; r < this.finalRows; r++) {
      for (let c = 0; c < this.finalCols; c++) {
        const cellEntry = finalGrid[r][c];

        let triangles = this.makeTriangles1([r, c]);
        if (cellEntry.type === "triangle2") {
          triangles = this.makeTriangles2([r, c]);
        }
        addShape(cellEntry.ids[0], triangles[0]);
        addShape(cellEntry.ids[1], triangles[1]);
      }
    }

    const groups = _.mapValues(labelsToSquares, (squares) => {
      return this.unionTriangles(squares);
    });

    const allChains = _.flatten(_.values(groups));

    return allChains.filter(chain => chain.length > this.minChainSize);
  }

  private unionTriangles(triangles: Point[][]) {
    let makingProgress = true;

    function areAdjacent(triangle1: Point[], triangle2: Point[]) {
      // console.log({triangle1, triangle2})
      const t1 = triangle1.map((p) => `${p.x.toFixed(0)}_${p.y.toFixed(0)}`);
      const t2 = triangle2.map((p) => `${p.x.toFixed(0)}_${p.y.toFixed(0)}`);
      return _.intersection(t1, t2).length === 2;
    }

    const shapes = [];

    while (triangles.length > 0) {
      const seedSet = [triangles.pop()];
      // console.log('starting from triangle: ', JSON.stringify(seedSet));
      // console.log(`have ${triangles.length} left`);
      makingProgress = true;
      while (makingProgress) {
        makingProgress = false;
        const usedTriangles = [];
        for (let i = 0; i < triangles.length; ++i) {
          if (_.some(seedSet, (tri) => areAdjacent(tri, triangles[i]))) {
            seedSet.push(triangles[i]);
            usedTriangles.push(i);
            makingProgress = true;
          }
        }
        triangles = _.filter(triangles, function(item, index) {
          return !usedTriangles.includes(index);
        });
        // console.log(`used ${usedTriangles.length}, have ${triangles.length} left`);
      }
      // console.log('done with that shape', seedSet);
      shapes.push(seedSet);
    }

    return shapes;
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

  private getNeighbors(cellId: CellId): CellId[] {
    return [
      this.getNeighbor(cellId, 1, 0),
      this.getNeighbor(cellId, 0, 1),
      this.getNeighbor(cellId, -1, 0),
      this.getNeighbor(cellId, 0, -1),
    ];
  }

  private getOpenNeighbors(cellId: CellId): CellId[] {
    return this.getNeighbors(cellId).filter((c) => this.isSquareOpen(c));
  }

  private labelSquare(cellId: CellId) {
    this.tile[this.makeKey(cellId)] = {
      ids: [this.currentCellName.toString(), this.currentCellName.toString()],
      type: "triangle1",
    };
  }

  private printTile() {
    let output = "";

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const label = this.tile[this.makeKey([r, c])];
        output += (label !== undefined ? label.ids.join(",") : "-").padStart(6);
        output += " ";
      }
      output += "\n\n";
    }
    console.log(output);
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
        // this.printTile();
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
          // maybe if we're above the ideal min chain size
          stopThisChain =
            chainSize >= this.maxChainSize ||
            (chainSize >= this.idealMinChainSize && this.rng() > 0.5);
        }
        // this.printTile();
      }
      //   this.printTile();
      //   if (this.currentCellName > 20) {
      //     return;
      //   }
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
