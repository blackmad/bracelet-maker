export function $(context: any): any;
export class Collector {
    constructor(comparer: any);
    comparer: any;
    collections: any;
    addItemToCollection(key: any, item: any): void;
    findCollection(key: any, action: any): any;
    getCollectionsOfMultiple(cb: any): void;
    removeCollection(key: any): any;
    removeItemFromCollection(key: any, item: any): any;
}
export class PointGraph {
    forEachPoint(cb: any): void;
    getElementAtPoint(p: any): any;
    getIdOfPoint(p: any): any;
    insertValue(value: any): any;
    insertValueIdAtPoint(valueId: any, p: any): any;
    mergeIndexElements(keep: any, remove: any): any;
    mergeNearestSinglePoints(withinDistance: any): void;
    mergePoints(withinDistance: any): void;
    reset(): void;
}
export namespace angle {
    function mirror(angleInDegrees: any, mirrorX: any, mirrorY: any): any;
    function noRevolutions(angleInDegrees: any): any;
    function ofArcEnd(arc: any): any;
    function ofArcMiddle(arc: any, ratio: any): any;
    function ofArcSpan(arc: any): any;
    function ofChainLinkJoint(linkA: any, linkB: any, ...args: any[]): any;
    function ofLineInDegrees(line: any): any;
    function ofPointInDegrees(origin: any, pointToFindAngle: any): any;
    function ofPointInRadians(origin: any, pointToFindAngle: any): any;
    function toDegrees(angleInRadians: any): any;
    function toRadians(angleInDegrees: any): any;
}
export namespace chain {
    function cycle(chainContext: any, amount: any): any;
    function dogbone(chainToFillet: any, filletSpec: any): any;
    function fillet(chainToFillet: any, filletSpec: any): any;
    function reverse(chainContext: any): any;
    function startAt(chainContext: any, routeKey: any): any;
    function toKeyPoints(chainContext: any, maxArcFacet: any): any;
    function toNewModel(chainContext: any, detachFromOldModel: any): any;
    function toPoints(chainContext: any, distanceOrDistances: any, maxPoints: any): any;
}
export function cloneObject(objectToClone: any): any;
export function createRouteKey(route: any): any;
export const environment: string;
export const environmentTypes: {
    BrowserUI: string;
    NodeJs: string;
    Unknown: string;
    WebWorker: string;
};
export namespace exporter {
    class XmlTag {
        static escapeString(value: any): any;
        constructor(name: any, attrs: any);
        name: any;
        attrs: any;
        innerText: any;
        getClosingTag(): any;
        getInnerText(): any;
        getOpeningTag(selfClose: any): any;
    }
    function chainToSVGPathData(chain: any, offset: any, accuracy: any): any;
    const colors: {
        aqua: number;
        black: number;
        blue: number;
        fuchsia: number;
        gray: number;
        green: number;
        lime: number;
        maroon: number;
        navy: number;
        olive: number;
        orange: number;
        purple: number;
        red: number;
        silver: number;
        teal: number;
        white: number;
        yellow: number;
    };
    function pathToSVGPathData(pathToExport: any, pathOffset: any, exportOffset: any, accuracy: any, clockwiseCircle: any): any;
    const svgUnit: {
        cm: {
            scaleConversion: number;
            svgUnitType: string;
        };
        foot: {
            scaleConversion: number;
            svgUnitType: string;
        };
        inch: {
            scaleConversion: number;
            svgUnitType: string;
        };
        m: {
            scaleConversion: number;
            svgUnitType: string;
        };
        mm: {
            scaleConversion: number;
            svgUnitType: string;
        };
    };
    function toDXF(itemToExport: any, options: any): any;
    function toJscadCAG(jscadCAG: any, modelToExport: any, jsCadCagOptions: any): any;
    function toJscadCSG(jscadCAG: any, modelToExport: any, options: any): any;
    function toJscadSTL(CAG: any, stlSerializer: any, modelToExport: any, options: any): any;
    function toJscadScript(modelToExport: any, options: any): any;
    function toJson(itemToExport: any, options: any): any;
    function toPDF(doc: any, modelToExport: any, options: any): void;
    function toSVG(itemToExport: any, options: any): any;
    function toSVGPathData(modelToExport: any, ...args: any[]): any;
    function tryGetModelUnits(itemToExport: any): any;
}
export function extendObject(target: any, other: any): any;
export namespace importer {
    function fromSVGPathData(pathData: any, options: any): any;
    function parseNumericList(s: any): any;
}
export function isChain(item: any): any;
export function isFunction(value: any): any;
export function isModel(item: any): any;
export function isNumber(value: any): any;
export function isObject(value: any): any;
export function isPath(item: any): any;
export function isPathArc(item: any): any;
export function isPathArcInBezierCurve(item: any): any;
export function isPathCircle(item: any): any;
export function isPathLine(item: any): any;
export function isPoint(item: any): any;
export namespace kit {
    function construct(ctor: any, args: any): any;
    function getParameterValues(ctor: any): any;
}
export namespace layout {
    function childrenOnChain(parentModel: any, onChain: any, baseline: any, reversed: any, contain: any, rotated: any): any;
    function childrenOnPath(parentModel: any, onPath: any, baseline: any, reversed: any, contain: any, rotate: any): any;
    function cloneToBrick(itemToClone: any, xCount: any, yCount: any, margin: any): any;
    function cloneToColumn(itemToClone: any, count: any, margin: any): any;
    function cloneToGrid(itemToClone: any, xCount: any, yCount: any, margin: any): any;
    function cloneToHoneycomb(itemToClone: any, xCount: any, yCount: any, margin: any): any;
    function cloneToRadial(itemToClone: any, count: any, angleInDegrees: any, rotationOrigin: any): any;
    function cloneToRow(itemToClone: any, count: any, margin: any): any;
}
export namespace measure {
    class Atlas {
        constructor(modelContext: any);
        modelContext: any;
        modelsMeasured: any;
        modelMap: any;
        pathMap: any;
        measureModels(): void;
    }
    function augment(measureToAugment: any): any;
    function boundingHexagon(modelToMeasure: any): any;
    function increase(baseMeasure: any, addMeasure: any, augmentBaseMeasure: any): any;
    function isAngleEqual(angleA: any, angleB: any, accuracy: any): any;
    function isArcConcaveTowardsPoint(arc: any, towardsPoint: any): any;
    function isArcOverlapping(arcA: any, arcB: any, excludeTangents: any): any;
    function isArcSpanOverlapping(arcA: any, arcB: any, excludeTangents: any): any;
    function isBetween(valueInQuestion: any, limitA: any, limitB: any, exclusive: any): any;
    function isBetweenArcAngles(angleInQuestion: any, arc: any, exclusive: any): any;
    function isBetweenPoints(pointInQuestion: any, line: any, exclusive: any): any;
    function isBezierSeedLinear(seed: any, exclusive: any): any;
    function isChainClockwise(chainContext: any, out_result: any): any;
    function isLineOverlapping(lineA: any, lineB: any, excludeTangents: any): any;
    function isMeasurementOverlapping(measureA: any, measureB: any): any;
    function isPathEqual(pathA: any, pathB: any, withinPointDistance: any, pathAOffset: any, pathBOffset: any): any;
    function isPointArrayClockwise(points: any, out_result: any): any;
    function isPointDistinct(pointToCheck: any, pointArray: any, withinDistance: any): any;
    function isPointEqual(a: any, b: any, withinDistance: any): any;
    function isPointInsideModel(pointToCheck: any, modelContext: any, options: any): any;
    function isPointOnCircle(p: any, circle: any, withinDistance: any): any;
    function isPointOnPath(pointToCheck: any, onPath: any, withinDistance: any, pathOffset: any, options: any): any;
    function isPointOnSlope(p: any, slope: any, withinDistance: any): any;
    function isSlopeEqual(slopeA: any, slopeB: any): any;
    function isSlopeParallel(slopeA: any, slopeB: any): any;
    function lineSlope(line: any): any;
    function modelExtents(modelToMeasure: any, atlas: any): any;
    function modelPathLength(modelToMeasure: any): any;
    function pathExtents(pathToMeasure: any, addOffset: any): any;
    function pathLength(pathToMeasure: any): any;
    function pointDistance(a: any, b: any): any;
}
export namespace model {
    function addCaption(modelContext: any, text: any, leftAnchorPoint: any, rightAnchorPoint: any): any;
    function addModel(parentModel: any, childModel: any, childModelId: any, overWrite: any): any;
    function addPath(modelContext: any, pathContext: any, pathId: any, overWrite: any): any;
    function addTo(childModel: any, parentModel: any, childModelId: any, overWrite: any): any;
    function breakPathsAtIntersections(modelToBreak: any, modelToIntersect: any): any;
    function center(modelToCenter: any, centerX: any, centerY: any): any;
    function clone(modelToClone: any): any;
    function combine(modelA: any, modelB: any, includeAInsideB: any, includeAOutsideB: any, includeBInsideA: any, includeBOutsideA: any, options: any): any;
    function combineIntersection(modelA: any, modelB: any): any;
    function combineSubtraction(modelA: any, modelB: any): any;
    function combineUnion(modelA: any, modelB: any): any;
    function convertUnits(modeltoConvert: any, destUnitType: any): any;
    function countChildModels(modelContext: any): any;
    function distort(modelToDistort: any, scaleX: any, scaleY: any, scaleOrigin: any, bezierAccuracy: any): any;
    function expandPaths(modelToExpand: any, distance: any, joints: any, combineOptions: any): any;
    function findChains(modelContext: any, ...args: any[]): any;
    function findSingleChain(modelContext: any): any;
    function getAllCaptionsOffset(modelContext: any): any;
    function getSimilarModelId(modelContext: any, modelId: any): any;
    function getSimilarPathId(modelContext: any, pathId: any): any;
    function isPathInsideModel(pathContext: any, modelContext: any, pathOffset: any, farPoint: any, measureAtlas: any): any;
    function layer(modelContext: any, layer: any): any;
    function mirror(modelToMirror: any, mirrorX: any, mirrorY: any): any;
    function move(modelToMove: any, origin: any): any;
    function moveRelative(modelToMove: any, delta: any): any;
    function originate(modelToOriginate: any, origin: any): any;
    function outline(modelToOutline: any, distance: any, joints: any, inside: any, options: any): any;
    function prefixPathIds(modelToPrefix: any, prefix: any): any;
    function removeDeadEnds(modelContext: any, pointMatchingDistance: any, keep: any, trackDeleted: any): any;
    function rotate(modelToRotate: any, angleInDegrees: any, rotationOrigin: any): any;
    function scale(modelToScale: any, scaleValue: any, scaleOrigin: any): any;
    function simplify(modelToSimplify: any, options: any): any;
    function walk(modelContext: any, options: any): any;
    function walkPaths(modelContext: any, callback: any): void;
    function zero(modelToZero: any, zeroX: any, zeroY: any): any;
}
export namespace models {
    class Belt {
        static metaParameters: {
            max: any;
            min: any;
            title: any;
            type: any;
            value: any;
        }[];
        constructor(leftRadius: any, distance: any, rightRadius: any);
        paths: any;
    }
    class BezierCurve {
        static computeLength(seed: any): any;
        static computePoint(seed: any, t: any): any;
        static getBezierSeeds(curve: any, options: any): any;
        static metaParameters: {
            title: any;
            type: any;
            value: any;
        }[];
        static typeName: string;
        constructor(...args: any[]);
        type: any;
        accuracy: any;
        seed: any;
        paths: any;
    }
    class BoltCircle {
        static metaParameters: {
            max: any;
            min: any;
            title: any;
            type: any;
            value: any;
        }[];
        constructor(boltRadius: any, holeRadius: any, boltCount: any, firstBoltAngleInDegrees: any);
        paths: any;
    }
    class BoltRectangle {
        static metaParameters: {
            max: any;
            min: any;
            title: any;
            type: any;
            value: any;
        }[];
        constructor(width: any, height: any, holeRadius: any);
        paths: any;
    }
    class ConnectTheDots {
        static metaParameters: {
            title: any;
            type: any;
            value: any;
        }[];
        constructor(...args: any[]);
        paths: any;
    }
    class Dogbone {
        static metaParameters: {
            max: any;
            min: any;
            title: any;
            type: any;
            value: any;
        }[];
        constructor(width: any, height: any, radius: any, style: any, bottomless: any);
        paths: any;
    }
    class Dome {
        static metaParameters: {
            max: any;
            min: any;
            title: any;
            type: any;
            value: any;
        }[];
        constructor(width: any, height: any, radius: any, bottomless: any);
        paths: any;
    }
    class Ellipse {
        static metaParameters: {
            max: any;
            min: any;
            title: any;
            type: any;
            value: any;
        }[];
        constructor(...args: any[]);
        models: any;
    }
    class EllipticArc {
        static metaParameters: {
            max: any;
            min: any;
            title: any;
            type: any;
            value: any;
        }[];
        constructor(...args: any[]);
        models: any;
    }
    class Holes {
        static metaParameters: {
            max: any;
            min: any;
            step: any;
            title: any;
            type: any;
            value: any;
        }[];
        constructor(holeRadius: any, points: any, ids: any);
        paths: any;
    }
    class Oval {
        static metaParameters: {
            max: any;
            min: any;
            title: any;
            type: any;
            value: any;
        }[];
        constructor(width: any, height: any);
        paths: any;
    }
    class OvalArc {
        static metaParameters: {
            max: any;
            min: any;
            step: any;
            title: any;
            type: any;
            value: any;
        }[];
        constructor(startAngle: any, endAngle: any, sweepRadius: any, slotRadius: any, selfIntersect: any, isolateCaps: any);
        paths: any;
        models: any;
    }
    class Polygon {
        static circumscribedRadius(radius: any, angleInRadians: any): any;
        static getPoints(numberOfSides: any, radius: any, firstCornerAngleInDegrees: any, circumscribed: any): any;
        static metaParameters: {
            max: any;
            min: any;
            title: any;
            type: any;
            value: any;
        }[];
        constructor(numberOfSides: any, radius: any, firstCornerAngleInDegrees: any, circumscribed: any);
        paths: any;
    }
    class Rectangle {
        static metaParameters: {
            max: any;
            min: any;
            title: any;
            type: any;
            value: any;
        }[];
        constructor(...args: any[]);
        paths: any;
        origin: any;
    }
    class Ring {
        static metaParameters: {
            max: any;
            min: any;
            step: any;
            title: any;
            type: any;
            value: any;
        }[];
        constructor(outerRadius: any, innerRadius: any);
        paths: any;
    }
    class RoundRectangle {
        static metaParameters: {
            max: any;
            min: any;
            title: any;
            type: any;
            value: any;
        }[];
        constructor(...args: any[]);
        paths: any;
        origin: any;
    }
    class SCurve {
        static metaParameters: {
            max: any;
            min: any;
            title: any;
            type: any;
            value: any;
        }[];
        constructor(width: any, height: any);
        paths: any;
    }
    class Slot {
        static metaParameters: {
            title: any;
            type: any;
            value: any;
        }[];
        constructor(origin: any, endPoint: any, radius: any, isolateCaps: any);
        paths: any;
        models: any;
        origin: any;
    }
    class Square {
        static metaParameters: {
            max: any;
            min: any;
            title: any;
            type: any;
            value: any;
        }[];
        constructor(side: any);
        paths: any;
    }
    class Star {
        static InnerRadiusRatio(numberOfPoints: any, skipPoints: any): any;
        static metaParameters: {
            max: any;
            min: any;
            title: any;
            type: any;
            value: any;
        }[];
        constructor(numberOfPoints: any, outerRadius: any, innerRadius: any, skipPoints: any);
        paths: any;
    }
    class Text {
        static glyphToModel(glyph: any, fontSize: any, bezierAccuracy: any): any;
        static metaParameters: {
            title: any;
            type: any;
            value: any;
        }[];
        constructor(font: any, text: any, fontSize: any, combine: any, centerCharacterOrigin: any, bezierAccuracy: any, opentypeOptions: any);
        models: any;
    }
}
export namespace path {
    function addTo(childPath: any, parentModel: any, pathId: any, overwrite: any): any;
    function alterLength(pathToAlter: any, distance: any, useOrigin: any): any;
    function breakAtPoint(pathToBreak: any, pointOfBreak: any): any;
    function center(pathToCenter: any): any;
    function clone(pathToClone: any, offset: any): any;
    function converge(lineA: any, lineB: any, useOriginA: any, useOriginB: any, ...args: any[]): any;
    function copyProps(srcPath: any, destPath: any): any;
    function distort(pathToDistort: any, scaleX: any, scaleY: any): any;
    function dogbone(lineA: any, lineB: any, filletRadius: any, options: any): any;
    function expand(pathToExpand: any, expansion: any, isolateCaps: any): any;
    function fillet(pathA: any, pathB: any, filletRadius: any, options: any): any;
    function intersection(path1: any, path2: any, options: any): any;
    function layer(pathContext: any, layer: any): any;
    function mirror(pathToMirror: any, mirrorX: any, mirrorY: any): any;
    function move(pathToMove: any, origin: any): any;
    function moveRelative(pathToMove: any, delta: any, subtract: any): any;
    function moveTemporary(pathsToMove: any, deltas: any, task: any): void;
    function rotate(pathToRotate: any, angleInDegrees: any, rotationOrigin: any): any;
    function scale(pathToScale: any, scaleValue: any): any;
    function straighten(arc: any, bevel: any, prefix: any, close: any): any;
    function toKeyPoints(pathContext: any, maxArcFacet: any): any;
    function toPoints(pathContext: any, numberOfPoints: any): any;
    function zero(pathToZero: any): any;
}
export const pathType: {
    Arc: string;
    BezierSeed: string;
    Circle: string;
    Line: string;
};
export namespace paths {
    class Arc {
        constructor(...args: any[]);
        radius: any;
        origin: any;
        startAngle: any;
        endAngle: any;
        type: any;
    }
    class Chord {
        constructor(arc: any);
        type: any;
        origin: any;
        end: any;
    }
    class Circle {
        constructor(...args: any[]);
        type: any;
        origin: any;
        radius: any;
    }
    class Line {
        constructor(...args: any[]);
        type: any;
        origin: any;
        end: any;
    }
    class Parallel {
        constructor(toLine: any, distance: any, nearPoint: any);
        type: any;
        origin: any;
        end: any;
    }
}
export namespace point {
    function add(a: any, b: any, subtract: any): any;
    function average(a: any, b: any): any;
    function clone(pointToClone: any): any;
    function closest(referencePoint: any, pointOptions: any): any;
    function distort(pointToDistort: any, scaleX: any, scaleY: any): any;
    function fromAngleOnCircle(angleInDegrees: any, circle: any): any;
    function fromArc(arc: any): any;
    function fromPathEnds(pathContext: any, pathOffset: any): any;
    function fromPolar(angleInRadians: any, radius: any): any;
    function fromSlopeIntersection(lineA: any, lineB: any, options: any): any;
    function middle(pathContext: any, ratio: any): any;
    function mirror(pointToMirror: any, mirrorX: any, mirrorY: any): any;
    function rotate(pointToRotate: any, angleInDegrees: any, rotationOrigin: any): any;
    function rounded(pointContext: any, accuracy: any): any;
    function scale(pointToScale: any, scaleValue: any): any;
    function subtract(a: any, b: any): any;
    function zero(): any;
}
export function round(n: any, accuracy: any): any;
export namespace solvers {
    function circleTangentAngles(a: any, b: any, inner: any): any;
    function equilateralAltitude(sideLength: any): any;
    function equilateralSide(altitude: any): any;
    function solveTriangleASA(oppositeAngleInDegrees: any, lengthOfSideBetweenAngles: any, otherAngleInDegrees: any): any;
    function solveTriangleSSS(lengthA: any, lengthB: any, lengthC: any): any;
}
export function splitDecimal(n: any): any;
export function travel(modelContext: any, route: any): any;
export const unitType: {
    Centimeter: string;
    Foot: string;
    Inch: string;
    Meter: string;
    Millimeter: string;
};
export namespace units {
    function conversionScale(srcUnitType: any, destUnitType: any): any;
    function isValidUnit(tryUnit: any): any;
}
export const version: string;
