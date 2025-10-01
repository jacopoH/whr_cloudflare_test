import { loadDecryptedData } from "../../src/utils/dataCache";

export default async function handler(req, res) {
  try {
    const data = await loadDecryptedData();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error in API route:", error); // Use the error variable
    res.status(500).json({ error: "Failed to load data" });
  }
}
