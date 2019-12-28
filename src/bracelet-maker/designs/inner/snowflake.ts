import * as _ from "lodash";
const uuidv1 = require("uuid/v1");
import RBush from "rbush";

import {
  MetaParameter,
  RangeMetaParameter,
  OnOffMetaParameter
} from "../../meta-parameter";
import { FastAbstractInnerDesign } from "./fast-abstract-inner-design";
import { InnerDesignVoronoi } from "./voronoi";
import { bufferShape } from "../../utils/paperjs-utils";

function getDistanceToLine(point: paper.Point, line: paper.Path.Line): number {
  return point.getDistance(line.getNearestPoint(point));
}

function notTooClose(line1: paper.Path.Line, line2: paper.Path.Line): boolean {
  return (
    getDistanceToLine(line1.segments[0].point, line2) < 0.01 &&
    getDistanceToLine(line1.segments[1].point, line2) < 0.01
  );
}

function uniteTouchingPathsOnePass(paths: paper.Path[]) {
  const toTreeEntry = (path: paper.Path): any => {
    return {
      minX: path.bounds.topLeft.x - 0.01,
      minY: path.bounds.topLeft.y - 0.01,
      maxX: path.bounds.bottomRight.x + 0.01,
      maxY: path.bounds.bottomRight.y + 0.01,
    };
  };

  const tree = new RBush();
  const pathDict = {};
  paths.forEach(path => {
    const id = uuidv1();
    pathDict[id] = path;
    tree.insert({
      id,
      ...toTreeEntry(path)
    });
  });

  const joinedPaths = [];
  const deleted = {};
  let didJoin = false;
  _.forEach(pathDict, (path: paper.Path, id) => {
    console.log(`looking at ${id}`);
    if (deleted[id]) {
      return;
    }
    let currentPath: paper.PathItem = path;
    const maybeIntersects = tree.search(toTreeEntry(path));
    maybeIntersects.forEach((maybeIntersectTreeEntry: any) => {
      const otherId = maybeIntersectTreeEntry.id;
      // console.log(`maybe intersects ${otherId}`)
      if (deleted[otherId] || otherId == id) {
        // console.log('otherId was deleted or is identity, skipping')
        return;
      }
      const otherPath: paper.Path = pathDict[otherId];
      if (currentPath.intersects(otherPath)) {
        // console.log(`${otherId} does intersect ${id}`)
        currentPath = currentPath.unite(otherPath);
        // console.log('intersected and deleted otherId')
        deleted[otherId] = true;
        didJoin = true;
      }
    });
    joinedPaths.push(currentPath);
  });
  return {didJoin, joinedPaths}
}

function uniteTouchingPaths(_paths: paper.Path[]) {
  let shouldStop = false;
  let paths = _paths;
  while (!shouldStop) {
    console.log('trying to join paths pass')
    const {didJoin, joinedPaths} = uniteTouchingPathsOnePass(paths)
    shouldStop = !didJoin;
    paths = joinedPaths;
  }
  return paths;
}


export class InnerDesignSnowflake extends FastAbstractInnerDesign {
  makeDesign(paper: paper.PaperScope, params: any) {
    const {
      boundaryModel,
      segments,
      kaleido,
      segmentBuffer
    }: {
      boundaryModel: paper.Path.Rectangle;
      segments: number;
      kaleido: boolean;
      segmentBuffer: number;
    } = params;

    const debug = false;

    var r = 360 / segments;

    let paths: paper.Path[] = [];
    const allPaths = [];

    // draw reflection axes
    const drawAxes = debug;
    const axes: paper.Path.Line[] = [];
    for (var i = 0; i < segments; ++i) {
      const line = new paper.Path.Line(
        boundaryModel.bounds.center,
        new paper.Point(boundaryModel.bounds.center.x, -1)
      );

      line.rotate(r * i, boundaryModel.bounds.center);
      axes.push(line);
      if (drawAxes) {
        line.strokeColor = "blue";
        line.strokeWidth = 0.05;
        paper.project.activeLayer.addChild(line);
      }
    }

    const p3 = new paper.Point(boundaryModel.bounds.center.x, -5).rotate(
      r,
      boundaryModel.bounds.center
    );
    let segmentPoints = [
      boundaryModel.bounds.center,
      new paper.Point(boundaryModel.bounds.center.x, -5),
      p3
    ];
    let boundarySegment: paper.PathItem = new paper.Path(segmentPoints);

    if (segments == 2) {
      const halfRectangle = new paper.Path.Rectangle(
        boundaryModel.bounds.topCenter,
        boundaryModel.bounds.bottomRight
      );
      boundarySegment = halfRectangle;
      segmentPoints = halfRectangle.segments.map(s => s.point);
    }

    if (segmentBuffer > 0) {
      boundarySegment = bufferShape(paper, -segmentBuffer, segmentPoints);
    }

    boundarySegment.closePath();

    if (debug) {
      boundarySegment.strokeColor = "purple";
      boundarySegment.strokeWidth = 0.1;
      paper.project.activeLayer.addChild(boundarySegment);
    }

    const v = new InnerDesignVoronoi();
    v.rng = this.rng;
    const vs = v.makeDesign(paper, {
      borderSize: 0.05,
      boundaryModel: boundarySegment,
      numPoints: 50,
      numBorderPoints: 20,
      voronoi: true,
      omitChance: 0.0,
    });
    vs.forEach(path => {
      const clippedPath = path.intersect(boundarySegment);
      paths.push(clippedPath);
    });

    for (let s = 0; s < segments; s++) {
      paths.forEach((p: paper.Path) => {
        let newPath = p.clone();
        newPath.rotate(s * r, boundaryModel.bounds.center);

        if (kaleido) {
          if (segments % 2 === 0 && s % 2 !== 0) {
            newPath.scale(1, -1, boundaryModel.bounds.center);

            if (segments % 4 === 0) {
              newPath.rotate(r, boundaryModel.bounds.center);
            }
          }

          if (segments % 2 !== 0 && s % 2 === 1) {
            newPath.scale(-1, 1, boundaryModel.bounds.center);
          }
        }

        allPaths.push(newPath);
      });
    }

    if (segmentBuffer == 0) {
      return uniteTouchingPaths(allPaths);
    }

    return allPaths;
  }

  get designMetaParameters(): Array<MetaParameter> {
    return [
      new OnOffMetaParameter({
        title: "kaleidoscope",
        value: true,
        name: "kaleido"
      }),
      new RangeMetaParameter({
        title: "Segment Buffer",
        min: 0,
        max: 0.25,
        value: 0,
        step: 0.01,
        name: "segmentBuffer"
      }),
      new RangeMetaParameter({
        title: "Segments",
        min: 2,
        max: 20,
        value: 2,
        step: 2,
        name: "segments"
      })
    ];
  }
}
