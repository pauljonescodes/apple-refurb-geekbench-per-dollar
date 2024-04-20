# Apple Refurb Geekbench-per-Dollar

This project is a data scraper and analyzer that fetches data about refurbished Apple products and their Geekbench scores. It then calculates a performance-per-dollar metric for each product.

## Features

- Fetches data about refurbished Apple products
- Fetches Geekbench scores for the products
- Merges the data and calculates a performance-per-dollar metric

## How to Use

1. Clone the repository
2. Install the dependencies with `npm install`
3. Run the script with `npm start`
4. Get details with `npm run get-details` (not as tested)

## Code Overview

The main script is `index.ts`. It fetches data about Apple products and their Geekbench scores, merges the data, and calculates a performance-per-dollar metric for each product.

The script first fetches data about Apple products. It then filters the data based on a product type filter, if one is provided.

Next, it loops over the Apple data and the Geekbench data. If it finds a match between an Apple product and a Geekbench entry (based on product type, size, processor type, and CPU and GPU core counts), it calculates an overall performance metric for the product. This metric is the sum of the product's multi-core score, single-core score, OpenCL score, and Metal score.

Finally, it calculates a performance-per-dollar metric by dividing the overall performance metric by the product's price. It adds this metric, along with the product's name and price, to the `mergedData` array. You can also get additional details, and the final product looks like this:

```json
[
  {
    "name": "Refurbished 14-inch MacBook Pro Apple M3 Max Chip with 14‑Core CPU and 30‑Core GPU - Space Black",
    "price": "$2,549.00",
    "path": "https://www.apple.com/shop/product/G1AU9LL/A/refurbished-14-inch-macbook-pro-apple-m3-max-chip-with-14%E2%80%91core-cpu-and-30%E2%80%91core-gpu-space-black?fnode=ffb5a65daafa72c82666edc82c5e7b147c58b65b210956668d69558825d4fabf818d4023d98828d1ed8f2279cf8766643a777fc2e1b05cd5534de9812dc0ff9fa9a0141d61f38a4664553a028e962d0b",
    "geekbenchPointPerDollar": 87.50019615535504,
    "details": "Originally released October 2023\n14.2-inch (diagonal) Liquid Retina XDR display;¹ 3024-by-1964 native resolution at 254 pixels per inch\n36GB unified memory\n512GB SSD²\nTouch ID\n1080p FaceTime HD camera\nThree Thunderbolt 4 (USB-C) ports"
  },
  {
    "name": "Refurbished 14-inch MacBook Pro Apple M3 Max Chip with 14‑Core CPU and 30‑Core GPU - Space Black",
    "price": "$2,549.00",
    "path": "https://www.apple.com/shop/product/G1AU9LL/A/refurbished-14-inch-macbook-pro-apple-m3-max-chip-with-14%E2%80%91core-cpu-and-30%E2%80%91core-gpu-space-black?fnode=ffb5a65daafa72c82666edc82c5e7b147c58b65b210956668d69558825d4fabf818d4023d98828d1ed8f2279cf8766643a777fc2e1b05cd5534de9812dc0ff9fa9a0141d61f38a4664553a028e962d0b",
    "geekbenchPointPerDollar": 87.50019615535504,
    "details": "Originally released October 2023\n14.2-inch (diagonal) Liquid Retina XDR display;¹ 3024-by-1964 native resolution at 254 pixels per inch\n36GB unified memory\n512GB SSD²\nTouch ID\n1080p FaceTime HD camera\nThree Thunderbolt 4 (USB-C) ports"
  },
  {
    "name": "Refurbished 14-inch MacBook Pro Apple M3 Max Chip with 14‑Core CPU and 30‑Core GPU - Silver",
    "price": "$2,549.00",
    "path": "https://www.apple.com/shop/product/G1AX9LL/A/refurbished-14-inch-macbook-pro-apple-m3-max-chip-with-14%E2%80%91core-cpu-and-30%E2%80%91core-gpu-silver?fnode=ffb5a65daafa72c82666edc82c5e7b147c58b65b210956668d69558825d4fabf818d4023d98828d1ed8f2279cf8766643a777fc2e1b05cd5534de9812dc0ff9fa9a0141d61f38a4664553a028e962d0b",
    "geekbenchPointPerDollar": 87.50019615535504,
    "details": "Originally released October 2023\n14.2-inch (diagonal) Liquid Retina XDR display;¹ 3024-by-1964 native resolution at 254 pixels per inch\n36GB unified memory\n512GB SSD²\nTouch ID\n1080p FaceTime HD camera\nThree Thunderbolt 4 (USB-C) ports"
  },
```

## Dependencies

- axios: Used to fetch data from webpages
- cheerio: Used to parse and extract data from HTML

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
