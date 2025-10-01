"use client";

import React from 'react';
import { useEffect , useState} from 'react'
// import {colours, checkIfNumber} from  '@constants'
import * as d3 from 'd3';

// import datafile from '@public/us-states_v2.json'
// import {get_suffix, indicator_title_dictionary, header_mapping, transform_tooltip_left, transform_text_anchor, school_district_array} from '@constants'
// import {closeIcon} from '@components/components'
// import {fetchDecryptedData} from '../src/utils/fetchDecryptedData'

// const twoDecimalPlaces = d3.format('.3f')
import {json_type} from '../src/domain/dataEntity'
import {checkRounding, axis_format} from '../src/constants/calculations'
import { amended_data_array, data_replacement_year } from '../src/constants/constants';

import {x_axis_label_dict} from '../public/data/selection_dictionary'
import { country_codes } from '../public/data/country_codes';
import { headerMap, reverse_headerMap } from '../public/data/headerMap';

import { ElevatorSharp } from '@mui/icons-material';
// type IndicatorData = {
//   "Country name": string;
//   "Region name": string;
//   Geocode: string;
//   Year: string;
//   [key: string]: string | number; // Additional columns with dynamic keys
// };

// type json_type = Record<string, string>;

type dictionary = {[key:string]:string}

// let chart_width: number; // Explicitly declare chart_width as a number

let horizontal_chart_margins: {
  top: number;
  left: number;
  right: number;
  bottom: number;
}; // Explicitly declare horizontal_chart_margins as an object with number properties



// const country_colors_array = ['#E0288A',
// '#DEE548',
// '#FBC33C',
// '#FF8300',
// '#00ADEF',
// '#828282',
// '#000000',
// '#93368D',
// '#3C9FA8',
// '#E9683A',
// '#116A93'
// ]
// const included_colours:string[] = []
function getWidth(this_container: string): number {
  const element = d3.select(`#${this_container}`).node() as HTMLElement | null;
  // console.log(element.getBoundingClientRect())
  if (element && element.getBoundingClientRect) {
    return element.getBoundingClientRect().width || 800; // Default to 600 if width is 0
  }
  return 800; // Fallback width
}

function getMargin(variable:string){
  if(variable.includes('GDP')){
    horizontal_chart_margins = {
      top:10,
      left:70,
      right:70,
      bottom:30
    }
}
  else if(window.innerWidth > 600){
    horizontal_chart_margins = {
                  top:10,
                  left:50,
                  right:70,
                  bottom:30
                }
  }

  else{
    horizontal_chart_margins = {
                  top:10,
                  left:50,
                  right:40,
                  bottom:30
                }
  }
  
}

const getDateFromYear = (year: string | Date | number | undefined) => {
    if(year != ''){
        const parsedDate = d3.timeParse("%Y")(parseInt(year as unknown as string) as unknown as string);
        if (!parsedDate) {
          return year;
          // throw new Error(`Invalid year format: ${year}`);
        }
        else{
          return parsedDate
        }
    }

};


const all_charts_config={} as {[key:string]:{[key:string]:number | undefined }}

let sorted_countries;
// let dots_drawn = false;

export async function drawLineChart(this_container:string,  variable:string, active_country:string, included_countries:string[], 
  all_countries:string[], data:json_type[], columns:string[], this_colorObject:dictionary, chart_type:string){

    const colorObject = this_colorObject
    const country = active_country;

    console.log(data)

    d3.select('.chart_group'+this_container).selectAll('.country_circle').remove()

    close_tooltips()


    const indicator_data = data;

      d3.select("#"+this_container).select('.x_axis_group').remove()
      d3.select("#"+this_container).select('.y_axis_group').remove()

      const countries: string[] = [];
      let year_array: (string | Date | number | undefined)[] = [];

      indicator_data.forEach(function (d: json_type) {
        if (country === 'All') {
          if (!countries.includes(d["Country name"] as string)) {
            countries.push(d["Country name"] as string);
          }
        } else if (!countries.includes(country)) {
          countries.push(country);
        }
      
        if (!year_array.includes(d["YE"]) && d['YE'] != '') {
          year_array.push(d["YE"]);
        }
      });

      year_array = year_array.sort()

      let lines_data;
      const values_Array = [] as number[]

      if(chart_type === 'multi_variable'){

        ////// update legend
        d3.selectAll('.legend_'+this_container).html('')

        console.log(colorObject)
        columns.forEach(function(variable){

              d3.selectAll('.legend_'+this_container).append('div')
              .html('<span class="legend_box" style="background-color:'+colorObject[headerMap[variable as string]]+'"></span><p class="text-sm">'+headerMap[variable as string].split('_')[1]+'</p>')
        })
        console.log(columns)
        lines_data = columns.map(function (id) {
          return {
            id: id,
            values: indicator_data.filter(function(d:json_type){
                if(d[id] != ''){
                  return d
              }
            
            }).map(function (d) {     
            values_Array.push(parseFloat(d[id] as string))           
            return { 
                'Geocode':(d['GE'] as unknown as string).replaceAll(' ', '').replaceAll('-', ''), 
                'Country name':d['NA'],  
                id:id, 
                variable:headerMap[id as string],
                Year: getDateFromYear(d.YE), 
                data_amended: d['DA'],
                value: parseFloat(d[id] as string),
                rank: parseFloat(d[reverse_headerMap[headerMap[id as string].replaceAll('_ mean', '_ ranking').replaceAll('_ SD', '_ ranking')]] as string),
              }
        })
      }
      })
       

      }
      else{
        // all_charts_config[this_container]['country_scale'] = d3.scaleOrdinal().domain(included_countries).range(country_colors_array)
        ////// update legend
        d3.selectAll('.legend_'+this_container).html('')
        // d3.select('#'+this_container).parentNode().selectAll('.legend').html('')

        included_countries.forEach(function(country){
              d3.selectAll('.legend_'+this_container).append('div').html('<span class="legend_box" style="background-color:'+colorObject[country]+'"></span><p class="text-sm">'+
              country_codes[country]+'</p>')
        })

        console.log(included_countries)

        // country_color.domain(included_countries)
        lines_data = included_countries.map(function (id) {
            return {
            id: id,
            values: indicator_data.filter(function(d:json_type){
              if(d['GE'] === id && d[variable] != ''){
                return d
            }
          })
          .map(function (d: json_type) {
                values_Array.push(parseFloat(d[variable] as string))
          
                  return { 
                    'Geocode':(d['GE'] as unknown as string), 
                    'Country name':d['NA'], 
                    id:d['GE'], 
                    variable:headerMap[variable as string], 
                    Year: getDateFromYear(d['YE']), 
                    data_amended: d['DA'],
                    rank: parseFloat(d[reverse_headerMap[headerMap[variable as string].replaceAll('_ mean', '_ ranking').replaceAll('_ SD', '_ ranking')]] as string),
                    value: parseFloat(d[variable] as string) };
            }),
          }
        })
      }     

      console.log(lines_data)

          sorted_countries = indicator_data;
          const null_value_array: (string | Date | number)[] = [];

          const this_data_max = d3.max(values_Array);
          const this_data_min = d3.min(values_Array);
          
          all_charts_config[this_container].min = getMin()
          all_charts_config[this_container].max = getMax()

          function getMin(){
              if(this_data_min! < 0){
                return this_data_min;
              }
              else{
                return 0
              }
          }
          
          function getMax(){
              if(variable != ''){
                if(headerMap[variable].includes('Life evaluation _ Average')){
                  return 10
                }
                else{
                  return this_data_max
                }
              }
              else{
                return this_data_max
              }
          }


          getMargin(variable)

          const this_country_array: string[] = [];
          sorted_countries.forEach(function (d: json_type) {
            this_country_array.push(d['Region name'] as string);
            if (d['value'] === '') {
              null_value_array.push(d['Region name'] as string);
            }
          });
            

          // x_Scale.range([0, all_charts_config[this_container]['chart_width']]).domain([getDateFromYear(year_array[0]), getDateFromYear(year_array[year_array.length -1])])
          //@ts-expect-error scale time type tbd
          all_charts_config[this_container]['x_Scale'] = d3.scaleTime()
          .range([horizontal_chart_margins.left, (all_charts_config![this_container]!['container_width']! - horizontal_chart_margins.right)])
               //@ts-expect-error issue with new date formatting from lines_Data instead of csv
              .domain([getDateFromYear(year_array[0]), getDateFromYear(year_array[year_array.length -1])])

          //@ts-expect-error scale time type tbd
          all_charts_config[this_container]['y_country_Scale'] = d3.scaleLinear().domain([all_charts_config[this_container].max ? all_charts_config[this_container].max : 10,  all_charts_config[this_container].min ? all_charts_config[this_container].min : 0]).range([horizontal_chart_margins.top, all_charts_config[this_container]['chart_height'] - horizontal_chart_margins.bottom])


          const path = d3.line<json_type>()
              // .curve(d3.curveCardinal.tension(0.5))
              // .defined(function (d) { console.log(parseFloat(d['value'] as unknown as string)); return isNaN(parseFloat(d['value'] as unknown as string)) === false  })
              .x(function (d) { 
                // const year = getDateFromYear(d["Year"].toString());
                //@ts-expect-error scale time type tbd
                return all_charts_config[this_container]['x_Scale'](d["Year"]); 
              })
              .y(function (d) { 
                if(d['value'] != '' && isNaN(parseFloat(d['value'] as unknown as string)) === false){
                    //@ts-expect-error scale time type tbd
                    return all_charts_config[this_container]['y_country_Scale'](parseFloat(d['value'] as string)); 
                }
                // else if (isNaN(parseFloat(d['value'] as unknown as string))) {
                //   //@ts-expect-error scale time type tbd
                //   return ''
                // }
                else {
                  //@ts-expect-error scale time type tbd
                  return all_charts_config[this_container]['y_country_Scale'](0)
                }
              });

          //@ts-expect-error scale time type tbd
          const xAxis = d3.axisBottom(all_charts_config[this_container]['x_Scale']).ticks(3)
          //@ts-expect-error scale time type tbd
          const yAxis = d3.axisLeft(all_charts_config[this_container]['y_country_Scale'])
         //@ts-expect-error scale time type tbd
          .ticks(all_charts_config[this_container]['chart_height'] < 300 ? 3 : 8)


          d3.selectAll('.zero_line').remove()

          //@ts-expect-error scale time type tbd
          if(all_charts_config![this_container]!['y_country_Scale']!.domain()[1] < 0){
            d3.select('.chart_group' + this_container)
              .append('line')
              .attr('class', 'zero_line')
              .attr('x1', horizontal_chart_margins.left)
              //@ts-expect-error scale time type tbfrankd
              .attr('x2', all_charts_config ? all_charts_config![this_container]!['x_Scale'].range()[1] : 0)
              //@ts-expect-error scale time type tbd
              .attr('y1', all_charts_config ? all_charts_config![this_container]!['y_country_Scale'](0) : 0)
              //@ts-expect-error scale time type tbd
              .attr('y2', all_charts_config ? all_charts_config![this_container]!['y_country_Scale'](0) : 0)
              .attr('stroke', 'black')
              .attr('stroke-dasharray', '5,5')
          }

          // if(update === false){
          d3.select('.chart_group' + this_container) // Correctly concatenates the selector
            .append('g')
            .attr('class', 'x_axis_group axis')
            //@ts-expect-error all_charts_config may be undefined
            .attr('transform', 'translate(0, ' + (all_charts_config[this_container] ? (all_charts_config[this_container]!['chart_height'] - horizontal_chart_margins.bottom) : 0 )+ ')')
            .call(xAxis);


          d3.select('.chart_group'+this_container).append('g')
              .attr('class', 'y_axis_group axis')
              .attr('transform', 'translate('+horizontal_chart_margins.left+', 0)')
              .call(yAxis)
              .selectAll('text')
              .attr('data-href', function(){
                  return this_container
              }) 
              .attr('data-variable', function(){
                  return variable
              })
              .attr('class', function(d){
                  if(d === 'National'){
                    return 'dot_plot_city_name uppercase font-bold '+this_container

                  }
                  else{
                     return 'dot_plot_city_name '+this_container
                  }
              })
              .attr('fill', function(){
                    return 'black'
              })
              .attr('id', function(){
                  return 'dot_plot'
              })
              .text(function(d){
                return axis_format((d as unknown as string), headerMap[variable])
              })

              d3.select('.chart_group' + this_container).select('.y_axis_group')
            .append('text')
            .attr('fill', 'black')
            .attr('text-anchor', 'start')
            .attr('class', 'text-xs')
            .attr('dy', '1em')
            //@ts-expect-error issue with config
            .attr('y', (all_charts_config![this_container]!['chart_height'] /2 - horizontal_chart_margins.top))
            .attr('x', -(horizontal_chart_margins.left * 2))
            // .attr('transform', 'rotate(-90,15,15')
            //@ts-expect-error issue with config
            .attr('transform', 'rotate(-90,'+(-horizontal_chart_margins.left)+','+(all_charts_config![this_container]!['chart_height']/2 - horizontal_chart_margins.top)+')')
            .text(function(){
              if(variable != ''){
                return  x_axis_label_dict[headerMap[variable].split(' _ ')[1]]
              }
              else{
                return 'Percentage'
              }
            })
            
   
          const this_dot_plot = d3.selectAll('.chart_group'+this_container)
              .selectAll('.country_path')
              .data(lines_data)

          this_dot_plot.enter()
              .append('path')
              .attr('class', function(d){
                if(d.values[0]){
                    return 'country_path country_element country_element'+(d.values[0].id as unknown as string).replaceAll(' ', '')
                }
                else{
                  return 'country_path country_element'
                }
              })
              //@ts-expect-error type d may be undefined
              .attr('stroke', function (d: { id: string; values: json_type[] }) {
                console.log(d.id)
                if(d){
                  if(headerMap[d.id as string]){
                    return colorObject[headerMap[d.id as string] as unknown as string] ? colorObject[headerMap[d.id as string] as unknown as string] : Object.values(colorObject); 
                  }
                  else{
                    return colorObject[d.id as unknown as string] ? colorObject[d.id as unknown as string] : Object.values(colorObject); 

                  }
                }
              })
              .attr('stroke-width', 3)
              .attr('fill', 'transparent')
              .attr('d', function(d) {
                  //@ts-expect-error d.values type
                  return path(d.values)
              })
              .each(function(d){
                //@ts-expect-error scale time type tbd
                add_line_dots(d.values, this_container, included_countries, variable, colorObject)
              })

          this_dot_plot
              .transition()
              .attr('d', function(d) {
                  //@ts-expect-error d values types error
                  return path(d.values)
              })
              //@ts-expect-error d values types error
              .attr('stroke', function (d) {
                if(d){
                  if(headerMap[d.id]){
                    return colorObject[headerMap[d.id as string] as unknown as string] ? colorObject[headerMap[d.id as string] as unknown as string] : Object.values(colorObject); 
                  }
                  else{
                    return colorObject[d.id as unknown as string] ? colorObject[d.id as unknown as string] : Object.values(colorObject); 

                  }
                }              })
              .attr('class', function(d){
                  if(d.values[0]){
                    return 'country_path country_element country_element'+(d.values[0].id as unknown as string).replaceAll(' ', '') 
                  }
                  else{
                    return 'country_path country_element'
                  }            
              })
              .on('end', function(d){
                // dots_drawn = true;
                //@ts-expect-error type of d
                add_line_dots(d.values, this_container, included_countries, variable, colorObject)
              })

          this_dot_plot.exit().remove()

          ////////////////////////////////////////
          ////////////////////////////////////////
          d3.selectAll('.background_rect')
            .on('click', function(){
              // .on('click', function(d){
                d3.selectAll('.country_circle').style('stroke', 'transparent').classed('inactive_circle', true)
                d3.selectAll('.country_element').style('opacity', 1)
                // close_LineChart_tooltip()
                close_tooltips()
            })

}
function add_line_dots(line:json_type[], this_container:string, included_countries:string[], variable:string, colorObject:dictionary){
                if(line){
                    const these_dots = d3.selectAll('.chart_group'+this_container)
                      .selectAll('.country_circle.country_element'+line[0].id)
                      .data(line as json_type[])
                    
                    these_dots.enter()
                      .append('circle')
                      .attr('class', function(d){
                            if(d){
                              return 'country_circle inactive_circle country_element country_element'+(d.id as unknown as string).replaceAll(' ', '') 
                            }
                            else{
                              return 'country_circle inactive_circle  country_element'
                            } 
                      })
                        // 'dot_plot_circle dot_plot_circle_rural circle_'+line.id.replaceAll(' ','_'))
                      .attr('cx', function(d:json_type) {
                        // const year = getDateFromYear(d["Year"].toString());
                         //@ts-expect-error scale time type tbd
                        return all_charts_config[this_container]['x_Scale'](d["Year"]); 
                      })
                       //@ts-expect-error error with country scale type
                      .attr('fill', function(d:json_type) {
                          if(d){
                            if(headerMap[d.id as string]){
                              return colorObject[headerMap[d.id as string] as unknown as string] ? colorObject[headerMap[d.id as string] as unknown as string] : Object.values(colorObject); 
                            }
                            else{
                              return colorObject[d.id as unknown as string] ? colorObject[d.id as unknown as string] : Object.values(colorObject); 
          
                            }
                          }                     
                      })
                      .attr('cy', function(d) {
                        if(d['value'] != '' || isNaN(parseFloat(d['value'] as unknown as string))){
                          //@ts-expect-error scale time type tbd
                          return all_charts_config[this_container]['y_country_Scale'](parseFloat(d['value'] as string)); 
                        }
                        else {
                          //@ts-expect-error scale time type tbd
                          return all_charts_config[this_container]['y_country_Scale'](0)
                        }
                      })
                      .attr('r', function(d){
                        if(d[variable] !== '' && isNaN(parseFloat(d['value'] as unknown as string)) != true){
                          return 5
                        }
                        else{
                          return 0
                        }
                      })
                      .on('click', function(e, d){
                      //   console.log(d)
                      //   d3.selectAll('.country_circle').style('stroke', 'transparent').classed('inactive_circle', true)
                      //   d3.select(this).style('stroke', 'black').classed('inactive_circle', false)
                        //@ts-expect-error issue with config
                        openChartTooltip(e, d, variable,this_container, (all_charts_config![this_container]!['chart_height'] / 2), (all_charts_config![this_container]!['chart_width'] / 2))
                      })
                      .on('mouseover', function(e,d){
                        d3.select(this).style('stroke', 'black')
                        d3.selectAll('.country_circle').style('stroke', 'transparent').classed('inactive_circle', true)
                        d3.select(this).style('stroke', 'black').classed('inactive_circle', false)
                        highlight(d.id as unknown as string, this_container)
                      })
                      .on('mouseout', function(){
                        d3.selectAll('.country_circle.inactive_circle').style('stroke', 'transparent')
                        highlight('All', this_container)
                      })

                  these_dots
                      .attr('class', 'country_circle inactive_circle country_element country_element'+(line[0].id as unknown as string).replaceAll(' ', ''))
                      .attr('cx', function(d:json_type) {
                        // const year = getDateFromYear(d["Year"].toString());
                         //@ts-expect-error scale time type tbd
                        return all_charts_config[this_container]['x_Scale'](d["Year"]); 
                      })
                      //@ts-expect-error error with country scale type
                      .attr('fill', function(d:json_type) {
                        if(d){
                          if(headerMap[d.id as string]){
                            return colorObject[headerMap[d.id as string] as unknown as string] ? colorObject[headerMap[d.id as string] as unknown as string] : Object.values(colorObject); 
                          }
                          else{
                            return colorObject[d.id as unknown as string] ? colorObject[d.id as unknown as string] : Object.values(colorObject); 
        
                          }
                        }
                      })
                      .attr('cy', function(d) {
                        if(d['value'] != ''|| isNaN(parseFloat(d['value'] as unknown as string))){
                          //@ts-expect-error scale time type tbd
                          return all_charts_config[this_container]['y_country_Scale'](parseFloat(d['value'] as string)); 
                        }
                        else {
                          //@ts-expect-error scale time type tbd
                          return all_charts_config[this_container]['y_country_Scale'](0)
                        }
                      })
                      .attr('r', function(d){
                        if(d['value'] !== '' && isNaN(parseFloat(d['value'] as unknown as string)) != true){
                          return 5
                        }
                        else{
                          return 0
                        }
                      })
                      .on('mouseover', function(e,d){
                        d3.select(this).style('stroke', 'black')
                        d3.selectAll('.country_circle').style('stroke', 'transparent').classed('inactive_circle', true)
                        d3.select(this).style('stroke', 'black').classed('inactive_circle', false)
                        highlight(d.id as unknown as string, this_container)
                      })
                      .on('click', function(e, d){
                        //@ts-expect-error obj poss undefined
                        openChartTooltip(e, d, variable,this_container, (all_charts_config![this_container]!['chart_height'] / 2), (all_charts_config![this_container]!['chart_width'] / 2))

                      })
                      // .on('mouseover', function(e,d){
                      //   console.log(d.Geocode)
                      //   highlight(d.id as unknown as string, this_container)
                      // })   
                      .on('mouseout', function(){
                        highlight('All', this_container)
                      })

                      // d3.selectAll('.chart_group'+this_container)
                      // .selectAll('.country_circle.country_element'+line[0].id).exit().remove()

                
                      // this_dot_plot_circles.on('click', function(e, d){
                      //   openChartTooltip(e, d, variable, this_container)
                      // })
                }
              }
// function check_integer(value){
//   if(value < 10){
//     return 
//   }
//   else {
//     return Math.round(partner_circle.data()[0][d3.select(this_circle).attr('data-variable')]
//   }
// }

function highlight(id:string, this_container:string){
  if(id === 'All'){
    d3.selectAll('.chart_group'+this_container).selectAll('.country_element').style('opacity', 1)
  }
  else{
    d3.selectAll('.chart_group'+this_container).selectAll('.country_element').style('opacity', 0.2)
    d3.selectAll('.chart_group'+this_container).selectAll('.country_element'+id.replaceAll(' ', '') ).style('opacity', 1)
  }

}

function close_tooltips(){

  d3.selectAll('.chart_tooltip').style('display', 'none')
}

function openChartTooltip(event:PointerEvent, value:json_type, variable:string, chart_id:string, half_height:number, half_width:number){
  close_tooltips()
  if(event.offsetY < half_height){
    d3.select('.chart_tooltip_'+chart_id).style('display', 'block')
      .style("top", event.offsetY + 'px')
      .style("transform", "translate(-50%, 0)")

  }
  else{
    d3.select('.chart_tooltip_'+chart_id).style('display', 'block')
      .style("top", event.offsetY + 'px')
      .style("transform", "translate(-50%, -105%)")
  }

  if(event.offsetX < 100){
    d3.select('.chart_tooltip_'+chart_id).style('display', 'block')
      .style("left", (event.offsetX + 100)+ 'px')

  }
  else if(event.offsetX < half_width){
    d3.select('.chart_tooltip_'+chart_id).style('display', 'block')
      .style("left", event.offsetX+ 'px')

  }
  else{
    d3.select('.chart_tooltip_'+chart_id).style('display', 'block')
      .style("left", (event.offsetX - 100) + 'px')
  }

  console.log(value)

  d3.select('.chart_tooltip_'+chart_id).html(
    '<div class="tooltip_header flex justify-between"><img src="/images/flags_iso_3/'+value.Geocode+'.png"></img>'+
    '<h2 class="">'+value['Country name']+'</h2><p class="close_tooltip"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg></p></div>'+
    '<div class="tooltip_contents">'+
    '<p>'+(value.variable as string).split(' _ ')[1] +'</p>'+    
    '<h2>'+checkRounding((value.variable as string).split(' _ ')[1], value['value'])+' in '+d3.timeFormat("%Y")(value.Year as unknown as Date)+'</h2>'+
    '<p>Rank:</p>'+
    '<h2>'+(value['rank'] ? value['rank']+' in '+d3.timeFormat("%Y")(value.Year as unknown as Date) : '-')+'</h2>'+
    '<p class="data_amended_check">'+((amended_data_array.includes(variable) && value.data_amended === 'Amended') ? 'Uses '+data_replacement_year +' data' : '' )+'</p>'+
    check_country_link(chart_id, value.Geocode)+  '</div>'
  )

  d3.selectAll('.close_tooltip').on('click', function(){
    d3.selectAll('.country_circle').style('stroke', 'transparent').classed('inactive_circle', true)
    close_tooltips()
  } )

  function check_country_link(chart_id:string, Geocode:string | number | null | undefined){
    if(chart_id === 'main_line_chart') {
      return '<div class="w-auto inline-block"><a class="btn" href="/country/'+Geocode+'">Go to country page</a></div></div>'
     }
     else{ return ''}
  }

}


// function  close_LineChart_tooltip(){
//   d3.selectAll('.dot_plot_circle').classed('inactive', false)
//   d3.selectAll('.dot_plot_line').classed('inactive', false)
//   d3.selectAll('.dot_plot_city_name').classed('inactive', false)

//   d3.selectAll('.LineChart_tooltip')
//     .style('display', 'none')
// }

function LineChart(props: {variable: string, columns: string[], country: string, container:string, included_countries:string[], all_countries:string[], data:json_type[], height:string | null, 
  colorObject:dictionary, chart_type:string}){


    console.log(props.variable)

    const [chartColorObj, setChartColorObj] = useState<dictionary | null | string>(null)
    useEffect(() => {
        // createLineChart(props.container, props.height)
                //@ts-expect-error needs to be set as array type

        if(props.colorObject.length  > 0){

          setChartColorObj(props.colorObject[0])

        }
        else{
          setChartColorObj(props.colorObject)

        }
    }, [props.included_countries.length]);
    useEffect(() => {      
      all_charts_config[props.container] = {}
      getMargin(props.container)
      all_charts_config[props.container]['container_width'] = getWidth(props.container);  
      
      const this_div = d3.select('#'+props.container)

      const this_height=  (this_div?.node() as HTMLElement).getBoundingClientRect().height 

      console.log(this_div)
      //@ts-expect-error obj undef
      all_charts_config[props.container]['chart_width'] = all_charts_config[props.container]['container_width'] - horizontal_chart_margins.left - horizontal_chart_margins.right ;
      all_charts_config[props.container]['chart_height'] = this_height;

      if(chartColorObj){
        drawLineChart(props.container, props.variable, props.country, props.included_countries, props.all_countries, props.data, props.columns, (chartColorObj as dictionary), props.chart_type)

      }
    }, [props.variable, props.included_countries.length, props.country, props.data, props.colorObject, chartColorObj]);



  // const ref = useRef(null);

  // useEffect(() => {
  //   console.log('width', ref.current ? ref.current.offsetWidth : 0);
  // }, [ref.current]);


  // return <div ref={ref}>Hello</div>;
    // console.log(props.variable.constructor === Array)
    
    // console.log(Array.isArray(props.variable))

//     d3.select("#"+this_container).select("svg")
//     // .attr("width", all_charts_config[this_container]['container_width'])
//     .attr("height", all_charts_config[this_container]['chart_height'])
//     .append('g').attr('class', 'chart_group'+this_container)
//     // .attr('transform', 'translate('+horizontal_chart_margins.left+', '+(horizontal_chart_margins.top)+')')

// d3.select('.chart_group'+this_container)
//     .append('rect')
//     .attr('fill', 'transparent')
//     .attr('class', 'background_rect')
//     .attr("width", all_charts_config[this_container]['container_width'])
//     .attr("height", all_charts_config[this_container]['chart_height'])


    return (  
            <div key ="test"  id={props.container}  className = {`line_chart relative h-full w-full `+ props.container.replaceAll(' ', '')+``}>
                <svg className="w-full h-full " >
                <rect style={{fill:'transparent'}} className="background_rect w-full h-full"  ></rect>

                  <g className={"chart_group"+props.container} ></g>
                </svg>
                <div className={`shadow-lg chart_tooltip chart_tooltip_`+props.container+``}></div>
            </div>     
       

      )
}

export default LineChart;