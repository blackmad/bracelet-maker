var makerjs = require('makerjs');

function Cuff(hash_width) {
    console.log(hash_width);

    var height = 2;
    var wristWidth = 7.5;
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
                new InnerDesign(height*4, wristWidth, 2.0),
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

function InnerDesign(height, width, hashWidthInt) {
    var lastNoise1 = noise.simplex2(100, 10) * 15;
    var lastNoise2 = noise.simplex2(100.1, 10.1) * 15;
    var hashWidth = hashWidthInt * 0.1;
    
    noise.seed(Math.random());
   
    var models = {};
    for ( var i = 0; i <= width; i += 0.1) {
      var newNoise1 = (noise.simplex2(500, (i-100)*1.0/200)+1)*0.2;
      var newNoise2 = (noise.simplex2(5, i*1.0/100)+1)*0.2;
      
      models[i.toString()] = new makerjs.models.ConnectTheDots(true, [
          [i + lastNoise1 + newNoise1, 0],
          [i + lastNoise2 + newNoise2, height],
          [i + lastNoise2 + newNoise2 + hashWidth, height],
          [i + lastNoise1 + newNoise1 + hashWidth, 0]
      ]);

      lastNoise1 = lastNoise1 + newNoise1;
      lastNoise2 = lastNoise2 + newNoise2;
    }

    this.models = models;

    this.units = makerjs.unitType.Inch;
}

Cuff.metaParameters = [
    { title: "Hash Width", type: "range", min: 1, max: 10, value: 1 }
];

module.exports = Cuff;

