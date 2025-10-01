"use client";

import FilterMultiDropdown from './FilterMultiDropdown';
import FilterLinkMultiDropdown from './FilterMultiDropdown';

const ClientFilterMultiDropdown = (props) => {
  console.log(props.defaultoptions)
  return <FilterMultiDropdown title={props.title} options = {props.options} variable ={props.variable} changeSelection={props.changeSelection}  
  multiSelect = {props.multiSelect ? props.multiSelect : false}
  selected_options= {props.selected_options}
  setSelectedOption= {props.setSelectedOption}
  defaultoptions = {props.defaultoptions}

      />;
};

export const ClientFilterLinkMultiDropdown = (props) => {
  return <FilterLinkMultiDropdown title={props.title} options = {props.options} variable ={props.variable} changeSelection={props.changeSelection}  
  multiSelect = {props.multiSelect ? props.multiSelect : false}
  selected_options= {props.selected_options}
  setSelectedOption= {props.setSelectedOption}

      />;
};

export default ClientFilterMultiDropdown;
