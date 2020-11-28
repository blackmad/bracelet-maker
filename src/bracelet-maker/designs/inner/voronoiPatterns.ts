import * as _ from "lodash";

import { InnerDesignVoronoi } from "./voronoi";

export class InnerDesignVoronoiPatterns extends InnerDesignVoronoi {
  generatePoints({
    paper,
    bounds,
    numPoints,
  }: {
    paper: paper.PaperScope;
    bounds: paper.Rectangle;
    numPoints: number;
  }): paper.Point[] {
    const length = bounds.width;

    const allPoints = _.flatten(
      _.times(numPoints - 1, (_i) => {
        const i = _i + 1;
        const points = [];
        // nice little turtle shell
        // points.push(new paper.Point(i/numPoints, 0));
        // points.push(new paper.Point(i/numPoints, 0.8*Math.sin(Math.PI*i/numPoints)));
        // points.push(new paper.Point(i/numPoints, -0.8*Math.sin(Math.PI*i/numPoints)));

        points.push(
          new paper.Point(i / numPoints, 0.8 * (i / numPoints) ** 2 - 0.75)
        );
        points.push(
          new paper.Point(
            i / numPoints,
            0.8 * ((numPoints - i) / numPoints) ** 2 - 0.75
          )
        );
        points.push(
          new paper.Point(i / numPoints, -0.8 * (i / numPoints) ** 2 + 0.75)
        );
        points.push(
          new paper.Point(
            i / numPoints,
            -0.8 * ((numPoints - i) / numPoints) ** 2 + 0.75
          )
        );

        if (i % 2 === 1) {
          points.push(
            new paper.Point(i / (numPoints * 2), -0.6 * (i / numPoints) ** 2)
          );
          points.push(
            new paper.Point(
              (numPoints - i) / (numPoints * 2) + 0.5,
              -0.6 * (i / numPoints) ** 2
            )
          );
        }

        // points.push(new paper.Point(i/numPoints, ((i/numPoints)**2) + 0.5));

        // points.push(new paper.Point(i/numPoints, ((i/numPoints)**2) - 0.5));

        // points.push(new paper.Point(i/numPoints, ((numPoints-i)/numPoints)**2));
        // points.push(new paper.Point(i/numPoints, -1*((numPoints-i)/numPoints)**2));

        return points;
      })
    );

    console.log(allPoints);

    const scaledPoints = allPoints.map((p) => {
      return p
        .multiply(new paper.Point(bounds.width, bounds.height / 2))
        .add(bounds.topLeft)
        .add(new paper.Point(0, bounds.height / 2));
    });
    console.log(scaledPoints);

    return scaledPoints;
  }
}
