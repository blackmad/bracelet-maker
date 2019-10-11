import { makeConicSection } from "./conic-section";
import { RangeMetaParameter } from "../../meta-parameter";
import { PaperModelMaker } from '../../model-maker';
import Angle from "../../utils/angle";
import {makeEvenlySpacedBolts} from '../design-utils';

import * as paper from 'paper';

export class ConicCuffOuter implements PaperModelMaker {
  constructor(public innerDesignClass: any) {}

  addRivetHoles(cuffModel, cuffModelInner) {
    /***** START RIVET HOLES *****/
    const boltGuideLine1P1 = [
      cuffModel.shortRadius * Math.cos(cuffModelInner.widthOffset.radians / 2),
      cuffModel.shortRadius * Math.sin(cuffModelInner.widthOffset.radians / 2)
    ];
    const boltGuideLine1P2 = [
      cuffModel.longRadius * Math.cos(cuffModelInner.widthOffset.radians / 2),
      cuffModel.longRadius * Math.sin(cuffModelInner.widthOffset.radians / 2)
    ];
    const boltGuideLine2P1 = [
      cuffModel.longRadius *
        Math.cos(
          cuffModel.alpha.radians - cuffModelInner.widthOffset.radians / 2
        ),
      cuffModel.longRadius *
        Math.sin(
          cuffModel.alpha.radians - cuffModelInner.widthOffset.radians / 2
        )
    ];
    const boltGuideLine2P2 = [
      cuffModel.shortRadius *
        Math.cos(
          cuffModel.alpha.radians - cuffModelInner.widthOffset.radians / 2
        ),
      cuffModel.shortRadius *
        Math.sin(
          cuffModel.alpha.radians - cuffModelInner.widthOffset.radians / 2
        )
    ];

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

    const numBolts = Math.round(cuffModel.bounds.height);
    const leftBolts = makeEvenlySpacedBolts(
      numBolts,
      boltGuideLine1P1,
      boltGuideLine1P2
    );
    const rightBolts = makeEvenlySpacedBolts(
      numBolts,
      boltGuideLine2P1,
      boltGuideLine2P2
    );
    return [...leftBolts, ...rightBolts]
    /***** END RIVET HOLES *****/

  }

  make(scope, options) {
    var {
      height,
      wristCircumference,
      forearmCircumference,
      safeBorderWidth
    } = options["ConicCuffOuter"];

    if (wristCircumference > forearmCircumference) {
      throw `wristCircumference ${wristCircumference} must be less than forearmCircumference ${forearmCircumference}`;
    }

    if (forearmCircumference - wristCircumference < 0.05) {
      forearmCircumference += 0.05;
    }

    const debug = false;

    var cuffModel = makeConicSection({
        topCircumference: wristCircumference + 1.0,
        bottomCircumference: forearmCircumference + 1.0,
        height: height,
        filletRadius: 0.2
      });
    console.log(cuffModel);
    cuffModel.model.translate(new paper.Point(
      -cuffModel.model.bounds.x,
      -cuffModel.model.bounds.y));

    var cuffModelInner = makeConicSection({
      topCircumference: wristCircumference + 1.0,
      bottomCircumference: forearmCircumference + 1.0,
      height: height,
      widthOffset: 1.1,
      heightOffset: safeBorderWidth
    });
    // cuffModelInner.model.remove();
    cuffModelInner.model.strokeWidth = 0.05;
    cuffModelInner.model.strokeColor = 'green';


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
    innerOptions.boundaryModel = cuffModel.model;
    innerOptions.outerModel = cuffModel.model;

    const innerDesign = this.innerDesignClass.make(scope, innerOptions);

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

    const allHoles = []
    console.log(cuffModel)
    const path = new paper.CompoundPath({
      // children: [cuffOuter],
      children: [cuffModel.model, ...allHoles, ...innerDesign.paths],
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
        title: "Wide Wrist Circumference",
        min: 4,
        max: 10,
        value: 7.4,
        step: 0.1,
        name: "forearmCircumference"
      }),
      new RangeMetaParameter({
        title: "Safe Border (in)",
        min: 0.1,
        max: 0.75,
        value: 0.25,
        step: 0.01,
        name: "safeBorderWidth"
      })
    ];
  }
}
