'use client'
import * as d3 from 'd3'
import Image from 'next/image'
import Button from '@mui/material/Button';
import {useEffect, useState} from 'react'
import LineChart from "./LineChart";
import StatSection from "./StatSection";
import DataTable from "./DataTable";

import {country_codes} from '../public/data/country_codes'
import { sidebar_dictionary } from "../public/data/selection_dictionary";
import { usePathname} from 'next/navigation';
import {InfoIcon} from '../src/constants/icons'
import {data_replacement_year} from '../src/constants/constants';

import {checkRounding} from '../src/constants/calculations'
import { reverse_headerMap, headerMap} from '../public/data/headerMap';
// import { table } from 'console';
type json_type = Record<string, string>;

const country_colors_array = ['#E0288A',
  '#DEE548',
  '#FBC33C', // yellow
  '#FF8300', // orange
  '#00ADEF', // blue
  '#828282',
  '#000000',
  '#93368D', // purple
  '#3C9FA8',
  '#E9683A',
  '#116A93'
  ]
export function CountryPageDataComponents(props:{data:json_type[]}){
    const pathname = usePathname(); // Get the current path
    // const[active_variable, setVariable] = useState<string>()
    // const [yearSelection, setyearSelection] = useState('2024');
    // const [regionSelection, setregionSelection] = useState('World');
    // const [year_options, setYearOptions] = useState<string[]>()

    const [countries_drawn, setCountriesDrawn] = useState<boolean>(false)
    const [countryData, setCountryData] = useState<json_type[] | null>();

    const [currentyearData, setCurrentYearData] = useState<json_type | null>();
    const [currentYear_drawn, setcurrentYear_drawn] = useState<boolean>(false)

    const [stats_data, setStatsData] = useState<{[key: string]: string | number}>()
    // const [statsDrawn, setStatsDrawn] = useState<boolean>(false)
    // const [tableDrawn, setTableDataDrawn] = useState<boolean>(false)
    const [table_data, setTableData] = useState<json_type[]>();
    const [tableColumns, setTableColumns] = useState<string[]>([] as string[]);
    const ignore_array = ['RN', 'GE', 'id', 'NA', 'YE','AG']


    const [lifeEvChartVariable, setLifeEvChartVariable] = useState<string>(reverse_headerMap['Life evaluation _ Average (3-year) _ mean'])
    const [active_country, setActiveCountry] = useState<string>(pathname ? country_codes[pathname.split('/')[2]] : '')
    const [active_country_code, setActiveCountryCode] = useState<string>(pathname ? pathname.split('/')[2] : '')
    const [colorObject, setcolorObject] = useState<json_type>()


    const [country_rank, setcountry_rank] = useState<number | string>()
    const [country_LE_score, setcountry_LE_score] = useState<string>()

    const await_country_data = async function test_func(){
      // const country_data = props.data.filter((d)=> d['Country name'] === active_country)
      setcurrentYear_drawn(false)
      setCurrentYearData(null)

      let country_data;
      setCountryData(null)
      setCountriesDrawn(false)

      try{
        country_data = props.data.filter((d)=> d['GE'] === active_country_code)
        setCountryData(country_data)
        setCountriesDrawn(true)
      }
      catch{
        console.log('error')
        setCountryData(null)
        setCountriesDrawn(false)
      }
      // const country_data = props.data.filter((d)=> d['Geocode'] === active_country_code)
      const all_years = d3.map(country_data!, function(d){return parseFloat(d['YE'] as unknown as string)})

      if(country_data){
        country_data.filter(function(d, i){
          if(d){
            if(all_years.includes(2024)){
              console.log(reverse_headerMap[d['Life evaluation _ Average (3-year) _ ranking']])
              if(parseFloat(d['YE']) === 2024){
                setCurrentYearData(d)
                setcurrentYear_drawn(true)
                setcountry_rank(parseFloat(d[reverse_headerMap['Life evaluation _ Average (3-year) _ ranking']]) ? parseFloat(d[reverse_headerMap['Life evaluation _ Average (3-year) _ ranking']]) : '-')
                setcountry_LE_score(d['LI'] ? d['LI'] : '-')      
              }
            }
            else{
              setCurrentYearData({})
              setcurrentYear_drawn(false)
              setcountry_rank('-')
              setcountry_LE_score('-')
            }
          }
        })
      }
      else{
        console.log('fail to get country data')
      }
      
    }


    const await_stats_data = async function stats_func(){
      // console.log(countryData)                

      const min_ranking = d3.max(countryData!, function(d){return parseFloat(d[reverse_headerMap['Life evaluation _ Average (3-year) _ ranking']])})
      const max_ranking = d3.min(countryData!, function(d){return parseFloat(d[reverse_headerMap['Life evaluation _ Average (3-year) _ ranking']])})
      const av_ranking = d3.mean(countryData!, function(d){return parseFloat(d[reverse_headerMap['Life evaluation _ Average (3-year) _ ranking']])})
      const these_stats : {[key: string]: string | number} = {
                'Current': (currentYear_drawn && currentyearData![reverse_headerMap['Life evaluation _ Average (3-year) _ ranking']] != '') ? parseInt(currentyearData![reverse_headerMap['Life evaluation _ Average (3-year) _ ranking']]) : '--',
                'Highest': parseInt(max_ranking as unknown as string),
                'Lowest': parseInt(min_ranking as unknown as string),
                'Average': parseInt(av_ranking as unknown as string),
                'Biggest climb': countryData![0]![reverse_headerMap['Biggest_Fall_Year']],
                'Biggest fall': countryData![0]![reverse_headerMap['Biggest_Climb_Year']]
              };
      setStatsData(these_stats)
      // setStatsDrawn(true)
    }


    const await_table_data = async function table_data_func(){
      const transposed_object = [] as json_type[]
      if(currentYear_drawn){
              Object.keys(sidebar_dictionary['Explanatory factors']).forEach(function(key, index){
                  // console.log(checkRounding(key, currentyearData['Explanatory factors'+' _ '+key+' _ mean']))
                  const transposed_row = {}  as json_type
                  transposed_row['Factor'] = key
                  transposed_row['Rank'] = checkRounding(reverse_headerMap['Explanatory factors'+' _ '+key+' _ ranking'], currentyearData![reverse_headerMap['Explanatory factors'+' _ '+key+' _ ranking']])
                  transposed_row['Value'] =  checkRounding(key, currentyearData![reverse_headerMap['Explanatory factors'+' _ '+key+' _ mean']])
                  // transposed_row['Value'] =  currentyearData['Explanatory factors'+' _ '+key+' _ mean']
                  transposed_row['Explains'] = checkRounding('Explains', currentyearData![reverse_headerMap['Explanatory factors'+' _ '+key+' _ contribution']])
                  // transposed_row['Year'] = currentyearData['YE']
                  // transposed_row['Country'] = currentyearData['NA']
                  transposed_row['id'] = index + key
                  transposed_object.push(transposed_row)

                  if(index === Object.keys(sidebar_dictionary['Explanatory factors']).length -1){
                      // setdataLoaded('true')
                      setTableData(transposed_object)
                      setTableColumns(Object.keys(transposed_object[0]).filter(d=>ignore_array.includes(d) === false))
                      // setTableDataDrawn(true)
                  }
              })
        }
        else{
            setTableData([] as json_type[])
            setTableColumns([] as string[])
            // setTableDataDrawn(false)

        }
    }

    useEffect(() => {
      console.log('drawing country data'+ active_country_code)
      await_country_data()
      if(countryData){
      //   console.log(tableDrawn)
      //   await_stats_data()
      //   await_table_data()
      }
    }, [currentYear_drawn, countries_drawn, active_country_code]);

    useEffect(() => {
      // await_country_data()
      const this_color_object:json_type = {}
      this_color_object[active_country_code] = country_colors_array[7]
      setcolorObject(this_color_object)
      if(countryData && currentyearData){
        {console.log(countries_drawn)}

        await_stats_data()
        await_table_data()
      }
    }, [countryData, currentyearData, active_country_code,currentYear_drawn, countries_drawn, ]);

    useEffect(() => {
      setActiveCountry(country_codes[pathname!.split('/')[2]])
      setActiveCountryCode(pathname!.split('/')[2])
      await_country_data()
    }, [pathname])

    if(countryData && stats_data && table_data && colorObject && country_rank ){
    // if(countryData && stats_data && table_data && colorObject && country_rank){

      {console.log(lifeEvChartVariable)}
        return (<div className="stacked_at_900 lg:h-full pt-4">
          <div className="w-full flex md:flex-row flex-col h-2/3">
            <div className="no_rmargin_at_900 md:w-2/5 w-full flex flex-col mx-0 md:mx-4 h-full ">
                <div className="flex items-center">
                <Image
                  src={`/images/flags_iso_3/`+pathname!.split('/')[2] +`.png`}
                  width={100}
                  height={50}
                  alt='country logo'
                  className='country_flag_img'
                />
                <div className="ml-4  shrink">
                  <h1 className="">{active_country}</h1>
                  <p><span className="font-bold">Rank:</span> {country_rank} | <span className="font-bold">Average Life Evaluation:</span> {country_LE_score} (out of 10)</p>
                </div>
              </div>

              <div className="w-full flex  flex-col ">
                  <div className="flex flex-row  justify-start mt-4">
                    <InfoIcon variable={'Life evaluation'} this_key={'info_icon_le'} />
                    <h3 className="ml-2">Happiness ranking</h3>
                  </div>
                  <StatSection data={stats_data!} />
              </div>
              <div  className={'grow flex flex-col '}>
                  <div className="flex flex-row  justify-start mt-4">

                      <InfoIcon variable={'Explanatory factors _ countryView'} this_key={'info_icon_ef'} />
                      <h3 className="ml-2">Explanatory factors</h3>
                  </div>
                  <DataTable  data={table_data!} columns={tableColumns} settings={'auto'} year={'All years'} region={'All'} height={'100%'} full_table={false}/>
                  {/* <p className="text-xs">* Uses {data_replacement_year} data</p> */}
              </div>
            </div>
            <div className="md:w-3/5  flex flex-col mx-0 md:mx-4 w-full h-full">
                <div className=" flex flex-col">
                  <div className="flex flex-column items-center justify-between">
                    <div className="flex flex-column">
                      <InfoIcon variable={'Life evaluation'} this_key={'info_icon_le'} />
                      <h3 className="ml-2">Life evaluation</h3>
                    </div>
                    <div className="chart_toggle_container">
                      <Button className={headerMap[lifeEvChartVariable].includes('annual') ? `chart_toggle active`  : `chart_toggle` }onClick={() => setLifeEvChartVariable(reverse_headerMap['Life evaluation _ Average (annual) _ mean'])}>Annual score</Button>
                      <Button className={headerMap[lifeEvChartVariable].includes('3-year') ? `chart_toggle active`  : `chart_toggle` } onClick={() => setLifeEvChartVariable(reverse_headerMap['Life evaluation _ Average (3-year) _ mean'])}>3 Year average</Button>
                    </div>
                  </div>
                </div>
                <div className="flex grow w-full chart_container_at_900">
                    <LineChart data = {countryData} columns={[]} variable={lifeEvChartVariable} 
                    country={active_country_code}  container="expl_factors" included_countries={[active_country_code]} all_countries={[lifeEvChartVariable]} height={'100%'}
                    colorObject={colorObject} chart_type={'country'}/>               
                </div>
            </div>
          </div>
          <div className="w-full flex flex-col md:flex-row h-1/3">
            <div className="md:w-1/3 w-full  h-full  mr-0 md:mr-8">
              <div className=" h-full flex flex-col">
                <div className="flex flex-column items-center justify-start">
                    <InfoIcon variable={'Emotions'} this_key={'info_icon_em'} />
                    <h3 className="ml-2">Emotions</h3>
                </div>
                <div className="flex grow w-full h-full">
                    <LineChart data = {countryData} variable={''} columns ={[reverse_headerMap['Emotions _ Positive emotions _ mean'], reverse_headerMap['Emotions _ Negative emotions _ mean']]} 
                      country={active_country_code} container="emotions_over_time"  included_countries={[active_country_code]} 
                      all_countries ={[reverse_headerMap['Emotions _ Positive emotions _ mean'], reverse_headerMap['Emotions _ Negative emotions _ mean']]}  height={'100%'}
                      colorObject={{'Emotions _ Positive emotions _ mean':country_colors_array[0], 'Emotions _ Negative emotions _ mean':country_colors_array[7]}}
                      chart_type={'multi_variable'}
                     />
                </div>
                <div className="chart_legend legend_emotions_over_time min-h-[80px]"></div>

              </div>
            </div>
            <div className="md:w-1/3 w-full h-full  flex flex-col">
              <div className="flex flex-column items-center justify-start">
                  <InfoIcon variable={'Benevolence'} this_key={'info_icon_ben'} />
                  <h3 className="ml-2">Benevolence</h3>
              </div>
              <div className="flex grow w-full h-full">
                <LineChart data = {countryData} variable={''} 
                columns = {[reverse_headerMap['Benevolence _ Donated _ mean'],reverse_headerMap['Benevolence _ Helped a stranger _ mean'],reverse_headerMap['Benevolence _ Volunteered _ mean']]} 
                country={active_country_code}  container="benev_ev_over_time"  included_countries={[active_country_code]} 
                all_countries = {[reverse_headerMap['Benevolence _ Donated _ mean'],reverse_headerMap['Benevolence _ Helped a stranger _ mean'],reverse_headerMap['Benevolence _ Volunteered _ mean']]}  height={'100%'}
                colorObject={{'Benevolence _ Donated _ mean':country_colors_array[0],'Benevolence _ Helped a stranger _ mean':country_colors_array[7], 'Benevolence _ Volunteered _ mean':country_colors_array[4]}}
                chart_type={'multi_variable'}
               />
              </div>
              <div className="chart_legend legend_benev_ev_over_time min-h-[80px]"></div>

            </div>
            <div className="md:w-1/3 w-full h-full  flex flex-col">
              <div className="flex flex-column items-center justify-start">
                  <InfoIcon variable={'Inequality'} this_key={'info_icon_ineq'} />
                  <h3 className="ml-2">Inequality</h3>
              </div>
              <div className="flex w-full  h-full">
                <LineChart data = {countryData} columns={[]} variable={reverse_headerMap['Life evaluation _ Inequality _ SD']} country={active_country_code}  
                container="life_ev_over_time"  included_countries={[active_country_code]} all_countries={[reverse_headerMap['Life evaluation _ Inequality _ SD']]}  height={'100%'}
                colorObject={colorObject}  chart_type={'country'} />               
                </div>
                <div className="  min-h-[80px]"></div>

            </div>
          </div>
        </div>)
    }
    else{return <p>Waiting</p>}

}


export default CountryPageDataComponents;