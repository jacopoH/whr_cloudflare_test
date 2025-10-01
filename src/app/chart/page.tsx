import { getDecryptedCSVData } from "../../utils/decryptData.js";
// import * as base64 from "base-64";
import dynamic from "next/dynamic";


// import ChartPageDataComponents  from "../../../../components/ChartPageDataComponents"



// import ChartPageDataComponents  from "../../../../components/ChartPageDataComponents"


// export async function getServerSideProps() {
//     // Call the function to get decrypted CSV data
//     const encryptedJSON = await getDecryptedCSVData();

//     return {
//         props: { encryptedJSON }, // Send Base64 encoded JSON to the client
//     };
// }
// type json_type = Record<string, string>;

const D3ChartComps = dynamic(() => import("../../../components/ChartPageDataComponents"), { ssr: false });

export const revalidate = 3600;
export default async function ChartPage() {

  // let decryptedData = null;
  // try {
  //   // Fetch encrypted Base64 data
  //   const encodedData = await getDecryptedCSVData();

  //   // Debugging: Check type of encodedData
  //   console.log("Encoded Data:", encodedData, "Type:", typeof encodedData);

  //   // Ensure `encodedData` is a valid string before decoding
  //   if (typeof encodedData === "string" && encodedData.trim().length > 0) {
  //     decryptedData = JSON.parse(base64.decode(encodedData));
  //     console.log("Decrypted Data:", decryptedData);
  //   } else {
  //     console.error("Invalid encrypted data received. Expected string but got:", encodedData);
  //   }
  // } catch (error) {
  // //   console.error("Error decoding Base64:", error);
  // //   return <div className="text-red-500">Error loading map data</div>;
  // // }
  //   // Fetch and decrypt data on the server
  // const encryptedJSON = await getDecryptedCSVData();

  // // Encode for security
  // //@ts-expect-error ussie with string array
  // const jsonString = utf8.decode(base64.decode(encryptedJSON));
  // const chartData = JSON.parse(jsonString);

  // /// data filtering
  // // const included_countries = ['Finland', 'Afghanistan', 'United States', 'China', 'India'] 

  // // const new_data_array:json_type[] = []
  // // await chartData.forEach(function(d:json_type){
  // //     if(included_countries.includes(d['Country name'])){
  // //       const data_obj = {} as json_type
  // //       data_obj['Country name'] = d['Country name']
  // //       data_obj['Year'] = d['Year']
  // //       data_obj[props.params.indicator.replaceAll('-', ' ')] = d[props.params.indicator.replaceAll('-', ' ')]
  // //       new_data_array.push(data_obj)
  // //       return d;
  // //     }
  // //  })



  let decryptedData = null;
   
     try {
       // Fetch encrypted Base64 data
       decryptedData = await getDecryptedCSVData()
   
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





  // const country_options = ['United Kingdom', 'Spain', 'Italy']; // Changed let to const
  if(decryptedData){
     return (
      <div className="w-full flex flex-col md:flex-row md:h-full h-auto" >
        <D3ChartComps data = {decryptedData}/>
      {/*<div className="flex flex-col w-full h-full" >*/}
        {/*<D3ChartComps data = {decryptedData}/>*/}
      </div>
    ); 
  }

}
