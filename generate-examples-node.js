import { AllInnerDesigns } from './built/designs/inner/all.js';
import { demoAllDesigns, demoDesign } from './built/demo/demo.js';
import { JSDOM } from 'jsdom';
import paper from 'paper-jsdom';
import * as _ from 'lodash';
import fs from 'fs';
import { InnerDesignSunflower } from './built/designs/inner/sunflower.js';
import { svg2png } from 'svg-png-converter';

paper.setup();

function elHydrator(svg) {
  const el = new JSDOM('<div>' + svg + '</div>');
  return el.window.document.getElementsByTagName('svg')[0];
}

if (!fs.existsSync('demo-output')) {
  fs.mkdirSync('demo-output/');
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

asyncForEach(AllInnerDesigns, async innerDesign => {
  console.log(innerDesign.name);
  paper.project.activeLayer.removeChildren();
  const svg = demoDesign(paper, new innerDesign(), elHydrator);
  fs.writeFileSync('demo-output/' + innerDesign.name + '.svg', svg);
  const png = await svg2png({
    input: svg,
    encoding: 'dataURL',
    format: 'png'
  });
  let base64Image = png.split(';base64,').pop();
  fs.writeFile(
    'demo-output/' + innerDesign.name + '.png',
    base64Image,
    { encoding: 'base64' },
    function(err) {
      console.log('File created');
    }
  );
});

// const svg = demoDesign(paper, new InnerDesignSunflower(), elHydrator);
// console.log(svg);
