'use client'
import * as d3 from 'd3'

import {variable_value_formatting} from '../../public/data/selection_dictionary'




const twoDecimalPlaces = d3.format('.0f')
export const commaFormat = d3.format(',')
const thousandsFormat = d3.format('.0s')


export function axis_format(value:number | string | Date, variable:string){
  console.log(variable)
  console.log(value)
  if(!variable){
    return twoDecimalPlaces(value as number)
  }
  if(variable.includes('Change') || variable.includes('Inequality')){
    return d3.format('.1f')(value as number)
  }
  if((value as number) > 999){
    return thousandsFormat(value as number)
  }
  else if((value as number)  > 9){
    return parseInt(value as string)
  }
  else{
    return twoDecimalPlaces(value as number)
  }
}
export function checkRounding(variable:string, value:string | number | null | undefined){
  const split_variable = (variable as unknown as string).split(' _ ')[1] ? variable.split(' _ ')[1] : variable;
  if(value === ''){
    return '-'
  }
  else if((typeof value === 'string' && value.includes('$')) ||( typeof value === 'string' && value.includes('%'))){
    return value;
  }
  if(variable.includes('Rank') || variable.includes('ranking')){
    return twoDecimalPlaces(parseFloat(value as string))
  }
  else if(variable_value_formatting[split_variable as unknown as string]){
    return variable_value_formatting[split_variable as unknown as string](parseFloat(value as string))
  }
  else{
    return twoDecimalPlaces(parseFloat(value as string))
  }
}



// export function getFormat(value:number){
//   if(value > 1000){
//     return commaFormat(value)
//   }
//   else if(value > 100){
//     return parseInt(value as unknown as string)
//   }
//   else if(value > 1){
//     return twoDecimalPlaces(value)
//   }
//   else {
//     return  twoDecimalPlaces(value)
//   }
// }

export const get_country_code_from_country_name = async function(dict:{[key:string]:string}, country_name:string){
    const filtered_iso = Object.keys(dict).filter(function (filtered:string) {
        let active_iso;
        if(dict[filtered] === country_name){
          active_iso =  filtered
        }
        return active_iso
    });
    return filtered_iso[0]
  // var filtered = Object.fromEntries(Object.entries(dict).filter(([k,v]) => v>1));
  // console.log(filtered)
};

