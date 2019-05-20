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

function ConicCuffOuter(innerDesignClass) {
    return function(options) {
        const retVal = {};

        console.log(options);
        const {height, wristCircumference, forearmCircumference} = options['ConicCuffOuter'];            

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

        retVal.models = {
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
        cuffClone.models = { c: cuffModelInnerClone };

        const innerOptions = options[innerDesignClass.name];
        innerOptions.height = totalHeight;
        innerOptions.width = totalWidth;
        const innerDesign = Reflect.construct(innerDesignClass, [innerOptions]);

        // this.models.rawDesign = makerjs.model.clone(innerDesign);
        retVal.models.design =
            makerjs.model.combineIntersection(
                innerDesign,
                cuffClone
            )
        /***** END DESIGN *****/

        /***** START CLEANUP *****/
        // now take out the original inner cuff model, not actually used as a cut
        retVal.models.completeCuffModel.models.cuffModelInner = null;

        retVal.units = makerjs.unitType.Inch;
        /***** END CLEANUP *****/

        return retVal;
    }
}

export function ConicCuffWithHashMarks(options) {
    return ConicCuffOuter(InnerDesignHashmarks)(options);
}

// top should be 0.45in out from edge of design - 7.75 apart - super tight 6.5, normal 7
// bottom 0.62 out - 8.125 apart, 7.75

ConicCuffWithHashMarks.subModels = [
    ConicCuffOuter, InnerDesignHashmarks   
]

ConicCuffOuter.metaParameters = [
    { title: "Height", type: "range", min: 1, max: 5, value: 2, step: 0.25, name: 'height' },
    { title: "Wrist Circumference", type: "range", min: 4, max: 10, value: 7, step: 0.1, name: 'wristCircumference' },
    { title: "Wide Wrist Circumference", type: "range", min: 4, max: 10, value: 7.75, step: 0.1, name: 'forearmCircumference' }
]

export default {};