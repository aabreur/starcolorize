// src/main.js
const { readFileAsync, writeFileAsync } = require('./utils/fileUtils');
const { recurseCross } = require('./utils/paletteUtils');
const { buildTemplate } = require('./templates');
const config = require('./config');

const genPatches = async (inputPath = "input.json") => {
  try {
    const inputs = await readFileAsync(inputPath);
    for (let input of inputs) {
      console.log(`---- Starting working on ${input.name} -----`);
      const rc = input.paletteCrossing
        .map(crossing => recurseCross(
          input.basePalettes,
          crossing,
          config.getPalettes().ingame,
          config.getPalettes().featured));

      const crossedPalettesList = [].concat(...rc);

      for (let target of input.targets) {
        const docJson = JSON.stringify(buildTemplate(target.template, crossedPalettesList, {
          ...target.params,
          starboundDefaultColorOptionsCount: config.getStarboundDefaultColorOptionsCount()
        }));

        for (let path of target.paths) {
          const finalPath = config.getOutputBasePath() + path + '.patch';
          console.log("Writing " + finalPath);
          await writeFileAsync(finalPath, docJson);
        }
      }
    }
  } catch (error) {
    console.error("An error occurred during patch generation:", error);
  }
};

genPatches().then(() => console.log("Patch generation completed."));
