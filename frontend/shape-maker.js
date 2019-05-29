var makerjs = require('makerjs');

function Circle(sizeX, sizeY) {
    return {paths: new makerjs.paths.Circle(sizeX)};
}

function FiveStar(sizeX, sizeY) {
    return new makerjs.models.Star(5, sizeX, sizeY);
}

function SixPolygon(sizeX, sizeY) {
    return new makerjs.models.Polygon(6, sizeX);
}

function Slot(sizeX, sizeY) {
    return new makerjs.models.Slot([0, 0], [sizeX, sizeY], 12);
}

function RoundRectangle(sizeX, sizeY) {
    return new makerjs.models.RoundRectangle(sizeX, sizeY, 5);
}

export class ShapeMaker {
    static get modelNames() {
        return _.map(ShapeMaker.models, (m) => m.name);
    }

    static get models() {
        return [
            makerjs.models.Rectangle,
            makerjs.models.Ellipse,
            makerjs.models.Oval,
            FiveStar,
            SixPolygon,
            RoundRectangle
        ]
    }

    static findModel(name) {
        const model = _.find(ShapeMaker.models, function(m) { return m.name == name });
        return model;
    }

    static makeShape(name, sizeX, sizeY) {
        const maker = ShapeMaker.findModel(name);
        return Reflect.construct(maker, [sizeX, sizeY]);
    }
}

export function makeShape(name, sizeX, sizeY) {
    const maker = ShapeMaker(name);
    return Reflect.construct(maker, [sizeX, sizeY]);
}