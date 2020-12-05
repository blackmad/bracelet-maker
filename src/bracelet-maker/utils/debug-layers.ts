import randomColor from 'randomcolor';

const debugLayers = {};
const debugLayerNames = [];

export function addToDebugLayer(
  paper: paper.PaperScope,
  layerName: string,
  item: paper.Item | paper.Point
) {
  if (!debugLayers[layerName]) {
    const newLayer = new paper.Group();
    debugLayers[layerName] = newLayer;
    debugLayerNames.push(layerName);
    newLayer.visible = false;

    newLayer.style = {
      ...newLayer.style,
      strokeColor: new paper.Color(randomColor()),
      strokeWidth: 0.04,
    };
  }

  let path: paper.Item = null;
  if (item instanceof paper.Point) {
    path = new paper.Path.Circle(item, 0.05);
  } else {
    path = item;
  }
  debugLayers[layerName].addChild(path);
  path.style = debugLayers[layerName].style;
}

export function getDebugLayers() {
  return debugLayers;
}

export function getDebugLayerNames() {
  return debugLayerNames;
}