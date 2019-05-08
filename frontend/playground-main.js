

var SimplexNoise = require('../../simplex-noise');
var makerjs = require('makerjs');

function Cuff(
    height,
    wristWidth,
    forearm_circumference,
    buffer_width, 
    hash_width,
    seed
) {
    console.log(buffer_width);
    console.log(hash_width);

    //var height = 2;
    //var wristWidth = 7.5;
    var sideBufferBottom = 0.8;
    var totalWidthBottom = wristWidth + sideBufferBottom*2;
    var sideBufferTop = 0.6;
    var sideBufferGap = sideBufferBottom - sideBufferTop;

    var FilletRadius = 0.2;

    var DesignBuffer = sideBufferBottom - sideBufferTop;

    var MillimeterToInches = 0.0393701;

    var points = [
        [0, 0], 
        [sideBufferGap, height], 
        [totalWidthBottom - sideBufferGap, height],
        [totalWidthBottom, 0]
    ];

    var RivetRadius = 5 * MillimeterToInches;
    var rivetHole = new makerjs.models.Oval(RivetRadius, RivetRadius);
    var rivetRow = null;

    // still don't love where these are centered
    rivetRow = makerjs.layout.cloneToRow(rivetHole, 5);
    var leftBoltPath = new makerjs.paths.Line([sideBufferTop*2/3, 0], [sideBufferTop*2/3 + DesignBuffer, height]);
    var leftBolts = makerjs.layout.childrenOnPath(rivetRow, leftBoltPath);
    delete leftBolts['models']['0']; delete leftBolts['models']['2']; delete leftBolts['models']['4'];

    rivetRow = makerjs.layout.cloneToRow(rivetHole, 5);
    var rightBoltPath = new makerjs.paths.Line([totalWidthBottom - (sideBufferTop*2/3) + RivetRadius, 0], [totalWidthBottom - DesignBuffer - (sideBufferTop*2/3) + RivetRadius, height]);
    var rightBolts = makerjs.layout.childrenOnPath(rivetRow, rightBoltPath, false, true);
    delete rightBolts['models']['0']; delete rightBolts['models']['2']; delete rightBolts['models']['4'];

   // this.paths = [rightBoltPath, leftBoltPath];
    this.models = {
        leftBolts: leftBolts,
        rightBolts: rightBolts,
        cuff: new makerjs.models.ConnectTheDots(true, points),
        design: makerjs.model.move(
            makerjs.model.combineIntersection(
                new InnerDesign(height, wristWidth, seed, buffer_width, hash_width),
                new makerjs.models.Rectangle(wristWidth, height - DesignBuffer*2)
            ),
            [sideBufferBottom, DesignBuffer]
        )
    };

    var chain = makerjs.model.findSingleChain(this.models.cuff);
    var filletsModel = makerjs.chain.fillet(chain, FilletRadius);
    this.models.fillets = filletsModel;

    this.units = makerjs.unitType.Inch;
}

function InnerDesign(
    height, 
    width, 
    seed, 
    bufferWidth, 
    hashWidth
) {
    var simplex = new SimplexNoise(seed.toString());
    var lastNoise1 = simplex.noise2D(100, 10) * 10;
    var lastNoise2 = simplex.noise2D(100.5, 10.5) * 10;

    var models = {};
    var i = -5;
    while (i <= width *2) {
      var newNoise1 = (simplex.noise2D(500, (i-100)*1.0/200)+1)*0.1;
      var newNoise2 = (simplex.noise2D(500, (i-100)*1.0/200)+1)*0.25;
      
      models[i.toString()] = new makerjs.models.ConnectTheDots(true, [
          [i + lastNoise1 + newNoise1, 0],
          [i + lastNoise2 + newNoise2, height],
          [i + lastNoise2 + newNoise2 + hashWidth, height],
          [i + lastNoise1 + newNoise1 + hashWidth, 0]
      ]);

      lastNoise1 = lastNoise1 + newNoise1;
      lastNoise2 = lastNoise2 + newNoise2;
      i += hashWidth + bufferWidth;
      console.log(i);
      console.log(width);
    }

    this.models = models;

    this.units = makerjs.unitType.Inch;
}

Cuff.metaParameters = [
    { title: "Height", type: "range", min: 1, max: 3, value: 2, step: 0.25 },
    { title: "Wrist Width", type: "range", min: 4, max: 10, value: 7.5, step: 0.2 },
    { title: "Forearm Circumference", type: "range", min: 4, max: 10, value: 7.7, step: 0.2 },
    { title: "Buffer Width", type: "range", min: 0.075, max: 0.75, value: 0.15, step: 0.05 },
    { title: "Hash Width", type: "range", min: 0.075, max: 0.75, value: 0.25, step: 0.05 },
    { title: "Seed", type: "range", min: 1, max: 10000, value: 1 }
];

module.exports = Cuff;

