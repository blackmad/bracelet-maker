export function roundCorners({ paper, path, radius }) {
  if (!path || !path.segments || path.segments.length < 3) {
    console.log("can't round", {path})
    return path;
  }

  path.closePath();

  var segments = path.segments.slice(0);
  path.removeSegments();

  for (var i = 0, l = segments.length; i < l; i++) {
    var curPoint = segments[i].point;
    var nextPoint = segments[i + 1 == l ? 0 : i + 1].point;
    var prevPoint = segments[i - 1 < 0 ? segments.length - 1 : i - 1].point;
    var nextDelta = curPoint.subtract(nextPoint);
    var prevDelta = curPoint.subtract(prevPoint);

    const actualRadius =
      Math.min(nextDelta.length, prevDelta.length) * (radius / 2);

    nextDelta.length = actualRadius;
    prevDelta.length = actualRadius;

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
