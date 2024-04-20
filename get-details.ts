import axios from "axios";
import cheerio from "cheerio";
import { promises as fs } from "fs";
import sorted from "./data/merged/sorted.json";

interface DetailedData {
  name: string;
  price: string;
  path: string;
  geekbenchPointPerDollar: number;
  details?: string;
}

// Loop over the JSON data and scrape text from each page
async function processJsonData() {
  const detailedData: DetailedData[] = [];
  for (const item of sorted) {
    let extractedText = "";

    try {
      const response = await axios.get(item.path);
      const $ = cheerio.load(response.data);
      extractedText =
        $('meta[property="og:description"]').attr("content") ?? "";
    } catch (error) {
      console.error("Error scraping the page:", error);
    }

    detailedData.push({
      name: item.name,
      price: item.price,
      path: item.path,
      geekbenchPointPerDollar: item.geekbenchPointPerDollar,
      details: extractedText,
    });
  }

  await fs.writeFile(
    `data/merged/details.json`,
    JSON.stringify(detailedData, null, 2),
    "utf8"
  );
}

processJsonData();
