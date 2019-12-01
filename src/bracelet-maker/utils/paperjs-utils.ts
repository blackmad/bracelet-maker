const Shape = require('@doodle3d/clipper-js');

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
    throw 'unknown type of polygon ' + typeof (polygon);
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

export function bufferShapeToPoints(
  paper: paper.PaperScope,
  buffer: number,
  points: paper.Point[]
): paper.Point[] {
  const scaleFactor = 100;
  const scaledPoints = points.map((p) => {
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

  return roundedShape.paths[0].map((p) => {
    return new paper.Point(p.X / 100, p.Y / 100);
  })
}

export function bufferShape(
  paper: paper.PaperScope,
  buffer: number,
  points: paper.Point[]
): paper.PathItem {
  const newPoints = bufferShapeToPoints(paper, buffer, points);

  const roundedPolygon = new paper.Path(newPoints);
  roundedPolygon.closePath();

  return roundedPolygon;
}

export function pickPointOnRectEdge(
  paper: paper.PaperScope,
  box: paper.Rectangle, rng: () => number) {
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
  constructor(public x: number, public y: number, public radius: number) { }
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

export function roundCorners({paper, path, radius}) {
  let segments = path.segments;

  const segmentsToRemove = []

  for (let i = 0; i < segments.length; i++) {
    const p1 = segments[i];
    const p2 = segments[(i+1) % segments.length];

    if (p1.point.getDistance(p2.point) < 0.1) {
      segmentsToRemove.push(i);
      console.log(`removing segment ${i} from ${p1.point} to ${p2.point}`)
    }
  }

  if ((segments.length - segmentsToRemove.length) > 4) {
    segmentsToRemove.forEach((i) => path.removeSegment(i));
  }

  segments = path.segments;
  
  const fraction = 0.5 + 0.5*(1-radius);
  const fractionOffset = (1 - fraction)*0.95;

  const newPath = new paper.Path();
  for (let i = 0; i < segments.length; i++) {
    // for (let i = 0; i < 1; i++) {
        const p1 = segments[i];
        const p2 = segments[(i+1) % segments.length];
        const p3 = segments[(i+2) % segments.length];


        const line1 = new paper.Path([p1, p2]);
        const c1 = line1.getPointAt(line1.length * fraction)
        var handleOut = line1.getPointAt(line1.length * (fraction + fractionOffset));
    
        const line2 = new paper.Path([p2, p3]);
        const c2 = line2.getPointAt(line2.length * (1 - fraction))
        var handleIn = line2.getPointAt(line2.length * (1 - (fraction + fractionOffset)));
    

        // if (Math.abs(c1.getDistance(c2)) < 0.2) {
        //   continue;
        // }
        
        // new paper.Path.Circle(c1, 0.01).fillColor = 'blue'
        // new paper.Path.Circle(c2, 0.01).fillColor = 'red'
        
        // new paper.Path.Circle(handleIn, 0.01).fillColor = 'orange'
        // new paper.Path.Circle(handleOut, 0.01).fillColor = 'green'

 
        
        newPath.add(
            new paper.Segment({
             point: c1,
             handleOut: handleOut.subtract(c1),
            })
        );
        
        newPath.add(
            new paper.Segment({
             point: c2,
             handleIn: handleIn.subtract(c2),
            })
        );
    }
    newPath.closePath();
    return newPath;
}

export function roundCornersOld({ paper, path, radius }) {
  var segments = path.segments.slice(0);
  path.removeSegments();

  for (var i = 0, l = segments.length; i < l; i++) {
    var curPoint = segments[i].point;
    var nextPoint = segments[i + 1 == l ? 0 : i + 1].point;
    var prevPoint = segments[i - 1 < 0 ? segments.length - 1 : i - 1].point;
    var nextDelta = curPoint.subtract(nextPoint);
    var prevDelta = curPoint.subtract(prevPoint);

    nextDelta.length = radius;
    prevDelta.length = radius;

    path.add(
      new paper.Segment(curPoint.subtract(prevDelta), null, prevDelta.divide(2))
    );

    path.add(
      new paper.Segment(curPoint.subtract(nextDelta), nextDelta.divide(2), null)
    );
  }
  path.closed = true;
  return path;
}

export function approxShape(
  paper,
  shape,
  numPointsToGet = 200
) {
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


// var BORDER_RADIUS = 20;

// function roundedPath( /* x1, y1, x2, y2, ..., xN, yN */ ){
//     context.beginPath();
//     if (!arguments.length) return;

//     //compute the middle of the first line as start-stop-point:
//     var deltaY = (arguments[3] - arguments[1]);
//     var deltaX = (arguments[2] - arguments[0]);
//     var xPerY = deltaY / deltaX;
//     var startX = arguments[0] + deltaX / 2;
//     var startY = arguments[1] + xPerY * deltaX / 2;

//     //walk around using arcTo:
//     context.moveTo(startX, startY);
//     var x1, y1, x2, y2;
//     x2 = arguments[2];
//     y2 = arguments[3];
//     for (var i = 4; i < arguments.length; i += 2) {
//         x1 = x2;
//         y1 = y2;
//         x2 = arguments[i];
//         y2 = arguments[i + 1];
//         context.arcTo(x1, y1, x2, y2, BORDER_RADIUS);
//     }

//     //finally, close the path:
//     context.arcTo(x2, y2, arguments[0], arguments[1], BORDER_RADIUS);
//     context.arcTo(arguments[0], arguments[1], startX, startY, BORDER_RADIUS);
//     context.closePath();
// }