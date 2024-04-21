# Apple Refurb Geekbench-per-Dollar

This project is a data scraper and analyzer that fetches data about refurbished Apple products and their Geekbench scores. It then calculates a performance-per-dollar metric for each product.

## Features

- Fetches data about refurbished Apple products
- Fetches Geekbench scores for the products
- Merges the data and calculates a performance-per-dollar metric

## How to Use

1. Clone the repository
2. Install the dependencies with `npm install`
3. Run the script with `npm start` (takes a while to get details)

## Code Overview

The main script is `index.ts`. It fetches data about Apple products and their Geekbench scores, merges the data, and calculates a performance-per-dollar metric for each product.

The script first fetches data about Apple products. It then filters the data based on a product type filter, if one is provided.

Next, it loops over the Apple data and the Geekbench data. If it finds a match between an Apple product and a Geekbench entry (based on product type, size, processor type, and CPU and GPU core counts), it calculates a performance-per-dollar metric by dividing the single core performance by the product's price. It adds this metric, along with the product's name and price, to the `mergedData` array. You can also get additional details, and the final product looks like this:

```json
[
  {
    "name": "Refurbished 24-inch iMac Apple M3 Chip with 8-Core CPU and 8-Core GPU - Green",
    "price": "$1,099.00",
    "description": "Originally released October 2023\n24-inch 4.5K Retina display;² 4480-by-2520 resolution at 218 pixels per inch with support for 1 billion colors\n8GB unified memory\n256GB SSD¹\n1080p FaceTime HD camera\nTwo Thunderbolt 4 (USB-C) ports",
    "applePath": "https://www.apple.com/shop/product/FQRA3LL/A/Refurbished-24-inch-iMac-Apple-M3-Chip-with-8-Core-CPU-and-8-Core-GPU-Green?fnode=70ee8fb581b806d40d296d600583904b983f3044a3464bd4a7479c98aff2670610c4d8a349b41da76ccb1aed4a4f1769aed576efa52abcdde630610645cd244c00840771eefbe7aff395f9d4df99b598",
    "geekbenchPath": "https://browser.geekbench.com/macs/imac-24-inch-2023-8c-gpu",
    "geekbenchPointPerDollar": 2.77
  },
  {
    "name": "Refurbished 24-inch iMac Apple M3 Chip with 8-Core CPU and 8-Core GPU - Pink",
    "price": "$1,099.00",
    "description": "Originally released October 2023\n24-inch 4.5K Retina display;² 4480-by-2520 resolution at 218 pixels per inch with support for 1 billion colors\n8GB unified memory\n256GB SSD¹\n1080p FaceTime HD camera\nTwo Thunderbolt 4 (USB-C) ports",
    "applePath": "https://www.apple.com/shop/product/FQRD3LL/A/Refurbished-24-inch-iMac-Apple-M3-Chip-with-8-Core-CPU-and-8-Core-GPU-Pink?fnode=70ee8fb581b806d40d296d600583904b983f3044a3464bd4a7479c98aff2670610c4d8a349b41da76ccb1aed4a4f1769aed576efa52abcdde630610645cd244c00840771eefbe7aff395f9d4df99b598",
    "geekbenchPath": "https://browser.geekbench.com/macs/imac-24-inch-2023-8c-gpu",
    "geekbenchPointPerDollar": 2.77
  },
  {
    "name": "Refurbished 15-inch MacBook Air Apple M2 Chip with 8‑Core CPU and 10‑Core GPU - Space Gray",
    "price": "$1,019.00",
    "description": "The new 15‑inch MacBook Air makes room for more of what you love with a spacious Liquid Retina display. Supercharged by the M2 chip and with up to 18 hours of battery life.³",
    "applePath": "https://www.apple.com/shop/product/FQKP3LL/A/refurbished-15-inch-macbook-air-apple-m2-chip-with-8%E2%80%91core-cpu-and-10%E2%80%91core-gpu-space-gray?fnode=70ee8fb581b806d40d296d600583904b983f3044a3464bd4a7479c98aff2670610c4d8a349b41da76ccb1aed4a4f1769aed576efa52abcdde630610645cd244c00840771eefbe7aff395f9d4df99b598",
    "geekbenchPath": "https://browser.geekbench.com/macs/mac14-15",
    "geekbenchPointPerDollar": 2.55
  }
  //...
]
```

## Dependencies

- axios: Used to fetch data from webpages
- cheerio: Used to parse and extract data from HTML

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
