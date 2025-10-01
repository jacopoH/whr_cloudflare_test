'use client'

import React, { useState, useEffect, useRef } from 'react';
// import * as d3 from "d3";
// import DoneIcon from '@mui/icons-material/Done';


import {OpenArrow, CloseArrow} from '../src/constants/icons'
const FilterDropdown = (props) => {
  // console.log(props.selected_options)
  const [selectedOption, setSelectedOption] = useState(props.variable);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // function getDoneIcon(option){
  //   if(props.selected_options.includes(option)){
  //         return <DoneIcon/>
  //   }

  // }
                  
  const dropdownRef = useRef()
  const handleOptionSelect = (option) => {
    // let updated_selected_options;
    setSelectedOption(option);
    setIsOpen(false);
    if(props.changeSelection != ''){
      props.changeSelection(option)
    }
    // if(props.multiSelect == true){
    //   if(props.selected_options.includes(option)){
    //     updated_selected_options = props.selected_options.filter((word) => word !== option)
    //   }
    //   else{
    //     props.selected_options.push(option)
    //     updated_selected_options = props.selected_options
    //   }
    //   props.setSelectedOption(updated_selected_options)
    // }
    
  };

    const closeOpenMenus = (e)=>{
      // if(isOpen && !selectedOption.contains(e.target)){
      if(isOpen && !dropdownRef.current?.contains(e.target)){
        setIsOpen(false)
      }
    }

  useEffect(function(){
    document.addEventListener('mousedown',closeOpenMenus)
  })
  

  return (
    <div className="dropdown_container w-auto md:w-1/3 px-4  py-0 md:py-2 md:pt-0" ref={dropdownRef}>
      <p className="title">{props.title}</p>
      <div className="dropdown">
        <div className="selectedOption" onClick={toggleDropdown}>
          <span className="selectedText">{parseInt(selectedOption) ? parseInt(selectedOption) : selectedOption  }</span>
          <span className="arrow">{isOpen ?  <CloseArrow/>:<OpenArrow/>}</span>
        </div>
        {isOpen && (
          <div className="options shadow-lg border-t border-black">
            {props.options.map((option, index) => (
              <div
                key={index}
                renderLabel= {parseInt(option) ? parseInt(option) : option}

                // id={props.selected_options.includes(option) ? 'active' : 'inactive'}
                className={props.multiSelect ? `multiSelect option option_`+option.replaceAll(' ', '_')  : `option option_`+option.replaceAll(' ', '_') }
                onClick={() => handleOptionSelect(option)}
              >
                {parseInt(option) ? parseInt(option) : option}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

  

export default FilterDropdown;
