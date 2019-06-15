import {makeConicSection} from './conic-section'
import { RangeMetaParameter, MetaParameterType } from '../meta-parameter';
import { ModelMaker } from '../model';

var makerjs = require('makerjs');

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

class ConicCuffOuterImpl { // implements MakerJs.IModel {
    public units = makerjs.unitType.Inch;
    public paths: MakerJs.IPathMap = {};
    public models: MakerJs.IModelMap = {};

    constructor(innerDesignClass: ModelMaker, options) {
        console.log(options);
        var {height, wristCircumference, forearmCircumference, safeBorderWidth} = options['ConicCuffOuter'];

        if (wristCircumference > forearmCircumference) {
            throw `wristCircumference ${wristCircumference} must be less than forearmCircumference ${forearmCircumference}`;
        }

        if (forearmCircumference - wristCircumference < 0.05) {
            forearmCircumference += 0.05;
        }

        /***** START OVERALL CUFF SHAPE + INNER *****/
        // Actual outer cuff cut
        var cuffModel = makeConicSection({
            topCircumference: wristCircumference + 1.0,
            bottomCircumference: forearmCircumference + 1.0,
            height: height,
            filletRadius: 0.2
        });

        // Inner "safe" area for design. Not actually printed. Used to calculate intersection of inner design.
        var cuffModelInner = makeConicSection({
            topCircumference: wristCircumference + 1.0,
            bottomCircumference: forearmCircumference + 1.0,
            height: height,
            widthOffset: 1.1,
            heightOffset: safeBorderWidth
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
        completeCuffModel.models['leftBolts'] = makeTwoEvenlySpacedBolts(boltGuideLine1P1, boltGuideLine1P2);
        completeCuffModel.models['rightBolts'] = makeTwoEvenlySpacedBolts(boltGuideLine2P1, boltGuideLine2P2);
        /***** END RIVET HOLES *****/

        /***** START RECENTER SHAPE *****/
        // Model is way far out, move it close to origin
        makerjs.model.rotate(completeCuffModel, 90 - cuffModel.alpha.degrees/2);
        makerjs.model.zero(completeCuffModel);

        // console.log(completeCuffModel)

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
        makerjs.model.originate(completeCuffModel);

        var cuffClone = makerjs.model.clone(completeCuffModel);
        var cuffModelInnerClone = cuffClone.models.cuffModelInner;
        cuffClone.models = { c: cuffModelInnerClone };

        console.log(innerDesignClass.constructor.name);
        const innerOptions = options[innerDesignClass.constructor.name] || {};
        innerOptions.height = totalHeight;
        innerOptions.width = totalWidth;
        innerOptions.boundaryModel = cuffClone;
        innerOptions.outerModel = {models: {c: makerjs.model.clone(completeCuffModel).models.cuffModel}}
        
        console.log(innerDesignClass)
        const innerDesign = innerDesignClass.make(innerOptions);

        this.models.design = innerDesign;
        // console.log(retVal.models.design )

        /***** END DESIGN *****/

        /***** START CLEANUP *****/
        // now take out the original inner cuff model, not actually used as a cut
        delete this.models.completeCuffModel.models.cuffModelInner;
        /***** END CLEANUP *****/
    }
}

export class ConicCuffOuter implements ModelMaker {
    innerDesignClass: ModelMaker;
    options: Object;

    get metaParameters() {
        return [
            new RangeMetaParameter({ title: "Height", min: 1, max: 5, value: 2, step: 0.25, name: 'height' }),
            new RangeMetaParameter({ title: "Wrist Circumference", min: 4, max: 10, value: 7, step: 0.1, name: 'wristCircumference' }),
            new RangeMetaParameter({ title: "Wide Wrist Circumference", min: 4, max: 10, value: 7.75, step: 0.1, name: 'forearmCircumference' }),
            new RangeMetaParameter({ title: "Safe Border (in)", min: 0.1, max: 0.75, value: 0.25, step: 0.01, name: 'safeBorderWidth' })
        ]
    }

    constructor(innerDesignClass: ModelMaker) {
        this.innerDesignClass = innerDesignClass;
    }

    make(options): MakerJs.IModel {
        return new ConicCuffOuterImpl(this.innerDesignClass, options);
    }
}