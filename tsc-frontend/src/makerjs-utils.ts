import Angle from "./designs/angle";

const makerjs = require('makerjs');

export namespace MakerJsUtils {
    export function arcLength(arc: MakerJs.paths.Arc): number {
        return Angle.fromDegrees(arc.endAngle - arc.startAngle).radians * arc.radius;
    }

    export function checkCircleCircleIntersection(c1: MakerJs.paths.Circle, c2: MakerJs.paths.Circle, border?: number): boolean {
        const xDistance = c1.origin[0] - c2.origin[0];
        const yDistance = c1.origin[1] - c2.origin[1];
    
        const sumOfRadii = c1.radius + c2.radius + (border || 0);
        const distanceSquared = xDistance * xDistance + yDistance * yDistance;
    
        return distanceSquared  < sumOfRadii * sumOfRadii;
    }

    export function checkCircleLineIntersection(circle: MakerJs.paths.Circle, l: MakerJs.paths.Line): boolean {
        return makerjs.path.intersection(circle, l) != null;

        // copied entirely from https://stackoverflow.com/questions/1073336/circle-line-segment-collision-detection-algorithm
        //p1 is the first line point
        //p2 is the second line point
        //c is the circle's center
        //r is the circle's radius
        console.log(l);
        const p1 = {x: l.origin[0], y: l.origin[1] }
        const p2 = {x: l.end[0], y: l.end[1] }
        const c = {x: circle.origin[0], y: circle.origin[1] }
        const r = circle.radius;

        var p3 = {x:p1.x - c.x, y:p1.y - c.y} //shifted line points
        var p4 = {x:p2.x - c.x, y:p2.y - c.y}

        var m = (p4.y - p3.y) / (p4.x - p3.x); //slope of the line
        var b = p3.y - m * p3.x; //y-intercept of line

        console.log(p3, p4, m ,b);

        var underRadical = Math.pow((Math.pow(r,2)*(Math.pow(m,2)+1)),2)-Math.pow(b,2); //the value under the square root sign 
        return underRadical > 0;
    }

    export function checkPathMeasureOverlap(path: MakerJs.IPath, m2: MakerJs.IMeasure): boolean {
        const m1 = makerjs.measure.pathExtents(path);
        return makerjs.measure.isMeasurementOverlapping(m1, m2);
    }

    function circleFromArc(arc: MakerJs.paths.Arc): MakerJs.paths.Circle {
        return new makerjs.paths.Circle(
            arc.origin, arc.radius
        )
    }

    export function checkPathIntersectsModel(path: MakerJs.IPath, model: MakerJs.IModel): boolean {
        const pathMeasure = makerjs.measure.pathExtents(path);
        var doesIntersect = false;
        var walkOptions = {
            onPath: function (wp) {
                if (doesIntersect) { 
                    return; 
                }

                doesIntersect = (makerjs.path.intersection(wp.pathContext, path) != null);
                
                // var otherPath = wp.pathContext;
                // // if (wp.pathContext.type == 'arc') {
                // //     // console.log('making it a circle');
                // //     otherPath = circleFromArc(wp.pathContext)
                // // }
                // // var newDoesIntersect = false;
                // if (otherPath.type == 'circle' && path.type == 'circle') {
                //     // console.log('corcle/cicle intersection');
                //     doesIntersect = checkCircleCircleIntersection(otherPath, <MakerJs.paths.Circle>path);
                // } else if (otherPath.type == 'line' && path.type == 'circle') {
                //     doesIntersect = checkCircleLineIntersection(<MakerJs.paths.Circle>path, <MakerJs.paths.Line>otherPath);
                // } else if (otherPath.type == 'circle' && path.type == 'line') {
                //     doesIntersect = checkCircleLineIntersection(<MakerJs.paths.Circle>otherPath, <MakerJs.paths.Line>path);
                // } else {
                //     doesIntersect = (makerjs.path.intersection(wp.pathContext, path) != null);
                // }

                // doesIntersect = newDoesIntersect;

                // if (origDoesIntersect != newDoesIntersect) {
                //     console.log('new ', newDoesIntersect, 'old ', origDoesIntersect, ' disagrees')
                //     console.log('testing path ', path);
                //     console.log('against ', wp.pathContext);
                //     console.log('turned into ', otherPath);
                // } else {
                //     console.log('fine');
                // }
                // return origDoesIntersect;
                // return newDoesIntersect;
            }
          };
          
          makerjs.model.walk(model, walkOptions);

          return doesIntersect;
    }

    export function collectPaths(model: MakerJs.IModel): MakerJs.IPath[] {
        const paths: MakerJs.IPath[] = [];
        var walkOptions = {
            onPath: function (wp) {
                paths.push(wp.pathContext);
            }
          };
          
          makerjs.model.walk(model, walkOptions);

          return paths;
    }
}