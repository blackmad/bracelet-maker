import { makeConicSection } from './conic-section';
import { RangeMetaParameter } from '../../meta-parameter';
import { OuterPaperModelMaker } from '../../model-maker';
import { makeEvenlySpacedBolts } from '../design-utils';

export class ConicCuffOuter implements OuterPaperModelMaker {
  public controlInfo = `Measure your wrist with a sewing measuring tape. I suggest measuring pretty tight, this pattern adds some length.<br/>
  Cis male wrists average around 7 inches, cis female wrists closer to 6.5 inches."`;

  constructor(public subModel: any) {}

  public addRivetHoles(paper: paper.PaperScope, height, cuffModel, cuffModelInner): paper.Path[] {
    /***** START RIVET HOLES *****/
    const boltGuideLine1P1 = new paper.Point(
      cuffModel.shortRadius * Math.cos(cuffModelInner.widthOffset.radians / 2),
      cuffModel.shortRadius * Math.sin(cuffModelInner.widthOffset.radians / 2)
    );
    const boltGuideLine1P2 = new paper.Point(
      cuffModel.longRadius * Math.cos(cuffModelInner.widthOffset.radians / 2),
      cuffModel.longRadius * Math.sin(cuffModelInner.widthOffset.radians / 2)
    );
    const boltGuideLine2P1 = new paper.Point(
      cuffModel.longRadius *
        Math.cos(
          cuffModel.alpha.radians - cuffModelInner.widthOffset.radians / 2
        ),
      cuffModel.longRadius *
        Math.sin(
          cuffModel.alpha.radians - cuffModelInner.widthOffset.radians / 2
        )
    );
    const boltGuideLine2P2 = new paper.Point(
      cuffModel.shortRadius *
        Math.cos(
          cuffModel.alpha.radians - cuffModelInner.widthOffset.radians / 2
        ),
      cuffModel.shortRadius *
        Math.sin(
          cuffModel.alpha.radians - cuffModelInner.widthOffset.radians / 2
        )
    );

    let numBolts = Math.round(height);
    if (height > 1.5) {
      numBolts = Math.max(2, numBolts);
    }
    const leftBolts = makeEvenlySpacedBolts(
      paper,
      numBolts,
      boltGuideLine1P1,
      boltGuideLine1P2
    );
    const rightBolts = makeEvenlySpacedBolts(
      paper,
      numBolts,
      boltGuideLine2P1,
      boltGuideLine2P2
    );
    return [...leftBolts, ...rightBolts];
    /***** END RIVET HOLES *****/
  }

  public rotateConicSectionToZeroZero(paper, model, degrees) {
    const toTranslateX = model.bounds.x;
    const toTranslateY = model.bounds.y;
    model.translate(new paper.Point(-toTranslateX, -toTranslateY));
    model.rotate(90 - degrees / 2);
    const toTranslateX2 = model.bounds.x;
    const toTranslateY2 = model.bounds.y;
    model.translate(new paper.Point(-toTranslateX2, -toTranslateY2));
  }

  public make(paper: paper.PaperScope, options) {
    const {
      height,
      wristCircumference,
      safeBorderWidth
    } = options.ConicCuffOuter;

    let { forearmCircumference } = options.ConicCuffOuter;

    if (wristCircumference > forearmCircumference) {
      throw new Error(`wristCircumference ${wristCircumference} must be less than forearmCircumference ${forearmCircumference}`);
    }

    if (forearmCircumference - wristCircumference < 0.05) {
      forearmCircumference += 0.05;
    }

    const debug = false;

    const cuffModel = makeConicSection({
      paper,
      topCircumference: wristCircumference + 1.0,
      bottomCircumference: forearmCircumference + 1.0,
      height,
      filletRadius: 0.2
    });

    const cuffModelInner = makeConicSection({
      paper,
      topCircumference: wristCircumference + 1.0,
      bottomCircumference: forearmCircumference + 1.0,
      height,
      widthOffset: 1.1,
      heightOffset: safeBorderWidth
    });

    const rivetHoles = this.addRivetHoles(
      paper,
      height,
      cuffModel,
      cuffModelInner
    );

    const tmpCuffModel = new paper.CompoundPath({
      children: [cuffModel.model, cuffModelInner.model, ...rivetHoles]
    });
    this.rotateConicSectionToZeroZero(paper, tmpCuffModel, cuffModel.alpha.degrees);

    /***** START DESIGN *****/
    // Now make the design and clamp it to the inner/safe arc we built

    // const safeCone = new makerjs.models.ConnectTheDots(true, [
    //   boundaryModel.models.c.models.cuff.paths.p1.origin,
    //   [
    //     20 *
    //       Math.cos(
    //         Angle.fromDegrees(
    //           boundaryModel.models.c.models.cuff.paths.p1.startAngle
    //         ).radians
    //       ) +
    //       boundaryModel.models.c.models.cuff.paths.p1.origin[0],
    //     20 *
    //       Math.sin(
    //         Angle.fromDegrees(
    //           boundaryModel.models.c.models.cuff.paths.p1.startAngle
    //         ).radians
    //       ) +
    //       boundaryModel.models.c.models.cuff.paths.p1.origin[1]
    //   ],
    //   [
    //     20 *
    //       Math.cos(
    //         Angle.fromDegrees(
    //           boundaryModel.models.c.models.cuff.paths.p1.endAngle
    //         ).radians
    //       ) +
    //       boundaryModel.models.c.models.cuff.paths.p1.origin[0],
    //     20 *
    //       Math.sin(
    //         Angle.fromDegrees(
    //           boundaryModel.models.c.models.cuff.paths.p1.endAngle
    //         ).radians
    //       ) +
    //       boundaryModel.models.c.models.cuff.paths.p1.origin[1]
    //   ]
    // ]);

    const innerOptions = options[this.subModel.constructor.name] || {};
    innerOptions.boundaryModel = cuffModelInner.model;
    innerOptions.outerModel = cuffModel.model;

    const innerDesign = this.subModel.make(paper, innerOptions);
    if (innerDesign.outline) {
      const oldCuffOuter = cuffModel.model;

      cuffModel.model = cuffModel.model.unite(innerDesign.outline);

      // cuffOuter.remove();
      // cheap hack to fill in inner holes for some reason
      // cuffOuter = cuffOuter.unite(safeArea);

      oldCuffOuter.remove();
      if (!debug) {
        innerDesign.outline.remove();
      }
    }

    cuffModelInner.model.remove();

    /***** END DESIGN *****/

    return {
      outer: outerModel, 
      holes: rivetHoles,
      design: innerDesign.paths
    }
  }

  get metaParameters() {
    return [
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
        title: 'Wide Wrist Circumference',
        min: 4,
        max: 10,
        value: 7.4,
        step: 0.1,
        name: 'forearmCircumference'
      }),
      new RangeMetaParameter({
        title: 'Safe Border (in)',
        min: 0.1,
        max: 0.75,
        value: 0.25,
        step: 0.01,
        name: 'safeBorderWidth',
        target: '.design-params-row'
      })
    ];
  }
}
