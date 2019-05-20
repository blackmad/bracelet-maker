export default InnerDesignHashmarks;

var makerjs = require('makerjs');

export function InnerDesignHashmarks({
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
}) {
    var simplex = new SimplexNoise(seed.toString());
    var lastNoise1 = simplex.noise2D(100, 10) * initialNoiseRange1;
    var lastNoise2 = simplex.noise2D(100.5, 10.5) * initialNoiseRange2;

    var models = {};
    var pos = -width ;
    var i = 0;
    while (pos <= width*2) {
      var newNoise1 = ((simplex.noise2D(i/200, i/300)) + noiseOffset1) * noiseInfluence;
      var newNoise2 = ((simplex.noise2D(i/20, i/30)) + noiseOffset2) * noiseInfluence;
    //   console.log(newNoise1);
      i += 1;
      
      const m = new makerjs.models.ConnectTheDots(true, [
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