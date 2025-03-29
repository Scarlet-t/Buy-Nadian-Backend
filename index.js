// npm
import express from "express";

// api directory
import * as oai from "./api/oai.js";
import * as nano from "./api/nanogpt.js";
import { fetchProductsByFields } from "./api/openFoodFacts.js";

// modules directory
import * as pModule from "./modules/productsModule.js";
import {calculateScore} from './modules/scoring.js';

const app = express();
const PORT = 6969;

app.use(express.json());

// ROUTES HERE
app.get("/", (req, res) => {
  res.send("Buy-Nadian Engine running");
});

import data from "./data/testData.json" assert { type: "json" };
app.get("/test", async (req, res) => {
  let array = [];
  data.forEach((item) => {
    let it = pModule.extractProductDetails(item);
    array.push(it);
  });
  res.json(array);
});

const testJson = {
  "code": "0048001213487",
  "product_name": "Mayonnaise",
  "brand": "Hellmann's,Unilever",
  "brand_tags": [
      "hellmann-s",
      "unilever"
  ],
  "description": "Mayonnaise",
  "categories": [
      "en:condiments",
      "en:sauces",
      "en:mayonnaises",
      "en:groceries"
  ],
  "image": "https://images.openfoodfacts.org/images/products/004/800/121/3487/front_en.6.400.jpg",
  "labels": [
      "en:no-gluten",
      "en:kosher",
      "en:omega-3",
      "en:high-in-omega-3",
      "en:kosher-parve",
      "en:orthodox-union-kosher",
      "en:parve"
  ],
  "allergens": [
      "en:eggs",
      "en:soybeans"
  ],
  "additives": [
      "en:e385"
  ],
  "is_imported": true,
  "manufacturing_places": "Canada,USA",
  "origins": "États-Unis",
  "origins_tags": [
      "en:united-states"
  ],
  "eco_score": "c",
  "nutrition_grade": "e",
  "is_vegan": false,
  "is_vegetarian": false,
  "is_gluten_free": false,
  "ingredient_text": "soybean oil, water, whole eggs and egg yolks (whole eggs and egg yolks), vinegar, salt, sugar, lemon juice concentrate, calcium disodium edta (used to protect quality), natural flavors,",
  "ingredient_list": [
      {
          "name": "soybean oil",
          "percent": 55
      },
      {
          "name": "water",
          "percent": 22.5
      },
      {
          "name": "whole eggs",
          "percent": 11.25
      },
      {
          "name": "egg yolks",
          "percent": 5.625
      },
      {
          "name": "vinegar",
          "percent": 2.8125
      },
      {
          "name": "salt",
          "percent": 0.865
      },
      {
          "name": "sugar",
          "percent": 0
      },
      {
          "name": "lemon juice concentrate",
          "percent": 0
      },
      {
          "name": "calcium disodium edta",
          "percent": 0
      },
      {
          "name": "natural flavors",
          "percent": 1.94750000000001
      },
      {
          "name": "whole eggs",
          "percent": 2.8125
      },
      {
          "name": "egg yolks",
          "percent": 2.8125
      },
      {
          "name": "used to protect quality",
          "percent": 0
      }
  ],
  "origin_breakdown": [
      {
          "epi_score": "63",
          "origin": "en:united-states",
          "percent": 100,
          "transportation_score": 0
      }
  ]
};
app.get("/test2", async (req, res) => {
  try{
    let thingy = await calculateScore(testJson);
    res.json(thingy);
  }
  catch(err) {
    res.status(500);
  }
});

app.get("/products", async (req, res) => {
    req.query
  try {
    fetchProductsByFields();
  }
  catch (error) {
    
  }
});

// listening message idk
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
