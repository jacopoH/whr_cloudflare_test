// import fs from "fs/promises";
// import path from "path";
// import crypto from "crypto";
// import { parse } from "csv-parse/sync";

// const ENCRYPTION_KEY = Buffer.from([
//   0x08, 0x5b, 0xb6, 0x21, 0x06, 0x5c, 0x71, 0x22,
//   0x6b, 0xef, 0x48, 0x97, 0xad, 0xa0, 0x03, 0xa7,
//   0x62, 0xfb, 0x5a, 0xaa, 0xf5, 0xb5, 0x28, 0x0d,
//   0x61, 0x5c, 0xcd, 0xf8, 0xda, 0x12, 0xc4, 0x2c,
// ]);

// const IV_LENGTH = 16;

// function decryptData(encryptedText) {
//   try {
//     const encryptedBuffer = Buffer.from(encryptedText, "base64");
//     const iv = encryptedBuffer.slice(0, IV_LENGTH);
//     const encrypted = encryptedBuffer.slice(IV_LENGTH);

//     const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
//     let decrypted = decipher.update(encrypted);
//     decrypted = Buffer.concat([decrypted, decipher.final()]);

//     return decrypted.toString("utf-8");
//   } catch (error) {
//     console.error("Decryption failed for:", error +' '+encryptedText);
//     return "ERROR_DECRYPTING";
//   }
// }

// // Main function to decrypt CSV
// export async function getDecryptedCSVData() {
//   const filePath = path.join(process.cwd(), "src/data/encrypted_demodata.csv");

//   try {
//     // Read CSV file
//     const fileContent = await fs.readFile(filePath, "utf-8");

//     // Parse CSV to get raw rows
//     const rawRecords = parse(fileContent, {
//       columns: false, // Don't assign headers yet
//       trim: true,
//     });

//     // Extract and decrypt headers (First row)
//     const encryptedHeaders = rawRecords.shift(); // Remove and extract first row
//     const decryptedHeaders = encryptedHeaders.map(decryptData); // Decrypt headers

//     // Decrypt each row and assign decrypted headers
//     const decryptedData = rawRecords.map((row) => {
//       return Object.fromEntries(
//         row.map((value, index) => [decryptedHeaders[index], decryptData(value)])
//       );
//     });

//     console.log(decryptedData); // ✅ Logs decrypted data as an array of objects



//     return decryptedData;
//   } catch (error) {
//     console.error("Error reading/decrypting CSV:", error);
//     return [];
//   }
// }

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const zlib = require('zlib');

// Constants - make sure these match your Python code
const IV_LENGTH = 16; // Adjust if different
// const ENCRYPTION_KEY = Buffer.from('your-encryption-key-here', 'utf8'); // Must match Python
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY 
  ? Buffer.from(process.env.ENCRYPTION_KEY, "hex") 
  : Buffer.from("", "hex");

function decryptData(encryptedText) {
  try {
    const encryptedBuffer = Buffer.from(encryptedText, "base64");
    const iv = encryptedBuffer.slice(0, IV_LENGTH);
    const encrypted = encryptedBuffer.slice(IV_LENGTH);

    const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    // Decompress
    const decompressed = zlib.inflateSync(decrypted);
    
    return decompressed.toString("utf-8");
  } catch (error) {
    console.error("Decryption failed:", error);
    return "ERROR_DECRYPTING";
  }
}

export async function getDecryptedCSVData() {
  const filePath = path.join(process.cwd(), "src/data/encrypted_demodata.json");

  try {
    // Read JSON file
    const fileContent = await fs.readFile(filePath, "utf-8");
    const jsonData = JSON.parse(fileContent);
    
    const { headers, rows } = jsonData;
    console.log(`Processing ${rows.length} encrypted rows`);
    
    // Process each encrypted row
    const decryptedData = [];
    
    for (let i = 0; i < rows.length; i++) {
      try {
        const encryptedRow = rows[i];
        
        // Decrypt the row
        const decryptedRowStr = decryptData(encryptedRow);
        
        // Parse the JSON string
        const rowData = JSON.parse(decryptedRowStr);
        
        decryptedData.push(rowData);
      } catch (err) {
        console.error(`Error decrypting row ${i}:`, err);
      }
    }
    
    console.log(`Successfully decrypted ${decryptedData.length} rows`);
    return decryptedData;
  } catch (error) {
    console.error("Error reading/decrypting data:", error);
    return [];
  }
}