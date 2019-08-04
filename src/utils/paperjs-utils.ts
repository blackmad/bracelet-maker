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

export function bufferShape(
  buffer: number,
  points: paper.Point[]
): paper.PathItem {
  const scaleFactor = 100;
  const scaledPoints = points.map(p => {
    return { X: p.x * scaleFactor + 0.0001, Y: p.y * scaleFactor + 0.0001 };
  });
  const shape = new Shape.default([scaledPoints]);

  const roundedShape = shape.offset(buffer * scaleFactor, {
    jointType: 'jtRound',
    endType: 'etClosedPolygon',
    miterLimit: 2.0,
    roundPrecision: 0.25
  });

  if (!roundedShape || !roundedShape.paths || roundedShape.paths.length == 0) {
    return null;
  }

  const roundedPolygon = new paper.Path(
    roundedShape.paths[0].map(p => {
      return new paper.Point(p.X / 100, p.Y / 100);
    })
  );
  // console.log(roundedPolygon);

  return roundedPolygon;
}

export function pickPointOnRectEdge(box: paper.Rectangle, rng: () => number) {
  var randomPoint = rng() * (box.width * 2 + box.height * 2);
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
  model: paper.Rectangle,
  rng?: () => number
): paper.Point[] {
  const p1 = pickPointOnRectEdge(model, rng);
  let p2 = pickPointOnRectEdge(model, rng);
  while (p2.x == p1.x || p2.y == p1.y) {
    p2 = pickPointOnRectEdge(model, rng);
  }
  return [p1, p2]
}

export function randomLineOnRectangle(
  model: paper.Rectangle,
  rng?: () => number
): paper.Path.Line {
	const points = this.randomLineEndpointsOnRectangle(model, rng);
  return new paper.Path.Line(points[0], points[1])
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
