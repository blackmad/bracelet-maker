import * as _ from "lodash";

import {
  MetaParameter,
  RangeMetaParameter,
  OnOffMetaParameter
} from "../../../meta-parameter";
import { FastAbstractInnerDesign } from "../fast-abstract-inner-design";
import { bufferPath, bufferPoints, bufferPointstoPathItem } from "../../../utils/paperjs-utils";
import { cascadedUnion } from "../../../utils/cascaded-union";
import { addToDebugLayer } from "../../../utils/debug-layers";

export class KaleidoscopeMaker {
  // input params
  segments: number;
  kaleido: boolean;
  segmentBuffer: number;
  debug: boolean;
  boundaryModel: paper.PathItem;
  paper: paper.PaperScope;

  // internal state
  boundarySegment: paper.PathItem;
  segmentAngleDegrees: number;

  constructor(paper: paper.PaperScope, params: {
    segments: number;
    kaleido: boolean;
    segmentBuffer: number;
    debug: boolean;
    boundaryModel: paper.Path;
  }) {
    this.paper = paper;
    this.segments = params.segments;
    this.kaleido = params.kaleido;
    this.segmentBuffer = params.segmentBuffer;
    this.debug = params.debug;
    this.boundaryModel = params.boundaryModel;
    
    if (this.segmentBuffer > 0) {
      this.boundaryModel = bufferPath(paper, this.segmentBuffer, params.boundaryModel);
    }

    this.segmentAngleDegrees = 360 / this.segments;
    this.boundarySegment = this.makeBoundarySegment();
  }

  public getBoundarySegment() { 
    return this.boundarySegment;
  }

  private makeBoundarySegment(): paper.PathItem {
    const paper = this.paper;
    
    const boundarySegmentDistance = Math.max(
      this.boundaryModel.bounds.width / 2,
      this.boundaryModel.bounds.height / 2
    );

    // draw reflection axes
    if (this.debug) {
      for (var i = 0; i < this.segments; ++i) {
        const line = new paper.Path.Line(
          this.boundaryModel.bounds.center,
          new paper.Point(
            this.boundaryModel.bounds.center.x,
            -boundarySegmentDistance
          )
        );

        line.rotate(this.segmentAngleDegrees * i, this.boundaryModel.bounds.center);

        addToDebugLayer(paper, "axes", line);
      }
    }

    const p3 = new paper.Point(
      this.boundaryModel.bounds.center.x,
      -boundarySegmentDistance
    ).rotate(this.segmentAngleDegrees, this.boundaryModel.bounds.center);
    let segmentPoints = [
      this.boundaryModel.bounds.center,
      new paper.Point(this.boundaryModel.bounds.center.x, -boundarySegmentDistance),
      p3
    ];
    let boundarySegment: paper.PathItem = new paper.Path(segmentPoints);  
    
    if (this.segments == 2) {
      const halfRectangle = new paper.Path.Rectangle(
        this.boundaryModel.bounds.topCenter,
        this.boundaryModel.bounds.bottomRight
      );
      boundarySegment = halfRectangle;
      segmentPoints = halfRectangle.segments.map(s => s.point);
    }

    if (this.segmentBuffer > 0) {
      boundarySegment = bufferPointstoPathItem(paper, -this.segmentBuffer, segmentPoints);
    }

    boundarySegment.closePath();

    if (this.debug) {
      addToDebugLayer(paper, "boundarySegment", boundarySegment.clone());
    }

    return boundarySegment;
  }

  public reflectPaths(_paths: paper.PathItem[]): paper.PathItem[] {
    if (this.debug) {
      _paths.forEach((path) =>
        addToDebugLayer(this.paper, 'segmentPaths', path.clone())
      );
    }

    const clippedPaths = [];
    _paths.forEach(path => {
      const clippedPath = path.intersect(this.boundarySegment);
      clippedPaths.push(clippedPath);
    });

    const finalPaths = [];
    for (let s = 0; s < this.segments; s++) {
      clippedPaths.forEach((p: paper.Path) => {
        let newPath: paper.Path = p.clone() as paper.Path;
        newPath.rotate(s * this.segmentAngleDegrees, this.boundaryModel.bounds.center);

        if (this.kaleido) {
          if (this.segments % 2 === 0 && s % 2 !== 0) {
            newPath.scale(1, -1, this.boundaryModel.bounds.center);

            if (this.segments % 4 === 0) {
              newPath.rotate(this.segmentAngleDegrees, this.boundaryModel.bounds.center);
            }
          }

          if (this.segments % 2 !== 0 && s % 2 === 1) {
            newPath.scale(-1, 1, this.boundaryModel.bounds.center);
          }
        }

        if (newPath.intersects(this.boundaryModel) || newPath.isInside(this.boundaryModel.bounds)) {
          finalPaths.push(newPath);
        }
      });
    }

    if (this.segmentBuffer == 0) {
      return cascadedUnion(finalPaths);
    }

    return finalPaths;
  }

  public static designMetaParameters(defaultKaleido: boolean) {
    return [
      new OnOffMetaParameter({
        title: "kaleidoscope",
        help: 'This should really only be false if segment buffer > 0',
        value: true,
        name: "kaleido",
        group: "Kaleidoscope",
      }),
      new RangeMetaParameter({
        title: "Segment Buffer",
        min: 0,
        max: 0.25,
        value: 0,
        step: 0.01,
        name: "segmentBuffer",
        group: "Kaleidoscope",
        randMin: 0,
        randMax: 0.25,
      }),
      new RangeMetaParameter({
        title: "Segments",
        min: defaultKaleido ? 2 : 1,
        max: 20,
        value: defaultKaleido ? 2 : 1,
        step: 1,
        name: "segments",
        group: "Kaleidoscope",
        randMin: 1,
        randMax: 12,
      })
    ];
  }
}