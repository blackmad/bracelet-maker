import * as _ from 'lodash';
class Ellipse {
    makeShape(paper, width, height) {
        return new paper.Path.Ellipse(new paper.Rectangle(0, 0, width, height));
    }
}
class Rectangle {
    makeShape(paper, width, height) {
        return new paper.Path.Rectangle(new paper.Rectangle(0, 0, width, height));
    }
}
class RegularPolygonMaker {
    static makeRegularPolygon(paper, width, height, sides) {
        const scale = width / height;
        const shape = new paper.Path.RegularPolygon(new paper.Point(0, 0), sides, width);
        shape.scale(1, scale);
        return shape;
    }
}
class Triangle {
    makeShape(paper, width, height) {
        return RegularPolygonMaker.makeRegularPolygon(paper, width, height, 3);
    }
}
class RightTriangle {
    makeShape(paper, width, height) {
        return new paper.Path([
            new paper.Point(0, 0),
            new paper.Point(0, width),
            new paper.Point(height, 0),
            new paper.Point(0, 0)
        ]);
    }
}
class Pentagon {
    makeShape(paper, width, height) {
        return RegularPolygonMaker.makeRegularPolygon(paper, width, height, 5);
    }
}
class Hexagon {
    makeShape(paper, width, height) {
        return RegularPolygonMaker.makeRegularPolygon(paper, width, height, 6);
    }
}
export class ShapeMaker {
    static makeShape(paper, shapeName, width, height) {
        const maker = _.find(this.models, (s) => (s.name == shapeName));
        return (new maker()).makeShape(paper, width, height);
    }
}
ShapeMaker.models = [
    Ellipse,
    Triangle,
    RightTriangle,
    Rectangle,
    Pentagon,
    Hexagon
];
ShapeMaker.modelNames = ShapeMaker.models.map((m) => m.name);
//# sourceMappingURL=shape-maker.js.map