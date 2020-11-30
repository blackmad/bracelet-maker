import { MetaParameter, RangeMetaParameter } from "../../meta-parameter";
import { CompletedModel, OuterPaperModelMaker } from "../../model-maker";
import { makeEvenlySpacedBolts, RivetRadius } from "../design-utils";

function roundCorners(paper, path, radius) {
  const segments = path.segments.slice(0);
  path.removeSegments();

  for (let i = 0, l = segments.length; i < l; i++) {
    const curPoint = segments[i].point;
    const nextPoint = segments[i + 1 == l ? 0 : i + 1].point;
    const prevPoint = segments[i - 1 < 0 ? segments.length - 1 : i - 1].point;
    const nextDelta = curPoint.subtract(nextPoint);
    const prevDelta = curPoint.subtract(prevPoint);

    nextDelta.length = radius;
    prevDelta.length = radius;

    path.add(new paper.Segment(curPoint.subtract(prevDelta), null, prevDelta.divide(2)));

    path.add(new paper.Segment(curPoint.subtract(nextDelta), nextDelta.divide(2), null));
  }
  path.closed = true;

  return path;
}

export class StraightCuffOuter extends OuterPaperModelMaker {
  public bottomPadding = 0.0;
  public topPadding = 0.0;

  get outerMetaParameters(): MetaParameter<any>[]  {
    return [
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
        value: 6.9,
        step: 0.1,
        name: "wristCircumference"
      }),
      new RangeMetaParameter({
        title: "Wide Wrist Circumference",
        min: 4,
        max: 10,
        value: 7.2,
        step: 0.1,
        name: "forearmCircumference"
      })
    ];
  }

  public controlInfo = `Measure your wrist with a sewing measuring tape. I suggest measuring pretty tight, this pattern adds some length.<br/>
  Cis male wrists average around 7 inches, cis female wrists closer to 6.5 inches." `;

  constructor(public subModel: any) {
    super();
  }

  public makeHoles({ paper, path, height, width }): paper.Path.Circle[] {
    const paddingDiff = Math.abs(this.topPadding - this.bottomPadding);
    const guideLineLeftP1 = new paper.Point(this.bottomPadding - 0.1 + RivetRadius / 2, 0);
    const guideLineLeftP2 = new paper.Point(
      this.bottomPadding - 0.1 - paddingDiff + RivetRadius / 2,
      height
    );

    let numBolts = Math.round(height);
    if (height > 1.5) {
      numBolts = Math.max(2, numBolts);
    }

    const holes1 = makeEvenlySpacedBolts(paper, numBolts, guideLineLeftP1, guideLineLeftP2);

    const guideLineRightP1 = new paper.Point(width - this.bottomPadding + 0.1 - RivetRadius / 2, 0);
    const guideLineRightP2 = new paper.Point(
      width - this.bottomPadding + paddingDiff + 0.1 - RivetRadius / 2,
      height
    );

    const holes2 = makeEvenlySpacedBolts(paper, numBolts, guideLineRightP1, guideLineRightP2);

    return [...holes1, ...holes2];
  }

  public async make(paper: paper.PaperScope, options): Promise<CompletedModel> {
    const {
      height,
      wristCircumference,
      forearmCircumference,
      safeBorderWidth,
      extendOutward,
      debug
    } = options.StraightCuffOuter;

    this.bottomPadding = 0.8;
    this.topPadding = this.bottomPadding + (wristCircumference - forearmCircumference);

    const totalWidth = wristCircumference + this.bottomPadding * 2;
    let cuffOuter: paper.Path = new paper.Path();
    cuffOuter.strokeColor = new paper.Color("black")
    cuffOuter.add(new paper.Point(this.bottomPadding - this.topPadding, 0));
    cuffOuter.add(new paper.Point(0, height));
    cuffOuter.add(new paper.Point(totalWidth, height));
    cuffOuter.add(new paper.Point(this.bottomPadding + wristCircumference + this.topPadding, 0));
    roundCorners(paper, cuffOuter, "0.2");
    const holes = this.makeHoles({
      paper: paper,
      path: cuffOuter,
      height,
      width: totalWidth
    });

    const safeAreaPath: paper.Path = new paper.Path();
    safeAreaPath.add(new paper.Point(this.bottomPadding + 0.1, 0));
    safeAreaPath.add(new paper.Point(this.topPadding + 0.1, height));
    safeAreaPath.add(
      new paper.Point(
        totalWidth - this.topPadding - 0.1,
        height
      )
    );
    safeAreaPath.add(new paper.Point(wristCircumference + this.bottomPadding - 0.1, 0));
    roundCorners(paper, safeAreaPath, "0.2");

    const safeCone = safeAreaPath.clone().scale(0.97, 10);

    const innerOptions = options[this.subModel.constructor.name] || {};
    innerOptions.height = height;
    innerOptions.width = totalWidth;
    innerOptions.boundaryModel = safeAreaPath;
    innerOptions.safeCone = safeCone;
    innerOptions.outerModel = cuffOuter;

    const innerDesign = await this.subModel.make(paper, innerOptions);
    if (innerDesign.outline) {
      cuffOuter = cuffOuter.unite(innerDesign.outline) as paper.Path;
    }

    return new CompletedModel({
      outer: cuffOuter,
      holes: holes,
      design: innerDesign.paths
    });

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
}
