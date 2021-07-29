const fs = require('fs');
const express = require('express');
const IPFS = require('ipfs-core');
const blender = require('./image-blend-randomize');

const app = express();
const port = process.env.PORT || 4000;
let node = null;

let sameCallStr = "";

app.get('/', async (req, res) => {
  if (!node) node = await IPFS.create({ repo: 'ipfs' });
  else if (typeof node.then === 'function') await node;

  await blender.genRandomImage();

  var characterId = req.query.characterId;
  var characterName = "Turtle #" + characterId;
  console.log("Turtle name: " + characterName);

  var speed = parseInt(req.query.score);
  speed += parseInt(Math.random() * 51);
  console.log("Speed: " + speed);

  const imgdata = fs.readFileSync('character.png');
  const image_response = await node.add({
    content: imgdata,
  });
  const char_json = await JSON.stringify({
    name: characterName,
    image: `https://ipfs.io/ipfs/${image_response.path}`,
    attributes: [
      { trait_type: 'speed', value: speed },
    ],
  });
  const json_response = await node.add({
    content: char_json,
  });
  var str = json_response.path;
  sameCallStr = str.slice(26);
  str = str.slice(0, 26);
  console.log("Part 1 Hash: " + str);
  console.log("Part 2 Hash: " + sameCallStr);
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
