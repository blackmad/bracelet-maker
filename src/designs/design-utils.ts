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

export function expandWithoutOutline(model, border, mode) {
  const m = makerjs;
  
  var expansion = m.model.expandPaths(model, border, mode);

  m.model.originate(expansion);
  m.model.simplify(expansion);

  //find chains
  var chains = m.model.findChains(expansion);

  const newModel = { models: {} }

  //start at 1 - ignore the longest chain which is the perimeter
  for (var i = 0; i < chains.length; i++) {

    //save the fillets in the model tree
    newModel.models['' + i] = m.chain.toNewModel(chains[i])
  }

  return newModel;
}