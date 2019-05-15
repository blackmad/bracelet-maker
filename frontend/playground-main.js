var SimplexNoise = require('../../simplex-noise');
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

class Angle {
    constructor({rads}) {
        this.radians = rads;
        this.degrees = rads * 180/Math.PI;
    }

    static fromAngle(angle) {
        return new Angle({rads: angle * Math.PI/180})
    }

    static fromRadians(rads) {
        return new Angle({rads: rads})
    }
}

function makeConicSection({
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
    var cuffChain = makerjs.model.findSingleChain({paths: cuffPaths});
    var cuffModel = makerjs.chain.toNewModel(cuffChain);
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

function ConicCuff(
    height,
    wristWidthRaw,
    forearm_circumference,
    buffer_width, 
    hash_width,
    seed,
    initialNoiseRange1,
    initialNoiseRange2,
    noiseOffset1,
    noiseOffset2,
    noiseInfluence
) {
    /***** START OVERALL CUFF SHAPE + INNER *****/
    // Actual outer cuff cut
    var cuffModel = makeConicSection({
        topCircumference: wristWidthRaw + 1.0, 
        bottomCircumference: forearm_circumference + 0.7, 
        height: height,
        filletRadius: 0.2
    });
    // Inner "safe" area for design. Not actually printed. Used to calculate intersection of inner design.
    var cuffModelInner = makeConicSection({
        topCircumference: wristWidthRaw + 1.0, 
        bottomCircumference: forearm_circumference + 0.7, 
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

    const innerDesign = new InnerDesign(totalHeight, totalWidth, seed, buffer_width, hash_width,     
        initialNoiseRange1,
        initialNoiseRange2,
        noiseOffset1,
        noiseOffset2, noiseInfluence)

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

function Cuff(
    height,
    wristWidthRaw,
    forearm_circumference,
    buffer_width, 
    hash_width,
    seed
) {
    //var height = 2;
    var wristWidth = wristWidthRaw - 0.2;
    var sideBufferBottom = 1.0;
    var totalWidthBottom = wristWidth + sideBufferBottom*2;
    var sideBufferTop = 0.7;
    var sideBufferGap = sideBufferBottom - sideBufferTop;

    var FilletRadius = 0.2;

    var YPadding = 0.3;

    var DesignBuffer = sideBufferBottom - sideBufferTop;

    var points = [
        [0, 0], 
        [sideBufferGap, height], 
        [totalWidthBottom - sideBufferGap, height],
        [totalWidthBottom, 0]
    ];

    var leftBolts = makeTwoEvenlySpacedBolts([sideBufferTop*1/2 + RivetRadius, 0], [sideBufferTop*1/2 + DesignBuffer + RivetRadius, height]);
    var rightBolts = makeTwoEvenlySpacedBolts([totalWidthBottom - (sideBufferTop*1/2), 0], [totalWidthBottom - DesignBuffer - (sideBufferTop*1/2), height]);
    
    this.models = {
        leftBolts: leftBolts,
        rightBolts: rightBolts,
        cuff: new makerjs.models.ConnectTheDots(true, points),
        design: makerjs.model.move(
            makerjs.model.combineIntersection(
                new InnerDesign(height, wristWidth, seed, buffer_width, hash_width),
                new makerjs.models.Rectangle(wristWidth, height - YPadding*2)
            ),
            [sideBufferBottom, YPadding]
        )
    };

    var chain = makerjs.model.findSingleChain(this.models.cuff);
    var filletsModel = makerjs.chain.fillet(chain, FilletRadius);
    this.models.fillets = filletsModel;

    this.units = makerjs.unitType.Inch;

    //this.layer = "red";
}

function InnerDesign(
    height, 
    width, 
    seed, 
    bufferWidth, 
    hashWidth,
    initialNoiseRange1,
    initialNoiseRange2,
    noiseOffset1,
    noiseOffset2,
    noiseInfluence
) {
    var simplex = new SimplexNoise(seed.toString());
    var lastNoise1 = simplex.noise2D(100, 10) * initialNoiseRange1;
    var lastNoise2 = simplex.noise2D(100.5, 10.5) * initialNoiseRange2;

    var models = {};
    var pos = -width ;
    var i = 0;
    while (pos <= width*2) {
      var newNoise1 = ((simplex.noise2D(i/200, i/300)) + noiseOffset1) * noiseInfluence;
      var newNoise2 = ((simplex.noise2D(i/20, i/30)) + noiseOffset2) * noiseInfluence;
      console.log(newNoise1);
      i += 1;
      
      m = new makerjs.models.ConnectTheDots(true, [
          [pos + lastNoise1 + newNoise1, 0],
          [pos + lastNoise2 + newNoise2, height],
          [pos + lastNoise2 + newNoise2 + hashWidth, height],
          [pos + lastNoise1 + newNoise1 + hashWidth, 0]
      ]);

      models[i.toString()] = m;

      lastNoise1 = lastNoise1 + newNoise1;
      lastNoise2 = lastNoise2 + newNoise2;
      pos += hashWidth + bufferWidth;
    //   console.log(i);
    //   console.log(width);
    }

    this.models = models;

    this.units = makerjs.unitType.Inch;
}

// top should be 0.45in out from edge of design - 7.75 apart - super tight 6.5, normal 7
// bottom 0.62 out - 8.125 apart, 7.75

ConicCuff.metaParameters = [
    { title: "Height", type: "range", min: 1, max: 5, value: 2, step: 0.25 },
    { title: "Wrist Circumference", type: "range", min: 4, max: 10, value: 7, step: 0.1 },
    { title: "Wide Wrist Circumference", type: "range", min: 4, max: 10, value: 7.75, step: 0.1 },
    { title: "Buffer Width", type: "range", min: 0.075, max: 0.75, value: 0.15, step: 0.05 },
    { title: "Hash Width", type: "range", min: 0.075, max: 0.75, value: 0.25, step: 0.05 },
    { title: "Seed", type: "range", min: 1, max: 10000, value: 1 },
    { title: "Initial Noise Range 1", type: "range", min: 0, max: 20, step: 0.1, value: 10 },
    { title: "Initial Noise Range 2", type: "range", min: 0, max: 20, step: 0.1, value: 10},
    { title: "Moving Noise Offset 1", type: "range", min: 0.01, max: 1, step: 0.1, value: 0.5 },
    { title: "Moving Noise Offset 2", type: "range", min: 0.01, max: 1, step: 0.1, value: 0.75},
    { title: "Noise Influence", type: "range", min: 0, max: 1, step: 0.01, value: 0.5 }
];

module.exports = ConicCuff;

