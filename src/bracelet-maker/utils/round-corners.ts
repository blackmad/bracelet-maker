export function roundCorners({ paper, path, radius }) {
  path.closePath();
  
  let segments = path.segments;
  const originalSegments = [...segments];

  for (let i = 0; i < segments.length; i++) {
    const p1 = segments[i];
    const p2 = segments[(i + 1) % segments.length];

    // console.log(p1.point.x, p1.point.y, p2.point.x, p2.point.y, p1.point.getDistance(p2.point))
    if (p1.point.getDistance(p2.point) < 0.1) {
      path.removeSegment(i)
      // console.log(`removing segment ${i} from ${p1.point} to ${p2.point}`)
    }
  }

  if (segments.length < 4) {
    segments = originalSegments;
  } else {
    segments = path.segments;
  }

  const fraction = 0.5 + 0.5 * (1 - radius);
  const fractionOffset = (1 - fraction) * 0.95;

  const newPath = new paper.Path();
  for (let i = 0; i < segments.length; i++) {
    // for (let i = 0; i < 1; i++) {
    const p1 = segments[i];
    const p2 = segments[(i + 1) % segments.length];
    const p3 = segments[(i + 2) % segments.length];

    const line1 = new paper.Path([p1, p2]);
    const c1 = line1.getPointAt(line1.length * fraction);
    var handleOut = line1.getPointAt(
      line1.length * (fraction + fractionOffset)
    );

    const line2 = new paper.Path([p2, p3]);
    const c2 = line2.getPointAt(line2.length * (1 - fraction));
    var handleIn = line2.getPointAt(
      line2.length * (1 - (fraction + fractionOffset))
    );

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
        handleOut: handleOut.subtract(c1)
      })
    );

    newPath.add(
      new paper.Segment({
        point: c2,
        handleIn: handleIn.subtract(c2)
      })
    );
  }
  newPath.closePath();
  return newPath;
}
