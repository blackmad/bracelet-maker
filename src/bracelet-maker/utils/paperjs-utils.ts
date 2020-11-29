const Shape = require("@doodle3d/clipper-js");
import * as jsts from "jsts";
import * as _ from "lodash";
import GeoJSON from "geojson";
import * as simplify from 'simplify-path';

export function randomPointInPolygon(
  paper: paper.PaperScope,
  polygon: paper.PathItem,
  rng: () => number
): paper.Point {
  let bounds = null;
  if (polygon instanceof paper.Rectangle) {
    bounds = polygon;
  } else if (polygon instanceof paper.Path.Rectangle) {
    bounds = polygon.bounds;
  } else {
    throw "unknown type of polygon " + typeof polygon;
  }

  let found = false;
  while (!found) {
    const testPoint = new paper.Point(
      bounds.x + rng() * bounds.width,
      bounds.y + rng() * bounds.height
    );

    if (bounds.contains(testPoint)) {
      found = true;
      return testPoint;
    }
  }
}


export function bufferPoints(
  paper: paper.PaperScope,
  buffer: number,
  points: paper.Point[]
): paper.Point[] {
  const scaleFactor = 100;
  const scaledPoints = points.map(p => {
    return { X: p.x * scaleFactor + 0.0001, Y: p.y * scaleFactor + 0.0001 };
  });
  const shape = new Shape.default([scaledPoints]);

  const roundedShape = shape.offset(buffer * scaleFactor, {
    jointType: "jtMiter",
    endType: "etClosedPolygon",
    miterLimit: 2.0,
    roundPrecision: 0.25
  });

  if (!roundedShape || !roundedShape.paths || roundedShape.paths.length == 0) {
    return null;
  }

  return roundedShape.paths[0].map(p => {
    return new paper.Point(p.X / 100, p.Y / 100);
  });
}

export function bufferPointstoPathItem(
  paper: paper.PaperScope,
  buffer: number,
  points: paper.Point[]
): paper.Path {
  const newPoints = bufferPoints(paper, buffer, points);

  const roundedPolygon = new paper.Path(newPoints);
  roundedPolygon.closePath();

  return roundedPolygon;
}

export function getPointsFromPath(shape: paper.Path): paper.Point[] {
  return (shape && shape.segments && shape.segments.map((s) => s.point)) || [];
}

export function bufferPath(
  paper: paper.PaperScope,
  buffer: number,
  shape: paper.Path
): paper.PathItem {
  return bufferPointstoPathItem(paper, buffer, getPointsFromPath(shape));
}

export function pickPointOnRectEdge(
  paper: paper.PaperScope,
  box: paper.Rectangle,
  rng: () => number
) {
  const randomPoint = rng() * (box.width * 2 + box.height * 2);
  if (randomPoint > 0 && randomPoint < box.height) {
    return new paper.Point(0 + box.x, box.height - randomPoint + box.y);
  } else if (randomPoint > box.height && randomPoint < box.height + box.width) {
    return new paper.Point(randomPoint - box.height + box.x, 0 + box.y);
  } else if (
    randomPoint > box.height + box.width &&
    randomPoint < box.height * 2 + box.width
  ) {
    return new paper.Point(
      box.width + box.x,
      randomPoint - (box.width + box.height) + box.y
    );
  } else {
    return new paper.Point(
      box.width - (randomPoint - (box.height * 2 + box.width)) + box.x,
      box.height + box.y
    );
  }
}

export function randomLineEndpointsOnRectangle(
  paper: paper.PaperScope,
  model: paper.Rectangle,
  rng?: () => number
): paper.Point[] {
  const p1 = pickPointOnRectEdge(paper, model, rng);
  let p2 = pickPointOnRectEdge(paper, model, rng);
  while (p2.x == p1.x || p2.y == p1.y) {
    p2 = pickPointOnRectEdge(paper, model, rng);
  }
  return [p1, p2];
}

export function randomLineOnRectangle(
  paper: paper.PaperScope,
  model: paper.Rectangle,
  rng?: () => number
): paper.Path.Line {
  const points = randomLineEndpointsOnRectangle(paper, model, rng);
  return new paper.Path.Line(points[0], points[1]);
}

export class SimpleCircle {
  constructor(public x: number, public y: number, public radius: number) {}
}

export function checkCircleCircleIntersection(
  c1: SimpleCircle,
  c2: SimpleCircle,
  border?: number
): boolean {
  const xDistance = c1.x - c2.x;
  const yDistance = c1.y - c2.y;

  const sumOfRadii = c1.radius + c2.radius + (border || 0);
  const distanceSquared = xDistance * xDistance + yDistance * yDistance;

  return distanceSquared < sumOfRadii * sumOfRadii;
}

export function approxShape(paper, shape, numPointsToGet = 200): paper.Point[] {
  // console.log('in appro: ', shape);
  let points = [];
  let shapeToUse = shape;

  if (shape instanceof paper.CompoundPath) {
    shapeToUse = shape.children[0];
  }

  // console.log(actualPath)
  for (let i = 0; i < numPointsToGet; i++) {
    points.push(
      shapeToUse.getPointAt((i / numPointsToGet) * shapeToUse.length)
    );
  }

  return points.map(point => shapeToUse.localToGlobal(point));
}

export function paperPointsToGeoJsonLineString(
  points: paper.Point[]
): GeoJSON.LineString {
  return {
    type: "LineString",
    coordinates: points.map(point => [point.y, point.x])
  };
}

export function paperRectToGeoJsonLineString(
  rect: paper.Rectangle
): GeoJSON.LineString {
  return paperPointsToGeoJsonLineString(paperRectToPoints(rect));
}

export function paperRectToPoints(rect: paper.Rectangle) {
  return [
    rect.topLeft,
    rect.bottomLeft,
    rect.bottomRight,
    rect.topRight,
    rect.topLeft
  ];
}

export function jstsGeometryToPaperJsGeometry(
  paper: paper.PaperScope,
  geom: jsts.geom.Geometry
): paper.Path {
  if (geom) {
    const coords = geom.getCoordinates();
    const points = coords.map(c => new paper.Point(c.y, c.x));
    return new paper.Path(points);
  } else {
    return null;
  }
}

export function geojsonFeatureToPaperJs(
  paper: paper.PaperScope,
  feature: GeoJSON.Feature
): paper.Path {
  console.log(feature.geometry.type);
  if (feature.geometry.type === "Polygon") {
    const coords = (feature.geometry as GeoJSON.Polygon).coordinates;
    console.log(coords);
    const points = coords[0].map(c => {
      console.log(c);
      return new paper.Point(c[1], c[0]);
    });
    console.log(points);
    return new paper.Path(points);
  }
  return null;
}

export function polygonize(
  paper: paper.PaperScope,
  shapes: paper.Point[][],
  buffer?: number
): paper.Path[] {
  // @ts-ignore
  const reader = new jsts.io.GeoJSONReader();

  // @ts-ignore
  const polygonizer = new jsts.operation.polygonize.Polygonizer();
  // polygonizer.setCheckRingsValid(false);
  const geojsonLineStrings = shapes.map(paperPointsToGeoJsonLineString);
  const geoms = geojsonLineStrings.map(l => reader.read(l));

  let cleaned = null;
  geoms.forEach(function(geom, i, array) {
    if (i === 0) {
      cleaned = geom;
    } else {
      cleaned = cleaned.union(geom);
    }
  });

  polygonizer.add(cleaned);

  var polygons = polygonizer.getPolygons().array_;
  // console.log(polygons);

  const paperPolys = polygons.map((_polygon: jsts.geom.Polygon) => {
    let polygon: jsts.geom.Geometry = _polygon;
    if (buffer) {
      polygon = _polygon.buffer(buffer, null, null);
    }
    return jstsGeometryToPaperJsGeometry(paper, polygon);
  });

  return _.compact(paperPolys);
}

export function flattenArrayOfPathItems(
  paper: paper.PaperScope,
  paths: paper.Item[]
): paper.Path[] {
  const ret: paper.Path[] = [];
  paths.forEach(path => {
    if (path instanceof paper.CompoundPath) {
      flattenArrayOfPathItems(paper, path.children).forEach(c => ret.push(c));
    } else if (path instanceof paper.Path) {
      ret.push(path);
    }
  });
  return ret;
}

export function bufferLine(
  paper: paper.PaperScope,
  points: paper.Point[],
  lineWidth: number
): paper.Path {
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

  const fatLinePoints = bufferPoints(paper, lineWidth / 2, hackedPoints);

  if (fatLinePoints) {
    const path = new paper.Path(fatLinePoints);
    path.closePath();
    return path;
  } else {
    console.log("could not buffer line", points, hackedPoints);
    return null;
  }
}

export function getDistanceToLine(point: paper.Point, line: paper.Path.Line): number {
  return point.getDistance(line.getNearestPoint(point));
}

export function containsOrIntersects({needle, haystack}: {needle: paper.PathItem, haystack: paper.Path}): boolean {
  return needle.isInside(haystack.bounds) || needle.intersects(haystack);
}

export function simplifyPathToPoints(path: paper.Path, tolerance: number = 0.005): [number, number][] {
  const paperPoints = getPointsFromPath(path);
  const points = paperPoints.map(p => [p.x, p.y]);
  return simplify(points, tolerance);
}

export function simplifyPath(paper: paper.PaperScope, path: paper.Path, tolerance: number = 0.001): paper.Path {
  return new paper.Path(simplifyPathToPoints(path, tolerance).map(p => new paper.Point(p)));
}