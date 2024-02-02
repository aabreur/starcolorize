

const fs = require('fs');

const [, ...result] = Array(454).keys();

doc = [
    { 
      "op": "replace", 
      "path": "/items/override/0/1/0/head/0/parameters/colorIndex", 
      "value": result
    },
    { 
        "op": "replace", 
        "path": "/items/override/0/1/0/chest/0/parameters/colorIndex", 
        "value": result
    },
    { 
        "op": "replace", 
        "path": "/items/override/0/1/0/legs/0/parameters/colorIndex", 
        "value": result
    },
    { 
        "op": "replace", 
        "path": "/items/override/0/1/0/back/0/parameters/colorIndex", 
        "value": result
    }
]

const json = JSON.stringify(doc);

fs.writeFile(`neon.npctype.patch`, json, 'utf8', 
(err, result) => {
  if(err) console.log('error', err);
})