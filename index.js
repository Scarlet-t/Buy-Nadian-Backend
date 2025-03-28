// server.js
import express from 'express';
import openai from './api/oai.js';

const app = express();
const PORT = 6969;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Buy-Nadian Engine running');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

import OpenFoodFacts from "node_modules/@openfoodfacts/openfoodfacts-nodejs";

const client = new OpenFoodFacts();

console.log(client);

