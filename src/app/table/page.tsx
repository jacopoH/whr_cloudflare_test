// "use client"; // Mark as a client component for D3 rendering

// import { useState, useEffect } from 'react';

// import * as base64 from "base-64";

import { getDecryptedCSVData } from "../../utils/decryptData.js";
import TableDataComponents from '../../../components/TableDataComponents'
// import DataTable from "../../../components/DataTable";
// import ClientFilterDropdown from "../../../components/ClientFilterDropdown";
// import ClientRegionDropdown from "../../../components/ClientRegionDropdown";
// import {fetchDecryptedData} from '../../../src/utils/fetchDecryptedData.js'
// import {getDecryptedData} from '../../../src/app/useCases/getDecryptedData'
// import {getYearOptions} from '../useCases/getYearOptions'

export const revalidate = 3600;
export default async function TablePage() {
  // const [demographicSelection, setdemographicSelection] = useState('All');
  // const [yearSelection, setyearSelection] = useState('2023');
  // const variable_options = ['Males', 'Females', 'Under 30', '30-44', '45-59', 'Over 50'];
  // const year_options = ['2022', '2023', '2024'];

  // const [table_data, setTableData] = useState<json_type[]>();
  //   const [table_headers, settable_headers] = useState<string[]>();

  // const [csv_file, setCSVFile] = useState('');
  // const [regionSelection, setregionSelection] = useState('All');

  // const main_table_headers = ['Country name', 'Year','Region name',
  // 'Life evaluation _ Cantril ladder (annual) _ mean',
  // 'Life evaluation _ Cantril ladder (3-years mean) _ mean'
  // ]
  // const await_csv_data = async function test_func(){
  //     getDecryptedData()
  //     .then(function(updated_release_data){
  //       if(typeof updated_release_data != 'undefined'){
  //         setCSVFile('testing')

      

  //         if(csv_file){
  //           console.log(csv_file)

  //         }

  //         setTableData(updated_release_data)
  //         settable_headers(Object.keys(updated_release_data[0]))
  //         console.log(yearSelection)
  //       }
  //     })
  // }

  // const [year_options, setYearOptions] = useState<string[]>()
  // const await_years = async function test_func(){
  //     getYearOptions()
  //     .then(function(year_options_call){
  //       if(typeof year_options_call != 'undefined'){
  //         year_options_call.sort(d3.descending)
  //         year_options_call.unshift('All years')
  //         console.log(year_options_call)
  //         setYearOptions(year_options_call)
  //       }
  //     })
  // }

  // useEffect(() => {
  //   await_csv_data()
  //   await_years()
  //   if(table_data){
  //     console.log(regions)
  //   }
  // }, [csv_file]);

  let decryptedData = null;
     
       try {
         // Fetch encrypted Base64 data
         decryptedData = await getDecryptedCSVData();
     
         // // Debugging: Check type of encodedData
         // console.log("Encoded Data:", encodedData, "Type:", typeof encodedData);
     
         // // Ensure `encodedData` is a valid string before decoding
         // if (typeof encodedData === "string" && encodedData.trim().length > 0) {
         //   decryptedData = JSON.parse(base64.decode(encodedData));
         //   console.log("Decrypted Data:", decryptedData);
         // } else {
         //   console.error("Invalid encrypted data received. Expected string but got:", encodedData);
         // }
       } catch (error) {
         console.error("Error decoding Base64:", error);
         return <div className="text-red-500">Error loading map data</div>;
       }

if(decryptedData){

  return (<div className="w-full">
      <div className="flex flex-col grow h-full p-0 xl:p-4">
        <TableDataComponents data={decryptedData}/>
       </div>
    </div>
  );

}
}
