import { AllInnerDesigns, InnerDesignsToAnimate } from "./built/designs/inner/all.js";
import { demoDesign } from "./built/demo/demo.js";
import { JSDOM } from "jsdom";
import paper from "paper-jsdom";
import * as _ from "lodash";
import fs from "fs";
import { InnerDesignEmpty } from "./built/designs/inner/empty.js";
// const child_process = require("child_process");
import querystring from 'querystring';


var SegfaultHandler = require("segfault-handler");

SegfaultHandler.registerHandler("crash.log"); // With no argument, SegfaultHandler will generate a generic log file name

paper.setup();
paper.settings.insertItems = false;

function elHydrator(svg) {
  const el = new JSDOM("<div>" + svg + "</div>");
  return el.window.document.getElementsByTagName("svg")[0];
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

async function generateDesigns(innerDesign) {
  const outputDir = "animation-scratch/" + innerDesign.name + '/';

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const times = _.times(100, (n) => n);
  let lastParams = {safeBorderWidth: 0.1};

  await asyncForEach(times, async (time) => {
    console.log(time);
    paper.project.activeLayer.removeChildren();

    const numMetaParametersToChange = time === 0 ? 1000 : 1;

    const {params, svg} = await demoDesign(
      paper,
      new innerDesign(new InnerDesignEmpty()),
      elHydrator,
      true,
      new paper.Rectangle(0, 0, 6, 6),
      lastParams,
      // 1.2,
      0.0
    );

    console.log(params);

    lastParams = {...params};

    const jsonPath = outputDir + time + ".json";
    fs.writeFileSync(jsonPath, JSON.stringify(params, null, 2));

    const outerDesignName = 'BoxOuter';

    // http://localhost:8080/#/newPlayground/BoxOuter/InnerDesignSnowflake
    const hosts = ['http://localhost:8080', 'http://gen1-alpha.blackmade.co']
    const urls = hosts.map((host) => {
      const urlParams = {};
      _.map(params, (value, key) => {
        urlParams[innerDesign.name + '.' + key] = value;
      });

      urlParams[`${outerDesignName}.height`] = 6;
      urlParams[`${outerDesignName}.topWidth`] = 6;
      urlParams[`${outerDesignName}.bottomWidth`] = 6;

      const path = `/#/newPlayground/${outerDesignName}/${innerDesign.name}`;
      const url = `${host}${path}?${querystring.stringify(urlParams)}`;
      console.log(url)
      return url;
    });

    const txtPath = outputDir + time + ".txt";
    fs.writeFileSync(txtPath, urls.join('\n'));

    if (!svg) {
      return;
    }

    const svgPath = outputDir + time + ".svg";
    fs.writeFileSync(svgPath, svg);

    // const outputPath = outputDir + innerDesign.name + "-" + time + '.png';
    // child_process.execSync(`svg2png -w 600 -o ${outputPath} ${svgPath}`);
    // fs.writeSync(readmeFd, `## ${innerDesign.name}\n`);
    // fs.writeSync(readmeFd, `![${outputPath}](${outputPath})\n`);
  });
}

async function generateAll() {
  for (let i = 0; i < InnerDesignsToAnimate.length; i++) {
    await generateDesigns(InnerDesignsToAnimate[i]);
  }
}

generateAll();
