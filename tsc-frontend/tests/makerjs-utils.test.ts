import { MakerJsUtils } from '../src/makerjs-utils'
import { expect } from 'chai';
import 'mocha';
var makerjs = require('makerjs');

describe('checkCircleCircleIntersection', () => {
  it('should return true on overlap', () => {
    const c1 = new makerjs.paths.Circle([0, 0], 1);
    const c2 = new makerjs.paths.Circle([0.5, 0.5], 1);
    const result = MakerJsUtils.checkCircleCircleIntersection(c1, c2);
    expect(result).to.equal(true);
  });

  it('should return true on touching', () => {
    const c1 = new makerjs.paths.Circle([0, 0], 1);
    const c2 = new makerjs.paths.Circle([1, 1], 1);
    const result = MakerJsUtils.checkCircleCircleIntersection(c1, c2);
    expect(result).to.equal(true);
  });

  it('should return false on no overlap', () => {
    const c1 = new makerjs.paths.Circle([0, 0], 1);
    const c2 = new makerjs.paths.Circle([10, 10], 1);
    const result = MakerJsUtils.checkCircleCircleIntersection(c1, c2);
    expect(result).to.equal(false);
  });
});

describe('checkPathIntersectsModel', () => {
  it('should return true on intersection', () => {
    const model = new makerjs.models.Rectangle(100, 100);
    const circle = new makerjs.paths.Circle([0, 0], 1);
    const result = MakerJsUtils.checkPathIntersectsModel(circle, model);
    expect(result).to.equal(true);
  });

  it('should return false on no intersection', () => {
    const model = new makerjs.models.Rectangle(100, 100);
    const circle = new makerjs.paths.Circle([-2, -2], 1);
    const result = MakerJsUtils.checkPathIntersectsModel(circle, model);
    expect(result).to.equal(false);
  });

  it('should return true on arc/circle intersection', () => {
    const circle = new makerjs.paths.Circle([0, 0], 1);
    const arc = new makerjs.paths.Arc([0, 0], [0, 2], 1);
    const model = {
      paths: {'arc': arc}
    }

    const result = MakerJsUtils.checkPathIntersectsModel(circle, <MakerJs.IModel>model);
    expect(result).to.equal(true);
  })
});
