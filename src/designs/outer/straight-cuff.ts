import { RangeMetaParameter, OnOffMetaParameter } from '../../meta-parameter';
import { PaperModelMaker } from '../../model-maker';
import { makeEvenlySpacedBolts, RivetRadius } from '../design-utils';

import * as paper from 'paper';

function roundCorners(path, radius) {
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

export class StraightCuffOuter implements PaperModelMaker {
  bottomPadding = 1.0;
  topPadding = 0.8;

  makeHoles({ path, height, width }): paper.Path.Circle[] {
    const paddingDiff = Math.abs(this.topPadding - this.bottomPadding);
    const guideLineLeftP1 = new paper.Point(
      this.topPadding / 2 + RivetRadius / 2,
      0
    );
    const guideLineLeftP2 = new paper.Point(
      this.topPadding / 2 + paddingDiff + RivetRadius / 2,
      height
    );

    const holes1 = makeEvenlySpacedBolts(
      Math.floor(height),
      guideLineLeftP1,
      guideLineLeftP2
    );

    const guideLineRightP1 = new paper.Point(
      width - this.topPadding / 2 - RivetRadius / 2,
      0
    );
    const guideLineRightP2 = new paper.Point(
      width - this.topPadding / 2 - paddingDiff - RivetRadius / 2,
      height
    );

    const holes2 = makeEvenlySpacedBolts(
      Math.floor(height),
      guideLineRightP1,
      guideLineRightP2
    );

    return [...holes1, ...holes2];
  }

  make(scope, options): paper.PathItem[] {
    var { height, wristCircumference, safeBorderWidth, debug } = options[
      'StraightCuffOuter'
    ];

    const totalWidth = wristCircumference + this.bottomPadding * 2;
    const cuffOuterPath: paper.Path = new paper.Path();
    cuffOuterPath.strokeColor = 'black';
    cuffOuterPath.add(new paper.Point(0, 0));
    cuffOuterPath.add(
      new paper.Point(this.bottomPadding - this.topPadding, height)
    );
    cuffOuterPath.add(
      new paper.Point(
        this.bottomPadding + wristCircumference + this.topPadding,
        height
      )
    );
    cuffOuterPath.add(new paper.Point(totalWidth, 0));
    roundCorners(cuffOuterPath, '0.2');
    const holes = this.makeHoles({
      path: cuffOuterPath,
      height,
      width: totalWidth
    });

    let cuffOuter: paper.PathItem = cuffOuterPath;

    const safeAreaPadding = 0.5;
    const safeAreaLength = wristCircumference;
    const safeArea = new paper.Path.Rectangle(
      new paper.Point(this.bottomPadding, safeBorderWidth),
      new paper.Size(safeAreaLength, height - safeBorderWidth * 2)
    );

    if (debug) {
      safeArea.strokeColor = 'green';
      safeArea.strokeWidth = 0.1;
    } else {
      safeArea.remove();
    }

    const safeCone = new paper.Path.Rectangle(
      new paper.Point(this.bottomPadding, -10),
      new paper.Size(safeAreaLength, 20)
    );
    safeCone.remove();

    const innerOptions = options[this.innerDesignClass.constructor.name] || {};
    innerOptions.height = height;
    innerOptions.width = totalWidth;
    innerOptions.boundaryModel = safeArea;
    innerOptions.safeCone = safeCone;
    innerOptions.outerModel = cuffOuter;

    const innerDesign = this.innerDesignClass.make(scope, innerOptions);
    if (innerDesign.outline) {
      const oldCuffOuter = cuffOuter;

      cuffOuter = cuffOuter.unite(innerDesign.outline);
      cuffOuter.remove();
      // cheap hack to fill in inner holes for some reason
      cuffOuter = cuffOuter.unite(safeArea);

      oldCuffOuter.remove();
      // innerDesign.outline.removeChildren();
      // innerDesign.outline.remove();
      // innerDesign.paths.forEach(p => p.remove());
    }

    if (debug) {
      return [innerDesign.paths];
    } else {
      const path = new paper.CompoundPath({
        // children: [cuffOuter],
        children: [cuffOuter, ...holes, ...innerDesign.paths],
        strokeColor: 'red',
        strokeWidth: '0.005',
        fillColor: 'lightgrey',
        fillRule: 'evenodd'
      });
      return [path];
    }

    // innerDesign.layer = "inner"
    // models['design'] = innerDesign;

    // if (debug) {
    //   // console.log(safeCone);
    //   // safeCone.layer = 'brightpink';
    //   // models['safeCone'] = safeCone;

    //   // console.log(safeArea);
    //   // safeArea.layer = 'orange';
    //   // models['safeArea'] = safeArea;
    // }

    // /***** END DESIGN *****/
  }

  get metaParameters() {
    return [
      new OnOffMetaParameter({
        title: 'Debug',
        name: 'debug',
        value: false
      }),
      new RangeMetaParameter({
        title: 'Height',
        min: 1,
        max: 5,
        value: 2,
        step: 0.25,
        name: 'height'
      }),
      new RangeMetaParameter({
        title: 'Wrist Circumference',
        min: 4,
        max: 10,
        value: 7,
        step: 0.1,
        name: 'wristCircumference'
      }),
      new RangeMetaParameter({
        title: 'Safe Border (in)',
        min: 0.1,
        max: 0.75,
        value: 0.25,
        step: 0.01,
        name: 'safeBorderWidth'
      }),
      new RangeMetaParameter({
        title: 'Wide Wrist Circumference',
        min: 4,
        max: 10,
        value: 7.4,
        step: 0.1,
        name: 'forearmCircumference'
      })
    ];
  }

  constructor(public innerDesignClass: any) {}
}
