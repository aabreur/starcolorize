'use strict';
const fs = require('fs-extra');

const config = require('config');

const palettes = config.get('palettes');
const starboundDefaultColorOptionsCount = config.get('starboundDefaultColorOptionsCount')

const templates = {
  item: (crossedPallete) => ({
    "op": "add", 
    "path": "/colorOptions/-", 
    "value": crossedPallete
  }),
  npc: (part, indexList, raceKey) => ({
    "op": "replace", 
    "path": `/items/${raceKey}/0/1/0/${part}/0/parameters/colorIndex`, 
    "value": indexList
  }),
  matchColorIndices: {
    "op": "add", 
    "path": "/matchColorIndices", 
    "value": true
  }
}

const buildtemplate = (template, crossedPalletesList, params) => {
  switch (template) {
    case 'item':
      return crossedPalletesList.map(p => templates.item(p))
    case 'npc':
      const indexList = [...Array(crossedPalletesList.length)].map((_, i) => starboundDefaultColorOptionsCount + i );
      const doc = params.parts.map( p => templates.npc(p, [ ...params.includeVanillaIndexes,  ...indexList], params.raceKey))
      if (params.matchColorIndices) doc.push(templates.matchColorIndices)
      return doc
    default:
      console.log(`Template not found: ${template}.`);
  }
}


function genPatches(inputPath="input.json"){
  let rawdata = fs.readFileSync(inputPath);
  let inputs = JSON.parse(rawdata);
  // console.log("got inputs", inputs)
  // console.log("--------------------------------")
  return inputs.forEach(input => {
    console.log(`---- Starting working on ${input.name} -----`)
    // const rc = runCrossing(input.basePalettes, input.paletteCrossing)
    const rc = input.paletteCrossing
      .map(crossing => 
        recurseCross(input.basePalettes, crossing, palettes.ingame, palettes.featured))
    const crossedPalletesList = [].concat(...rc);

    input.targets.forEach(target => {
      const docJson = JSON.stringify(buildtemplate(target.template, crossedPalletesList, target.params || {}))
      target.paths.forEach(path => {
        const finalPath = config.get('outputBasePath') + path + '.patch'
        console.log("writing "+ finalPath)
        fs.outputFileSync(finalPath, docJson)
      })
    })
  })
}

// function runCrossing(basePalettes, crossings) {
//   const palettes = config.get('palettes');
//   return crossings.map(crossing => recurseCross(basePalettes, crossing, palettes.ingame, palettes.featured))
// }

function recurseCross(basePalettes, crossing, ingamePalettes, featuredPalettes, currentDepth = 0){
  // console.log(`-- entering recurseCross [${currentDepth}] --`)
  // console.log("crossing:")
  // console.log(crossing)
  let crossedPalletes = crossing[currentDepth]
    .map(featuredPaletteName =>
      dictPalettes(
        ingamePalettes[basePalettes[currentDepth]], 
        featuredPalettes[featuredPaletteName]))

  // console.log("crossedPalletes:")
  // console.log(crossedPalletes)
  
  if (crossing[currentDepth + 1]){
    let final_list = []
    crossedPalletes.forEach(crossedPallete => {
      recurseCross(basePalettes, crossing, ingamePalettes, featuredPalettes, currentDepth+1).forEach(p =>{
        // final_list.push(Object.assign(p, crossedPallete))
        final_list = [ 
          ...final_list, 
          { 
            ...p, 
            ...crossedPallete
          }
        ]
      })
    })
    // console.log("final_list:")
    // console.log(final_list)
    return final_list
  } else {
    return crossedPalletes
  }


}


  // colorOptions = [
//   { 
//       "op": "add", 
//       "path": "/colorOptions/-", 
//       "value": {
//           "ffca8a": "FDEE00", "e0975c": "FF7F07", "a85636": "91210B", "6f2919": "701A0B",
//           "b1b1b1": "CFF09E", "7c7a7a": "79BD9A", "5a5859": "3B8686", "353535": "0B486B"
//       } 
//   }
// ]



function dictPalettes(p1, p2) {
  return {
    [p1[0]]: p2[0],
    [p1[1]]: p2[1],
    [p1[2]]: p2[2],
    [p1[3]]: p2[3]
  }
}

console.log(genPatches())


// colorOptions = [
//   { 
//       "op": "add", 
//       "path": "/colorOptions/-", 
//       "value": {
//           "ffca8a": "FDEE00", "e0975c": "FF7F07", "a85636": "91210B", "6f2919": "701A0B",
//           "b1b1b1": "CFF09E", "7c7a7a": "79BD9A", "5a5859": "3B8686", "353535": "0B486B"
//       } 
//   }
// ]

// finalPalettes.forEach(palette1 => {
//   finalPalettes.forEach(palette2 => {
//     colorOptions.push({ 
//       "op": "add", 
//       "path": "/colorOptions/-", 
//       "value": {
//         "ffca8a": palette1[0], "e0975c": palette1[1], "a85636": palette1[2], "6f2919": palette1[3],
//         "b1b1b1": palette2[0], "7c7a7a": palette2[1], "5a5859": palette2[2], "353535": palette2[3]
//       }
//     })
//   })
// })



// const dbConfig = config.get('Customer.dbConfig');


// // let finalPalettes = []

// // palettes.forEach(palette => {
// //   if (palette.length == 4) {
// //     finalPalettes.push(palette) 
// //   } else {
// //     finalPalettes.push(palette.slice(0,4))
// //     finalPalettes.push(palette.slice(1,5)) 
// //   }
// // })

// const finalPalettes = [
//   // dark purple
//   ["736B94", "372D46", "271F2E", "0D0713"],
//   // fire intense
//   // ["FED638", "FEA738", "EA751C", "EA1C1C"],
//   // fire contrast
//   ["FDEE00", "FF7F07", "91210B", "701A0B"],
//   //snow
//   // ["DFE0DB", "C3C6CB", "96B0BD", "4C85A0"],
//   //boreal
//   ["99F2BC", "00B799", "014D7E", "000141"],
//   // ice
//   // ["EDFEFF", "BDFAFF", "76E3F2", "3D9ABF"],
//   // pinkpurple
//   ["EFD5F0", "9E2C83", "4B2676", "2C2350"],
//   // intense green
//   ["D7E009", "72AF14", "3C8000", "124700"],
//   // marrom barata
//   // ["B99863", "8F713B", "4A3A19", "2C2616"],
//   // leaf green
//   ["2F7D6F", "29574A", "003423", "051103"],
//   // clouds
//   // ["F7F9FE", "ECF1F2", "DCE8EB", "BED2D9"],
//   // blood
//   ["FF3030", "B32223", "991D1D", "731616"],
//   // aqua
//   ["00DFFC", "00B4CC", "008C9E", "005F6B"],
//   // moon
//   ["EEE6AB", "C5BC8E", "696758", "36393B"],
//   // olive
//   ["ADB85F", "837B47", "5A3D31", "300018"],
//   // oragetopurple
//   ["CC3E18", "9E0B41", "4A073C", "181419"],
//   // metal
//   ["EBF7F8", "D0E0EB", "88ABC2", "49708A"]
// ]

// console.log(finalPalettes);

// colorOptions = [
//   { 
//       "op": "add", 
//       "path": "/colorOptions/-", 
//       "value": {
//           "ffca8a": "FDEE00", "e0975c": "FF7F07", "a85636": "91210B", "6f2919": "701A0B",
//           "b1b1b1": "CFF09E", "7c7a7a": "79BD9A", "5a5859": "3B8686", "353535": "0B486B"
//       } 
//   }
// ]

// finalPalettes.forEach(palette1 => {
//   finalPalettes.forEach(palette2 => {
//     colorOptions.push({ 
//       "op": "add", 
//       "path": "/colorOptions/-", 
//       "value": {
//         "ffca8a": palette1[0], "e0975c": palette1[1], "a85636": palette1[2], "6f2919": palette1[3],
//         "b1b1b1": palette2[0], "7c7a7a": palette2[1], "5a5859": palette2[2], "353535": palette2[3]
//       }
//     })
//   })
// })


// const json = JSON.stringify(colorOptions);

// const fs = require('fs');


// ['head', 'chest', 'legs', 'back'].forEach(part => fs.writeFile(`/mnt/c/Program Files (x86)/Steam/steamapps/common/Starbound/mods/colourfull/items/armors/other/neo/neo.${part}.patch`, json, 'utf8', 
// (err, result) => {
//   if(err) console.log('error', err);
// }))

// console.log(`${colorOptions.length} color options created`)

// const [, ...result] = Array(colorOptions.length + 12).keys();

// doc = [
//     { 
//       "op": "replace", 
//       "path": "/items/override/0/1/0/head/0/parameters/colorIndex", 
//       "value": result
//     },
//     { 
//         "op": "replace", 
//         "path": "/items/override/0/1/0/chest/0/parameters/colorIndex", 
//         "value": result
//     },
//     { 
//         "op": "replace", 
//         "path": "/items/override/0/1/0/legs/0/parameters/colorIndex", 
//         "value": result
//     },
//     { 
//         "op": "replace", 
//         "path": "/items/override/0/1/0/back/0/parameters/colorIndex", 
//         "value": result
//     }
// ]

// const json2 = JSON.stringify(doc);

// fs.writeFile('/mnt/c/Program Files (x86)/Steam/steamapps/common/Starbound/mods/colourfull/npcs/tenants/neon.npctype.patch', json2, 'utf8', 
// (err, result) => {
//   if(err) console.log('error', err);
// })


