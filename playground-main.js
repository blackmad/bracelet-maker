

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
    var totalWidthTop = wristWidth + sideBufferTop*2;
    var sideBufferGap = sideBufferBottom - sideBufferTop;

    var DesignBuffer = 0.2;

    var points = [
        [0, 0], 
        [sideBufferGap, height], 
        [totalWidthBottom - sideBufferGap, height],
        [totalWidthBottom, 0]
    ];

    this.models = {
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
    var filletsModel = makerjs.chain.fillet(chain, 0.2);
    this.models.fillets = filletsModel;

    this.units = makerjs.unitType.Inch;
}

function InnerDesign(
    height, 
    width, 
    seed, 
    bufferWidthInt, 
    hashWidthInt
) {
    var simplex = new SimplexNoise(seed.toString());
    var lastNoise1 = simplex.noise2D(100, 10) * 10;
    var lastNoise2 = simplex.noise2D(100.5, 10.5) * 10;
    var hashWidth = 0.075 + hashWidthInt * 0.01;
    var bufferWidth = 0.075 + bufferWidthInt * 0.01;

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
    { title: "Buffer Width", type: "range", min: 1, max: 100, value: 1 },
    { title: "Hash Width", type: "range", min: 1, max: 100, value: 1 },
    { title: "Seed", type: "range", min: 1, max: 10000, value: 1 }
];

module.exports = Cuff;

