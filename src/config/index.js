// src/config/index.js
const config = require('config');

module.exports = {
  getPalettes: () => config.get('palettes'),
  getStarboundDefaultColorOptionsCount: () => config.get('starboundDefaultColorOptionsCount'),
  getOutputBasePath: () => config.get('outputBasePath'),
};