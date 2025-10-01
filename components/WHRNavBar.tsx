'use client'
// import Link from 'next/link';
// import Image from 'next/image';
import DataNavBar from './DataNavBar';
import {useEffect, useState} from 'react'
// import ClientFilterDropdown from "./ClientFilterDropdown";
// import ClientFilterLinkMultiDropdown from "./ClientFilterMultiDropdown";
// import Collapse from '@mui/material/Collapse';
// import Button from "@mui/material/Button";
type json_type = Record<string, string>;


export default function WHRNavBar(props:{decryptedData2:json_type[]}) {
        const mobile_break = 768;
        // const [rootExpanded, setRootExpanded] = useState<boolean>(true);
        const [page_width, setPageWidth] = useState<number>();
      // useEffect(()=> {
      //   if(page_width){
      //     if((page_width as unknown as number) < 600){
      //       setRootExpanded(false)
      //     }
      //     else{
      //       setRootExpanded(true)
  
      //     }
      //   }


      // }, [page_width])
      useEffect(()=> {
        const handleResize = () => setPageWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);         
      }, [])


return (<div>


      {props.decryptedData2 ? (
        <DataNavBar data={props.decryptedData2} page_width={page_width! as number} mobile_break={mobile_break}/>
      ) : (
        <p className="text-white">Failed to load data</p>
      )}
    </div>)

}