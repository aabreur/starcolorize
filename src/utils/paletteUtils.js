const dictPalettes = (p1, p2) => ({
    [p1[0]]: p2[0],
    [p1[1]]: p2[1],
    [p1[2]]: p2[2],
    [p1[3]]: p2[3]
});
  
const paletteCross = (sourcePalettes, crossing, palettes, currentDepth = 0, memo = {}) => {
    const memoKey = `${currentDepth}-${crossing[currentDepth].join('-')}`;
    if (memo[memoKey]) {
        return memo[memoKey];
    }

    let crossedPalettes = crossing[currentDepth].map(featuredPaletteName =>
        dictPalettes(palettes[sourcePalettes[currentDepth]], palettes[featuredPaletteName]));

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

module.exports = {
    paletteCross
};
