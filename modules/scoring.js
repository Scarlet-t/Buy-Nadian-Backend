//this is where we grade the products by canadian-ness

import * as oai from "../api/oai.js";
import * as nano from "../api/nanogpt.js";
//json imorts
import foodBusinesses from "../data/FoodBusinesses.json" assert { type: "json" };
import testData from "../data/testData.json" assert { type: "json" };

// if lowercase product.origin_breakdown.origin = canada
//  return product.origin_breakdown.percent
// if brand inside

const confidenceLevels = {
    origin_data_present: 1.0, 
    brand_in_foodland_ontario_list: 0.85, 
    brand_in_made_in_canada_directory: 0.75, 
    gpt_estimate_full: 0.5, 
    gpt_estimate_missing_values: 0.3, 
  };

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

// brand_tags is an array
// retuurn truee if match found (or maybe a truthy value ie the brand name from the dataset)
function searchBrand(brand_tags, dataset) {
    return true;
}

// wip
function getConfidence(product) {
    return 1;
}

export async function calculateScore(product) {
    //set confidence levels
    // origin listed
    let estimated_percentage = product.origin_breakdown.origin? product.origin_breakdown.origin.percent/100 : null;
    let confidence_score;
    let prior_average; 
    // otherwise, gpt
    if (!estimated_percentage) {
        let gptEstimate
        try{
            // returns this format:
            // {
            //     "estimated_percentage": number (0 to 1),
            //     "prior_average": number (0 to 1),
            //     "ingredients": [
            //       { "name": "ingredient_name", "origin_guess": "Likely country of origin" }
            //     ],
            //     "disclaimer": "This is an estimated breakdown based on public sourcing patterns. Accuracy may vary."
            //  }
            gptEstimate = await nano.getEstimate(product);
            console.log(gptEstimate);
            estimated_percentage = gptEstimate.estimated_percentage;
            prior_average = gptEstimate.prior_average;
            confidence_score = 1; //change lateer
        }
        catch(error) {
            console.log("failed");
            console.log(error);
        }
    }
    else {
        confidence_score = 1;
        prior_average = 1;
    }
    console.log(`confidence: ${confidence_score}; estimate: ${estimated_percentage}; prioravg: ${prior_average}`)
    let final_estimate = (estimated_percentage * confidence_score) + (prior_average * (1 - confidence_score)) * 100;
    return final_estimate;
}

