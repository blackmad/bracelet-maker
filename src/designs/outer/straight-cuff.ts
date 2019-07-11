import {
  RangeMetaParameter,
  OnOffMetaParameter,
  MetaParameterType
} from "../../meta-parameter";
import { PaperModelMaker } from "../../model-maker";

import * as paper from "paper";

function roundCorners(path,radius) {
	var segments = path.segments.slice(0);
	path.removeSegments();

	for(var i = 0, l = segments.length; i < l; i++) {
		var curPoint = segments[i].point;
		var nextPoint = segments[i + 1 == l ? 0 : i + 1].point;
		var prevPoint = segments[i - 1 < 0 ? segments.length - 1 : i - 1].point;
		var nextDelta = curPoint.subtract(nextPoint);
		var prevDelta = curPoint.subtract(prevPoint);

		nextDelta.length = radius;
		prevDelta.length = radius;

		path.add(
			new paper.Segment(
				curPoint.subtract(prevDelta),
				null,
				prevDelta.divide(2)
			)
		);

		path.add(
			new paper.Segment(
				curPoint.subtract(nextDelta),
				nextDelta.divide(2),
				null
			)
		);
	}
	path.closed = true;
	return path;
}


export class StraightCuffOuter implements PaperModelMaker {
  make(scope, options): void {
    var { height, wristCircumference, safeBorderWidth, debug } = options[
      "StraightCuffOuter"
    ];

    const bottomPadding = 1.0;
    const topPadding = 0.8;
    const totalWidth = wristCircumference + bottomPadding * 2;
    console.log(scope);
    var cuffOuter = new paper.Path();
    cuffOuter.strokeColor = "black";
    cuffOuter.add(new paper.Point(0, 0));
    cuffOuter.add(new paper.Point(bottomPadding - topPadding, height));
    cuffOuter.add(
      new paper.Point(bottomPadding + wristCircumference + topPadding, height)
    );
    cuffOuter.add(new paper.Point(totalWidth, 0));
    roundCorners(cuffOuter, '0.2');
    cuffOuter.closed = true;

    const safeAreaPadding = 0.5;
    const safeAreaLength = wristCircumference;
    const safeArea =
      new paper.Rectangle(
        new paper.Point(bottomPadding, safeBorderWidth),
        new paper.Size(
          safeAreaLength,
          height - safeBorderWidth * 2
        )
      )

    // const safeCone = makerjs.model.move(
    //   new makerjs.models.Rectangle(safeAreaLength, height * 4),
    //   [bottomPadding, -height * 2]
    // );
    // console.log(safeArea);

    // // cuffOuter.layer = 'outer';
    // const models = {
    //   cuff: cuffOuter,
    //   fillet: fillet
    // }

    const innerOptions = options[this.innerDesignClass.constructor.name] || {};
    innerOptions.height = height;
    innerOptions.width = totalWidth;
    innerOptions.boundaryModel = safeArea;
    // innerOptions.safeCone = safeCone;
    // innerOptions.outerModel = makerjs.model.clone(cuffOuter);

    const innerDesign = this.innerDesignClass.make(scope, innerOptions);

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

    // if (innerDesign.models && innerDesign.models.outline) {
    //   // console.log(innerDesign.models.outline);
    //   // if (debug) {
    //   //   innerDesign.models.outline.layer = 'red';
    //   //   models['outline'] = innerDesign.models.outline;
    //   // } else {
    //   //  // delete innerDesign.models.outline;
    //   // }

    //   // models.cuff = makerjs.model.combineUnion(
    //   //   innerDesign.models.outline,
    //   //   models.cuff
    //   // );

    //   // console.log(models.cuff)

    //   // const cuffChain = makerjs.model.findChains({models: {
    //   //   cuff: models.cuff,
    //   //   outline: innerDesign.models.outline
    //   // }})[0];
    //   // models.cuff = makerjs.chain.toNewModel(cuffChain)
    //   // console.log(models.cuff)

    //   // models.cuff.layer = 'outer'
    //   // console.log(models.cuff)

    //   delete innerDesign.models.outline
    // }

    // /***** END DESIGN *****/

    // console.log(models);

    // return {
    //   models: models,
    //   units: makerjs.unitType.Inch
    // }
  }

  get metaParameters() {
    return [
      new OnOffMetaParameter({
        title: "Debug",
        name: "debug",
        value: false
      }),
      new RangeMetaParameter({
        title: "Height",
        min: 1,
        max: 5,
        value: 2,
        step: 0.25,
        name: "height"
      }),
      new RangeMetaParameter({
        title: "Wrist Circumference",
        min: 4,
        max: 10,
        value: 7,
        step: 0.1,
        name: "wristCircumference"
      }),
      new RangeMetaParameter({
        title: "Safe Border (in)",
        min: 0.1,
        max: 0.75,
        value: 0.25,
        step: 0.01,
        name: "safeBorderWidth"
      }),
      new RangeMetaParameter({
        title: "Wide Wrist Circumference",
        min: 4,
        max: 10,
        value: 7.4,
        step: 0.1,
        name: "forearmCircumference"
      })
    ];
  }

  constructor(public innerDesignClass: any) {}
}
