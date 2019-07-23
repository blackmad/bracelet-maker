import { MakerJsUtils } from '../src/utils/makerjs-utils'
import { expect } from 'chai';
import 'mocha';
import * as _ from 'lodash';
import paper = require('paper');
import { pickPointOnRectEdge } from '../src/utils/paperjs-utils';
var makerjs = require('makerjs');

// @ts-ignore
paper.setup(); // creates a new project
// paper.setup([100, 100]); // this also works for some width, height

describe('pickPointOnRectEdge', () => {
  it('should do something', () => {
    const c2 = new paper.Path.Circle(new paper.Point(0,0,), 20)
    console.log(pickPointOnRectEdge(c2.bounds, Math.random))
    console.log(pickPointOnRectEdge(c2.bounds, Math.random))
    console.log(pickPointOnRectEdge(c2.bounds, Math.random))
    console.log(pickPointOnRectEdge(c2.bounds, Math.random))
    console.log(pickPointOnRectEdge(c2.bounds, Math.random))
  });
})