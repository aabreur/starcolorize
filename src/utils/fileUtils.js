// src/utils/fileUtils.js
const fs = require('fs-extra');

const readFileAsync = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    throw error; // Rethrow to handle it in the caller function
  }
};

const writeFileAsync = async (filePath, content) => {
  try {
    await fs.outputFile(filePath, content);
    console.log(`Successfully wrote file: ${filePath}`);
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error);
    throw error; // Rethrow to handle it in the caller function
  }
};

module.exports = {
  readFileAsync,
  writeFileAsync,
};