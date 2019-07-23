import * as paper from 'paper';

export function randomPointInPolygon(polygon: paper.PathItem, rng: () => number): paper.Point {
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