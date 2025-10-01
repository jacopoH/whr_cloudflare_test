// 'use client'
// import * as base64 from "base-64";

import { getDecryptedCSVData } from "../../utils/decryptData.js";
import {MapComponents} from '../../../components/MapEnc'

export const revalidate = 3600;
export default async function Home() {
   let decryptedData = null;
   
     try {
       // Fetch encrypted Base64 data
       decryptedData = await getDecryptedCSVData();
   
     //   // Debugging: Check type of encodedData
     //   console.log("Encoded Data:", encodedData, "Type:", typeof encodedData);
   
     //   // Ensure `encodedData` is a valid string before decoding
     //   if (typeof encodedData === "string" && encodedData.trim().length > 0) {
     //     decryptedData = JSON.parse(base64.decode(encodedData));
     //     console.log("Decrypted Data:", decryptedData);
     //   } else {
     //     console.error("Invalid encrypted data received. Expected string but got:", encodedData);
     //   }
     } catch (error) {
       console.error("Error decoding Base64:", error);
       return <div className="text-red-500">Error loading map data</div>;
     }

  // // Decode Base64 back to JSON before passing to the map
  // const decryptedData = JSON.parse(base64.decode(encodedData));
if(decryptedData){
    return (
    <div className="flex flex-col w-full h-full">
        <MapComponents data={decryptedData}/>

    </div>
  );
}
else{
  return <div>Waiting</div>
}

}
