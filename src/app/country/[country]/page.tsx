// import LineChart from "../../../../components/LineChart";
// import StatSection from "../../../../components/StatSection";
// import DataTable from "../../../../components/DataTable";
// import Image from 'next/image'
// import {fetchDecryptedData} from '../../utils/fetchDecryptedData.js'
import { getDecryptedCSVData } from "../../../utils/decryptData.js";
// import {filterDecryptedData} from '../../../../src/useCases/filterDecryptedData'

import CountryPageDataComponents from "../../../../components/CountryPageDataComponents"
// import {get_country_code_from_country_name} from '../../../../src/constants/calculations'
// import * as base64 from "base-64";


// import { NextResponse } from "next/server";
// import { headers } from "next/headers";

// export function middleware(request) {
//   const requestHeaders = new Headers(request.headers);
//   requestHeaders.set("x-pathname", request.nextUrl.pathname);

//   return NextResponse.next({
//     request: {
//       headers: requestHeaders,
//     },
//   });
// }



// export default async function Page() {

//   return <div>{headersList.get("x-pathname")}</div>;
// }
export const revalidate = 3600;
export default async function CountryPage() {


  // const headersList = headers();
  // const props = params;


  // const [country, set_country] = useState<string>(country_codes[params.country])
  // const [table_data, setTableData] = useState<json_type[]>();
  // const [countryData, setCountryData] = useState<json_type[]>();
  // const [tableColumns, setTableColumns] = useState<string[]>([] as string[]);
  // const [stats_data, setStatsData] = useState<{[key: string]: string | number}>()


  // const ignore_array = ['Region name', 'Geocode', 'id', 'Country name', 'Year','Country',]

  // const await_csv_data = async function test_func(active_country:string){
  //     getDecryptedData()

  // const decryptedData = await getDecryptedCSVData();
  let decryptedData = null;
  
    try {
      // Fetch encrypted Base64 data
      decryptedData = await getDecryptedCSVData();
  
      // Debugging: Check type of encodedData
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
  

  //     .then(function(updated_release_data){

  //         const transposed_object = [] as json_type[]
  //         if(typeof updated_release_data != 'undefined'){
  //           const country_data = updated_release_data.filter((d)=> d['Country name'] === active_country)
  //           const min_ranking = d3.max(country_data, function(d){return parseFloat(d['Life evaluation _ Cantril ladder (3-years mean) _ ranking'])})
  //           const max_ranking = d3.min(country_data, function(d){return parseFloat(d['Life evaluation _ Cantril ladder (3-years mean) _ ranking'])})
  //           const av_ranking = d3.mean(country_data, function(d){return parseFloat(d['Life evaluation _ Cantril ladder (3-years mean) _ ranking'])})

  //           const all_years = d3.map(country_data, function(d){return d['Year']})
  //           console.log(all_years)

            
  //           country_data.filter(function(d){
  //             if(all_years.includes('2023')){
  //               if(parseFloat(d['Year']) === 2023){
  //                   Object.keys(sidebar_dictionary['Explanatory factors']).forEach(function(key, index){
  //                       const transposed_row = {}  as json_type
  //                       transposed_row['Factor'] = key
  //                       transposed_row['Rank'] = d['Explanatory factors'+' _ '+key+' _ ranking']
  //                       transposed_row['Value'] = d['Explanatory factors'+' _ '+key+' _ mean']
  //                       transposed_row['Contrib. %'] = d['Explanatory factors'+' _ '+key+' _ contribution']
  //                       transposed_row['Year'] = d['Year']
  //                       transposed_row['Country'] = d['Country name']
  //                       transposed_row['id'] = index + key
  //                       transposed_object.push(transposed_row)
  //                       if(index === Object.keys(sidebar_dictionary['Explanatory factors']).length -1){
  //                           // setdataLoaded('true')
  //                           // console.log(transposed_object)
  //                           setTableData(transposed_object)
  //                           setTableColumns(Object.keys(transposed_object[0]).filter(d=>ignore_array.includes(d) === false))
  //                       }
  //                   })
  //               }
  //             }
  //             else{
  //                 setTableData([] as json_type[])
  //                 setTableColumns([] as string[])
  //             }

  //             const these_stats : {[key: string]: string | number} = {
  //               'Current': parseInt(d['Life evaluation _ Cantril ladder (3-years mean) _ ranking']),
  //               'Highest': parseInt(max_ranking as unknown as string),
  //               'Lowest': parseInt(min_ranking as unknown as string),
  //               'Average': parseInt(av_ranking as unknown as string),
  //               'Biggest climb': d['Biggest_Fall_Year'],
  //               'Biggest fall': d['Biggest_Climb_Year']
  //             };
  //             setStatsData(these_stats)

  //           })
  //           setCountryData(country_data)
  //         }


  //       return updated_release_data
  //     })

  // }

  // useEffect(() => {
  //   if(pathname){
  //     set_country(country_codes[pathname.split('/')[2]])
  //   }
  // }, [pathname]);

  // useEffect(() => {
  //   if(country){
  //       // setPageDrawn(false);
  //       await_csv_data(country)
  //       if(countryData){
  //         console.log(countryData)
  //       }
  //   }
    
  // }, [country]);



  if(decryptedData){
      return (<div className="h-full w-full">
          <div className="inline">
              {/*<h1 className="ml-4">{country}</h1>*/}
          </div>
          {/*<CountryPageDataComponents data={decryptedData} active_country ={country_codes[pathname.split('/')[2]]}/>*/}
          <CountryPageDataComponents data={decryptedData}/>

        </div>
      );
  }
  else{
      return<div> Waiting</div>
  }
}
