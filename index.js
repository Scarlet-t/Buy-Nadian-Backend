const fs = require("fs/promises");

// npm
const express = require("express");

// api directory
const oai = require("./api/oai.js");
const nano = require("./api/nanogpt.js");
const { fetchProductsByFields } = require("./api/openFoodFacts.js");

// modules directory
const pModule = require("./modules/productsModule.js");
const { calculateScore } = require("./modules/scoring.js");
const rMod = require("./modules/redis.js");

// IMPORTS END

const app = express();
const PORT = 6969;
(async () => {
    const categoryJson = JSON.parse(
      await fs.readFile("./data/categories.json", "utf-8")
    );
  })();

app.use(express.json());

// TEST ROUTES
app.get("/", (req, res) => {
    resdis.startGet()
  res.send("Buy-Nadian Engine running");
});

app.get("/test", async (req, res) => {
  let array = [];
  categoryJson.forEach((item) => {
    let it = pModule.extractProductDetails(item);
    array.push(it);
  });
  res.json(array);
});

const testJson = {
  code: "0048001213487",
  product_name: "Mayonnaise",
  brand: "Hellmann's,Unilever",
  brand_tags: ["hellmann-s", "unilever"],
  description: "Mayonnaise",
  categories: ["en:condiments", "en:sauces", "en:mayonnaises", "en:groceries"],
  image:
    "https://images.openfoodfacts.org/images/products/004/800/121/3487/front_en.6.400.jpg",
  labels: [
    "en:no-gluten",
    "en:kosher",
    "en:omega-3",
    "en:high-in-omega-3",
    "en:kosher-parve",
    "en:orthodox-union-kosher",
    "en:parve",
  ],
  allergens: ["en:eggs", "en:soybeans"],
  additives: ["en:e385"],
  is_imported: true,
  manufacturing_places: "Canada,USA",
  origins: "États-Unis",
  origins_tags: ["en:united-states"],
  eco_score: "c",
  nutrition_grade: "e",
  is_vegan: false,
  is_vegetarian: false,
  is_gluten_free: false,
  ingredient_text:
    "soybean oil, water, whole eggs and egg yolks (whole eggs and egg yolks), vinegar, salt, sugar, lemon juice concentrate, calcium disodium edta (used to protect quality), natural flavors,",
  ingredient_list: [
    {
      name: "soybean oil",
      percent: 55,
    },
    {
      name: "water",
      percent: 22.5,
    },
    {
      name: "whole eggs",
      percent: 11.25,
    },
    {
      name: "egg yolks",
      percent: 5.625,
    },
    {
      name: "vinegar",
      percent: 2.8125,
    },
    {
      name: "salt",
      percent: 0.865,
    },
    {
      name: "sugar",
      percent: 0,
    },
    {
      name: "lemon juice concentrate",
      percent: 0,
    },
    {
      name: "calcium disodium edta",
      percent: 0,
    },
    {
      name: "natural flavors",
      percent: 1.94750000000001,
    },
    {
      name: "whole eggs",
      percent: 2.8125,
    },
    {
      name: "egg yolks",
      percent: 2.8125,
    },
    {
      name: "used to protect quality",
      percent: 0,
    },
  ],
  origin_breakdown: [
    {
      epi_score: "63",
      origin: "en:united-states",
      percent: 100,
      transportation_score: 0,
    },
  ],
};
app.get("/test2", async (req, res) => {
  try {
    let thingy = await calculateScore(testJson);
    res.json(thingy);
  } catch (err) {
    res.status(500);
  }
});

// ACTUAL ROUTES
app.get("/categories", async (req, res) => {
  try {
    let categories = Object.entries(categoryJson)
      .filter(([_, dat]) => !dat.parents || dat.parents.length === 0)
      .map(([id, dat], idx) => ({
        id: idx,
        name: dat.name.en || id,
      }));
    res.json(categories);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});


app.get("/search_products", async (req, res) => {
  const {
    title,
    brand,
    category,
    country,
    page = 1,
    page_size = 20,
  } = req.query;

  const tagTypes = [];
  const tagValues = [];

  if (brand) {
    tagTypes.push("brands");
    tagValues.push(brand);
  }
  if (category) {
    tagTypes.push("categories");
    tagValues.push(category);
  }
  if (country) {
    tagTypes.push("countries");
    tagValues.push(country);
  }

  const cacheKey = `search:${title || ""}:${brand || ""}:${category || ""}:${
    country || ""
  }:page${page}`;

  try {
    // checks Redis
    const cached = await rMod.redis.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    // fetch fresh data
    const fetchedProducts = await fetchProductsByFields({
      tagTypes,
      tagValues,
      page: parseInt(page),
      pageSize: parseInt(page_size),
      title,
    });
    
    // only getting fields i caree about
    let products = []
    fetchedProducts.forEach((product) => {
        products.push(pModule.extractProductDetails(product));
    });

    // stores in rMod.redis for 6 hrs
    await rMod.redis.set(cacheKey, products, { ex: 21600 });

    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "fetching or caching error." });
  }
});

// listening message idk
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
