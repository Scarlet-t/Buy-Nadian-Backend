import "dotenv/config";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export default openai;

export async function getEstimate(productData) {
  if (!productData) {
    throw new Error("Missing productData");
  }

  let completion;
  let attempts = 0;
  const maxAttempts = 3;

  do {
    let prompt = `
    You are a food sourcing analyst. Based on the provided product data, your task is to estimate what percentage of the product's ingredients are likely sourced from Canada.
    
    Use your best judgment by considering:
    - The type of ingredients (e.g., maple syrup, dairy, wheat)
    - The product brand and any brand blurb (if available)
    - The style of product (e.g., granola vs. ramen)
    - The likelihood of sourcing based on known Canadian exports or production patterns
    
    ---
    
    Product name: ${productData.productName}
    Brand: ${productData.brand}
    Ingredients: ${productData.ingredients}
    ${
      productData.brandBlurb
        ? `Brand description: ${productData.brandBlurb}`
        : ""
    }
    Sold in: Canada
    
    ---
    
    Return your answer as a **valid JSON object** with this exact format:
    
    {
      "estimated_percentage": number (between 0 and 1),
      "ingredients": [
        { "name": "ingredient_name", "origin_guess": "Likely country of origin" }
        // One object per ingredient
      ],
      "disclaimer": "This is an estimated breakdown based on ingredient likelihood and publicly available data. Accuracy may vary."
    }
    Do not include any explanations, markdown formatting, or extra commentary — just the JSON.
    `;
    completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: prompt,
          response_format: "json",
        },
      ],
    });
  } while (++attempts < maxAttempts && !validateEstimate(completion.choices[0].message.content));

  return JSON.parse(completion.choices[0].message.content);
}

function validateEstimate(message) {
  //work in progress
  //validates the format of gpt's returned estimate
  return true;
}
