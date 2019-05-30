import { SimplexNoise } from '../external/simplex-noise.mjs';

var makerjs = require('makerjs');

// This is a super gross way of deleting the paths that lie along the "safe" inner boundary
// so that the circles are connected to the rest of the cuff
function extractBoundaryChunks(model) {
    const chunks = [];
    extractBoundaryChunksHelper(model, chunks);
    return chunks;
}

function extractBoundaryChunksHelper(model, chunks) {
if (!model || !model.models) { return }
for (let [key, value] of Object.entries(model.models)) {
    if (value.alpha) {
        chunks.push(model.models[key]);
        delete model.models[key];
    } else {
        extractBoundaryChunksHelper(value, chunks)
    }
}
}

function lineLength(line) {
    return Math.sqrt(Math.pow(line.end[0] - line.origin[0], 2) + Math.pow(line.end[1] - line.origin[1], 2));
}

function combineIntersection(modelA, modelB, options) {
    return makerjs.model.combine(modelA, modelB, true, false, true, false);
}

function extractPaths(model, optionalType) {
    const paths = [];
    var walkOptions = {
        onPath: function (wp) {
            if (!optionalType || optionalType == wp.pathContext.type) {
                paths.push(wp.pathContext);
            }
        }
      };
      
    makerjs.model.walk(model, walkOptions);
    return paths;
}

function approxSlope(line) {
    if (!line.end) { return NaN; }
    return Math.round(
        (line.origin[0] - line.end[0]) / (line.origin[1] - line.end[1]) * 1000
    )
}

export class InnerDesignCircles {
    makeInvertedBorder({currentModel, boundaryModel}) {
        makerjs.model.originate(currentModel);
        makerjs.model.originate(boundaryModel, currentModel.origin);
        makerjs.model.simplify(currentModel);

        const boundaryChunksArray = extractBoundaryChunks(currentModel);
        const boundaryChunks = {};
        boundaryChunksArray.forEach((chunk, index) => boundaryChunks[index.toString()] = chunk);
    
        const boundaryArcGroups = {}
        const boundaryLineGroups = {}

        var walkOptions = {
            onPath: function (wp) {
              if (wp.pathContext.type === 'arc') {
                  if (!boundaryArcGroups[wp.pathContext.radius]) {
                    boundaryArcGroups[wp.pathContext.radius] = []
                  }
                boundaryArcGroups[wp.pathContext.radius].push(wp.pathContext);
              }
              if (wp.pathContext.type === 'line') {
                  const slope = approxSlope(wp.pathContext);
                  if (!boundaryLineGroups[slope]) {
                    boundaryLineGroups[slope] = []
                  }
                  boundaryLineGroups[slope].push(wp.pathContext);
              }
            }
          };
          
        makerjs.model.walk({models: boundaryChunks}, walkOptions);
        
        // Take all the chunks of arcs we have along the edges and, because we want their inverse
        // -- so that the circles are anchored to the edges -- we connect the end of each piece
        // to the start of the next one
        // There's a boundary case here at the very edge/corners of our model
        const paths = []
        const boundaryArcsByRadius = _.groupBy(extractPaths(boundaryModel, 'arc'), l => l.radius)
        _.each(boundaryArcsByRadius, (arcs, radius) => {
            if (!boundaryArcGroups[radius]) {
                paths.push(arcs[0]);
            }
        })
        for (let [radius, value] of Object.entries(boundaryArcGroups)) {
            console.log(extractPaths(boundaryModel))
            const overallArc = _.find(extractPaths(boundaryModel), p => p.radius && p.radius == radius)
            value.sort((a, b) => (a.startAngle - b.startAngle))
            const modifiedValue = _.flatten([
                [new makerjs.paths.Arc(value[0].origin, overallArc.radius, overallArc.startAngle, overallArc.startAngle)],
                value,
                [new makerjs.paths.Arc(value[0].origin, overallArc.radius, overallArc.endAngle, overallArc.endAngle)]
            ])

            for (let i = 0; i < modifiedValue.length - 1; i++) {
                const thisArc = modifiedValue[i];
                const nextArc = modifiedValue[i + 1];
                console.log(i)
                console.log(thisArc)
                console.log(nextArc)
                if (Math.abs(thisArc.endAngle - nextArc.startAngle) > 0.001) {
                    paths.push(
                        new makerjs.paths.Arc(
                            thisArc.origin,
                            thisArc.radius,
                            thisArc.endAngle,
                            nextArc.startAngle
                    ))
                }
            }
        }

        // Still a line bug in: https://127.0.0.1:5500/new-playground/frontend.html#ConicCuffOuter.height=2&ConicCuffOuter.wristCircumference=7&ConicCuffOuter.forearmCircumference=7.75&ConicCuffOuter.safeBorderWidth=0.25&InnerDesignCircles.seed=3325&InnerDesignCircles.numCircles=29&InnerDesignCircles.maxBorderSize=0.1&InnerDesignCircles.minCircleSize=0.5&InnerDesignCircles.maxCircleSize=1.5&InnerDesignCircles.centerXNoiseDenom1=20&InnerDesignCircles.centerXNoiseDenom2=20&InnerDesignCircles.centerYNoiseDenom1=20&InnerDesignCircles.centerYNoiseDenom2=10

        // Now do the same as above except for the lines

        // If say, there are no points at all on the edge, we want to still include that line, so 
        // just add in the entire thing
        const boundaryLinesBySlope = _.groupBy(extractPaths(boundaryModel, 'line'), l => approxSlope(l))
        _.each(boundaryLinesBySlope, (lines, slope) => {
            if (!boundaryLineGroups[slope]) {
                paths.push(lines[0]);
            }
        })

        for (let [slope, value] of Object.entries(boundaryLineGroups)) {
            // dunno if this is useful - sometimes we end up with two overlapping line segments on 
            // the border that confuses our logic, this tries to dedupe it by taking what I think is
            // the longest one
            const originMap = _.groupBy(value, v => v.origin);
            _.keys(originMap).forEach(key => {
                var value = originMap[key];
                if (value.length > 1){
                    const sortedByLength = _.sortBy(value, lineLength);
                    originMap[key] = _.last(sortedByLength);
                } else {
                    originMap[key] = originMap[key][0]
                }
            })

            const overallLine = _.find(extractPaths(boundaryModel), l => approxSlope(l) == slope);

            const lines = _.flatten([
                [new makerjs.paths.Line(overallLine.end, overallLine.end)],
                Object.values(originMap).sort((a, b) => (b.origin[1] - a.origin[1])),
                [new makerjs.paths.Line(overallLine.origin, overallLine.origin)]
            ])
            
            for (let i = 0; i < lines.length - 1; i++) {
                const thisArc = lines[i];
                const nextArc = lines[i + 1];
                const possibleLine = new makerjs.paths.Line(
                    thisArc.origin,
                    nextArc.end
                )
                if (lineLength(possibleLine) > 0.01) {
                    paths.push(possibleLine);
                }
            }
        }
        return paths;
    }

  constructor({ 
    height = 2, 
    width = 10, 
    boundaryModel, 
    numCircles,
    maxBorderSize,
    minCircleSize,
    maxCircleSize,
    seed,
    centerXNoiseDenom1,
    centerXNoiseDenom2,
    centerYNoiseDenom1,
    centerYNoiseDenom2
  }) {
    var simplex = new SimplexNoise(seed.toString());

    var currentModel = {}
   
    var madeModel = false;

    var combineOptions = {};
    for (var c = 1; c <= numCircles; c++) {
        const paths = [];
        
        const center = [
            simplex.noise2DInRange(c/centerXNoiseDenom1, c/centerXNoiseDenom2, 0, width),
            simplex.noise2DInRange(c/centerYNoiseDenom1, c/centerYNoiseDenom2, 0, height)
        ];

        const circleSize = simplex.noise2DInRange(c/20, c/10, minCircleSize, maxCircleSize);
        const borderCoefficient = 1 + simplex.noise2DInRange(c/10, c/20, 0.1, maxBorderSize);

        paths.push(new makerjs.paths.Circle(
            center, circleSize
        ));
        paths.push(new makerjs.paths.Circle(
            center, circleSize*borderCoefficient
        ));

        var newModel = combineIntersection(
            makerjs.model.clone(boundaryModel),
            { paths: paths},
            combineOptions
        )
        delete combineOptions['measureeB']
        
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

    this.paths = this.makeInvertedBorder({currentModel, boundaryModel})

    this.models = currentModel.models;
    this.units = makerjs.unitType.Inch;
  }
}

InnerDesignCircles.metaParameters = [
  { title: "Seed", type: "range", min: 1, max: 10000, value: 1, step: 1, name: 'seed' },
  { title: "Num Circles", type: "range", min: 1, max: 40, value: 20, step: 1, name: 'numCircles' },
  { title: "Max Border Size", type: "range", min: 0.1, max: 0.25, value: 0.1, step: 0.01, name: 'maxBorderSize' },
  { title: "Min Circle Size", type: "range", min: 0.1, max: 2.0, value: 0.5, step: 0.01, name: 'minCircleSize' },
  { title: "Max Circle Size", type: "range", min: 0.1, max: 3.0, value: 1.5, step: 0.01, name: 'maxCircleSize' },
  { title: "Center X Noise Demon 1", type: "range", min: 1, max: 40, value: 20, step: 1, name: 'centerXNoiseDenom1' },
  { title: "Center X Noise Demon 2", type: "range", min: 1, max: 40, value: 20, step: 1, name: 'centerXNoiseDenom2' },
  { title: "Center Y Noise Demon 1", type: "range", min: 1, max: 40, value: 20, step: 1, name: 'centerYNoiseDenom1' },
  { title: "Center Y Noise Demon 2", type: "range", min: 1, max: 40, value: 10, step: 1, name: 'centerYNoiseDenom2' }
];

export default {}