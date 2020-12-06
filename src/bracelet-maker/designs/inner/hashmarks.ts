// how do I make this not happen?
// http://localhost:8080/#/newPlayground/StraightCuffOuter/InnerDesignHashmarks?StraightCuffOuter.debug=false&StraightCuffOuter.height=2&StraightCuffOuter.wristCircumference=7&StraightCuffOuter.safeBorderWidth=0.25&StraightCuffOuter.forearmCircumference=7.4&InnerDesignHashmarks.seed=1&InnerDesignHashmarks.bufferWidth=0.01&InnerDesignHashmarks.hashWidth=0.525&InnerDesignHashmarks.initialNoiseRange1=3.8&InnerDesignHashmarks.initialNoiseRange2=0&InnerDesignHashmarks.noiseOffset1=0.01&InnerDesignHashmarks.noiseOffset2=0.41&InnerDesignHashmarks.noiseInfluence=1

import { MetaParameter, RangeMetaParameter } from "../../meta-parameter";
import { FastAbstractInnerDesign } from "./fast-abstract-inner-design";
export class InnerDesignHashmarks extends FastAbstractInnerDesign {
  makeDesign(paper: paper.PaperScope, params: any) {
    const {
      boundaryModel,
      outerModel,
      bufferWidth,
      hashWidth,
      initialNoiseRange1,
      initialNoiseRange2,
      noiseOffset1,
      noiseOffset2,
      noiseInfluence
    } = params;

    const height = outerModel.bounds.height;
    const width = outerModel.bounds.width;

    var lastNoise1 = this.simplex.noise2D(100, 10) * initialNoiseRange1;
    var lastNoise2 = this.simplex.noise2D(100.5, 10.5) * initialNoiseRange2;
    var paths = [];
    var pos = -width;
    var i = 0;

    const attractorDistance = params.attractorDistance;
    let attractorYPercentage = params.attractorYPercentage;
    let attractorYGrowRate = params.attractorYGrowRate;

    const megaBlockSize = 0.25;
    const megaBlockDistance = 0.5;

    const megaBlock = new paper.Path.Rectangle(
      boundaryModel.bounds.topLeft.add(
        new paper.Point(0, (boundaryModel.bounds.height - megaBlockSize) / 2)),
      boundaryModel.bounds.bottomRight.subtract(
          new paper.Point(0, (boundaryModel.bounds.height - megaBlockSize) / 2))
    )

    while (pos <= width) {
      var newNoise1 =
        (this.simplex.noise2D(i / 200, i / 300) + noiseOffset1) * noiseInfluence;
      var newNoise2 =
        (this.simplex.noise2D(i / 20, i / 30) + noiseOffset2) * noiseInfluence;
      i += 1;

      const leftLine = new paper.Path([
        new paper.Point(pos + lastNoise1 + newNoise1, 0),
        new paper.Point(pos + lastNoise2 + newNoise2, height)
      ]);
      let leftAnchorPoint = leftLine.getPointAt(leftLine.length * attractorYPercentage)
      leftAnchorPoint = leftAnchorPoint.add(new paper.Point(attractorDistance, 0))

      const rightLine = new paper.Path([
        new paper.Point(pos + lastNoise1 + newNoise1 + hashWidth, 0),
        new paper.Point(pos + lastNoise2 + newNoise2 + hashWidth, height)
      ]);
      let rightAnchorPoint = rightLine.getPointAt(rightLine.length * attractorYPercentage)
      rightAnchorPoint = rightAnchorPoint.add(new paper.Point(attractorDistance, 0))

      attractorYPercentage += attractorYGrowRate;

      if (attractorYPercentage >= 0.75 || attractorYPercentage <= 0.25) {
        attractorYGrowRate *= -1;
        attractorYPercentage += 2*attractorYGrowRate;
      }

      const path = new paper.Path([
        new paper.Point(pos + lastNoise1 + newNoise1, 0),
        leftAnchorPoint,
        new paper.Point(pos + lastNoise2 + newNoise2, height),
        new paper.Point(pos + lastNoise2 + newNoise2 + hashWidth, height),
        rightAnchorPoint,
        new paper.Point(pos + lastNoise1 + newNoise1 + hashWidth, 0)
      ]);
      path.closePath();

      // new paper.Path.Circle(new paper.Point(pos + lastNoise1 + newNoise1, 0), 0.1).fillColor='red';
      // new paper.Path.Circle(new paper.Point(pos + lastNoise2 + newNoise2, height), 0.1).fillColor='blue';
      // new paper.Path.Circle(new paper.Point(pos + lastNoise2 + newNoise2 + hashWidth, height), 0.1).fillColor='green';
      // new paper.Path.Circle(new paper.Point(pos + lastNoise1 + newNoise1 + hashWidth, 0), 0.1).fillColor='orange';

      // path.smooth({
      //   from: 0,
      //   to: 2,
      //   type: 'continuous'
      // })

      path.smooth({
        // from: 3,
        // to: 5,
        type: 'continuous'
      })

      // paths.push(path.subtract(megaBlock, {insert: false}));
      paths.push(path);
      lastNoise1 = lastNoise1 + newNoise1;
      lastNoise2 = lastNoise2 + newNoise2;
      pos += hashWidth + bufferWidth;
    }
    return Promise.resolve({paths});
  }

  get designMetaParameters() {
    return [
      new RangeMetaParameter({
        title: "Buffer Width",
        min: 0.075,
        max: 0.75,
        value: 0.15,
        step: 0.05,
        name: "bufferWidth",
        randMin: 0.1,
        randMax: 0.5,
      }),
      new RangeMetaParameter({
        title: "Hash Width",
        min: 0.075,
        max: 0.75,
        value: 0.25,
        step: 0.05,
        name: "hashWidth",
        randMin: 0.1,
        randMax: 0.4,
      }),
      new RangeMetaParameter({
        title: "Start Noise Coeff 1",
        min: 0,
        max: 20,
        step: 0.1,
        value: 10,
        randMin: 0,
        randMax: 20,
        name: "initialNoiseRange1"
      }),
      new RangeMetaParameter({
        title: "Start Noise Coeff 2",
        min: 0,
        max: 20,
        step: 0.1,
        value: 10,
        randMin: 0.1,
        randMax: 0.4,
        name: "initialNoiseRange2"
      }),
      new RangeMetaParameter({
        title: "Noise Offset 1",
        min: 0.01,
        max: 1,
        step: 0.1,
        value: 0.5,
        randMin: 0.1,
        randMax: 0.8,
        name: "noiseOffset1"
      }),
      new RangeMetaParameter({
        title: "Noise Offset 2",
        min: 0.01,
        max: 1,
        step: 0.1,
        value: 0.75,
        randMin: 0.1,
        randMax: 0.8,
        name: "noiseOffset2"
      }),
      new RangeMetaParameter({
        title: "Noise Influence",
        min: 0,
        max: 1,
        step: 0.01,
        value: 0.5,
        randMin: 0.1,
        randMax: 0.8,
        name: "noiseInfluence"
      }),

      new RangeMetaParameter({
        title: "Attractor Distance",
        min: 0.00,
        max: 5,
        step: 0.1,
        value: 2,
        randMin: 0.1,
        randMax: 4,
        name: "attractorDistance",
        group: "curve"
      }),
      new RangeMetaParameter({
        title: "Attractor Percentage Start",
        min: 0.25,
        max: 0.75,
        step: 0.01,
        value: 0.4,
        randMin: 0.25,
        randMax: 0.75,
        name: "attractorYPercentage",
        group: "curve"
      }),
      new RangeMetaParameter({
        title: "Attractor Change Rate",
        min: 0,
        max: 1,
        step: 0.01,
        value: 0.1,
        randMin: 0,
        randMax: 1,
        name: "attractorYGrowRate",
        group: "curve"
      })
    ];
  }
}