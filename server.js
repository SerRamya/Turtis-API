import fs from 'fs';
import express from 'express';
import { genRandomImage } from './image-blend-randomize.js';
import { NFTStorage, File } from "nft.storage";
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDk2NGY5QzI1NWFENzY0NTZEQTM0NmI0NUUwOTFCNzNGNzMwNEI4ZTAiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYyNzYzMjkwNzY0NiwibmFtZSI6InR1cnRpc19uZnQifQ.2seJ15GsY20_WuQ75Ug-9176cSWQRAGbTKquel5ox30';
const client = new NFTStorage({ token: apiKey });

let sameCallStr = "";

app.get('/', async (req, res) => {
  await genRandomImage();

  var characterId = req.query.characterId;
  var characterName = "Turtle #" + characterId;
  console.log("Turtle name: " + characterName);

  var speed = parseInt(req.query.score);
  speed += parseInt(Math.random() * 51);
  console.log("Speed: " + speed);

  const imgdata = fs.readFileSync('character.png');
  const metadata = await client.store({
      name: characterName,
      description: 'An amazing turtle that can dodge through platforms',
      image: new File([imgdata], 'character.png', { type: 'image/png' }),
      attributes: [
        { trait_type: 'speed', value: speed },
      ],
  });

  var str = metadata.ipnft;
  sameCallStr = str.slice(31);
  str = str.slice(0, 31);
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
