'use client'
import * as d3 from "d3";

import {useEffect, useState} from 'react'
import SidebarMenu from "./SidebarMenu";


import LineChart from "./LineChart";
import ClientFilterMultiDropdown from "./ClientFilterMultiDropdown";


type json_type = Record<string, string>;
type dictionary = {[key:string]:string}
const color_object:dictionary = {}

export function ChartPageDataComponents(props:{data:json_type[]}){
    const[active_variable, setVariable] = useState<string>()
    
    const [countrySelection, setcountrySelection] = useState('Afghanistan');

    // const [csvData, setCSVData] = useState<json_type[]>()
    const [countryOptions, setcountryOptions] = useState<string[]>()

    // const included_countries = ['Finland', 'Afghanistan', 'United States', 'China', 'India'] 

    const included_countries = ['FIN', 'AFG', 'USA', 'CHN', 'IND'] 

    const [lineChartcountryOptions,setlineChartcountryOptions] = useState<string[]>(included_countries);

    const [countriesDrawn, setCountriesDrawn] = useState<boolean>(false)
    // const [dataDrawn, setDataDrawn] = useState<boolean>(false)
    // const [dataObj, setDataObj] = useState()

      const country_colors_array = ['#E0288A',
        '#DEE548',
        '#FBC33C',
        '#FF8300',
        '#00ADEF',
        '#828282',
        '#000000',
        '#93368D',
        '#3C9FA8',
        '#E9683A',
        '#116A93'
        ]
      // const [colorObject, setcolorObject] = useState()
      
      // const [colorObjDrawn, setColorObjDrawn] = useState(null)

      // useEffect(()=>{
      //   setColorObjDrawn(null)

      //   lineChartcountryOptions.map(function(country, i){
      //     // country_colors_array.map(function(color){
      //     console.log(colorObjDrawn)
      //     if(colorObject){
      //       if(Object.keys(colorObject).includes(country) === false){
      //         color_object[country] = country_colors_array[i]
      //       }
      //     }
      //     else{
      //       color_object[country] = country_colors_array[i]
      //     }
      //     setcolorObject(color_object)
      //     if(i === lineChartcountryOptions.length -1){
      //       setColorObjDrawn(true)
      //     }
      //     return color_object
      //   })
      // }, [lineChartcountryOptions, colorObjDrawn, countryOptions, active_variable])

       // total list
            // ['red', 'orange', 'blue']
            // list in chart draw one
            // ['red']
            // remaining colours ['orange', 'blue']
            // list in chart draw two

    const await_csv_data = async function test_func(){
        const country_array:string[] = []
        props.data.sort(function(a, b){return d3.ascending(a['NA'], b['NA'])}).forEach(function(d,i){
        
        // props.data.forEach(function(d,i){
          if(country_array.includes(d['GE']) === false && d['GE'] != '' && d['GE'] != 'None'){
            country_array.push(d['GE'])
          }
          if(i === (props.data.length-1)){

            // setCSVData(props.data)
            setcountryOptions(country_array)
            setCountriesDrawn(true)

        //     lineChartcountryOptions.map(function(country, i){
        //   // country_colors_array.map(function(color){
        //   // console.log(colorObjDrawn)
        //   if(colorObject){
        //     if(Object.keys(colorObject).includes(country) === false){
        //       color_object[country] = country_colors_array[i]
        //     }
        //   }
        //   else{
        //     color_object[country] = country_colors_array[i]
        //   }
        //   setcolorObject(color_object)
        //   if(i === lineChartcountryOptions.length -1){
        //     setColorObjDrawn(true)
        //   }
        //   return color_object
        // })
          }
        })

        // const new_data_array = []
        // props.data.forEach(function(d){
        //   if(included_countries.includes(d['Country name'])){
        //     const data_obj = {}
        //     data_obj['Country name'] = d['Country name']
        //     data_obj['Year'] = d['Year']
        //     data_obj[props.variable.replaceAll('-', ' ')] = d[props.variable.replaceAll('-', ' ')]
        //     setDataDrawn(true)

        //     new_data_array.push(data_obj)
            // setDataObj(new_data_array)
        //     return data_obj;
        //   }
        // })
    }
    let color_count =0;

    useEffect(() => {
        setVariable('LI')
        await_csv_data()
        if(countryOptions){
        }
      }, [countriesDrawn]);
    useEffect(() => {
        setVariable(active_variable)
      }, [active_variable]);

    if(active_variable && countryOptions){
          return (<div className="flex flex-col grow lg:flex-row w-full "><div className="min-w-[300px] lg:overflow-auto">
            {/*<p>{active_variable}</p>*/}
          <SidebarMenu selection={active_variable} changeSelection={setVariable}/>
        </div>
        <div className="w-full flex lg:flex-row flex-col h-full">
          <div className="lg:w-3/4 h-full w-full">
            <LineChart columns={[]} 
            variable={active_variable} 
            country={'All'} container="main_line_chart" 
            included_countries={lineChartcountryOptions} all_countries = {countryOptions} data={props.data} 
            height={'100%'} 
            //@ts-expect-error expecting dictionary[] type
            colorObject = {lineChartcountryOptions.map(function(country){
              // country_colors_array.map(function(color){
              if(color_count < country_colors_array.length -1){
                color_count = color_count +1;
              }
              else {
                color_count = 0;
              }
              if(Object.keys(color_object).includes(country) === false){
                  color_object[country] = country_colors_array[color_count]
              }
              else{
                color_object[country] = country_colors_array[color_count]
              }
              return color_object
            })}
            chart_type={'country'}

            /> 
          </div>
          <div className="lg:w-1/4 w-full pt-2">
            <h3 className="mb-4"> Select a country to add to the chart</h3>
            <ClientFilterMultiDropdown  
              title={''} 
              options={countryOptions} 
              defaultoptions = {[]}
              variable={countrySelection} 
              changeSelection={setcountrySelection} 
              multiSelect={true}
              selected_options={lineChartcountryOptions}
              setSelectedOption={setlineChartcountryOptions}
            />
            <div className="chart_legend legend_main_line_chart"></div>
          </div>
        </div></div>)
    }
    else{return(<div>Waiting</div>)}

}


export default ChartPageDataComponents;