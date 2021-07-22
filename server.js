const fs = require('fs');
const express = require('express');
const IPFS = require('ipfs');
const blender = require('./image-blend-randomize');

const app = express();
const port = 3000;
let node = null;

app.get('/', async (req, res) => {
  if (!node) node = await IPFS.create();
  blender.genRandomImage();

  const imgdata = fs.readFileSync('character.png');
  const image_response = await node.add({
    content: imgdata,
  });
  const char_json = await JSON.stringify({
    name: 'Super Turtle',
    image: `https://ipfs.io/ipfs/${image_response.path}`,
    attributes: [{ trait_type: 'speed', value: 1 }],
  });
  const json_response = await node.add({
    content: char_json,
  });
  res.send(`https://ipfs.io/ipfs/${json_response.path}`);
});

app.listen(port, () => {
  console.log(`app listening at port: ${port}`);
});
