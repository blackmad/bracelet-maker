var makerjs = require('makerjs');

// This is a super gross way of deleting the paths that lie along the "safe" inner boundary
// so that the circles are connected to the rest of the cuff
function cleanModel(model) {
    _.each(model.models, function(value, key, list) {
        if (value.alpha) {
            model.models[key] = null;
        } else {
            cleanModel(value)
        }
    })
  }


function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

export class InnerDesignCircles {
  constructor({ 
    height = 2, 
    width = 10, 
    boundaryModel, 
    numCircles,
    maxBorderSize,
    minCircleSize,
    maxCircleSize
    // seed, 
    // bufferWidth, 
    // hashWidth, 
    // initialNoiseRange1, 
    // initialNoiseRange2, 
    // noiseOffset1, 
    // noiseOffset2, 
    // noiseInfluence 
  }) {
    var circleSize = 1.0;
    var currentModel = {}
   
    var madeModel = false;

    
    for (var c = 1; c <= numCircles; c++) {
        const paths = [];
        
        const center = [
            Math.random() * width,
            Math.random() * height
        ];

        const circleSize = getRandomArbitrary(minCircleSize, maxCircleSize)

        paths.push(new makerjs.paths.Circle(
            center, circleSize
        ));
        paths.push(new makerjs.paths.Circle(
            center, circleSize*(1+getRandomArbitrary(0.5, 1.0)*maxBorderSize)
        ));

        var newModel = makerjs.model.combineIntersection(
            makerjs.model.clone(boundaryModel),
            { paths: paths}
        )
        // newModel.models.a = null;

        if (madeModel) {
            currentModel = makerjs.model.combineUnion(
                currentModel,
                newModel
            )
        } else {
            madeModel = true;
            currentModel = newModel
        }
        
    }

    cleanModel(currentModel);
    this.models = currentModel.models;
    this.paths = currentModel.paths;

    this.units = makerjs.unitType.Inch;

  }

 
}

InnerDesignCircles.metaParameters = [
  { title: "Num Circles", type: "range", min: 1, max: 30, value: 3, step: 1, name: 'numCircles' },
  { title: "Max Border Size", type: "range", min: 0.1, max: 0.25, value: 0.1, step: 0.01, name: 'maxBorderSize' },
  { title: "Min Circle Size", type: "range", min: 0.1, max: 2.0, value: 0.5, step: 0.01, name: 'minCircleSize' },
  { title: "Max Circle Size", type: "range", min: 0.1, max: 3.0, value: 1.5, step: 0.01, name: 'maxCircleSize' }
];

export default {}