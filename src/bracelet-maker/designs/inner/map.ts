// TODO: if it's too close to another street, don't use it
import {
  MetaParameter,
  RangeMetaParameter,
  OnOffMetaParameter,
  GeocodeMetaParameter
} from "../../meta-parameter";

import { FastAbstractInnerDesign } from "./fast-abstract-inner-design";
import {
  fetchTopoJsonTiles,
  lineStringCoordinatesToPaperLine,
  multiLneStringCoordinatesToPaperLines
} from "./map-utils";
import * as _ from "lodash";
import {
  flattenArrayOfPolygonsToPolygons,
  bufferLine
} from "../../utils/paperjs-utils";
import { cascadedUnion } from '../../utils/cascaded-union';
var randomColor = require("randomcolor");

export class InnerDesignMap extends FastAbstractInnerDesign {
  needSubtraction = false;
  needSeed = false;

  extractPointPathsFromFeatures(features: GeoJSON.Feature[], invertLatLng: boolean): paper.Point[][] {
    const paths: paper.Point[][] = [];
    features.map(f => {
      if (f.geometry.type === "LineString") {
        paths.push(
          lineStringCoordinatesToPaperLine(
            paper,
            f.geometry.coordinates,
            invertLatLng
          )
        );
      } else if (f.geometry.type === "MultiLineString") {
        multiLneStringCoordinatesToPaperLines(
          paper,
          f.geometry.coordinates,
          invertLatLng
        ).forEach(l => paths.push(l));
      } else {
        console.log(`cannot understand ${f.geometry.type}`);
      }
    });
    return paths;
  }

  filterFeatures(features: GeoJSON.Feature[]): GeoJSON.Feature[] {
    return features.filter(f => {
      return (
        ["road", "major_road", "minor_road"].includes(f.properties.kind) &&
        f.properties.kind_detail != "service" // these seem to very often be parking lot outlines;
        // these are cool but break parks
        // (f.properties.kind == "path" && f.properties.kind_detail == "footway")
      );
    });
  }

  async makeDesign(
    paper: paper.PaperScope,
    params: any
  ): Promise<paper.Path[]> {
    const {
      boundaryModel,
      center,
      scaleX,
      xyRatio,
      invertLatLng,
      lineWidth
    } = params;

    const debug = false;

    const centerLat = parseFloat(center.split(",")[0]);
    const centerLng = parseFloat(center.split(",")[1]);

    const centerX = invertLatLng ? centerLat : centerLng;
    const centerY = invertLatLng ? centerLng : centerLat;

    // if scaleX=500, we're saying 1 degree of latitude = 500 inches
    // so to fill boundaryModel.width, we need width/scaleX latitude total

    const scaleY = (scaleX * 1) / xyRatio;

    const latSpan = invertLatLng
      ? boundaryModel.bounds.width / scaleX
      : boundaryModel.bounds.height / scaleX;
    const lngSpan = invertLatLng
      ? boundaryModel.bounds.height / scaleY
      : boundaryModel.bounds.width / scaleY;

    let zoom = 14;
    if (scaleX < 200 || scaleY < 200) {
      zoom = 13;
    }

    const features = await fetchTopoJsonTiles({
      minlat: centerLat - latSpan / 2,
      minlng: centerLng - lngSpan / 2,
      maxlat: centerLat + latSpan / 2,
      maxlng: centerLng + lngSpan / 2,
      zoom
    });

  
    const filteredFeatures = this.filterFeatures(features);
    const paths: paper.Point[][] = this.extractPointPathsFromFeatures(filteredFeatures, invertLatLng);

    const bufferedPaths: paper.PathItem[] = paths.map(path => {
      // translate map coordinates to our coordinate system, center on our center and scale
      const points = path.map(point => {
        return new paper.Point(
          (point.x - centerX) * scaleX,
          (point.y - centerY) * scaleY
        ).add(boundaryModel.bounds.center);
      });

      const line = new paper.Path(points);

      if (debug) {
        line.strokeWidth = 0.05;
        line.strokeColor = randomColor();
        paper.project.activeLayer.addChild(line);
      }

      // Only consider line segments that are inside or touching our boundaries
      if (
        line.isInside(boundaryModel.bounds) ||
        boundaryModel.intersects(line)
      ) {
        const fatLine = bufferLine(points, lineWidth);
        if (fatLine) {
          return fatLine.intersect(boundaryModel);
        } else {
          return null;
        }
      }
    });

    // Now union all the buffered lines together
    const unionedPaths = cascadedUnion(bufferedPaths.filter((b) => b != null));
    // Explode all the compound paths because that way we can isolate the ones that touch the edge
    const explodedUnionedPaths = flattenArrayOfPolygonsToPolygons(paper, unionedPaths);
    // After unioning, we end up with a set of cuts that will cause the inside of the design to drop out,
    // so we carefully invert it ...
    // find the inside paths, these are good holes
    const insidePaths = explodedUnionedPaths.filter(p => p.isInside(boundaryModel.bounds));
    // find the paths that touch the edge
    const outsidePaths = explodedUnionedPaths.filter(
      p => !p.isInside(boundaryModel.bounds)
    );
    // Invert those
    let invertedPath = boundaryModel;
    outsidePaths.forEach(path => (invertedPath = invertedPath.subtract(path)));

    const ret = [invertedPath, ...insidePaths];
    ret.forEach(r => {
      /// Also, mirror everything because I was working in the wrong coordinate space and didn't want to redo anything
      if (invertLatLng) {
        r.scale(1, -1, boundaryModel.bounds.center);
      } else {
        r.scale(-1, 1, boundaryModel.bounds.center);
      }
    });
    return ret;
  }

  get designMetaParameters(): Array<MetaParameter> {
    return [
      new GeocodeMetaParameter({
        title: "Center",
        text: "111 8th avenue, nyc",
        value: "40.74,-74",
        name: "center"
      }),
      new RangeMetaParameter({
        title: "Scale X",
        min: 200,
        max: 1000,
        value: 500,
        step: 1,
        name: "scaleX"
      }),
      new RangeMetaParameter({
        title: "X/Y ratio",
        min: 0.0001,
        max: 10,
        value: 1.0,
        step: 0.001,
        name: "xyRatio"
      }),
      new RangeMetaParameter({
        title: "Line Width",
        min: 0.02,
        max: 0.5,
        value: 0.1,
        step: 0.001,
        name: "lineWidth"
      }),
      new OnOffMetaParameter({
        title: "Invert Lat/Lng",
        value: false,
        name: "invertLatLng"
      })
    ];
  }
}
