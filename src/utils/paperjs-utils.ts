import * as paper from 'paper';
var Shape = require('@doodle3d/clipper-js');

export function randomPointInPolygon(
  polygon: paper.PathItem,
  rng: () => number
): paper.Point {
  while (true) {
    const testPoint = new paper.Point(
      polygon.bounds.x + rng() * polygon.bounds.width,
      polygon.bounds.y + rng() * polygon.bounds.height
    );

    if (polygon.contains(testPoint)) {
      return testPoint;
    }
  }
}


export function bufferShape(buffer: number, points: paper.Point[]): paper.PathItem {
  const scaleFactor = 100;
  const scaledPoints = points.map((p) => { return {X: (p.x*scaleFactor) + 0.0001 , Y: (p.y*scaleFactor) + 0.0001}});
  const shape = new Shape.default([scaledPoints]);

  const roundedShape = shape.offset(buffer*scaleFactor, {
    jointType: 'jtRound',
    endType: 'etClosedPolygon',
    miterLimit: 2.0,
    roundPrecision: 0.25
  })

  if (!roundedShape || !roundedShape.paths || roundedShape.paths.length == 0) {
    return null;
  }

  const roundedPolygon = new paper.Path(
    roundedShape.paths[0].map((p) => {
      return new paper.Point(p.X / 100, p.Y / 100)
    })
  )
  console.log(roundedPolygon);

  return roundedPolygon;
}