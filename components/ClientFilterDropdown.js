"use client";

import FilterDropdown from './FilterDropdown';

const ClientFilterDropdown = (props) => {
  return <FilterDropdown title={props.title} options = {props.options} variable ={props.variable} changeSelection={props.changeSelection}  
  multiSelect = {props.multiSelect ? props.multiSelect : false}
  selected_options= {props.selected_options}
  setSelectedOption= {props.setSelectedOption}

      />;
};

export const ClientFilterDataContainer = () =>{
  return (<ClientFilterDropdown 
          title={'Country'} 
          options={countryOptions} 
          variable={countrySelection} 
          changeSelection={go_to_country_page} 
          multiSelect={false}
          selected_options={[]}
          setSelectedOption={setlineChartcountryOptions}
        />)
}

export default ClientFilterDropdown;
