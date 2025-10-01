// import {fetchDecryptedData} from './fetchDecryptedData'

// type json_type = Record<string, string>;
// export async function getDecryptedData() {
//   const res = await fetchDecryptedData()
//   if (!res) {
//     throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
//   }

//   // console.log(res)

//   return res as json_type[]; // Returns decrypted data as JSON
// }


import { loadDecryptedData } from "../utils/dataCache";

// type json_type = Record<string, string>;

export async function getDecryptedData() {
  const res = await loadDecryptedData(); // Fetch directly from server
  if (!res) {
    throw new Error("Failed to load decrypted data");
  }

  return res; // Returns decrypted data safely
}

// export async function getDecryptedData() {
//   const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
//   const res = await fetch(`${baseUrl}/api/data`, { cache: "no-store" });

//   if (!res.ok) {
//     throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
//   }

//   return res.json(); // Returns decrypted data as JSON
// }