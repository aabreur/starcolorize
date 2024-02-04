const templates = {
    item: (crossedPalette) => ({
        op: "add",
        path: "/colorOptions/-",
        value: crossedPalette
    }),

    npc: (part, indexList, raceKey) => ({
        op: "replace",
        path: `/items/${raceKey}/0/1/0/${part}/0/parameters/colorIndex`,
        value: indexList
    }),

    matchColorIndices: {
        op: "add",
        path: "/matchColorIndices",
        value: true
    },

    buildTemplate: (template, crossedPalettesList, params) => {
        switch (template) {
            case 'item':
                return crossedPalettesList.map(p => templates.item(p));
            case 'npc':
                const indexList = [...Array(crossedPalettesList.length)].map((_, i) => params.starboundDefaultColorOptionsCount + i);
                const doc = params.parts.map(part => templates.npc(part, [...params.includeVanillaIndexes, ...indexList], params.raceKey));
                if (params.matchColorIndices) doc.push(templates.matchColorIndices);
                return doc;
            default:
                console.log(`Template not found: ${template}.`);
                return [];
        }
    }
};

module.exports = templates;
  