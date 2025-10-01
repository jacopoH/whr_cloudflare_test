import React, { useState } from 'react';
// import * as d3 from "d3";
import {checkedIcon, icon} from '@mui/icons-material/Done';
import Checkbox from '@mui/material/Checkbox';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import {OpenArrow} from '../src/constants/icons'
import {country_codes} from '../public/data/country_codes'
export const FilterLinkMultiDropdown = (props) => {
// const [selectedOption, setSelectedOption] = useState();
  if(props.selected_options){
    return( <Autocomplete
        options={props.options}
        size="small"
        value={props.variable}
        popupIcon={<OpenArrow/>}
        getOptionLabel={(option) => country_codes[option]}
        onChange={(event, newValue) => {
            props.changeSelection(newValue)
        }}

        sx={{ 
          height:'100%',
          padding:'0px', 
          borderBottom: 'solid 2px #E0288A',
          '& .MuiFormLabel-root':{
            color:'black'
          },
          '& .MuiOutlinedInput-notchedOutline ': {
            border:'none',
          },
          '& .MuiOutlinedInput-notchedOutline *':{
            color:'black'
          },
          '& .MuiInputBase-root':{
            height:'44px',
          },
          '& .MuiAutocomplete-hasPopupIcon.MuiAutocomplete-hasClearIcon.MuiAutocomplete-root .MuiInputBase-root':{
            padding:'10px'
          },
          '& .MuiOutlinedInput-root':{
            padding:'0px'
          },
          '& .mui-1kfabtt-MuiFormLabel-root-MuiInputLabel-root':{
            
            top:'5%',
            fontWeight:'bold'
          },
          '& .MuiInputLabel-shrink':{
            transform: 'translate(14px, -9px) scale(0)',
            display:'none'
          },
          '& .MuiButtonBase-root.MuiAutocomplete-clearIndicator':{
            visibility:'hidden'
          }
        
          // '& .mui-1x7n7v0-MuiButtonBase-root-MuiIconButton-root-MuiAutocomplete-clearIndicator'
        }}
        renderInput={(params) => <TextField {...params}  label="Country" />}
      />)
  }
};
const FilterMultiDropdown = (props) => {

const [selectedOptionsArray, setSelectedOptionsArray] = useState(props.selected_options);


// <span className="arrow">{isOpen ?  <CloseArrow/>:<OpenArrow/>}</span>

if(props.selected_options){
  return (<div className='mb-4'><p className="title">{props.title ? props.title : ''} </p><Autocomplete
          multiple
          id="checkboxes-tags-demo"
          options={props.options}
          popupIcon={<OpenArrow/>}
          disableCloseOnSelect
          sx={{ 
            minHeight:'100%',
            padding:'0px', 
            borderBottom: 'solid 1px #000',
            '& .mui-hvjq6j-MuiFormLabel-root-MuiInputLabel-root, .mui-1kfabtt-MuiFormLabel-root-MuiInputLabel-root':{
              color:'black'
            },
            '& .mui-1ll44ll-MuiOutlinedInput-notchedOutline, .MuiOutlinedInput-notchedOutline ': {
              border:'none',
              borderColor:'red'
            },
            '& .MuiInputLabel-root':{
              top:'-10%',
              color: 'black',
              textTransform: 'uppercase',
              fontWeight: 'bold',
              fontFamily: 'proxima-nova'
            },
            '& .MuiOutlinedInput-notchedOutline *':{
              color:'black'
            },
            '& .MuiInputBase-root':{
              minHeight:'42px',
            },
            '& .MuiOutlinedInput-root':{
              padding:'0px'
            },
            '& .mui-1kfabtt-MuiFormLabel-root-MuiInputLabel-root':{
              top:'5%',
              fontWeight:'bold'
            },
            '& .mui-hvjq6j-MuiFormLabel-root-MuiInputLabel-root':{
              transform: 'translate(14px, -9px) scale(0)'
            },
            '& .mui-1x7n7v0-MuiButtonBase-root-MuiIconButton-root-MuiAutocomplete-clearIndicator':{
              display:'none'
            }
          
            // '& .mui-1x7n7v0-MuiButtonBase-root-MuiIconButton-root-MuiAutocomplete-clearIndicator'
          }}
          getOptionLabel={(option) => country_codes[option] ? country_codes[option] : option}
          // value={props.selected_options}
          defaultValue={props.selected_options}
          onChange={(event, newValue) => {
              console.log(newValue)
              if(newValue.length === 0 || newValue.includes('World')){
                setSelectedOptionsArray(props.defaultoptions)
                props.setSelectedOption(props.defaultoptions)
              }
              else{
                setSelectedOptionsArray(newValue)
                props.setSelectedOption(newValue)
              }

          }}
          renderOption={(params, option, { selected }) => {
            const { key, ...optionProps } = params;
            return (
              <li className={"xl:p-2 p-0"}key={key} {...optionProps}>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8, fontFamily:'proxima-nova'}}
                  sx={{
                    '&.Mui-checked': {
                      color: '#E0288A',
                    },
                  }}
                  defaultChecked={selectedOptionsArray.includes(option)}
                  checked={selected}
                  value={country_codes[selected]}
                  // onChange={(event, newValue) => {
                  // //     // setValue([
                  // //     //   ...fixedOptions,
                  // //     //   ...newValue.filter((option) => !fixedOptions.includes(option)),
                  // //     // ]);
                  // // //   console.log(event.target.value)
                  //   // handleOptionSelect(event, newValue)
                  //   console.log(event.target.value)
                  // }}
                  />
                {country_codes[option] ? country_codes[option] : option}
              </li>
            );
          }}
          renderInput={(params) => <TextField {...params} label={props.title} placeholder={''}  />}
    /></div>)
}
  


};



export default FilterMultiDropdown;
