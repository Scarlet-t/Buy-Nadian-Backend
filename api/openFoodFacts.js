//!!! ALL FETCH REQUESTS MUST HAVE HEADER:
//   {headers: {"User-Agent": "BuyNadian/1.0 (zyjenny3@gmail.com)",}}

// API reference : https://wiki.openfoodfacts.org/API/Read/Search
  
  // fetches array of objects
  // each is a product from openfoodfacts
  // the tagTypes, tagValues are arrays
  // return is parsed json

  function addSearchTags(params, tagTypes, tagValues) {
    tagTypes.forEach((tagType, idx) => {
      params[`tagtype_${idx}`] = tagType;
      params[`tag_${idx}`] = tagValues[idx];
      params[`tag_contains_${idx}`] = 'contains'
    });
    return params;
  }

  // EXPORTS
  export async function fetchProductsByFields({
    tagTypes,
    tagValues,
    pageSize = 12,
    page = 1,
  }) {
  
    const url = new URL("https://world.openfoodfacts.org/cgi/search.pl");
  
    let params = {
      action: "process",
      page_size: pageSize,
      page: page,
      json: 1,
    };
  
    params = addSearchTags(params, tagTypes, tagValues);
  
    // add all the search parameters
    Object.entries(params).forEach(([key, val]) =>{
        // console.log(`key: ${key}, value: ${val}`);
        url.searchParams.append(key, val);
    }
    );
  
    const res = await fetch(url.toString(), {headers: {
        "User-Agent": "BuyNadian/1.0 (zyjenny3@gmail.com)",
      }});
    
    const data = await res.json();
  
    return data.products || []; //!! returns empty string if no results
  }


  