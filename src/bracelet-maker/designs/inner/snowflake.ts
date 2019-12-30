import * as _ from "lodash";

import {
  MetaParameter,
  RangeMetaParameter,
  OnOffMetaParameter
} from "../../meta-parameter";
import { FastAbstractInnerDesign } from "./fast-abstract-inner-design";
import { InnerDesignVoronoi } from "./voronoi";
import { bufferShape } from "../../utils/paperjs-utils";
import { cascadedUnion } from "../../utils/cascaded-union";
import { addToDebugLayer } from "../../utils/debug-layers";

export class InnerDesignSnowflake extends FastAbstractInnerDesign {
  async makeDesign(paper: paper.PaperScope, params: any) {
    const {
      boundaryModel,
      segments,
      kaleido,
      segmentBuffer,
      debug
    }: {
      boundaryModel: paper.Path.Rectangle;
      segments: number;
      kaleido: boolean;
      segmentBuffer: number;
      debug: boolean;
    } = params;

    var r = 360 / segments;

    let paths: paper.Path[] = [];
    const allPaths: paper.Path[] = [];

    const boundarySegmentDistance = Math.max(
      boundaryModel.bounds.width / 2,
      boundaryModel.bounds.height / 2
    );

    // draw reflection axes
    if (debug) {
      for (var i = 0; i < segments; ++i) {
        const line = new paper.Path.Line(
          boundaryModel.bounds.center,
          new paper.Point(
            boundaryModel.bounds.center.x,
            -boundarySegmentDistance
          )
        );

        line.rotate(r * i, boundaryModel.bounds.center);

        addToDebugLayer(paper, "axes", line);
      }
    }

    const p3 = new paper.Point(
      boundaryModel.bounds.center.x,
      -boundarySegmentDistance
    ).rotate(r, boundaryModel.bounds.center);
    let segmentPoints = [
      boundaryModel.bounds.center,
      new paper.Point(boundaryModel.bounds.center.x, -boundarySegmentDistance),
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
      addToDebugLayer(paper, "boundarySegment", boundarySegment);
    }

    const v = new InnerDesignVoronoi();
    v.rng = this.rng;
    const vs = await v.makeDesign(paper, {
      borderSize: 0.05,
      boundaryModel: boundarySegment,
      numPoints: 50,
      numBorderPoints: 20,
      voronoi: true,
      omitChance: 0.0
    });
    vs.paths.forEach(path => {
      const clippedPath = path.intersect(boundarySegment);
      paths.push(clippedPath);
    });

    for (let s = 0; s < segments; s++) {
      paths.forEach((p: paper.Path) => {
        let newPath: paper.Path = p.clone() as paper.Path;
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
      return {paths: cascadedUnion(allPaths)};
    }

    return {paths: allPaths};
  }

  get designMetaParameters() {
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
