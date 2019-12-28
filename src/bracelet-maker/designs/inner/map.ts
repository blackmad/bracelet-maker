import { MetaParameter } from "../../meta-parameter";

import { FastAbstractInnerDesign } from "./fast-abstract-inner-design";
import { fetchTopoJsonTiles } from "./map-utils";
import { AbstractExpandInnerDesign } from "./abstract-expand-and-subtract-inner-design";
import * as _ from 'lodash';
import { bufferShapeToPoints } from '@/bracelet-maker/utils/paperjs-utils';
var randomColor = require('randomcolor');


function pairwise(arr, func) {
  const end = arr.length == 2 ? 1 : arr.length;
  for (var i = 0; i < end; i++) {
    func(arr[i % arr.length], arr[(i + 1) % arr.length]);
  }
}

export class InnerDesignMap extends FastAbstractInnerDesign {
  async makeDesign(
    paper: paper.PaperScope,
    params: any
  ): Promise<paper.Path[]> {
    const {boundaryModel} = params;
    const invertLatLng = false;

    const centerLat = 40.74;
    const centerLng = -74;

    const centerX = invertLatLng ? centerLng : centerLat;
    const centerY = invertLatLng ? centerLat : centerLng;
    const latSpan = 0.008;
    const lngSpan = 0//0.008;

    const minlat = 40.74;
    const minlng = -74;
    const features = await fetchTopoJsonTiles({
      minlat: centerLat - latSpan,
      minlng: centerLng - lngSpan,
      maxlat: centerLat + latSpan,
      maxlng: centerLng + lngSpan,
      zoom: 16
    });

    
    let minSeenX = 10000;
    let minSeenY = 10000;
    let maxSeenX = -10000;
    let maxSeenY = -10000;

    function lineStringCoordinatesToPaperLine(
      paper: paper.PaperScope,
      coordinates: number[][]
    ): paper.Point[] {
      return coordinates.map((point) => {
        const p = invertLatLng ? new paper.Point(point[0], point[1]): new paper.Point(point[1], point[0]);
        if (p.x < minSeenX) { minSeenX = p.x }
        if (p.y < minSeenX) { minSeenY = p.y }
        if (p.x > maxSeenX) { maxSeenX = p.x }
        if (p.y > maxSeenY) { maxSeenY = p.y }
        return p;
      });
    }

    function multiLneStringCoordinatesToPaperLines(
      paper: paper.PaperScope,
      coordinates: number[][][]
    ): paper.Point[][] {
      return coordinates.map(g => lineStringCoordinatesToPaperLine(paper, g));
    }

    console.log(features);
    const paths: paper.Point[][] = [];
    const filteredFeatures = features.filter(f => {
      if (["road", "major_road", "minor_road"].includes(f.properties.kind)) {
        if (f.geometry.coordinates.length > 10 || f.geometry.coordinates[0].length > 10) {
          console.log('big', f)
        }
        return true;
      }
      return false;
    });
    console.log(filteredFeatures);
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
    console.log(paths);

    const scale = 0.5;
    const scaleX = 1000 * scale;
    const scaleY = 800 * scale;

    console.log(maxSeenY, minSeenY);
    console.log(maxSeenY - minSeenY);

    const transformPoint = (point) => {
      return new paper.Point(
        (point.x - centerX) * scaleX,
        (point.y - centerY) * scaleY
      ).add(boundaryModel.bounds.center);
    }

    let totalUnion = boundaryModel;

    const newPaths = [];
    paths.forEach((path) => {
      const points = path.map(transformPoint);

      const line = new paper.Path(points);
      line.strokeWidth = 0.05;
      line.strokeColor = randomColor();
      // paper.project.activeLayer.addChild(line);
      

      // if (line.isInside(boundaryModel.bounds) || boundaryModel.intersects(line)) {
        // newPaths.push(line);
        let hackedPoints = [...points]
        hackedPoints.reverse()
        if (hackedPoints.length == 2) {
          const tmpLine = new paper.Path(hackedPoints)
          hackedPoints = [
            hackedPoints[0],
            tmpLine.getPointAt(tmpLine.length*0.5),
            hackedPoints[1]
          ]
        }
        hackedPoints = hackedPoints.concat(points);

        const fatLinePoints = bufferShapeToPoints(paper, 0.05, hackedPoints);
        if(fatLinePoints) {
          const fatLine = new paper.Path(fatLinePoints);
          fatLine.strokeWidth = 0.05;
          fatLine.strokeColor = line.strokeColor;
          fatLine.closePath();
          newPaths.push(fatLine);
        } else {
          console.log('could not buffer line', points, hackedPoints)
        }
    });

    // let totalUnion = boundaryModel;
    // newPaths.forEach((p) => {
    //   totalUnion = totalUnion.subtract(p)
    // })
    // console.log(totalUnion.subtract(newPaths[0]))

    // const sub = boundaryModel.subtract(totalUnion)
    // sub.strokeWidth = 0.05;
    // sub.strokeColor = randomColor();
    // paper.project.activeLayer.addChild(sub);


    const circle = new paper.Path.Circle(transformPoint(new paper.Point(minlat, minlng)), 0.5);
    circle.fillColor = 'red';
    paper.project.activeLayer.addChild(circle);


    return newPaths;

    // return paths;
    // return [params.boundaryModel];
  }

  get designMetaParameters(): Array<MetaParameter> {
    return [];
  }
}
