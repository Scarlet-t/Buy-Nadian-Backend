import puppeteer from "puppeteer";

// Function to search for a brand on MadeInCanadaDirectory and extract results
async function searchBrand(brandName) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate to the MadeInCanadaDirectory search page
  await page.goto("https://madeincanadadirectory.ca/search");

  // Interact with the search
  await page.click("a.ait-toggle-area-btn");
  await page.waitForSelector("#searchinput-text");
  await page.type("#searchinput-text", brandName);
  await page.click(".searchsubmit");

  // Wait till search results come out
  await page.waitForNavigation({ waitUntil: "networkidle2" });
  await page.waitForSelector(".items-container");

  // Extract all item-container
  let results = await page.$$eval(".items-container .item-container", (items) =>
    items.map((item) => {
      const title = item.querySelector(".item-title h3")?.textContent.trim();
      const link = item.querySelector(".item-title a")?.href;
      const categories = Array.from(
        item.querySelectorAll(".item-categories .item-category")
      ).map((category) => category.textContent.trim());
      const description = item
        .querySelector(".entry-content p")
        ?.textContent.trim();
      const address = item
        .querySelector(".item-address .value")
        ?.textContent.trim();
      const website = item.querySelector(".item-web .value a")?.href;

      return { title, link, categories, description, address, website };
    })
  );

  // Log only the first extracted result
  if (results.length > 0) {
    const result = results[0];

    console.log(`Title: ${result.title}`);
    console.log(`Link: ${result.link}`);
    console.log(`Categories: ${result.categories.join(", ")}`);
    console.log(`Description: ${result.description}`);
    console.log(`Address: ${result.address}`);
    console.log(`Website: ${result.website}`);
  } else {
    console.log(`No items found for "${brandName}".`);
  }

  await browser.close();

  return results[0];
}
