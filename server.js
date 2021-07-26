const fs = require('fs');
const express = require('express');
const IPFS = require('ipfs-core');
const blender = require('./image-blend-randomize');
const CID = require('cids');

const app = express();
const port = process.env.PORT || 4000;
let node = null;

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
  const cid = new CID(json_response.cid).toV1().toString('base16upper');
  res.json({
    IPFS_PATH: Number('0x' + cid.slice(9)),
  });
});

app.listen(port, () => {
  console.log(`app listening at port: ${port}`);
});
