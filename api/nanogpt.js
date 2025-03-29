import nanogptjs from 'nanogptjs'
import dotenv from 'dotenv';

// key setup
dotenv.config();
const NANO_GPT_API_KEY = process.env.NANO_GPT_API_KEY;

// nanogpt setup
const nanogpt = nanogptjs({
    apiKey: NANO_GPT_API_KEY,
    defaultModel: 'chatgpt-4o-latest'
  });

// function exports

export async function getEstimate(productData) {
    if (!productData) {
      throw new Error("Missing productData");
    }
  
    let attempts = 0;
    const maxAttempts = 3;
    let result = null;
  
    const prompt = `
You are a food sourcing analyst. Based on the provided product data, estimate:
1. What percentage of the product's ingredients are likely sourced from Canada (estimated_percentage).
2. A reasonable fallback estimate (prior_average) for similar products in this category, assuming no further data is available.
3. Per-ingredient country-of-origin guesses.

You MUST consider:
- Ingredient names and types (e.g., maple syrup, dairy, wheat)
- Percentage estimates if provided
- Manufacturing and origin locations (if listed)
- Brand, product category, and brand description (if available)
- Whether the product is labeled as vegan, vegetarian, or gluten-free
- Common Canadian exports and known import patterns
- If the product appears to be imported
- Eco and nutrition scores (if relevant)

---
Product Data:
Name: ${productData.product_name}
Brand: ${productData.brand}
Brand tags: ${productData.brand_tags?.join(", ") || "None"}
Description: ${productData.description}
Categories: ${productData.categories?.join(", ") || "None"}
Manufacturing places: ${productData.manufacturing_places || "Unknown"}
Declared origins: ${productData.origins || "Unknown"}
Origin tags: ${productData.origins_tags?.join(", ") || "None"}
Is imported: ${productData.is_imported ? "Yes" : "No"}
Eco-score: ${productData.eco_score || "N/A"}
Nutrition grade: ${productData.nutrition_grade || "N/A"}
Labels: ${productData.labels?.join(", ") || "None"}
Vegan: ${productData.is_vegan ? "Yes" : "No"}
Vegetarian: ${productData.is_vegetarian ? "Yes" : "No"}
Gluten-free: ${productData.is_gluten_free ? "Yes" : "No"}

Ingredients:
${
  productData.ingredient_list?.length > 0
    ? productData.ingredient_list
        .map(
          (ing) => `- ${ing.name}${ing.percent ? ` (${ing.percent}%)` : ""}`
        )
        .join("\n")
    : productData.ingredient_text || "No ingredients listed."
}

Brand description:
${productData.brandBlurb || "None"}

Sold in: Canada

---

Return ONLY a valid JSON object in this **exact structure** (no markdown, no extra commentary):

{
  "estimated_percentage": number (0 to 1),
  "prior_average": number (0 to 1),
  "ingredients": [
    { "name": "ingredient_name", "origin_guess": "Likely country of origin" }
  ],
  "disclaimer": "This is an estimated breakdown based on public sourcing patterns. Accuracy may vary."
}
`;
    
  
    while (attempts++ < maxAttempts) {
      try {
        const response = await nanogpt.chat(prompt);
        const content = response.reply;
  
        if (validateEstimate(content)) {
          return JSON.parse(content);
        }
      } catch (err) {
        console.error("NanoGPT call failed:", err);
      }
    }
  
    throw new Error("Failed to get valid estimate after retries.");
  }
  
  function validateEstimate(content) {
    return true;
  }
  