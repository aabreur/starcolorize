const fs = require('fs'); 
const path = require('path');

// load config
const config = require('config');

// load palettes
const palettesPath = path.join(__dirname, '..', '..', 'palettes'); 
const palettes = {};
fs.readdirSync(palettesPath).forEach((file) => { 
    const paletteName = path.basename(file, '.json'); 
    const palettePath = path.join(palettesPath, file); 
    const paletteData = require(palettePath);
    for (const key in paletteData) {
        palettes[`${paletteName}:${key}`] = paletteData[key];
    }
});

// constants
const constants = {
    STARBOUND_DEFAULT_COLOR_OPTIONS_COUNT: 12,
};

module.exports = {
  palettes: () => palettes,
  outputBasePath: () => config.get('outputBasePath'),
    ...constants
};