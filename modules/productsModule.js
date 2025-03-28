// OPENFOODFACTS API reference : https://wiki.openfoodfacts.org/API/Read/Search

function isImported(product, referenceCountry = "canada") {
  // removes "en:" tags from item in origin_tags
  const origin = (product.origins_tags || []).map((tag) =>
    tag.replace("en:", "")
  );

  return (
    origin.length > 0 && !origin.includes(referenceCountry.toLowerCase())
  );
}

// grabs image from product info
// gets display image by default
function getImage(product, size = "") {
  return (
    product?.selected_images?.front?.[size]?.en ||
    product?.[`image_${size}_url`] ||
    product?.image_url ||
    product?.image_front_url ||
    null
  );
}

// !!!! EXPORTS HERE
// grabs only the important info from a product object
export function extractProductDetails(product, referenceCountry = "canada") {
  if (!product) return null;

  // chop this down later if there are redundancies/fields for low prio implementation
  const details = {
    code: product.code || null,
    product_name: product.product_name || null,
    brand: product.brands || null,
    brand_tags: product.brands_tags || [],
    description: product.generic_name || null,
    categories: product.categories_tags || [],
    image: getImage(product),
    labels: product.labels_tags || [],
    allergens: product.allergens_tags || [],
    additives: product.additives_tags || [],
    is_imported: isImported(product, referenceCountry),
    manufacturing_places: product.manufacturing_places || null,
    origins: product.origins || null,
    origins_tags: product.origins_tags || [],
    eco_score: product.ecoscore_grade || null,
    nutrition_grade: product.nutrition_grades || null,
    is_vegan: product.labels_tags?.includes("en:vegan") || false,
    is_vegetarian: product.labels_tags?.includes("en:vegetarian") || false,
    is_gluten_free: product.labels_tags?.includes("en:gluten-free") || false,
    ingredient_text: product.ingredients_text || null,
    ingredient_list: (product.ingredients || []).map((ing) => ({
      name: ing.text,
      percent: ing.percent_estimate,
    })),
    origin_breakdown:
      product.ecoscore_data?.adjustments?.origins_of_ingredients
        ?.aggregated_origins || [],
  };

  return details;
}

// only extracts fields needed for preview
export function extractProductPreviewDetails(product) {
  if (!product)
    return null;

  const origin_breakdown =
    product.ecoscore_data?.adjustments?.origins_of_ingredients
      ?.aggregated_origins || [];

  // returns small image, if too small/big try screwing with size until it looks devent on the cards
  // check reference for options
  const previewDetails = {
    image: getImage(product, "small"),
    product_name: product.product_name || null,
    brand: product.brands || null,
    origin_breakdown: origin_breakdown,
  };

  return previewDetails;

}