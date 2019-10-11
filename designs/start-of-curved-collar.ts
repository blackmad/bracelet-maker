// TODO

let collarWidth = 18;
let collarTopLift = 1;
let collarTopSink = 1.5;
let collarBottomSink = 1.5;
let baseHeight = 2;

// core of collar
var rectangle = new Rectangle(0, collarTopLift,  collarWidth, baseHeight);
var cornerSize = 0.4;
var path = new Path.RoundRectangle(rectangle, cornerSize);
path.strokeColor = 'black';
path.strokeWidth = 0.1;

let curveStartDistance = 4;
let curvedLength = 8;

const topPath = new Path()
topPath.strokeColor = 'red';
topPath.strokeWidth = '0.1';

topPath.add(new Point(0, collarTopLift))
topPath.add(new Point(curveStartDistance, collarTopLift))
topPath.add(new Point(curveStartDistance + curvedLength*0.1, 0))
topPath.add(new Point(curveStartDistance + curvedLength*0.5, collarTopLift))
topPath.add(new Point(curveStartDistance + curvedLength*0.9, 0))
topPath.add(new Point(curveStartDistance + curvedLength, collarTopLift))
topPath.add(new Point(collarWidth, collarTopLift))
topPath.smooth({
    type: 'geometric',
    from: 1,
    to: -2
})

const bottomPath = new Path()
bottomPath.strokeColor = 'red';
bottomPath.strokeWidth = '0.1';
const bottomCurvedLength = curvedLength * 0.9
const bottomCurveStartDistance = curveStartDistance + ((curvedLength - bottomCurvedLength)/2)


const bottomBaseLine = collarTopLift + baseHeight;
bottomPath.add(new Point(0, bottomBaseLine))
bottomPath.add(new Point(bottomCurveStartDistance, bottomBaseLine))
// bottomPath.add(new Point(bottomCurveStartDistance + bottomCurvedLength*0.1, 0))
bottomPath.add(new Point(bottomCurveStartDistance + bottomCurvedLength*0.5, bottomBaseLine + collarBottomSink))
// bottomPath.add(new Point(bottomCurveStartDistance + bottomCurvedLength*0.9, 0))
bottomPath.add(new Point(bottomCurveStartDistance + bottomCurvedLength, bottomBaseLine))
bottomPath.add(new Point(collarWidth, bottomBaseLine))
bottomPath.smooth({
    type: 'geometric',
    from: 1,
    to: -2
})

view.translate(0, 40)
view.scale(25, 25, new Point(0,0))
