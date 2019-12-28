// TODO: if it's too close to another street, don't use it
import {
  MetaParameter,
  RangeMetaParameter,
  OnOffMetaParameter,
  GeocodeMetaParameter
} from "../../meta-parameter";

import { FastAbstractInnerDesign } from "./fast-abstract-inner-design";
import { fetchTopoJsonTiles } from "./map-utils";
import { AbstractExpandInnerDesign } from "./abstract-expand-and-subtract-inner-design";
import * as _ from "lodash";
import {
  bufferShapeToPoints,
  cascadedUnion,
  flattenArrayOfPolygonsToPolygons
} from "../../utils/paperjs-utils";
var randomColor = require("randomcolor");

function pairwise(arr, func) {
  const end = arr.length == 2 ? 1 : arr.length;
  for (var i = 0; i < end; i++) {
    func(arr[i % arr.length], arr[(i + 1) % arr.length]);
  }
}

export class InnerDesignMap extends FastAbstractInnerDesign {
  needSubtraction = false;
  needSeed = false;

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

    function lineStringCoordinatesToPaperLine(
      paper: paper.PaperScope,
      coordinates: number[][]
    ): paper.Point[] {
      return coordinates.map(point => {
        const p = invertLatLng
          ? new paper.Point(point[1], point[0])
          : new paper.Point(point[0], point[1]);
        return p;
      });
    }

    function multiLneStringCoordinatesToPaperLines(
      paper: paper.PaperScope,
      coordinates: number[][][]
    ): paper.Point[][] {
      return coordinates.map(g => lineStringCoordinatesToPaperLine(paper, g));
    }

    const paths: paper.Point[][] = [];
    let filteredFeatures = features.filter(f => {
      return (
        (["road", "major_road", "minor_road"].includes(f.properties.kind) &&
          f.properties.kind_detail != "service") // these seem to very often be parking lot outlines;
        // these are cool but break parks
        // (f.properties.kind == "path" && f.properties.kind_detail == "footway")
      );
    });


    // if (zoom < 14) {
    //   filteredFeatures = features.filter(f =>
    //     ["major_road"].includes(f.properties.kind));
    // }

    filteredFeatures.map(f => {
      if (f.geometry.type === "LineString") {
        paths.push(
          lineStringCoordinatesToPaperLine(paper, f.geometry.coordinates)
        );
      } else if (f.geometry.type === "MultiLineString") {
        multiLneStringCoordinatesToPaperLines(
          paper,
          f.geometry.coordinates
        ).forEach(l => paths.push(l));
      } else {
        console.log(`cannot understand ${f.geometry.type}`);
      }
    });

    const transformPoint = point => {
      return new paper.Point(
        (point.x - centerX) * scaleX,
        (point.y - centerY) * scaleY
      ).add(boundaryModel.bounds.center);
    };

    const newPaths = [];
    paths.forEach(path => {
      const points = path.map(transformPoint);

      const line = new paper.Path(points);
      if (debug) {
        line.strokeWidth = 0.05;
        line.strokeColor = randomColor();
        paper.project.activeLayer.addChild(line);
      }

      if (
        line.isInside(boundaryModel.bounds) ||
        boundaryModel.intersects(line)
      ) {
        // newPaths.push(line);
        let hackedPoints = [...points];
        hackedPoints.reverse();
        if (hackedPoints.length == 2) {
          const tmpLine = new paper.Path(hackedPoints);
          hackedPoints = [
            hackedPoints[0],
            tmpLine.getPointAt(tmpLine.length * 0.5),
            hackedPoints[1]
          ];
        }
        hackedPoints = hackedPoints.concat(points);

        const fatLinePoints = bufferShapeToPoints(
          paper,
          lineWidth / 2,
          hackedPoints
        );
        if (fatLinePoints) {
          const fatLine = new paper.Path(fatLinePoints);
          fatLine.strokeWidth = 0.05;
          fatLine.strokeColor = line.strokeColor;
          fatLine.closePath();
          newPaths.push(fatLine.intersect(boundaryModel));
        } else {
          console.log("could not buffer line", points, hackedPoints);
        }
      }
    });

    if (debug) {
      const circle = new paper.Path.Circle(
        transformPoint(new paper.Point(centerX, centerY)),
        0.5
      );
      circle.fillColor = new paper.Color("red");
      paper.project.activeLayer.addChild(circle);
    }

    // const boundarySegs = [];// pairwise(boundaryModel.segments, (A, B) => newPaths.push([A, B]));
    const unionedPaths = cascadedUnion(newPaths);
    const lastPaths = flattenArrayOfPolygonsToPolygons(paper, unionedPaths);
    const insidePaths = lastPaths.filter(p => p.isInside(boundaryModel.bounds));
    const outsidePaths = lastPaths.filter(
      p => !p.isInside(boundaryModel.bounds)
    );
    let invertedPath = boundaryModel;
    outsidePaths.forEach(path => (invertedPath = invertedPath.subtract(path)));
    const ret = [invertedPath, ...insidePaths];
    ret.forEach(r => {
      if (invertLatLng) {
        r.scale(1, -1, boundaryModel.bounds.center);
      } else {
        r.scale(-1, 1, boundaryModel.bounds.center);
      }
    });
    return ret;
    // console.log(lastPaths);
    // return lastPaths;

    // console.log(unionedPaths)
    // return unionedPaths.filter((p) => p.isInside(boundaryModel.scale(0.8).bounds))
    // return [boundaryModel.subtract(unionedPaths)];

    // return newPaths;

    // return paths;
    // return [params.boundaryModel];
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
