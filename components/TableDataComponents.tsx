'use client'
import * as d3 from 'd3'
import {useEffect, useState} from 'react'
import DataTable from "./DataTable";
import ClientFilterDropdown from "./ClientFilterDropdown";

import FilterMultiDropdown from "./FilterMultiDropdown";
import regions from '../src/constants/regions.js'

import {reverse_headerMap} from '../public/data/headerMap'
type json_type = Record<string, string>;

export function TableDataComponents(props:{data:json_type[]}){

  const [yearSelection, setyearSelection] = useState('2024');
  const [regionSelection, setregionSelection] = useState('World');
  const [year_options, setYearOptions] = useState<string[]>()
  const [table_data, setTableData] = useState<json_type[]>();


  const [tableColumns] = useState<string[]>([reverse_headerMap['Life evaluation _ Average (3-year) _ ranking'],
    reverse_headerMap['Country name'],
    reverse_headerMap['Life evaluation _ Average (3-year) _ mean'],
    reverse_headerMap['Life evaluation _ Change (since 2012) _ mean'],
    reverse_headerMap['Life evaluation _ Inequality _ ranking'],
    reverse_headerMap['Explanatory factors _ Social support _ ranking'],
    reverse_headerMap['Explanatory factors _ GDP per capita _ ranking'],
   reverse_headerMap['Explanatory factors _ Healthy life expectancy _ ranking'],
    reverse_headerMap['Explanatory factors _ Freedom _ ranking'],
   reverse_headerMap['Explanatory factors _ Generosity _ ranking'],
   reverse_headerMap['Explanatory factors _ Perceptions of corruption _ ranking'],
    reverse_headerMap['Emotions _ Positive emotions _ ranking'],
    reverse_headerMap['Emotions _ Negative emotions _ ranking'],
    reverse_headerMap['Benevolence _ Donated _ ranking'],
    reverse_headerMap['Benevolence _ Volunteered _ ranking'],
    reverse_headerMap['Benevolence _ Helped a stranger _ ranking']
])



    // const ignore_array = ['Region name', 'Geocode', 'id', 'Country name', 'Year','Country',]
    const [yearsDrawn, setYearsDrawn] = useState<boolean>(false);
    

     const await_year_options = async function test_func(){
        const year_array:string[] = []
        props.data.forEach(function(d,i){
          // if(d['DA'] === 'Amended'){
          //     d['AD'] = d['AD'].toString() + '*'
          // }
          if(year_array.includes(d['YE']) === false && d['YE'] != ''){
            year_array.push(d['YE'])
          }
          if(i === (props.data.length-1)){
            setYearOptions(year_array.sort(d3.descending))
            setYearsDrawn(true)
          }
          // console.log(d)
        })
    }

    useEffect(() => {
      setTableData(props.data)
      // setTableColumns(Object.keys(props.data[0]))
      await_year_options()
    }, [table_data, yearsDrawn]);

    if(table_data){
        return (<div> <div className="dropdownRow flex flex-col md:flex-row">
        {/*<ClientFilterDropdown title={'Filter by region'} options ={regions}  variable ={regionSelection} changeSelection={setregionSelection} />*/}
        <ClientFilterDropdown 
            title={'Filter by year'} 
            options={year_options} 
            variable={yearSelection} 
            changeSelection={setyearSelection} 
        />
        <div className=" w-full md:w-1/4">
        <FilterMultiDropdown 
          title={'Select regions'} 
          options={regions} 
          variable={regionSelection} 
          defaultoptions = {regions}
          changeSelection={setregionSelection} 
          multiSelect={true}
          selected_options={[]}
          setSelectedOption={setregionSelection}
        /></div>

        </div>
      {/*</div>*/}
      <div className="w-full flex flex-col px-4 ">
          <DataTable data = {table_data} columns={tableColumns!} settings={'fixed'} year={yearSelection} region={regionSelection} height={800}  full_table={true}/>
      </div>
        </div>)
    }

}


export default TableDataComponents;