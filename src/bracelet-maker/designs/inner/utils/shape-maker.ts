import * as _ from 'lodash';

export interface ShapeMakerIface {
  makeShape(paper: paper.PaperScope, width: number, height: number): paper.Path;
}

export class Ellipse implements ShapeMakerIface {
  makeShape(paper: paper.PaperScope, width: number, height: number): paper.Path {
    return new paper.Path.Ellipse(
      new paper.Rectangle(0, 0, width, height)
    );
}}

export class Rectangle implements ShapeMakerIface {
  makeShape(paper: paper.PaperScope, width: number, height: number): paper.Path {
    return new paper.Path.Rectangle(
      new paper.Rectangle(0, 0, width, height)
    );
}}

export class RegularPolygonMaker {
  static makeRegularPolygon(paper: paper.PaperScope, width: number, height: number, sides: number): paper.Path {
    const scale = width / height;
    const shape = new paper.Path.RegularPolygon(new paper.Point(0,0), sides, width);
    shape.scale(1, scale);
    return shape
}}

export class Triangle implements ShapeMakerIface {
  makeShape(paper: paper.PaperScope, width: number, height: number): paper.Path {
    return RegularPolygonMaker.makeRegularPolygon(paper, width, height, 3);
}}

export class RightTriangle implements ShapeMakerIface {
  makeShape(paper: paper.PaperScope, width: number, height: number): paper.Path {
    return new paper.Path([
      new paper.Point(0, 0),
      new paper.Point(0, width),
      new paper.Point(height, 0),
      new paper.Point(0, 0)
    ])
  }
}


export class Pentagon implements ShapeMakerIface {
  makeShape(paper: paper.PaperScope, width: number, height: number): paper.Path {
    return RegularPolygonMaker.makeRegularPolygon(paper, width, height, 5);
}}

export class Hexagon implements ShapeMakerIface {
  makeShape(paper: paper.PaperScope, width: number, height: number): paper.Path {
    return RegularPolygonMaker.makeRegularPolygon(paper, width, height, 6);
}}

export class ShapeMaker {
  static models = [
    Ellipse,
    Triangle,
    RightTriangle,
    Rectangle,
    Pentagon,
    Hexagon
  ]

  static modelNames = ShapeMaker.models.map((m) => m.name);

  static makeShape(paper, shapeName, width, height): paper.Path {
    const maker = _.find(this.models, (s) => (s.name == shapeName));
    return (new maker()).makeShape(paper, width, height)
  }
}