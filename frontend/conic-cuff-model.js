var makerjs = require('makerjs');
import {makeConicSection} from './conic-section.js'
import {InnerDesignHashmarks} from './inner-design-hashmarks.js';

function makeTwoEvenlySpacedBolts(p1, p2) {
    var MillimeterToInches = 0.0393701;

    var RivetRadius = 2.5 * MillimeterToInches;
        
    var rivetHole = new makerjs.models.Oval(RivetRadius, RivetRadius)
    var rivetRow = null;

    // still don't love where these are centered
    rivetRow = makerjs.layout.cloneToRow(rivetHole, 5);
    var leftBoltPath = new makerjs.paths.Line(p1, p2);
    var leftBolts = makerjs.layout.childrenOnPath(rivetRow, leftBoltPath);
    delete leftBolts['models']['0']; delete leftBolts['models']['2']; delete leftBolts['models']['4'];

    return leftBolts;
}

export function ConicCuff({
    height = 2,
    wristCircumference = 7,
    forearmCircumference = 7.5,
    bufferWidth = 0.1, 
    hashWidth = 0.1,
    seed = 4000,
    initialNoiseRange1 = 10,
    initialNoiseRange2 = 10,
    noiseOffset1 = 0.5,
    noiseOffset2 = 0.75,
    noiseInfluence = 0.5
}) {
    /***** START OVERALL CUFF SHAPE + INNER *****/
    // Actual outer cuff cut
    var cuffModel = makeConicSection({
        topCircumference: wristCircumference + 1.0, 
        bottomCircumference: forearmCircumference + 0.7, 
        height: height,
        filletRadius: 0.2
    });
    // Inner "safe" area for design. Not actually printed. Used to calculate intersection of inner design.
    var cuffModelInner = makeConicSection({
        topCircumference: wristCircumference + 1.0, 
        bottomCircumference: forearmCircumference + 0.7, 
        height: height, 
        widthOffset: 0.8, 
        heightOffset: 0.2
    });

    var completeCuffModel = {
        models: {
            cuffModel: cuffModel,
            cuffModelInner: cuffModelInner
        }
    }
    /***** END OVERALL CUFF SHAPE + INNER *****/

    /***** START RIVET HOLES *****/
    const boltGuideLine1P1 = [
        cuffModel.shortRadius * Math.cos(cuffModelInner.widthOffset.radians/2),
        cuffModel.shortRadius * Math.sin(cuffModelInner.widthOffset.radians/2)
    ];
    const boltGuideLine1P2 = [
        cuffModel.longRadius * Math.cos(cuffModelInner.widthOffset.radians/2),
        cuffModel.longRadius * Math.sin(cuffModelInner.widthOffset.radians/2)
    ];
    const boltGuideLine2P1 = [
        cuffModel.longRadius * Math.cos(cuffModel.alpha.radians - cuffModelInner.widthOffset.radians/2),
        cuffModel.longRadius * Math.sin(cuffModel.alpha.radians - cuffModelInner.widthOffset.radians/2)
    ];
    const boltGuideLine2P2 = [
        cuffModel.shortRadius * Math.cos(cuffModel.alpha.radians - cuffModelInner.widthOffset.radians/2),
        cuffModel.shortRadius * Math.sin(cuffModel.alpha.radians - cuffModelInner.widthOffset.radians/2)
    ];
    completeCuffModel.models.leftBolts = makeTwoEvenlySpacedBolts(boltGuideLine1P1, boltGuideLine1P2);
    completeCuffModel.models.rightBolts = makeTwoEvenlySpacedBolts(boltGuideLine2P1, boltGuideLine2P2);
    /***** END RIVET HOLES *****/

    /***** START RECENTER SHAPE *****/
    // Model is way far out, move it close to origin
    makerjs.model.rotate(completeCuffModel, 90);
    makerjs.model.zero(completeCuffModel);

    this.models = {
        completeCuffModel: completeCuffModel
    }
    /***** END RECENTER SHAPE *****/

    /***** START DESIGN *****/
    // Now make the design and clamp it to the inner/safe arc we built
    var bbox = makerjs.measure.modelExtents(completeCuffModel);
    var totalWidth = bbox.high[0] - bbox.low[0];
    var totalHeight = bbox.high[1] - bbox.low[1];

    // this is some insane terrible logic to preserve the recentering we did above
    // and just use the inner shape as the intersection clamp for our design
    var cuffClone = makerjs.model.clone(completeCuffModel);
    var cuffModelInnerClone = cuffClone.models.cuffModelInner;
    cuffClone.models = { c: cuffModelInnerClone }

    const innerDesign = new InnerDesignHashmarks({
        height: totalHeight, 
        width: totalWidth, 
        seed, 
        bufferWidth, 
        hashWidth,
        initialNoiseRange1,
        initialNoiseRange2,
        noiseOffset1,
        noiseOffset2, 
        noiseInfluence
    })

    // this.models.rawDesign = makerjs.model.clone(innerDesign);
    this.models.design =
       makerjs.model.combineIntersection(
           innerDesign,
           cuffClone
       )
    /***** END DESIGN *****/

    /***** START CLEANUP *****/
    // now take out the original inner cuff model, not actually used as a cut
    this.models.completeCuffModel.models.cuffModelInner = null;

    this.units = makerjs.unitType.Inch;
    /***** END CLEANUP *****/
}


// top should be 0.45in out from edge of design - 7.75 apart - super tight 6.5, normal 7
// bottom 0.62 out - 8.125 apart, 7.75

ConicCuff.metaParameters = [
    { title: "Height", type: "range", min: 1, max: 5, value: 2, step: 0.25, name: 'height' },
    { title: "Wrist Circumference", type: "range", min: 4, max: 10, value: 7, step: 0.1, name: 'wristCircumference' },
    { title: "Wide Wrist Circumference", type: "range", min: 4, max: 10, value: 7.75, step: 0.1, name: 'forearmCircumference' },
    { title: "Buffer Width", type: "range", min: 0.075, max: 0.75, value: 0.15, step: 0.05, name: 'bufferWidth' },
    { title: "Hash Width", type: "range", min: 0.075, max: 0.75, value: 0.25, step: 0.05, name: 'hashWidth' },
    { title: "Seed", type: "range", min: 1, max: 10000, value: 1, name: 'seed' },
    { title: "Initial Noise Range 1", type: "range", min: 0, max: 20, step: 0.1, value: 10, name: 'initialNoiseRange1' },
    { title: "Initial Noise Range 2", type: "range", min: 0, max: 20, step: 0.1, value: 10, name: 'initialNoiseRange2' },
    { title: "Moving Noise Offset 1", type: "range", min: 0.01, max: 1, step: 0.1, value: 0.5, name: 'movingNoiseOffset1' },
    { title: "Moving Noise Offset 2", type: "range", min: 0.01, max: 1, step: 0.1, value: 0.75, name: 'movingNoiseOffset2' },
    { title: "Noise Influence", type: "range", min: 0, max: 1, step: 0.01, value: 0.5, name: 'noiseInfluence' }
];

export default ConicCuff;