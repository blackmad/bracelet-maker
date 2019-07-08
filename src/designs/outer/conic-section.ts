import {Angle} from '../../utils/angle';

var makerjs = require('makerjs');

export default makeConicSection;

export function makeConicSection({
    topCircumference,
    bottomCircumference,
    height,
    widthOffset = 0,
    heightOffset = 0,
    filletRadius = null
}) {
    // math from: https://www.templatemaker.nl/api/api.php?client=templatemaker&request=galleryitem&template=cone&file=example-math.jpg
    // take the inputs and compute a conical secion
    var L = topCircumference;
    var M = bottomCircumference;

    var T = L / Math.PI;  // top width of cross section of cone
    var B = M / Math.PI; // bottom width of cross section of cone
    var H = height; // height of cross section of cone

    var R = Math.sqrt(Math.pow(0.5*B - 0.5*T, 2) + Math.pow(H, 2)); // height of conical section
    var P = R / (B - T); // short radius
    var Q = P + R; // long radius
    var alpha = Angle.fromRadians(L / P);
    
    // For making inner/offset conic sections, this calculates how much to offset the angle
    var widthOffsetAngle = Angle.fromRadians(widthOffset / Q);
                    
    // Compute the arcs that make up the cuff
    var cuffPaths = {
        p1: new makerjs.paths.Arc([0,0], P + heightOffset, widthOffsetAngle.degrees, alpha.degrees - widthOffsetAngle.degrees),
        p2: new makerjs.paths.Arc([0,0], Q - heightOffset, widthOffsetAngle.degrees, alpha.degrees - widthOffsetAngle.degrees)
    };

    // Compute the lines that connect the two arcs
    cuffPaths['l1'] = new makerjs.paths.Line(
        makerjs.point.fromArc(cuffPaths['p1'])[0], 
        makerjs.point.fromArc(cuffPaths['p2'])[0]
    );
    cuffPaths['l2'] = new makerjs.paths.Line(
        makerjs.point.fromArc(cuffPaths['p1'])[1], 
        makerjs.point.fromArc(cuffPaths['p2'])[1]
    );

    // make the paths into a unified model
    var cuffModel = {paths: cuffPaths} // makerjs.chain.toNewModel(cuffChain);
    var cuffChain = makerjs.model.findSingleChain(cuffModel);
    
    var fillet = null;
    if (filletRadius) {
        fillet = makerjs.chain.fillet(cuffChain, filletRadius);
    }

    return {
        models: {cuff: cuffModel, fillet: fillet},
        widthOffset: widthOffsetAngle,
        alpha: alpha,
        shortRadius: P,
        longRadius: Q,
        units: makerjs.unitType.Inch
    };
}