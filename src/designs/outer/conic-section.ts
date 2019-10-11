import { Angle } from '../../utils/angle';

import * as paper from 'paper';
import { Path } from 'opentype.js';

export default makeConicSection;

function arcOver({ center, radius, startAngle, endAngle }) {
  console.log({ center, radius, startAngle, endAngle });
  const path = new paper.Path();
  path.moveTo(
    center.add(new paper.Point({ length: radius, angle: startAngle }))
  );
  const sweepAngle = endAngle - startAngle;
  var isOver180 = Math.abs(sweepAngle) > 180;
  var isPositive = sweepAngle > 0;

  path.arcTo(
    center.add(
      new paper.Point({
        length: radius,
        angle: startAngle + sweepAngle
      })
    ),
    new paper.Size(radius, radius),
    // @ts-ignore
    sweepAngle,
    isPositive,
    isOver180
  );

  path.strokeColor = 'blue';
  path.strokeWidth = 10;
  return path;
}
export function makeConicSection({
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

  var T = L / Math.PI; // top width of cross section of cone
  var B = M / Math.PI; // bottom width of cross section of cone
  var H = height; // height of cross section of cone

  var R = Math.sqrt(Math.pow(0.5 * B - 0.5 * T, 2) + Math.pow(H, 2)); // height of conical section
  var P = R / (B - T); // short radius
  var Q = P + R; // long radius
  var alpha = Angle.fromRadians(L / P);

  // For making inner/offset conic sections, this calculates how much to offset the angle
  var widthOffsetAngle = Angle.fromRadians(widthOffset / Q);

  // Compute the arcs that make up the cuff
  var cuffPaths = {
    p1: arcOver({
      center: new paper.Point(0, 0),
      radius: P + heightOffset,
      startAngle: widthOffsetAngle.degrees,
      endAngle: alpha.degrees - widthOffsetAngle.degrees
    }),
    p2: arcOver({
      center: new paper.Point(0, 0),
      radius: Q - heightOffset,
      startAngle: widthOffsetAngle.degrees,
      endAngle: alpha.degrees - widthOffsetAngle.degrees
    })
  };

  console.log(cuffPaths['p1']);

  // // Compute the lines that connect the two arcs
  cuffPaths['l1'] = new paper.Path.Line(
    cuffPaths['p1'].segments[0].point,
    cuffPaths['p2'].segments[0].point
  )
  cuffPaths['l2'] = new paper.Path.Line(
    cuffPaths['p1'].segments[1].point,
    cuffPaths['p2'].segments[1].point
  )
  // cuffPaths['l2'] = new makerjs.paths.Line(
  //     makerjs.point.fromArc(cuffPaths['p1'])[1],
  //     makerjs.point.fromArc(cuffPaths['p2'])[1]
  // );

  // // make the paths into a unified model
  // var cuffModel = {paths: cuffPaths} // makerjs.chain.toNewModel(cuffChain);

  // const closedModel = new paper.CompoundPath([cuffPaths['p1'], cuffPaths['l1'], cuffPaths['p2'], cuffPaths['l2']]);
  const closedModel = new paper.CompoundPath([cuffPaths['p1'], cuffPaths['p2']]);

  closedModel.closePath();
  closedModel.rotate(90 - alpha.degrees / 2);

  return {
    model: closedModel,
    widthOffset: widthOffsetAngle,
    alpha: alpha,
    shortRadius: P,
    longRadius: Q
  };
}
