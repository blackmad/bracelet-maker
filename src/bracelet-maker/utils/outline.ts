import concaveman from "concaveman";
import { addToDebugLayer } from "./debug-layers";


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
    for (let offset = 0; offset < 1; offset += 0.025) {
      const point = path.getPointAt(path.length * offset);
      if (point) {
        allPoints.push([point.x, point.y]);
        addToDebugLayer(paper, "outlinePoints", point);
      }
    }
  });
  const concaveHull = concaveman(allPoints, concavity, lengthThreshold);
  const concavePath = new paper.Path(concaveHull.map(p => new paper.Point(p[0], p[1])));
  addToDebugLayer(paper, "concavePath", concavePath.clone());
  return concavePath;
}
