import fs from "fs";
import path from "path";
import csv from "csv-parser";
// import { decryptData } from "./decryptData"; // Assuming this function already works for decryption

let cachedData = null;

export async function loadDecryptedData() {
  if (cachedData) {
    return cachedData; // Return cached data if available
  }

  const filePath = path.join(process.cwd(), "src", "data", "encrypted_demodata.csv");

  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

//   const decryptedRows = [];
//   const headers = [];

//   const fileStream = fs.createReadStream(filePath);

//   await new Promise((resolve, reject) => {
//     fileStream
//       .pipe(csv())
//       .on("headers", (encryptedHeaders) => {
//         // Decrypt the headers
//         encryptedHeaders.forEach((header) => {
//           headers.push(decryptData(header)); // Decrypt each header
//         });
//       })
//       .on("data", (row) => {
//         // Decrypt each data row
//         const decryptedRow = {};
//         Object.keys(row).forEach((key, index) => {
//           const decryptedKey = headers[index] || key; // Use decrypted header if available
//           decryptedRow[decryptedKey] = decryptData(row[key]);
//         });
//         decryptedRows.push(decryptedRow);
//       })
//       .on("end", resolve)
//       .on("error", reject);
//   });

//   cachedData = decryptedRows; // Cache the decrypted data
//   return decryptedRows;
// }


  ///////////// replace the above with the following if you want to fix the encryption issues

  const decryptedRows = [];
  // const headers = [];

  const fileStream = fs.createReadStream(filePath);

  await new Promise((resolve, reject) => {
    fileStream
      .pipe(csv())
      // .on("headers", (encryptedHeaders) => {
      //   // Decrypt the headers
      //   encryptedHeaders.forEach((header) => {
      //     headers.push(decryptData(header)); // Decrypt each header
      //   });
      // })
      .on("data", (row) => {
        // Decrypt each data row
      //   const decryptedRow = {};
      //   Object.keys(row).forEach((key, index) => {
      //     const decryptedKey = headers[index] || key; // Use decrypted header if available
      //     decryptedRow[decryptedKey] = decryptData(row[key]);
      //   });
      const decryptedRow = Object.keys(row).reduce((acc, key) => {
        // acc[key] = decryptData(row[key]);

          acc[key] = row[key];
        return acc;
      }, {});
        decryptedRows.push(decryptedRow);
      })

      .on("end", resolve)
      .on("error", reject);
  });

  cachedData = decryptedRows; // Cache the decrypted data

  return decryptedRows;
}
