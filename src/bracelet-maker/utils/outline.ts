import concaveman from "concaveman";
import { addToDebugLayer } from "./debug-layers";
import { simplifyPath, unkinkPath } from './paperjs-utils';


export function makeConcaveOutline({
  paper,
  paths,
  concavity,
  lengthThreshold,
  minimumOutline,
}: {
  paper: paper.PaperScope;
  paths: paper.PathItem[];
  concavity: number;
  lengthThreshold: number;
  minimumOutline: paper.Rectangle;
}): paper.Path {
  const allPoints = [];

  function addPoint(point: paper.Point, force: boolean = false) {
    if (point && (!point.isInside(minimumOutline) || force)) {
      allPoints.push([point.x, point.y]);
      addToDebugLayer(paper, "outlinePoints", point);
    }
  }

  paths.forEach((path: paper.Path) => {
    path.segments.forEach(s => addPoint(s.point));
    for (let offset = 0; offset < 1; offset += 0.025) {
      addPoint(path.getPointAt(path.length * offset));
    }
  });

  const minimumOutlinePath = new paper.Path.Rectangle(minimumOutline);
  for (let offset = 0; offset < 1; offset += 0.025) {
    addPoint(minimumOutlinePath.getPointAt(minimumOutlinePath.length * offset), true);
  }

  const concaveHull = concaveman(allPoints, concavity, lengthThreshold);
  const concavePath = new paper.Path(concaveHull.map(p => new paper.Point(p[0], p[1])));
  addToDebugLayer(paper, "concavePath", concavePath.clone());
  const unkinkedConcavePath = unkinkPath(paper, concavePath);

  const simplifedPath =  simplifyPath(paper, unkinkedConcavePath, 0.01);

  return unkinkedConcavePath;
}
