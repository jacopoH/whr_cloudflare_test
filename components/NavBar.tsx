
// import * as utf8 from "utf8";
// import * as base64 from "base-64";
import WHRNavBar from './WHRNavBar';

import { getDecryptedCSVData } from "../src/utils/decryptData.js";

export default async function NavBar() {
  let decryptedData2 = null;

  try {
    decryptedData2 = await getDecryptedCSVData();

    // // Ensure `encryptedData` is a valid string before decoding
    // if (typeof encryptedData === "string" && encryptedData.trim().length > 0) {
    //   const decodedString = utf8.decode(base64.decode(encryptedData));
    //   decryptedData2 = JSON.parse(decodedString);
    // } else {
    //   console.error("Invalid encrypted data received:", encryptedData);
    // }
  } catch (error) {
    console.error("Error decoding/decrypting data:", error);
  }
  if(decryptedData2){
    return ( <WHRNavBar decryptedData2 = {decryptedData2}/>
  );
  }
  
}
