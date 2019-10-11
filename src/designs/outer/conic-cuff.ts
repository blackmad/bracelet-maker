import { makeConicSection } from './conic-section';
import { RangeMetaParameter } from '../../meta-parameter';
import { PaperModelMaker } from '../../model-maker';
import { makeEvenlySpacedBolts } from '../design-utils';

export class ConicCuffOuter implements PaperModelMaker {
  constructor(public innerDesignClass: any) {}

  addRivetHoles(paper: paper.PaperScope, height, cuffModel, cuffModelInner) {
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

    /***** throw in some debugging *****/
    // if (debug) {
    //     completeCuffModel.paths = completeCuffModel.paths || {};
    //     completeCuffModel.paths["leftBoltLine"] = new makerjs.paths.Line(
    //         boltGuideLine1P1,
    //         boltGuideLine1P2
    //     );
    //     completeCuffModel.paths["rightBoltLine"] = new makerjs.paths.Line(
    //         boltGuideLine2P1,
    //         boltGuideLine2P2
    //     );
    // }

    const numBolts = Math.round(height);
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

  make(paper: paper.PaperScope, options) {
    var {
      height,
      wristCircumference,
      forearmCircumference,
      safeBorderWidth
    } = options['ConicCuffOuter'];

    if (wristCircumference > forearmCircumference) {
      throw `wristCircumference ${wristCircumference} must be less than forearmCircumference ${forearmCircumference}`;
    }

    if (forearmCircumference - wristCircumference < 0.05) {
      forearmCircumference += 0.05;
    }

    const debug = false;

    var cuffModel = makeConicSection({
      paper,
      topCircumference: wristCircumference + 1.0,
      bottomCircumference: forearmCircumference + 1.0,
      height: height,
      filletRadius: 0.2
    });
    console.log(cuffModel);
    const toTranslateX = cuffModel.model.bounds.x;
    const toTranslateY = cuffModel.model.bounds.y;

    var cuffModelInner = makeConicSection({
      paper,
      topCircumference: wristCircumference + 1.0,
      bottomCircumference: forearmCircumference + 1.0,
      height: height,
      widthOffset: 1.1,
      heightOffset: safeBorderWidth
    });
    cuffModelInner.model.remove();

    const rivetHoles = this.addRivetHoles(
      paper,
      height,
      cuffModel,
      cuffModelInner
    );
    console.log(rivetHoles);
    cuffModel.model.remove();
    cuffModel.model = new paper.CompoundPath({
      children: [cuffModel.model, ...rivetHoles]
    });

    cuffModel.model.translate(new paper.Point(-toTranslateX, -toTranslateY));
    cuffModelInner.model.translate(
      new paper.Point(-toTranslateX, -toTranslateY)
    );

    cuffModel.model.rotate(90 - cuffModel.alpha.degrees / 2);
    cuffModelInner.model.rotate(90 - cuffModel.alpha.degrees / 2);

    const toTranslateX2 = cuffModel.model.bounds.x;
    const toTranslateY2 = cuffModel.model.bounds.y;
    cuffModel.model.translate(new paper.Point(-toTranslateX2, -toTranslateY2));
    cuffModelInner.model.translate(
      new paper.Point(-toTranslateX2, -toTranslateY2 + safeBorderWidth)
    );

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

    const innerOptions = options[this.innerDesignClass.constructor.name] || {};
    innerOptions.boundaryModel = cuffModelInner.model;
    innerOptions.outerModel = cuffModel.model;

    const innerDesign = this.innerDesignClass.make(paper, innerOptions);

    // if (innerDesign.models && innerDesign.models.outline) {
    //   models.completeCuffModel.models.cuffModel = makerjs.model.combineUnion(
    //     innerDesign.models.outline,
    //     models.completeCuffModel.models.cuffModel
    //   );
    //   models.completeCuffModel.layer = 'outer'
    //   innerDesign.models.outline = undefined;
    //   models.completeCuffModel.models.completeCuffModel = undefined;
    //   models.completeCuffModel.models.cuff = undefined;
    //   // models.completeCuffModel.models.cuffModel = undefined
    // }

    /***** END DESIGN *****/

    console.log(cuffModel);
    const path = new paper.CompoundPath({
      children: [cuffModel.model, ...innerDesign.paths],
      strokeColor: 'red',
      strokeWidth: '0.005',
      fillColor: 'lightgrey',
      fillRule: 'evenodd'
    });
    return [path];
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
        name: 'safeBorderWidth'
      })
    ];
  }
}
