import { RangeMetaParameter, MetaParameterType } from '../../meta-parameter';
import * as _ from 'lodash';
import {
  makeEvenlySpacedBolts,
  BeltHoleRadius,
  RivetRadius
} from '../design-utils';

import { PaperModelMaker } from '../../model-maker';

export class StraightCollarOuter implements PaperModelMaker {
  constructor(public innerDesignClass: any) {}

  controlInfo = "Measure your neck with a sewing tape measure.<br/>If you don't have one handy, 13.5 inches is usually a good size for a cis woman, and 15 inches for a cis man. Don't worry, this pattern generates extra length.<br/>Note that a straight collar taller than about 2 inches will not be very comfortable."

  make(paper: paper.PaperScope, options): paper.PathItem[] {
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

    const distanceToFirstBolts = 0.5;
    const distanceBetweenBolts = 0.378;
    const slotHeight = 0.125;
    const slotPadding = 0.5;
    const slotLength = 0.75;

    const collarPadding = 4;
    const totalLength = neckSize + collarPadding;

    const models: any = {};

    // @ts-ignore
    let outerModel = new paper.Path.Rectangle(
      // @ts-ignore
      new paper.Rectangle(0, 0, totalLength, height),
      height/2
    );

    let curPos = 0;
    function makeTwoHolesAt(distance) {
      return makeEvenlySpacedBolts(paper, 2, [distance, 0], [distance, height]);
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
    models.slot = new paper.Path.Rectangle(
      new paper.Rectangle(
        new paper.Point(curPos, height / 2 - slotHeight),
        new paper.Point(curPos + slotLength, height / 2 + slotHeight)
      ),
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
        new paper.Path.Circle(
          new paper.Point(
            totalLength - endPadding - holeDistance * h,
            height / 2
          ),
          BeltHoleRadius
        )
      );
    }
    models.holes = holes;

    const safeAreaPadding = 0.5;
    const safeAreaLength =
      totalLength - beltAreaLength - holesAreaLength - safeAreaPadding * 2;
    const safeArea = new paper.Path.Rectangle(
      new paper.Rectangle(
        beltAreaLength + safeAreaPadding,
        safeBorderWidth,
        safeAreaLength,
        height - safeBorderWidth * 2
      )
    );
    safeArea.remove();

    const safeCone = new paper.Path.Rectangle(
      new paper.Rectangle(
        beltAreaLength + safeAreaPadding,
        -height * 2,
        safeAreaLength,
        height * 4
      )
    );
    safeCone.remove();

    // TODO
    // round belt end
    // round other belt end more
    // get it to work with outlines

    const innerOptions = options[this.innerDesignClass.constructor.name] || {};
    innerOptions.height = height;
    innerOptions.width = totalLength;
    innerOptions.boundaryModel = safeArea;
    innerOptions.safeCone = safeCone;
    innerOptions.outerModel = outerModel;

    const innerDesign = this.innerDesignClass.make(paper, innerOptions);
    // if (models && models.design && models.design.models.outline) {
    //   console.log("outline!!");
    //   console.log("outline:", models.design.models.outline);
    //   models.outerModel = makerjs.model.combineUnion(
    //     models.outerModel,
    //     models.design.models.outline
    //   );
    //   // delete models.design.models.outline
    // }

    let allHoles = [];
    _.forEach(models, (v, k) => allHoles.push(v));
    allHoles = _.flatten(allHoles);

    const path = new paper.CompoundPath({
      children: [outerModel, ...allHoles, ...innerDesign.paths],
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
        title: 'Neck Size',
        min: 8,
        max: 18,
        value: 13,
        step: 0.1,
        name: 'neckSize'
      }),
      new RangeMetaParameter({
        title: 'Safe Border Width',
        min: 0.1,
        max: 0.25,
        value: 0.1,
        step: 0.01,
        name: 'safeBorderWidth'
      })
    ];
  }
}
