import { RangeMetaParameter, MetaParameterType } from "../meta-parameter";
import { ModelMaker } from "../model";

var makerjs = require("makerjs");
import {makeEvenlySpacedBolts, BeltHoleRadius, RivetRadius} from './design-utils'

class StraightCollarImpl {
  // implements MakerJs.IModel {
  public units = makerjs.unitType.Inch;
  public paths: MakerJs.IPathMap = {};
  public models: MakerJs.IModelMap = {};

  constructor(innerDesignClass: ModelMaker, options) {
    var {
      height,
      neckSize,
      safeBorderWidth,
      debug = false
    } = options["StraightCollar"];
    
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
    const holeDistance = 0.5
    const endPadding = 0.5;
    const holesAreaLength = (numHoles * holeDistance) + endPadding - BeltHoleRadius*2;
    
    const distanceToFirstBolts = 0.25;
    const distanceBetweenBolts = 0.378;
    const slotHeight = 0.125;
    const slotPadding = 0.5;
    const slotLength = 0.75;
    
    const slotAreaLength = (distanceToFirstBolts + distanceBetweenBolts*2 + slotPadding*2 + slotLength)
    
    const collarPadding = 4;
    const totalLength = neckSize + collarPadding;
    
    this.models.outerModel = new makerjs.models.Rectangle(
      totalLength, height
    )
    
    let curPos = 0;
    function makeTwoHolesAt(distance) {
      return makeEvenlySpacedBolts(2, [distance, 0], [distance, height])
    }
    
    function makeTwoHolesAtCurPos() {
      return makeTwoHolesAt(curPos);
    }

    // belt area
    curPos += distanceToFirstBolts;
    this.models.firstBolts = makeTwoHolesAtCurPos();
    curPos += distanceBetweenBolts;
    this.models.secondBolts = makeTwoHolesAtCurPos();
    curPos += slotPadding+slotHeight;
    this.models.slot = new makerjs.models.Slot(
      [curPos, height/2], [curPos+slotLength, height/2], slotHeight);
      
    curPos += slotLength + slotPadding;
    this.models.thirdBolts = makeTwoHolesAtCurPos();
    curPos += distanceBetweenBolts;
    this.models.fourthBolts = makeTwoHolesAtCurPos();
    curPos += RivetRadius*2;
    const beltAreaLength = curPos;
    
    // belt holes
    
    const holes = []
    for (let h = 0; h < numHoles; h++) {
      console.log(BeltHoleRadius);
      holes.push(
        makerjs.path.move(
          new makerjs.paths.Circle(BeltHoleRadius),
          [totalLength - endPadding - (holeDistance * h), height /2]
        )
      );
    }
    console.log(holes);
    this.models.holes = {paths: holes}
    
    const safeAreaPadding = 0.5;
    const safeArea = makerjs.model.move(
      new makerjs.models.Rectangle(totalLength - beltAreaLength - holesAreaLength - safeAreaPadding*2,
      height - safeBorderWidth*2),
      [beltAreaLength + safeAreaPadding,
       safeBorderWidth]
    );
    
    if (debug) {
     this.models.safeArea = safeArea;
    }
    // TODO
    // round belt end
    // round other belt end more
    // replace straight lines with arcs
    // make safe cone
    // get it to work with outlines
    
        const innerOptions = options[innerDesignClass.constructor.name] || {};
    innerOptions.height = height;
    innerOptions.width = totalLength;
    innerOptions.boundaryModel = makerjs.model.clone(safeArea);
    // innerOptions.safeCone = safeCone;
    innerOptions.outerModel = makerjs.model.clone(this.models.outerModel);

    const innerDesign = innerDesignClass.make(innerOptions);

    this.models.design = innerDesign;
    if (this.models && this.models.design && this.models.design.models.outline) {
      console.log('outline!!')
      this.models.outerModel = makerjs.model.combineUnion(
        this.models.outerModel,
        this.models.design.models.outline)
      delete this.models.design.models.outline;
    }
    console.log('???');
    console.log(innerDesign);

  }
}

export class StraightCollar implements ModelMaker {
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

  constructor(innerDesignClass: ModelMaker) {
    this.innerDesignClass = innerDesignClass;
  }

  make(options): MakerJs.IModel {
    return new StraightCollarImpl(this.innerDesignClass, options);
  }
}




