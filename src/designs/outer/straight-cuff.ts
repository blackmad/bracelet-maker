import { makeConicSection } from "./conic-section";
import { RangeMetaParameter, OnOffMetaParameter, MetaParameterType } from "../../meta-parameter";
import { ModelMaker } from "../../model-maker";
import Angle from "../../utils/angle";
import {makeEvenlySpacedBolts} from '../design-utils';

var makerjs = require("makerjs");

export class RectToConicSection {
  static projectRectToCone({
    topWidth,
    bottomWidth,
    height
  }) {
    const maxWidth = Math.max(topWidth, bottomWidth)
    var conicModel = makeConicSection({
      topCircumference: topWidth,
      bottomCircumference: bottomWidth,
      height: height
    });

    const arcs = [];
    const walkOptions = {
      onPath: function(wp) {
        if (wp.pathContext.type === "arc") {
          arcs.push(wp.pathContext);
        }
      }
    };

    makerjs.model.walk(conicModel, walkOptions);

    const startArc = arcs[0];
    const endArc = arcs[1];

    console.log(startArc);
    console.log(endArc);

    function translatePoint(x, y) {
      const unitY = y / height;
      const radius =
        startArc.radius +
        Math.abs(startArc.radius - endArc.radius) * unitY;

      const tmpConicModel = makeConicSection({
        topCircumference: radius,
        bottomCircumference: bottomWidth,
        height: y
      });

      const unitX = x / maxWidth;
      const alpha = tmpConicModel['alpha'].radians * unitX;
      const newY = radius * Math.sin(alpha)
      const newX = radius * Math.cos(alpha);
      return [newX, newY];
    }
  }
}

export class StraightCuffOuter implements ModelMaker {
  make(options): MakerJs.IModel {
    var {
      height,
      wristCircumference,
      safeBorderWidth,
      debug
    } = options["StraightCuffOuter"];

    const bottomPadding = 1.0;
    const topPadding = 0.8;
    const totalWidth = wristCircumference + bottomPadding * 2;

    const cuffOuter = new makerjs.models.ConnectTheDots(true, [
      [0, 0],
      [bottomPadding - topPadding, height],
      [bottomPadding + wristCircumference + topPadding, height],
      [totalWidth, 0]
    ]);

    const cuffChain = makerjs.model.findSingleChain(cuffOuter);
    const fillet = makerjs.chain.fillet(cuffChain, 0.3);

    const safeAreaPadding = 0.5;
    const safeAreaLength = wristCircumference;
    const safeArea = makerjs.model.move(
      new makerjs.models.Rectangle(
        safeAreaLength,
        height - safeBorderWidth * 2
      ),
      [bottomPadding, safeBorderWidth]
    );

    const safeCone = makerjs.model.move(
      new makerjs.models.Rectangle(safeAreaLength, height * 4),
      [bottomPadding, -height * 2]
    );
    console.log(safeArea);

    // cuffOuter.layer = 'outer';
    const models = {
      cuff: cuffOuter,
      fillet: fillet
    }

    const innerOptions = options[this.innerDesignClass.constructor.name] || {};
    innerOptions.height = height;
    innerOptions.width = totalWidth;
    innerOptions.boundaryModel = makerjs.model.clone(safeArea);
    innerOptions.safeCone = safeCone;
    innerOptions.outerModel = makerjs.model.clone(cuffOuter);

    const innerDesign = this.innerDesignClass.make(innerOptions);

    innerDesign.layer = "inner"
    models['design'] = innerDesign;

    if (debug) {
      // console.log(safeCone);
      // safeCone.layer = 'brightpink';
      // models['safeCone'] = safeCone;

      // console.log(safeArea);
      // safeArea.layer = 'orange';
      // models['safeArea'] = safeArea;
    }

    if (innerDesign.models && innerDesign.models.outline) {
      // console.log(innerDesign.models.outline);
      // if (debug) {
      //   innerDesign.models.outline.layer = 'red';
      //   models['outline'] = innerDesign.models.outline;
      // } else {
      //  // delete innerDesign.models.outline;
      // }
      
      // models.cuff = makerjs.model.combineUnion(
      //   innerDesign.models.outline,
      //   models.cuff
      // );

      // console.log(models.cuff)

      // const cuffChain = makerjs.model.findChains({models: {
      //   cuff: models.cuff,
      //   outline: innerDesign.models.outline
      // }})[0];
      // models.cuff = makerjs.chain.toNewModel(cuffChain)
      // console.log(models.cuff)

      // models.cuff.layer = 'outer'
      // console.log(models.cuff)

      delete innerDesign.models.outline
    }

    /***** END DESIGN *****/

    console.log(models);

    return {
      models: models,
      units: makerjs.unitType.Inch
    }
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
      }),
    ];
  }

  constructor(public innerDesignClass: ModelMaker) {
  }
}
