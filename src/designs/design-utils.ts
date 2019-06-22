var makerjs = require("makerjs");

export const MillimeterToInches = 0.0393701;
export const RivetRadius = 2.5 * MillimeterToInches;
export const BeltHoleRadius = 3 * MillimeterToInches;

export function makeEvenlySpacedBolts(numBolts, p1, p2) {

  var rivetHole = new makerjs.models.Oval(RivetRadius, RivetRadius);
  var rivetRow = null;

  // still don't love where these are centered
  rivetRow = makerjs.layout.cloneToRow(rivetHole, numBolts * 2 + 1);
  var leftBoltPath = new makerjs.paths.Line(p1, p2);
  var leftBolts = makerjs.layout.childrenOnPath(rivetRow, leftBoltPath, 0.85);

  for (const key in leftBolts["models"]) {
    if (Number(key) % 2 == 0) {
      delete leftBolts["models"][key];
    }
  }

  return leftBolts;
}