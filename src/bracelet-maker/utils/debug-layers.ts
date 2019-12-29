import * as randomColor from 'randomcolor';

const debugLayers = {};
const debugLayerNames = [];

export function addToDebugLayer(
  paper: paper.PaperScope,
  layerName: string,
  item: paper.Item
) {
  if (!debugLayers[layerName]) {
    console.log('making layer')
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
  debugLayers[layerName].addChild(item);
  item.style = debugLayers[layerName].style;
}

export function getDebugLayers() {
  return debugLayers;
}

export function getDebugLayerNames() {
  return debugLayerNames;
}