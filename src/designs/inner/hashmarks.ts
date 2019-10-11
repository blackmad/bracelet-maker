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
    while (pos <= width) {
      var newNoise1 =
        (this.simplex.noise2D(i / 200, i / 300) + noiseOffset1) * noiseInfluence;
      var newNoise2 =
        (this.simplex.noise2D(i / 20, i / 30) + noiseOffset2) * noiseInfluence;
      //   console.log(newNoise1);
      i += 1;
      const path = new paper.Path([
        new paper.Point(pos + lastNoise1 + newNoise1, 0),
        new paper.Point(pos + lastNoise2 + newNoise2, height),
        new paper.Point(pos + lastNoise2 + newNoise2 + hashWidth, height),
        new paper.Point(pos + lastNoise1 + newNoise1 + hashWidth, 0)
      ]);

      paths.push(path);
      lastNoise1 = lastNoise1 + newNoise1;
      lastNoise2 = lastNoise2 + newNoise2;
      pos += hashWidth + bufferWidth;
    }
    return paths;
  }

  get designMetaParameters(): Array<MetaParameter> {
    return [
      new RangeMetaParameter({
        title: "Buffer Width",
        min: 0.075,
        max: 0.75,
        value: 0.15,
        step: 0.05,
        name: "bufferWidth"
      }),
      new RangeMetaParameter({
        title: "Hash Width",
        min: 0.075,
        max: 0.75,
        value: 0.25,
        step: 0.05,
        name: "hashWidth"
      }),
      new RangeMetaParameter({
        title: "Start Noise Coeff 1",
        min: 0,
        max: 20,
        step: 0.1,
        value: 10,
        name: "initialNoiseRange1"
      }),
      new RangeMetaParameter({
        title: "Start Noise Coeff 2",
        min: 0,
        max: 20,
        step: 0.1,
        value: 10,
        name: "initialNoiseRange2"
      }),
      new RangeMetaParameter({
        title: "Noise Offset 1",
        min: 0.01,
        max: 1,
        step: 0.1,
        value: 0.5,
        name: "noiseOffset1"
      }),
      new RangeMetaParameter({
        title: "Noise Offset 2",
        min: 0.01,
        max: 1,
        step: 0.1,
        value: 0.75,
        name: "noiseOffset2"
      }),
      new RangeMetaParameter({
        title: "Noise Influence",
        min: 0,
        max: 1,
        step: 0.01,
        value: 0.5,
        name: "noiseInfluence"
      })
    ];
  }
}