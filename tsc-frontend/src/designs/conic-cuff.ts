import { makeConicSection } from "./conic-section";
import { RangeMetaParameter, MetaParameterType } from "../meta-parameter";
import { ModelMaker } from "../model";
import Angle from "./angle";

var makerjs = require("makerjs");

const MillimeterToInches = 0.0393701;
const RivetRadius = 2.5 * MillimeterToInches;

function makeEvenlySpacedBolts(numBolts, p1, p2) {
  var rivetHole = new makerjs.models.Oval(RivetRadius, RivetRadius);
  var rivetRow = null;

  // still don't love where these are centered
  rivetRow = makerjs.layout.cloneToRow(rivetHole, numBolts * 2 + 1);
  var leftBoltPath = new makerjs.paths.Line(p1, p2);
  var leftBolts = makerjs.layout.childrenOnPath(rivetRow, leftBoltPath, 0.85);

  for (const key in leftBolts["models"]) {
    if (Number(key) % 2 == 0) {
      delete leftBolts["models"][key];
    }
  }

  return leftBolts;
}

class ConicCuffOuterImpl {
  // implements MakerJs.IModel {
  public units = makerjs.unitType.Inch;
  public paths: MakerJs.IPathMap = {};
  public models: MakerJs.IModelMap = {};

  constructor(innerDesignClass: ModelMaker, options) {
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

    /***** START OVERALL CUFF SHAPE + INNER *****/
    // Actual outer cuff cut
    var cuffModel = makeConicSection({
      topCircumference: wristCircumference + 1.0,
      bottomCircumference: forearmCircumference + 1.0,
      height: height,
    //   filletRadius: 0.2
    });

    var filletedCuffModel = makeConicSection({
        topCircumference: wristCircumference + 1.0,
        bottomCircumference: forearmCircumference + 1.0,
        height: height,
        filletRadius: 0.2
      });
    delete filletedCuffModel.models.cuff;
    console.log(filletedCuffModel);

    // Inner "safe" area for design. Not actually printed. Used to calculate intersection of inner design.
    var cuffModelInner = makeConicSection({
      topCircumference: wristCircumference + 1.0,
      bottomCircumference: forearmCircumference + 1.0,
      height: height,
      widthOffset: 1.1,
      heightOffset: safeBorderWidth
    });

    var completeCuffModel = {
      models: {
        cuffModel: cuffModel,
        cuffModelInner: cuffModelInner,
        fillets: filletedCuffModel
      },
      paths: {}
    };
    /***** END OVERALL CUFF SHAPE + INNER *****/

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
    if (debug) {
        completeCuffModel.paths = completeCuffModel.paths || {};
        completeCuffModel.paths["leftBoltLine"] = new makerjs.paths.Line(
            boltGuideLine1P1,
            boltGuideLine1P2
        );
        completeCuffModel.paths["rightBoltLine"] = new makerjs.paths.Line(
            boltGuideLine2P1,
            boltGuideLine2P2
        );
    }

    const numBolts = Math.round(height);
    completeCuffModel.models["leftBolts"] = makeEvenlySpacedBolts(
      numBolts,
      boltGuideLine1P1,
      boltGuideLine1P2
    );
    completeCuffModel.models["rightBolts"] = makeEvenlySpacedBolts(
      numBolts,
      boltGuideLine2P1,
      boltGuideLine2P2
    );
    /***** END RIVET HOLES *****/

    /***** START RECENTER SHAPE *****/
    // Model is way far out, move it close to origin
    makerjs.model.rotate(completeCuffModel, 90 - cuffModel.alpha.degrees / 2);
    makerjs.model.zero(completeCuffModel);

    this.models = {
      completeCuffModel: completeCuffModel
    };
    /***** END RECENTER SHAPE *****/

    /***** START DESIGN *****/
    // Now make the design and clamp it to the inner/safe arc we built
    var bbox = makerjs.measure.modelExtents(completeCuffModel);
    var totalWidth = bbox.high[0] - bbox.low[0];
    var totalHeight = bbox.high[1] - bbox.low[1];

    // this is some insane terrible logic to preserve the recentering we did above
    // and just use the inner shape as the intersection clamp for our design
    makerjs.model.originate(completeCuffModel);

    var cuffClone = makerjs.model.clone(completeCuffModel);
    var cuffModelInnerClone = cuffClone.models.cuffModelInner;
    cuffClone.models = { c: cuffModelInnerClone };

    const boundaryModel = cuffClone;
    const safeCone = new makerjs.models.ConnectTheDots(true, [
      boundaryModel.models.c.models.cuff.paths.p1.origin,
      [
        20 *
          Math.cos(
            Angle.fromDegrees(
              boundaryModel.models.c.models.cuff.paths.p1.startAngle
            ).radians
          ) +
          boundaryModel.models.c.models.cuff.paths.p1.origin[0],
        20 *
          Math.sin(
            Angle.fromDegrees(
              boundaryModel.models.c.models.cuff.paths.p1.startAngle
            ).radians
          ) +
          boundaryModel.models.c.models.cuff.paths.p1.origin[1]
      ],
      [
        20 *
          Math.cos(
            Angle.fromDegrees(
              boundaryModel.models.c.models.cuff.paths.p1.endAngle
            ).radians
          ) +
          boundaryModel.models.c.models.cuff.paths.p1.origin[0],
        20 *
          Math.sin(
            Angle.fromDegrees(
              boundaryModel.models.c.models.cuff.paths.p1.endAngle
            ).radians
          ) +
          boundaryModel.models.c.models.cuff.paths.p1.origin[1]
      ]
    ]);

    const innerOptions = options[innerDesignClass.constructor.name] || {};
    innerOptions.height = totalHeight;
    innerOptions.width = totalWidth;
    innerOptions.boundaryModel = cuffClone;
    innerOptions.safeCone = safeCone;
    innerOptions.outerModel = {
      models: { c: makerjs.model.clone(completeCuffModel).models.cuffModel }
    };

    const innerDesign = innerDesignClass.make(innerOptions);

    this.models.design = innerDesign;

    if (innerDesign.models && innerDesign.models.outline) {
      this.models.completeCuffModel.models.cuffModel = makerjs.model.combineUnion(
        innerDesign.models.outline,
        this.models.completeCuffModel.models.cuffModel
      );
      innerDesign.models.outline = undefined;
      this.models.completeCuffModel.models.completeCuffModel = undefined;
      this.models.completeCuffModel.models.cuff = undefined;
      // this.models.completeCuffModel.models.cuffModel = undefined
    }

    /***** END DESIGN *****/

    /***** START CLEANUP *****/
    // now take out the original inner cuff model, not actually used as a cut
    if (!debug) {
      delete this.models.completeCuffModel.models.cuffModelInner;
    }
    /***** END CLEANUP *****/
  }
}

export class ConicCuffOuter implements ModelMaker {
  innerDesignClass: ModelMaker;
  options: Object;

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
        value: 7.75,
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

  constructor(innerDesignClass: ModelMaker) {
    this.innerDesignClass = innerDesignClass;
  }

  make(options): MakerJs.IModel {
    return new ConicCuffOuterImpl(this.innerDesignClass, options);
  }
}
