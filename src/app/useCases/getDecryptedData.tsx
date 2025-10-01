import {fetchDecryptedData} from './fetchDecryptedData'

type json_type = Record<string, string>;
export async function getDecryptedData() {
  const res = await fetchDecryptedData()
  if (!res) {
    throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
  }

  // console.log(res)

  return res as json_type[]; // Returns decrypted data as JSON
}


