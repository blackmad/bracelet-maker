import { AllInnerDesigns } from './built/designs/inner/all.js';
import { AllOuterDesigns } from './built/designs/outer/all.js';
import { demoDesign } from './built/demo/demo.js';
import { JSDOM } from 'jsdom';
import paper from 'paper-jsdom';
import * as _ from 'lodash';
import fs from 'fs';
import { svg2png } from 'svg-png-converter';
import { InnerDesignSunflower } from './built/designs/inner/sunflower.js';
import { InnerDesignEmpty } from './built/designs/inner/empty.js';

paper.setup();

const outputDir = 'static/demo-output/'

function elHydrator(svg) {
  const el = new JSDOM('<div>' + svg + '</div>');
  return el.window.document.getElementsByTagName('svg')[0];
}

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const readmeFd = fs.openSync('README.md', 'w');


async function generateDesigns(header, designs) {
  fs.writeSync(readmeFd, `# ${header}\n`);
  await asyncForEach(designs, async innerDesign => {
    console.log(innerDesign.name);
    paper.project.activeLayer.removeChildren();
    const svg = demoDesign(paper, new innerDesign(
      new InnerDesignEmpty()
    ), elHydrator);
    fs.writeFileSync(outputDir + innerDesign.name + '.svg', svg);
    const png = await svg2png({
      input: svg,
      encoding: 'dataURL',
      format: 'png'
    });
    let base64Image = png.split(';base64,').pop();
    const outputPath = outputDir + innerDesign.name + '.png';
    fs.writeFileSync(
      outputPath,
      base64Image,
      { encoding: 'base64' },
      function(err) {
        console.log('File created');
      }
    );

    fs.writeSync(readmeFd, `## ${innerDesign.name}\n`);
    fs.writeSync(readmeFd, `![${outputPath}](${outputPath})\n`);
  });
}

async function generateAll() { 
  await generateDesigns('Outer Designs', AllOuterDesigns);
  await generateDesigns('Inner Designs', AllInnerDesigns);
}

generateAll();