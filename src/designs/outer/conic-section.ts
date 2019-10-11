import { Angle } from '../../utils/angle';

import * as paper from 'paper';
import { Path } from 'opentype.js';
import { start } from 'repl';

export default makeConicSection;

function getArcPoint({ center, radius, angle }) {
  return center.add(new paper.Point({ length: radius, angle: angle }));
}

function arcOver({ path, center, radius, startAngle, endAngle }) {
  console.log({ center, radius, startAngle, endAngle });
  path.moveTo(getArcPoint({ center, radius, angle: startAngle }));
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

  // path.strokeColor = 'blue';
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

  const center = new paper.Point(0, 0);

  const path = arcOver({
    path: new paper.Path(),
    center,
    radius: P + heightOffset,
    startAngle: widthOffsetAngle.degrees,
    endAngle: alpha.degrees - widthOffsetAngle.degrees
  });

  path.lineTo(
    getArcPoint({center, radius: Q - heightOffset, angle: alpha.degrees - widthOffsetAngle.degrees}))

  arcOver({
    path,
    center: new paper.Point(0, 0),
    radius: Q - heightOffset,
    startAngle: alpha.degrees - widthOffsetAngle.degrees,
    endAngle: widthOffsetAngle.degrees
  });

  path.closePath();
  path.fillColor = 'lightgrey';

  return {
    model: path,
    widthOffset: widthOffsetAngle,
    alpha: alpha,
    shortRadius: P,
    longRadius: Q
  };
}
