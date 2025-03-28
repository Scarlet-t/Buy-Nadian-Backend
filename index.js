// npm
import express from "express";

// api directory
import openai from "./api/oai.js";
import {fetchProductsByFields} from "./api/openFoodFacts.js";

// modules directory
import * as products from "./modules/productsModule.js";

const app = express();
const PORT = 6969;

app.use(express.json());

// ROUTES HERE
app.get("/", (req, res) => {
  res.send("Buy-Nadian Engine running");
});



// listening message idk
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
