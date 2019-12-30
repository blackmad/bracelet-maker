import concaveman from "concaveman";

export function makeConcaveOutline({
  paper,
  paths,
  concavity,
  lengthThreshold
}: {
  paper: paper.PaperScope;
  paths: paper.PathItem[];
  concavity: number;
  lengthThreshold: number;
}): paper.Path {
  const allPoints = [];
  paths.forEach((path: paper.Path) => {
    path.segments.forEach(s => allPoints.push([s.point.x, s.point.y]));
    for (let offset = 0; offset < 1; offset += 0.01) {
      const point = path.getPointAt(path.length * offset);
      allPoints.push([point.x, point.y]);
      }
  });
  const concaveHull = concaveman(
    allPoints,
    concavity,
    lengthThreshold
  );
  return new paper.Path(concaveHull.map(p => new paper.Point(p[0], p[1])));
}
