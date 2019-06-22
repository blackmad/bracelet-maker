var makerjs = require('makerjs');

interface ShapeMakerShape {
    (sizeX: number, sizeY: number): MakerJs.IModel;
}

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
        return ShapeMaker.models.map(m => m.name);
    }

    static get models(): Array<ShapeMakerShape> {
        return [
            makerjs.models.Rectangle,
            makerjs.models.Ellipse,
            makerjs.models.Oval,
            FiveStar,
            SixPolygon,
            RoundRectangle
        ]
    }

    static findModel(name: string) {
        const model = ShapeMaker.models.find(m => m.name == name);
        return model;
    }

    static makeShape(name: string, sizeX: number, sizeY: number) {
        const maker = ShapeMaker.findModel(name);
        return Reflect.construct(maker, [sizeX, sizeY]);
    }
}