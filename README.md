# the algo (wip)
## 1. Query OpenFoodFacts API
- If `origin` or `origins_tags` exists:
  - Parse and display % Canadian (100% if only "Canada" is listed)
- If neither exists:
  - Proceed to the next step.

## 2. Check MadeInCanadaDirectory.ca
- Use Puppeteer or scraping tool to search for the brand.
- If the brand is listed:
  - Extract the brand blurb and pass it into the GPT prompt.
- If the brand is **not** listed:
  - Pass only the ingredient list to GPT.

## 3. Format Ingredients List
- Use the `ingredients_text` field from OpenFoodFacts.
- Format ingredients as a clean, comma-separated string:
  - Example: `"Whole grain oats, sugar, canola oil, cocoa powder"`

## 4. Call ChatGPT
- Use the estimation prompt with the formatted ingredients list (and brand blurb if available).
- Include the ruleset for GPT to base its estimation on.

## 5. Display Result
- Parse returned JSON:
- WIP

## things completed:
- openai estimation stuff (not tested)
- fetch from openfoodfacts (tested with 1 search field: country = canada, need to be tested more)
- from productsModule:
  - extractProductDetails (tested, results not studied super well lol)
  - extractProductPreviewDetails (tested)

##  things i just realised need to be done (will be added as i think of it i really dont wanna come up with a list rn tbh):
- openai assistant (jenny)
- madeincanada directory stuff (jj)
- 

## stretch goals that i can think of:
- sustainability score
  - using epi_score, transportation_score from product.origin_breakdown


## Thanks to:
- https://www.ontario.ca/foodland/page/find-and-buy-local-food
- https://madeincanadadirectory.ca/ 
