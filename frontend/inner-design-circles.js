var makerjs = require('makerjs');


function cleanModel(model) {
    _.each(model.models, function(value, key, list) {
        console.log('looking at')
        console.log(key)
        console.log(value)
        if (value.alpha) {
            model.models[key] = null;
            console.log('nulling')
        } else {
            cleanModel(value)
        }
    })
  }

export class InnerDesignCircles {
  constructor({ 
    height = 2, 
    width = 10, 
    boundaryModel, 
    numRows,
    circleBorderConstant
    // seed, 
    // bufferWidth, 
    // hashWidth, 
    // initialNoiseRange1, 
    // initialNoiseRange2, 
    // noiseOffset1, 
    // noiseOffset2, 
    // noiseInfluence 
  }) {

    var rows = numRows;
    var circleSize = (height / rows);
    var cols = width / circleSize;
    var currentModel = {}
   
    var madeModel = false;

    for (var r = 1; r <= rows; r++) {
        for (var c = 1; c <= cols; c++) {
            const paths = [];
           
            const offset = (r % 2) * circleSize * 0.5;
            const center = [c*circleSize + offset, r*circleSize]
            paths.push(new makerjs.paths.Circle(
                center, circleSize*0.75
            ));
            paths.push(new makerjs.paths.Circle(
                center, circleSize*0.75*(1+circleBorderConstant)
            ));

            var newModel = makerjs.model.combineIntersection(
                makerjs.model.clone(boundaryModel),
                { paths: paths}
            )
            console.log(newModel);
            // newModel.models.a = null;

            if (madeModel) {
                currentModel = makerjs.model.combineUnion(
                    currentModel,
                    newModel
                )
                console.log(currentModel);
            } else {
                madeModel = true;
                currentModel = newModel
            }
            
        }
    }
    console.log(currentModel);


    cleanModel(currentModel);
    this.models = currentModel.models;
    this.paths = currentModel.paths;

    this.units = makerjs.unitType.Inch;

  }

 
}

InnerDesignCircles.metaParameters = [
  { title: "Num Rows", type: "range", min: 1, max: 10, value: 3, step: 1, name: 'numRows' },
  { title: "Border Size", type: "range", min: 0.1, max: 0.75, value: 0.1, step: 0.01, name: 'circleBorderConstant' }
];

export default {}