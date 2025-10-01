'use client'
import * as d3 from "d3";

import { usePathname} from 'next/navigation';
import { useRouter } from 'next/navigation'
import {useEffect, useState} from 'react'
import Link from 'next/link';
import Image from 'next/image';

import {FilterLinkMultiDropdown} from "./FilterMultiDropdown";
// import ClientFilterDropdown from "./ClientFilterDropdown";
// import ClientFilterLinkMultiDropdown from "./ClientFilterMultiDropdown";
import Collapse from '@mui/material/Collapse';
import Button from "@mui/material/Button";

import {Burger_icon, Close_icon} from '../src/constants/icons'


type json_type = Record<string, string>;

export function DataNavBar(props:{data:json_type[], page_width:number, mobile_break:number}){

    const pathname = usePathname(); // Get the current path
  const router = useRouter()
    const [countriesDrawn, setCountriesDrawn] = useState<boolean>(false)

    const [rootExpanded, setRootExpanded] = useState<boolean>(true);
    // const [page_width, setPageWidth] = useState<string>();


  function updateCountryUrl(sortOrder: string) {
    window.history.pushState(null, '', `/country/${sortOrder.toString()}`)
  }

  const [countrySelection, setcountrySelection] = useState<string | null>();
  const [countryOptions,setCountryOptions] = useState<string[]>();
  // const included_countries = ['United Kingdom', 'Italy', 'Spain']

  // const [lineChartcountryOptions,setlineChartcountryOptions] = useState(included_countries);

  function go_to_country_page(country:string){
    if(pathname){
        if(pathname!.includes('country') === false){
        // router.push('/country/'+country)
        return router.push('/country/'+country.replaceAll(' ', '_'))

        // <Navigate to={"/plans"} state={{ data }} />
      }
    }
    if(country){
        setcountrySelection(country)
        updateCountryUrl(country.replaceAll(' ', '_').replaceAll('\'', ''))

    }

  }



    const await_csv_data = async function test_func(){
        const country_array:string[] = []
        props.data.sort(function(a, b){return d3.ascending(a['NA'], b['NA'])}).forEach(function(d,i){
          if(country_array.includes(d['GE']) === false && d['GE'] != '' && d['GE'] != 'None'){
            country_array.push(d['GE'])
          }
          if(i === (props.data.length-1)){
            setCountryOptions(country_array)
            setCountriesDrawn(true)
          }
        })
    }

     useEffect(() => {
        // setVariable('Life evaluation _ Cantril ladder (annual) _ mean')
        await_csv_data()
        if(countryOptions){
        }
      }, [countriesDrawn]);

      useEffect(()=> {
        if(pathname!.includes('country') === false){
          setcountrySelection(null)
        }

      }, [pathname])
      // useEffect(()=> {
      //   if(props.page_width < props.mobile_break){
      //     setRootExpanded(false)
      //   }
      //   else{
      //     setRootExpanded(true)
      //   }
      // }, [props.page_width])


      // useEffect(()=> {
      //   const handleResize = () => setPageWidth(window.innerWidth);
      //   window.addEventListener("resize", handleResize);
      //   return () => window.removeEventListener("resize", handleResize);         
      // }, [])


    if(countryOptions){
          return (<div className="flex flex-col  pb-4">
            <div className="flex flex-col md:flex-row items-center ">
            <div className="gallup_banner flex px-4 p-2 mt-0 sm:mt-2 flex-row grow w-full">

            <a href ={'https://worldhappiness.report/'} className={'self-start md:self-center p-4 md:p-0'}> 
            <Image 
              height={75}
              width={150}
              src={'/images/whr-wordmark-1c-white.svg'}
              alt={'WHR logo image'}
              className={'pr-4 self-start'}></Image>
            </a>
              
              <h3 className="text-lg xl:text-xl p-2 ">
                The {' '} <a href ={'https://worldhappiness.report/'} className={'px-2'}> World Happiness Report </a> {' '} dashboard is powered by Gallup<sup>©</sup> Analytics &nbsp;&nbsp;
                <Button className={'action_button'}>
                <a
                    href="https://worldhappiness.report/data-sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                  >Access the raw data
 
                  </a>
                </Button>
              </h3>
              </div>
            <Button className={(props.page_width > props.mobile_break) ? `hidden` : `flex `}
                onClick={() => {
                  setRootExpanded(!rootExpanded);
                }}>
                {rootExpanded ?  <Close_icon/> : <Burger_icon/>}
            </Button>
           
            </div>
            <Collapse in={rootExpanded}>
              <div className="w-full justify-end flex ">
                <nav className="navbar flex flex-col md:flex-row xl:w-1/2 w-full justify-end items-end self-end">
                  <Link
                    href="/map"
                    prefetch={false}
                    className={`nav-button w-full  md:w-1/4 ${pathname === '/map' ? 'active' : ''}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>

                    Map
                  </Link>
                  <Link
                    href="/chart"
                    prefetch={false}
                    className={`nav-button w-full md:w-1/4 ${pathname === '/chart' ? 'active' : ''}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                    </svg>
                    Chart
                  </Link>
                  <Link
                    href="/table"
                    prefetch={false}
                    className={`nav-button w-full md:w-1/4  ${pathname === '/table' ? 'active ' : ''}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5" />
                    </svg>
                    Rankings
                  </Link>
                  <div className={`${pathname!.includes('/country') ? 'active  w-full md:w-auto navbar_dropdown' : 'w-full md:w-1/4 navbar_dropdown'}`}>

                    <FilterLinkMultiDropdown 
                      title={'Country'} 
                      options={countryOptions} 
                      variable={countrySelection} 
                      changeSelection={go_to_country_page} 
                      multiSelect={false}
                      selected_options={[]}
                      setSelectedOption={[]}
                    />
                  </div>
                </nav>
              </div>
            </Collapse>
    </div>)
    
    }

}


export default DataNavBar;