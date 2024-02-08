// src/main.js
const { readFileAsync, writeFileAsync } = require('./utils/fileUtils');
const { paletteCross } = require('./utils/paletteUtils');
const { buildTemplate } = require('./templates');
const settings = require('./settings');

const genPatches = async (inputPath = "input.json") => {
  try {
    const inputs = await readFileAsync(inputPath);
    for (let input of inputs) {
      console.log(`---- Starting working on ${input.name} -----`);
      const rc = input.paletteCrossing
        .map(crossing => paletteCross(
          input.basePalettes,
          crossing,
          settings.palettes()));

      const crossedPalettesList = [].concat(...rc);

      for (let target of input.targets) {
        const docJson = JSON.stringify(buildTemplate(target.template, crossedPalettesList, {
          ...target.params,
          starboundDefaultColorOptionsCount: settings.STARBOUND_DEFAULT_COLOR_OPTIONS_COUNT
        }));

        for (let path of target.paths) {
          const finalPath = settings.outputBasePath() + path + '.patch';
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
