//!!! ALL FETCH REQUESTS MUST HAVE HEADER:
//   {headers: {"User-Agent": "BuyNadian/1.0 (zyjenny3@gmail.com)",}}

// API reference : https://wiki.openfoodfacts.org/API/Read/Search
  
  // fetches array of json objects
  // each is a product from openfoodfacts
  // the tagTypes, tagValues are arrays
  export async function fetchProductsByFields({
    tagTypes,
    tagValues,
    pageSize = 12,
    page = 1,
  }) {
  
    const url = new URL("https://world.openfoodfacts.org/cgi/search.pl");
  
    const params = {
      action: "process",
      page_size: pageSize,
      page: page,
      json: 1,
    };
  
    params = addSearchTags(params);
  
    // add all the search parameters
    Object.entries(params).forEach(([key, val]) =>
      url.searchParams.append(key, val)
    );
  
    const res = await fetch(url.toString(), {headers: {
        "User-Agent": "BuyNadian/1.0 (zyjenny3@gmail.com)",
      }});
    
    const data = await res.json();
  
    return data.products || []; //!! returns empty string if no results
  }
  
  const data = await response.json();
  console.log(data);

  