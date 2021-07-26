const fs = require('fs');
const express = require('express');
const IPFS = require('ipfs-core');
const blender = require('./image-blend-randomize');

const app = express();
const port = process.env.PORT || 4000;
let node = null;

let sameCall = false;
let sameCallStr = "";

app.get('/', async (req, res) => {
  if (!node) node = await IPFS.create({ repo: 'ipfs' });
  else if (typeof node.then === 'function') await node;

  await blender.genRandomImage();

  const imgdata = fs.readFileSync('character.png');
  const image_response = await node.add({
    content: imgdata,
  });
  const char_json = await JSON.stringify({
    name: 'Super Turtle',
    image: `https://ipfs.io/ipfs/${image_response.path}`,
    attributes: [
      { trait_type: 'speed', value: Math.floor(Math.random() * 10) },
    ],
  });
  const json_response = await node.add({
    content: char_json,
  });
  var str = json_response.path;
  sameCallStr = str.slice(26);
  console.log("same call str is " + sameCallStr);
  str = str.slice(0,26);
  sameCall = true;
  console.log("str is " + str);
  res.json({
    IPFS_PATH: str
  });
});

app.get('/second', async (req, res) => {
  res.json({
    IPFS_PATH: sameCallStr
  });
});

app.listen(port, () => {
  console.log(`app listening at port: ${port}`);
});
