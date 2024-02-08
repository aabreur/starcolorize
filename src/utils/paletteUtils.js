
function mapPalettes(p1, p2) {
    return p1.reduce((obj, key, index) => {
        obj[key] = p2[index]; 
        return obj;
    }, {});
}
  
function paletteCross(sourcePalettes, crossing, palettes, currentDepth = 0, memo = {}) {
    const memoKey = `${currentDepth}-${crossing[currentDepth].join('-')}`;
    if (memo[memoKey]) {
        return memo[memoKey];
    }

    let crossedPalettes = crossing[currentDepth].map(featuredPaletteName =>
        mapPalettes(palettes[sourcePalettes[currentDepth]], palettes[featuredPaletteName]));

    if (crossing[currentDepth + 1]) {
        let finalList = [];
        for (const crossedPalette of crossedPalettes) {
            const nextCross = paletteCross(sourcePalettes, crossing, palettes, currentDepth + 1, memo);
            for (const p of nextCross) {
                finalList.push({ ...p, ...crossedPalette });
            }
        }
        memo[memoKey] = finalList;
        return finalList;
    } else {
        memo[memoKey] = crossedPalettes;
        return crossedPalettes;
    }
};

async function fromHexFileToPalette(palette) {
    const hexFile = await readFileAsync(`palettes/${palette}.hex`);
    return hexFile.split('\n').map(line => line.split(' ').map(Number));
}

module.exports = {
    paletteCross
};
