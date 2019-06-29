import { RangeMetaParameter, MetaParameterType } from "../../meta-parameter";
import { ModelMaker } from "../../model-maker";
import {
  makeEvenlySpacedBolts,
  BeltHoleRadius,
  RivetRadius
} from "../design-utils";

var makerjs = require("makerjs");

export class StraightCollarOuter implements ModelMaker {
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
        title: "Neck Size",
        min: 8,
        max: 18,
        value: 13,
        step: 0.1,
        name: "neckSize"
      }),
      new RangeMetaParameter({
        title: "Safe Border Width",
        min: 0.1,
        max: 0.25,
        value: 0.1,
        step: 0.01,
        name: "safeBorderWidth"
      })
    ];
  }

  constructor(public innerDesignClass: ModelMaker) {}

  make(options): MakerJs.IModel {
    var { height, neckSize, safeBorderWidth, debug = false } = options[
      this.constructor.name
    ];

    // quarter inch, two bolts
    // quarter inch, two bolts
    // quarter inch, inch long slot
    // quarter inch, two bolts,
    // quarter inch, two bolts
    // start safe area
    // go for length - belt area - 3 inches
    // 3 inches of holes every 0.5 inches

    const safeAreaXPadding = 0.25;

    const numHoles = 6;
    const holeDistance = 0.5;
    const endPadding = 0.5;
    const holesAreaLength =
      numHoles * holeDistance + endPadding - BeltHoleRadius * 2;

    const distanceToFirstBolts = 0.25;
    const distanceBetweenBolts = 0.378;
    const slotHeight = 0.125;
    const slotPadding = 0.5;
    const slotLength = 0.75;

    const slotAreaLength =
      distanceToFirstBolts +
      distanceBetweenBolts * 2 +
      slotPadding * 2 +
      slotLength;

    const collarPadding = 4;
    const totalLength = neckSize + collarPadding;

    const models: any = {};

    models["outerModel"] = new makerjs.models.Rectangle(totalLength, height);

    let curPos = 0;
    function makeTwoHolesAt(distance) {
      return makeEvenlySpacedBolts(2, [distance, 0], [distance, height]);
    }

    function makeTwoHolesAtCurPos() {
      return makeTwoHolesAt(curPos);
    }

    // belt area
    curPos += distanceToFirstBolts;
    models.firstBolts = makeTwoHolesAtCurPos();
    curPos += distanceBetweenBolts;
    models.secondBolts = makeTwoHolesAtCurPos();
    curPos += slotPadding + slotHeight;
    models.slot = new makerjs.models.Slot(
      [curPos, height / 2],
      [curPos + slotLength, height / 2],
      slotHeight
    );

    curPos += slotLength + slotPadding;
    models.thirdBolts = makeTwoHolesAtCurPos();
    curPos += distanceBetweenBolts;
    models.fourthBolts = makeTwoHolesAtCurPos();
    curPos += RivetRadius * 2;
    const beltAreaLength = curPos;

    // belt holes

    const holes = [];
    for (let h = 0; h < numHoles; h++) {
      holes.push(
        makerjs.path.move(new makerjs.paths.Circle(BeltHoleRadius), [
          totalLength - endPadding - holeDistance * h,
          height / 2
        ])
      );
    }
    models.holes = { paths: holes };

    const safeAreaPadding = 0.5;
    const safeAreaLength =
      totalLength - beltAreaLength - holesAreaLength - safeAreaPadding * 2;
    const safeArea = makerjs.model.move(
      new makerjs.models.Rectangle(
        safeAreaLength,
        height - safeBorderWidth * 2
      ),
      [beltAreaLength + safeAreaPadding, safeBorderWidth]
    );

    const safeCone = makerjs.model.move(
      new makerjs.models.Rectangle(safeAreaLength, height * 4),
      [beltAreaLength + safeAreaPadding, -height * 2]
    );

    if (debug) {
      models.safeArea = safeArea;
    }

    // TODO
    // round belt end
    // round other belt end more
    // replace straight lines with arcs
    // make safe cone
    // get it to work with outlines

    const innerOptions = options[this.innerDesignClass.constructor.name] || {};
    innerOptions.height = height;
    innerOptions.width = totalLength;
    innerOptions.boundaryModel = makerjs.model.clone(safeArea);
    innerOptions.safeCone = safeCone;
    innerOptions.outerModel = makerjs.model.clone(models.outerModel);

    const innerDesign = this.innerDesignClass.make(innerOptions);

    models.design = innerDesign;
    if (models && models.design && models.design.models.outline) {
      console.log("outline!!");
      console.log("outline:", models.design.models.outline);
      models.outerModel = makerjs.model.combineUnion(
        models.outerModel,
        models.design.models.outline
      );
      // delete models.design.models.outline
    }

    return { models: models, units: makerjs.unitType.Inch };
  }
}
