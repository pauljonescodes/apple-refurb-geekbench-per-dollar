import axios, { AxiosResponse } from "axios";
import cheerio from "cheerio";
import { promises as fs } from "fs";
import { nanoid } from "nanoid";

const geekbenchUrlString: string =
  "https://browser.geekbench.com/mac-benchmarks";
const appleUrlString: string = "https://www.apple.com/shop/refurbished/mac";
const productTypeFilter: string | undefined = undefined; //"MacBook Pro";

enum GeekbenchScoreType {
  singleCore = "single-core",
  multiCore = "multi-core",
  openCL = "opencl",
  metal = "metal",
}

interface GeekbenchData {
  id: string;
  originalName: string;
  originalDescription: string;
  originalPath?: string;
  productType: string;
  processorType: string;
  clockSpeedGHz: number;
  cpuCoreCount: number;
  gpuCoreCount: number;
  sizeInches?: number;
  model: string;
  singleCoreScore?: number;
  multiCoreScore?: number;
  openCLScore?: number;
  metalScore?: number;
}

async function fetchAndParseGeekbenchData(
  urlString: string
): Promise<GeekbenchData[]> {
  try {
    const response: AxiosResponse = await axios.get(urlString);
    const data: string = response.data;
    const $ = cheerio.load(data);
    const scrapedData: GeekbenchData[] = [];

    let cpuCoreCount = 0;
    let gpuCoreCount = 0;

    for (let geekbenchScoreTypeValue of Object.values(GeekbenchScoreType)) {
      $(`#${geekbenchScoreTypeValue} .table-wrapper #mac > tbody > tr`).each(
        (index, element) => {
          const id = nanoid();
          const originalName: string = $(element)
            .find("td.name > a")
            .text()
            .replace(/\s+/g, " ")
            .trim();
          const originalDescription: string = $(element)
            .find("td.name > div.description")
            .text()
            .replace(/\s+/g, " ")
            .trim();
          const originalPathComponent: string | undefined = $(element)
            .find("td.name > a")
            ?.attr("href")
            ?.trim();
          const originalPath: string | undefined = originalPathComponent
            ? "https://browser.geekbench.com" + originalPathComponent
            : undefined;
          const score: string = $(element).find("td.score").text().trim(); // Assumes score is in the second <td>

          const productType = originalName.replace(/\s*\([^)]*\)/g, "").trim();

          const processorTypeMatch = originalDescription.match(/^(.*?)\s*@/);
          const processorType = processorTypeMatch
            ? processorTypeMatch[1].trim()
            : "Unknown";

          const clockSpeedMatch =
            originalDescription.match(/@ ([\d.]+)\s*GHz/i);
          const clockSpeedGHz = clockSpeedMatch
            ? parseFloat(clockSpeedMatch[1])
            : -1;

          const cpuCoreMatch = originalDescription.match(/(\d+)\s*CPU cores/i);
          const gpuCoreMatch = originalDescription.match(/(\d+)\s*GPU cores/i);
          const genericCoreMatch = originalDescription.match(/(\d+)\s*cores/i);

          if (cpuCoreMatch) {
            cpuCoreCount = parseInt(cpuCoreMatch[1], 10);
          }

          if (gpuCoreMatch) {
            gpuCoreCount = parseInt(gpuCoreMatch[1], 10);
          }

          // Use the generic cores match if there's no specific CPU or GPU core match
          if (!cpuCoreMatch && !gpuCoreMatch && genericCoreMatch) {
            cpuCoreCount = parseInt(genericCoreMatch[1], 10);
            gpuCoreCount = 0;
          }

          const sizeAndModelYearMatch = originalName.match(/\(([^)]+)\)/);

          let sizeInches = -1;
          let model = "";

          if (sizeAndModelYearMatch) {
            const sizeInchesMatch =
              sizeAndModelYearMatch[1].match(/(\d+\.\d+|\d+)-inch/);

            if (sizeInchesMatch) {
              sizeInches = parseFloat(sizeInchesMatch[1]);

              model = sizeAndModelYearMatch[1]
                .replace(/(\d+\.\d+|\d+)-inch/, "")
                .replace(/,\s*/, "")
                .trim();
            } else {
              model = sizeAndModelYearMatch[1].trim();
            }
          }

          const existingEntryIndex = scrapedData.findIndex(
            (entry) => entry.originalPath === originalPath
          );

          if (existingEntryIndex !== -1) {
            switch (geekbenchScoreTypeValue) {
              case GeekbenchScoreType.singleCore:
                scrapedData[existingEntryIndex].singleCoreScore =
                  parseInt(score);
                break;
              case GeekbenchScoreType.multiCore:
                scrapedData[existingEntryIndex].multiCoreScore =
                  parseInt(score);
                break;
              case GeekbenchScoreType.openCL:
                scrapedData[existingEntryIndex].openCLScore = parseInt(score);
                break;
              case GeekbenchScoreType.metal:
                scrapedData[existingEntryIndex].metalScore = parseInt(score);
                break;
            }
          } else {
            const newEntry: GeekbenchData = {
              id,
              originalName,
              originalDescription,
              clockSpeedGHz,
              originalPath,
              sizeInches,
              model,
              productType,
              processorType,
              cpuCoreCount,
              gpuCoreCount,
            };

            switch (geekbenchScoreTypeValue) {
              case GeekbenchScoreType.singleCore:
                newEntry.singleCoreScore = parseInt(score);
                break;
              case GeekbenchScoreType.multiCore:
                newEntry.multiCoreScore = parseInt(score);
                break;
              case GeekbenchScoreType.openCL:
                newEntry.openCLScore = parseInt(score);
                break;
              case GeekbenchScoreType.metal:
                newEntry.metalScore = parseInt(score);
                break;
            }

            scrapedData.push(newEntry);
          }
        }
      );
    }

    return scrapedData;
  } catch (error) {
    console.error("Error fetching or parsing data:", error);
    return [];
  }
}

interface AppleData {
  id: string;
  originalName: string;
  originalPrice: string;
  originalPath?: string;
  price: number;
  sizeInches?: number;
  productType: string; // e.g., "Mac mini", "MacBook Air"
  processorType?: string;
  cpuCoreCount: number;
  gpuCoreCount: number;
}

async function fetchAndParseAppleData(urlString: string): Promise<AppleData[]> {
  const response = await axios.get(urlString);
  const data: string = response.data;
  const $ = cheerio.load(data);
  const scrapedData: AppleData[] = [];

  $(".rf-refurb-category-grid-no-js ul li").each((index, element) => {
    const originalName: string = $(element)
      .find("h3 a")
      .text()
      .replace(/\s+/g, " ")
      .trim();
    const originalPath: string | undefined = $(element)
      .find("h3 a")
      .attr("href")
      ?.trim();
    const originalPrice: string = $(element)
      .find(".as-price-currentprice")
      .text()
      .replace(/\s+/g, " ")
      .trim();

    const sizeMatch = originalName.match(/(\d+\.\d+|\d+)-inch/);

    function removeSize(name: string) {
      // This regex removes anything like "13.3-inch" or other sizes
      return name.replace(/(\d+\.\d+-inch|\d+-inch)/g, "").trim();
    }

    // Function to extract the product type without size references
    function parseProductType(name: string) {
      const cleanedName = removeSize(name); // First, clean the name to remove size references
      const productTypeMatch = cleanedName.match(
        /^(Refurbished\s+)?(.*?)(?=Apple)/i
      );
      return productTypeMatch ? productTypeMatch[2].trim() : "Unknown"; // Extract product type without size
    }

    let productType = parseProductType(originalName);

    const cpuCountMatch = originalName.match(/(\d+)[‑-]Core CPU/i);
    const gpuCountMatch = originalName.match(/(\d+)[‑-]Core GPU/i);
    const cpuCount = cpuCountMatch ? parseInt(cpuCountMatch[1], 10) : 0;
    const gpuCount = gpuCountMatch ? parseInt(gpuCountMatch[1], 10) : 0;

    let processor = "Unknown";
    const processorMatch = originalName.match(
      new RegExp(`${productType} (Apple [^with]+) Chip with`)
    );
    processor = processorMatch ? processorMatch[1].trim() : "Unknown";

    scrapedData.push({
      id: nanoid(),
      originalName: originalName,
      originalPrice: originalPrice,
      originalPath: originalPath
        ? "https://www.apple.com" + originalPath
        : undefined,
      sizeInches: sizeMatch ? parseFloat(sizeMatch[1]) : undefined,
      productType,
      processorType: processor,
      cpuCoreCount: cpuCount,
      gpuCoreCount: gpuCount,
      price: parseFloat(originalPrice.replace(/[^0-9.]/g, "")),
    });
  });

  return scrapedData;
}

interface MergedData {
  name: string;
  price: string;
  description?: string;
  applePath?: string;
  geekbenchPath?: string;
  geekbenchPointPerDollar: number;
}

async function main(): Promise<void> {
  const geekbenchData = await fetchAndParseGeekbenchData(geekbenchUrlString);
  const appleData = await fetchAndParseAppleData(appleUrlString);

  await fs.writeFile(
    "data/source/geekbench.json",
    JSON.stringify(geekbenchData, null, 2),
    "utf8"
  );
  await fs.writeFile(
    "data/source/apple.json",
    JSON.stringify(appleData, null, 2),
    "utf8"
  );

  const mergedData: MergedData[] = [];

  for (const appleDatum of appleData) {
    if (
      productTypeFilter != undefined &&
      appleDatum.productType !== productTypeFilter
    ) {
      continue;
    }

    for (const geekbenchDatum of geekbenchData) {
      if (
        geekbenchDatum.productType === appleDatum.productType &&
        geekbenchDatum.sizeInches === appleDatum.sizeInches &&
        geekbenchDatum.processorType === appleDatum.processorType &&
        geekbenchDatum.cpuCoreCount === appleDatum.cpuCoreCount &&
        geekbenchDatum.gpuCoreCount === appleDatum.gpuCoreCount
      ) {
        const overallPerformanceMetric = geekbenchDatum.singleCoreScore ?? 0;
        const performancePerDollar =
          Math.round((overallPerformanceMetric / appleDatum.price) * 100) / 100;
        let description: string | undefined = undefined;

        if (appleDatum.originalPath) {
          try {
            const response = await axios.get(appleDatum.originalPath);
            const $ = cheerio.load(response.data);
            description =
              $('head meta[name="description"]').attr("content") ??
              $('meta[property="og:description"]').attr("content");
          } catch (error) {
            console.error("Error scraping the page:", error);
          }
        }

        mergedData.push({
          name: appleDatum.originalName,
          price: appleDatum.originalPrice,
          description,
          applePath: appleDatum.originalPath,
          geekbenchPath: geekbenchDatum.originalPath,
          geekbenchPointPerDollar: performancePerDollar,
        });

        continue;
      }
    }
  }

  mergedData.sort(
    (a, b) => b.geekbenchPointPerDollar - a.geekbenchPointPerDollar
  );

  await fs.writeFile(
    `data/merged/sorted.json`,
    JSON.stringify(mergedData, null, 2),
    "utf8"
  );
}

main();
