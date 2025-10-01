"use client";

import React from "react";
import { sidebar_dictionary } from "../public/data/selection_dictionary";
import { reverse_headerMap } from "../public/data/headerMap";

import {InfoIcon} from '../src/constants/icons'
import {useEffect} from 'react'

import Accordion from '@mui/material/Accordion';
// import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import Button from '@mui/material/Button';
// import { useRouter } from 'next/navigation'

// import Navigate from 'next/navigation';

interface SidebarMenuProps {
  selection: string;
  changeSelection: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export type SidebarDictionary = {
  [category: string]: {
    [variable: string]: string;
  };
};



export default function SidebarMenu({ selection, changeSelection }: SidebarMenuProps) {

  // const router = useRouter()
  const handleOptionChange = (value: string) => {
    // changeSelection(value);
    console.log(reverse_headerMap)
    console.log(value)

    changeSelection(value)
    // updateVarUrl(value.replaceAll(' ', '-'))
    // return router.push('/chart/'+value.replaceAll(' ', '-'))
    // return <Navigate to={"/chart/"+value} state={{ value }} />
  };
  // function updateVarUrl(value: string) {
  //   window.history.pushState(null, '', `/chart/${value.replaceAll(' ', '-')}`)
  // }
  // const[active_variable, setVariable] = useState<string>()
  useEffect(()=>{
      changeSelection(selection)
  }, [])

  if(selection){
     return (<aside className="sidebar  w-full">
      <p className="p-2">Select a variable</p>

      <div className="sidebar_section  shadow-lg w-full">

        {Object.keys(sidebar_dictionary).map((d) => {
          console.log(d)
          return (
              <Accordion defaultExpanded={d.includes('evaluation')? true : false} className={ `xl:p-1 p-0  items-center justify-between`}  style={{boxShadow: "none"}} key={`div` +d}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3-content"
                id="panel3-header"
                className={`w-full sectionHeader w-full p-2  mb-2 mt-1 xl:mt-2 flex flex-row justify-start bg-` + d.replaceAll(" ", "")}
              >
                  <InfoIcon variable={d}  this_key={'info_icon'+d} /><Typography component="span" className={"flex justify-start"}><p className="mx-2">{d + ` `} </p>
                  </Typography>
              </AccordionSummary>
                  {Object.keys(sidebar_dictionary[d]).map((variable, index) => {
                      const isSelected = selection === reverse_headerMap[sidebar_dictionary[d][variable]];
                      const key = `${d}-${variable}-${index}`
                      return <AccordionDetails key={`accordionhead`+key} className={`p-0 w-full flex flex-row justify-between`}>
                        <div 
                          onClick={() => handleOptionChange(reverse_headerMap[sidebar_dictionary[d][variable]])}
                          className={isSelected ? (`label p-2 w-full flex justify-start bg-50-` + d.replaceAll(" ", "")) : 'label p-2 w-full flex justify-start'}
                          key={`input`+key}
                        >
                       <InfoIcon variable={variable}  this_key={'info_icon'+variable} /><span className='mx-2 lg:mx-2'>{variable}</span> </div>
                      </AccordionDetails>
                  })}
            </Accordion>
            );
        })}
      </div>
    </aside>
  );
  }
}
