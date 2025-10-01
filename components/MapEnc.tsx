'use client'
import * as d3 from "d3";

import {D3ZoomEvent} from "d3"
import * as topojson from "topojson-client";
import { Topology, Objects } from "topojson-specification";
import { GeoJsonProperties, FeatureCollection, Geometry } from "geojson";
import { Feature } from "geojson";
// import {fetchDecryptedData} from '../src/utils/fetchDecryptedData'
// import {getDecryptedData} from '../src/useCases/getDecryptedData'
// import {getDecryptedCSVData} from '../src/utils/getDecryptedData'
import {useEffect, useState} from 'react'
import {checkRounding} from '../src/constants/calculations'
import { amended_data_array, data_replacement_year} from '../src/constants/constants';

import {json_type} from '../src/domain/dataEntity'
import {map_band_dictionary, variable_appendages} from '../public/data/selection_dictionary'
import SidebarMenu from "./SidebarMenu";
import regions from '../src/constants/regions.js'
import {region_bounds} from '../src/constants/regions.js' 
import ClientFilterDropdown from "./ClientFilterDropdown";
import {DownloadButton} from '../src/constants/icons'
import {send_this_svg_to_print} from '../src/constants/download_svg.js'


import {reverse_headerMap, headerMap} from '../public/data/headerMap' 
const no_data_color = '#e5e7eb'
// type TopoJSONGeometry = 
//   | TopoJSONPoint
//   | TopoJSONLineString
//   | TopoJSONPolygon;

// interface TopoJSONPoint {
//   type: "Point";
//   coordinates: [number, number];
// }

// interface TopoJSONLineString {
//   type: "LineString";
//   arcs: number[];
// }

// interface TopoJSONPolygon {
//   type: "Polygon";
//   arcs: number[][];
// }


// interface TopoJSON {
//   type: string;
//   objects: {
//     countries: {
//       type: string;
//       geometries: TopoJSONGeometry[];
//     };
//   };
//   arcs: number[][]; // Define arcs for LineString and Polygon
//   transform?: {
//     scale: [number, number];
//     translate: [number, number];
//   };
// }

// type IndicatorData = {
//   "Country name": string;
//   "Region name": string;
//   Geocode: string;
//   Year: string;
//   [key: string]: string | number; // Additional columns with dynamic keys
// };

interface CountryFeatureProperties {
  iso3: string; // Adjust based on your data structure
  fill?:string | undefined;
  band?:string | undefined;
  'Region name':string;
  [key: string]: string | number | null | undefined; // Allow additional properties
}
function country_fill_function(value:number | string | undefined | null,selected_variable:string, variable:string, d:Feature<Geometry, CountryFeatureProperties> ){
  console.log(selected_variable)
  if(value){
    return value !== undefined || value != '' ? opacityScale(d, parseFloat(value as unknown as string), variable, selected_variable) : '#e5e7eb'; 
}
//adding redundant code covered by class assignment for styling of map download
else{
  return no_data_color
}
}
type dictionary = Record<string, Record<string, string | number |null| undefined>> 
export type D3Event<T extends Event, E extends Element> = T & { currentTarget: E }

const projection = d3.geoEquirectangular()
const path = d3.geoPath().projection(projection);

let width = 800; // Default width
let height =600;

const zoom = d3.zoom().on("zoom",(event:D3ZoomEvent<SVGGElement, unknown>) => {   
  zoomed(event)
}).clickDistance(10000).translateExtent([[0, 0], [width, height]])
  .extent([[0, 0], [width, height]])

let csvDict:dictionary;
export function drawMap(map_data:json_type[], world_data:Topology<Objects<GeoJsonProperties>>, regions_data:Topology<Objects<GeoJsonProperties>>,  variable: string, 
  currentYear:string, region:string, updateallCheckText:React.Dispatch<React.SetStateAction<boolean>>,
  mapHeight:number, mapWidth:number) {
      // Remove any existing SVG inside the #map container
      // d3.select("#map").selectAll("svg").remove();
      // Fetch TopoJSON and decrypted data
      // Type `world` as a Topology with GeoJSON properties

      console.log('drawing map')
      csvDict = {} as dictionary;

      close_tooltips()

      const selected_variable = headerMap[variable].split(' _ ')[1]
      const world = world_data;
      const world_as_regions = regions_data;


      if (!world || !world.objects || !world.objects['world-administrative-boundaries-sdsn_updatedNames_regionsRemapped']) {
        throw new Error("Invalid TopoJSON structure: 'world' object not found");
      }

      
      if (!world_as_regions || !world_as_regions.objects || !world_as_regions.objects.regions_boundaries_simplified) {
        throw new Error("Invalid TopoJSON structure: 'world_as_regions' object not found");
      }
      // Extract GeoJSON features from TopoJSON

      const result = topojson.feature(world, world.objects['world-administrative-boundaries-sdsn_updatedNames_regionsRemapped']);
      const world_as_regions_result = topojson.feature(world_as_regions, world_as_regions.objects.regions_boundaries_simplified);

      if (!("features" in result)) {
        throw new Error("Expected a FeatureCollection, but got a single Feature");
      }

      // const countries = (result as FeatureCollection).features;
      const countries = (result as FeatureCollection<Geometry, CountryFeatureProperties>).features;

      const regions = (world_as_regions_result as FeatureCollection<Geometry, CountryFeatureProperties>).features;


      // regions.forEach(function(d){
      //   console.log(d.properties.region)
      // })
      // const csvData:json_type[] = await fetchDecryptedData();
      // Create a lookup object for the CSV data based on Geocode

      const csvData:json_type[] = map_data;
      // await getDecryptedCSVData();

      csvData.forEach((row: json_type) => {
         if(parseInt(row[reverse_headerMap['Year']] as unknown as string) === parseInt(currentYear)){
          csvDict[row[reverse_headerMap['Geocode']] as unknown as string] = {}; // Adjust to match your data structure
          Object.keys(csvData[0]).forEach(function(key){
            csvDict[row[reverse_headerMap['Geocode']] as unknown as string][key] = row[key]
          })
        }

      });

      console.log(csvDict)

     
      // // Extract GeoJSON features from TopoJSON
      // const countries = topojson.feature(world, world.objects.countries).features;
      
      // Set up SVG dimensions
      // const map_element = d3.select("#map").node() as HTMLElement | null;
      width = mapWidth ? mapWidth : 800; // Default width
      height = mapHeight ? mapHeight :  600; // Default height


      zoom.on('start', function(){ console.log('zoom start'); close_tooltips()}).translateExtent([[0, 0], [width, height]]).extent([[0, 0], [width, height]])
      .on("zoom",(event:D3ZoomEvent<SVGGElement, unknown>) => {   
        zoomed(event)
      })



      projection.fitSize([width, height], {
        type: "FeatureCollection",
        features: countries,
      });

      path.projection(projection);

      if(region != 'All'){
        console.log(region)
        console.log(result)
        zoomToRegion(region, (result  as FeatureCollection<Geometry, CountryFeatureProperties>), variable, selected_variable)
      }
  
      // Create SVG
      console.log('height')
      console.log(height)
      const container_svg = d3.select("#map")
        .select("svg")
        .attr('class', 'map_svg')
        .attr("width", width)
        .attr("height", height)

        d3.select('.map_rect').attr("width", width)
        .attr("height", height).attr('fill', 'transparent').on('click', function(){
          deactivate_paths(variable)
        })


      //@ts-expect-error zoom type conflict
      d3.select(".map_svg").call(zoom)
      // .on("dblclick.zoom", null)
      // .on("click.zoom", null)
      .on("wheel.zoom", null)
      // .on("touchstart.zoom", null)
      
      const svg =   container_svg.select('g.map_g') 

      // Draw countries
      svg.selectAll("path.country")
        .data(countries)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", function (d: Feature<Geometry, CountryFeatureProperties>) {
          const value = csvDict[d.properties?.iso3]?.[variable];

          console.log(selected_variable)
          return country_fill_function(value, selected_variable, variable, d)
          // if(value){
          //     return value !== undefined || value != '' ? opacityScale(d, parseFloat(value as string), variable, selected_variable) : '#e5e7eb'; 
          // }
          // //adding redundant code covered by class assignment for styling of map download
          // else{
          //   return '#e5e7eb'
          // }
        })
        .style('opacity', 1)
        .attr('id', function(d){
          //@ts-expect-error need to assign band to type
          return  d.band!== undefined ?  'band_'+d.band.replaceAll(' ', '_').replaceAll('.', '').replaceAll('%', '').replaceAll('(', '').replaceAll(')', '') : ''
        })
        .attr("stroke", "#4e4e4e")
        .attr("class", function (d: Feature<Geometry, CountryFeatureProperties>) {
          const dict_value = csvDict[d.properties?.iso3]?.[variable];
          return dict_value !== undefined
            ? `active_path country`
            : 'country bg-white non_interactive';
        })
        .on('click', function(e,d){
          const dict_value = csvDict[d.properties?.iso3]?.[variable];
          if(dict_value && (d3.select(this).classed("non_interactive") === false)){
            activate_path(this, variable)
            // d3.selectAll('path.active_path').style('stroke', '#4e4e4e')
            // d3.select(this).style('stroke', '#E0288A')
            openTooltip(e, d, variable, csvDict, height / 2, width/2)
          }


          // openTooltip(csvDict[d.properties?.iso3]?.[variable])
        })
        // .on('mouseout', function(e,d){
      
        //   close_tooltips()
        //   deactivate_paths(variable)
        // })



        svg.selectAll<SVGPathElement, Feature<Geometry, CountryFeatureProperties>>("path.country")

        .attr("fill", function (d) {
          console.log(selected_variable)

            const value = csvDict[d.properties?.iso3]?.[variable];
            console.log(selected_variable)
            return country_fill_function(value, selected_variable, variable, d)
            //   if(value){
            //       return value !== undefined || value != '' ? opacityScale(d, parseFloat(value as string), variable, selected_variable) : '#e5e7eb'; 
            //   }
            //   //adding redundant code covered by class assignment for styling of map download
            //   else{
            //     return '#e5e7eb'
            //   }        
        })
        .style('opacity', 1)
        .attr('id', function(d){
            //@ts-expect-error need to assign band to type
            return  d.band!== undefined ?  'band_'+d.band.replaceAll(' ', '_').replaceAll('.', '').replaceAll(',', '').replaceAll('%', '').replaceAll('(', '').replaceAll(')', '') : ''
          // return d['']
        })
        .attr("class", function (d: Feature<Geometry, CountryFeatureProperties>) {
          const dict_value = csvDict[d.properties?.iso3]?.[variable];
          return dict_value !== undefined
            ? `country active_path`
            : 'country bg-white non_interactive' ;
        }).on('click', function(e,d){
          const dict_value = csvDict[d.properties?.iso3]?.[variable];
          if(dict_value && (d3.select(this).classed("non_interactive") === false)){
            activate_path(this, variable)
            openTooltip(e, d, variable, csvDict, height / 2, width/2)
          }
        })
        // .on('mouseout', function(e,d){
        //   close_tooltips()
        //   deactivate_paths(variable)
        // })


      // Draw regions
      svg.selectAll("path.region")
        .data(regions)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", function () {
          return 'transparent'
        })
        .attr('id', function(d){
          if(d.properties.region){
            return  (d.properties.region as string).replaceAll(' ', '_')
          }
          else{
            return ''
          }
          // return d['']
        })
        .attr("stroke", "transparent")
        .attr("class", function (d: Feature<Geometry, CountryFeatureProperties>) {
          const dict_value = csvDict[d.properties?.iso3]?.[variable];
          return dict_value !== undefined
            ? `region `
            : 'region ';
      })

      d3.select('.map_legend_entries').html('')
      d3.select('.map_legend_printentries').selectAll('text').remove()
      d3.select('.map_legend_printentries').selectAll('rect').remove()

      d3.select('.all_bands_checkbox').property('checked', true)
      console.log('accessing checkbox')

      console.log(headerMap)
      console.log(selected_variable)
      const legend_array = map_band_dictionary[selected_variable];
      legend_array.forEach(function(d, i){
        d3.select('.map_legend_entries').append('div').datum(d)
          .html('<input type="checkbox" data-ref = "'+d.text+'"class="checkbox" id="'+variable.split(' _ ')[0].replaceAll(',', '').replaceAll(' ', '').replaceAll('.', '').replaceAll('%', '')+'" checked></input><label><span class="legend_box_sq '+variable.split(' _ ')[0].replaceAll(' ', '')+'" style="background-color:'+
            d.color+'"></span>'+
            d.text + '</label>'
          )

        d3.select('.map_legend_printentries').append('text').datum(d)
          .attr('y', (i * 20))
          .attr('x', 20)
          .attr('dy', '0.75em')
          .text(d.text)
        d3.select('.map_legend_printentries').append('rect').datum(d)
          .attr('y', (i * 20))
          .attr('width', 10)
          .attr('height', 10)
          .attr('fill', d.color)
      })

      d3.selectAll('.checkbox').on('change', (event) => {
        // console.log(d3.select(this).attr('href'))
      const this_href = d3.select(event.currentTarget).attr('data-ref')

          if (event.currentTarget.checked) {
             if(this_href === 'All'){
              updateallCheckText(false)
              d3.selectAll('.checkbox').property("checked", true)
              d3.selectAll('path.active_path')
                //@ts-expect-error issue with selection
                .style("fill", function (d:Feature<Geometry, CountryFeatureProperties>) {

                  // const value = csvDict[d.properties?.iso3]?.[variable];
                  // return country_fill_function(value, selected_variable)
                      if(d){
                          const value = csvDict[d.properties?.iso3]?.[variable];
                          console.log(selected_variable)
                          return country_fill_function(value, selected_variable, variable, d)
                        }
                      else{
                        return no_data_color
                      } 
                })
                .classed('non_interactive', false)
            }
            else{
              d3.selectAll('.active_path#band_'+this_href.replaceAll(' ', '_').replaceAll('.', '').replaceAll(',', '').replaceAll('%', '').replaceAll('(', '').replaceAll(')', ''))
                //@ts-expect-error need to defins a type for d
                .style("fill", function (d:Feature<Geometry, CountryFeatureProperties>) {
                      if(d){
                          // const value = csvDict[d.properties?.iso3]?.[variable];
                          // if(value){
                          //     return value !== undefined || value != '' ? opacityScale(d, parseFloat(value as string), variable, selected_variable) : '#e5e7eb'; 
                          // }
                          const value = csvDict[d.properties?.iso3]?.[variable];
                          console.log(selected_variable)

                          return country_fill_function(value, selected_variable, variable, d)
                        }
                      else{
                        return no_data_color
                      } 
                })
                .classed('non_interactive', false)
              }
            }

        else {
            if(this_href === 'All'){
              updateallCheckText(true)
              d3.selectAll('.checkbox').property("checked", false)
              d3.selectAll('path.active_path')
                // .style('fill', 'white')
                .style('fill', no_data_color)
                .classed('non_interactive', true)
                .classed('inactive_band', true)

            }
            else{
            d3.selectAll('#band_'+this_href.replaceAll(' ', '_').replaceAll('.', '').replaceAll(',', '').replaceAll('%', '').replaceAll('(', '').replaceAll(')', ''))
            // .style('opacity', 0.1)
            // .style('fill', 'white')
            .style('fill', no_data_color)
            .classed('non_interactive', true)
            .classed('inactive_band', true)

            }


          }
      })

      // d3.select('.map_legend_entries').selectAll('div').on('click', function(e, d){
      //   d3.selectAll('path.country').style('opacity', 0.1)
      //   d3.selectAll('#band_'+d.text.replaceAll(' ', '_')).style('opacity', 1)f
      // })
}

function activate_path(this_path:SVGElement, variable:string){
  deactivate_paths(variable)
  d3.selectAll('path.active_path').style('fill', no_data_color)
  d3.selectAll('path.non_interactive').style('fill', no_data_color)
  //@ts-expect-error issue with d
  d3.select(this_path).style("fill", function (d:Feature<Geometry, CountryFeatureProperties>) {
    if(d){
      const value = csvDict[d.properties?.iso3]?.[variable];

      return country_fill_function(value, headerMap[variable].split(' _ ')[1],  variable, d)
      // const value = csvDict[d.properties?.iso3]?.[variable];
        // if(value){
        //     return value !== undefined || value != '' ? opacityScale(d, parseFloat(value as string), variable, variable.split(' _ ')[1]) : '#e5e7eb'; 
        // }
    }
    else{
      return no_data_color;
    }
})
}

function deactivate_paths(variable:string){

  // if(region != 'World'){
    //@ts-expect-error issue with d and datum
    d3.selectAll('path.active_path:not(.non_interactive)').style("fill", function (d:Feature<Geometry, CountryFeatureProperties>) {
        if(d){
          const value = csvDict[d.properties?.iso3]?.[variable];
          return country_fill_function(value, headerMap[variable].split(' _ ')[1], variable, d)
        }
        else{
          return no_data_color
        } 
    })
    d3.selectAll('path.non_interactive').style("fill", no_data_color)
    
    d3.selectAll('path.non_interactive.inactive_band').style("fill", "white")
  // }


}

function opacityScale(v: Feature<Geometry, CountryFeatureProperties>, value:number, variable:string, selected_variable:string){
    map_band_dictionary[selected_variable].forEach(function(d, i){
      if(value <= parseFloat(d.max_value as unknown as string) && value > (parseFloat(d.min_value as unknown as string))){
         //@ts-expect-error need to assign fill to type
         v.fill =  map_band_dictionary[selected_variable][i].color
         //@ts-expect-error need to assign band to type
         v.band = map_band_dictionary[selected_variable][i].text
      }
    })
    //@ts-expect-error need to assign fill to type
    return v.fill
}

function zoomed(event:D3ZoomEvent<SVGGElement, unknown>) {
    // g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
    // g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"); // not in d3 v4

    //@ts-expect-error need to define types for zoom
    d3.selectAll("path.country").attr("transform", event.transform); // updated for d3 v4
    // @ts-expect-error need to define types for zoom
    d3.selectAll("path.region").attr("transform", event.transform); // updated for d3 v4
    d3.selectAll('path.country').attr('stroke-width', (1 / event.transform.k))
}

function resetMap(active_variable:string, countries_json:Topology<Objects<GeoJsonProperties>>){
  d3.selectAll('.checkbox').property('checked', true)
  console.log(active_variable)
  zoomToRegion('World', 
    (topojson.feature(countries_json, countries_json.objects['world-administrative-boundaries-sdsn_updatedNames_regionsRemapped']) as FeatureCollection<Geometry, CountryFeatureProperties>) , 
    active_variable, headerMap[active_variable].split(' _ ')[1])
}
function zoomToRegion(region:string, world_json:(FeatureCollection<Geometry, CountryFeatureProperties>), variable:string, selected_variable:string){
  let bounds;
  close_tooltips()
  deactivate_paths(variable)


  //@ts-expect-error with region bounds
  if(region_bounds[region]){
    //@ts-expect-error with region bounds
    const active_region_bounds = region_bounds[region]
    bounds = [
      projection(active_region_bounds[0]),
      projection(active_region_bounds[1])
    ];
    console.log(bounds)

  }
  else{
    console.log('else')
    bounds = path.bounds(world_json)



  //  bounds = [
  //     [-25.272818452358365, -114.9648719971861],
  //     [917.2049776245796, 507.5180814546301]
  // ]


  }


  if(bounds){
  //@ts-expect-error with region bounds
  const  dx = bounds![1][0] - bounds![0][0];
    //@ts-expect-error with region bounds

  const dy = bounds![1][1] - bounds![0][1];
  //@ts-expect-error with region bounds

  const x = (bounds![0][0] + bounds![1][0]) / 2;
  //@ts-expect-error with region bounds

  const y = (bounds![0][1] + bounds![1][1]) / 2;

  console.log(height)

  const scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx! / width, dy! / height)));
  const translate = [width / 2 - scale * x, height / 2 - scale * y];


  d3.select("#map").selectAll("path.country").style("stroke", function () {return '#4e4e4e'})

  d3.select(".map_svg").transition()
      .duration(750)
      //@ts-expect-error type mismatch
      .call( zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) )
      .on('end', function(){
        if(region != 'World' && region != 'All'){
            d3.selectAll("path.country")
              .classed('active_path', function(d){
                if(d){
                  //@ts-expect-error missing properties on {}
                  if(d?.properties?.region === region){
                    return true
                  }
                  else{
                    return false
                  }
              }
              else{
                    return false
                  }
              })
              .classed('inactive_region', function(d){
                if(d){
                  //@ts-expect-error missing properties on {}
                  if(d?.properties?.region === region){
                    return false
                  }
                  else{
                    return true
                  }
              }
              else{
                    return true
                  }
              })
              .style("display", function (d:Feature<Geometry, CountryFeatureProperties> | unknown) {
                // if(d){
                  //@ts-expect-error missing properties on {}
                  if(d?.properties?.region === region){
                    return 'block'
                  }
                  else{
                    return 'none'
                  }
              // }
              // else{
              //       return 'white'
              //     }
              })
              .style("fill", function (d:Feature<Geometry, CountryFeatureProperties> | unknown) {
                // if(d){
                  //@ts-expect-error missing properties on {}
                  if(d?.properties?.region === region){
                    //@ts-expect-error missing properties on {}
                    const value = csvDict[d.properties?.iso3]?.[variable];
                    //@ts-expect-error missing properties on {}
                    return opacityScale(d, parseFloat(value as string), variable, selected_variable)
                  }
                  else{
                    return 'white'
                  }
              // }
              // else{
              //       return 'white'
              //     }
              })
              .style("stroke", function (d) {
                //@ts-expect-error missing d of type unknown
                if(d.properties?.region === region){
                  return '#4e4e4e'
                }
                else{
                  return 'transparent'
                }
              })
        }
        else{
            d3.selectAll("path.country")
              .style("fill", function (d:Feature<Geometry, CountryFeatureProperties> | unknown) {
              if(d){
                  //@ts-expect-error missing properties on {}
                  const value = csvDict[d.properties?.iso3]?.[variable];
                  //@ts-expect-error missing properties on {}
                  return opacityScale(d, parseFloat(value as string), variable, selected_variable)
   
              }
              })
              .style("display", function (d:Feature<Geometry, CountryFeatureProperties> | unknown) {
                    return 'block'
              })
              .classed('active_path', true)
              // .style("stroke", function (d) {
              //   //@ts-expect-error missing d of type unknown
              //     return '#4e4e4e'
              // })
        }
      }); // updated for d3 v4
  }
  
}

function close_tooltips(){
  console.log('closing tooltip')
  d3.selectAll('.map_tooltip').style('display', 'none')
}

function openTooltip(event:PointerEvent, value:Feature<Geometry, CountryFeatureProperties>, variable:string, csvDict:dictionary, half_height:number, half_width:number){
  console.log(csvDict[value.properties?.iso3])

  /// if this is not non_interactive
  if(csvDict[value.properties?.iso3]?.[variable]){
        if(event.offsetY < half_height){
          d3.selectAll('.map_tooltip').style('display', 'block')
          .style("top", event.offsetY + 'px')
      
        }
        else{
          d3.selectAll('.map_tooltip').style('display', 'block')
          .style("top", event.offsetY + 'px')
        }
      
        if(event.offsetX < 100){
          d3.selectAll('.map_tooltip').style('display', 'block')
          .style("left", event.offsetX +100 + 'px')
      
        }
        else if(event.offsetX < half_width){
          d3.selectAll('.map_tooltip').style('display', 'block')
          .style("left", event.offsetX + 'px')
      
        }
        else{
          d3.selectAll('.map_tooltip').style('display', 'block')
          .style("left", event.offsetX -100 + 'px')
        }


   
        console.log(reverse_headerMap[headerMap[variable].replaceAll('_ mean', '_ ranking').replaceAll('_ SD', '_ ranking')])
        console.log(headerMap[variable].replaceAll('_ mean', '_ ranking').replaceAll('_ SD', '_ ranking'))
        d3.selectAll('.map_tooltip').html(
          '<div class="tooltip_header flex justify-between"><div class="flex flex-row"><img src="/images/flags_iso_3/'+value.properties?.iso3+'.png"></img>'+
          '<h2 class="">'+value.properties['name']+'</h2></div><p class="close_tooltip"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg></p>'+
          '</div><div class="tooltip_contents"><h4>'+headerMap[variable].split(' _ ')[1].replaceAll('_', '')+' in ' +parseFloat(csvDict[value.properties?.iso3]?.['YE'] as unknown as string)+'</h4>'+
          '<div class="flex flex-row"><div><p>'+variable_appendages[headerMap[variable].split(' _ ')[1]]+'</p><h2>'+checkRounding(headerMap[variable].split(' _ ')[1], csvDict[value.properties?.iso3]?.[variable])+'</h2></div>'+
          '<div class="ml-8"><p >Rank</p>'+
          '<h2>'+
          (parseInt(csvDict[value.properties?.iso3]?.[reverse_headerMap[headerMap[variable].replaceAll('_ mean', '_ ranking').replaceAll('_ SD', '_ ranking')]] as unknown as string) ? 
          parseInt(csvDict[value.properties?.iso3]?.[reverse_headerMap[headerMap[variable].replaceAll('_ mean', '_ ranking').replaceAll('_ SD', '_ ranking')]] as unknown as string) : '-')+
          '</h2></div></div>'+
          '<p class="data_amended_check">'+((amended_data_array.includes(variable) && csvDict[value.properties?.iso3]['DA'] === 'Amended') ? 'Uses '+data_replacement_year+' data' : '' )+'</p>'+
          '<div class="w-auto inline-block"><a class="btn" href="/country/'+value.properties?.iso3+'">Go to country page</a></div></div>'
        )
  }

  d3.selectAll('.close_tooltip').on('click', ()=> {
    close_tooltips()
    deactivate_paths(variable)
  })

}
  function DownloadMap(year:number){
    const this_svg = d3.select('#map').select('svg');
    const this_svg_node = this_svg.node();
    const svg_height = this_svg.attr('height')
    const svg_width = this_svg.attr('width')

    d3.selectAll('.print_credit').attr('y', ((svg_height as unknown as number) - 50)).attr('x', ((svg_width as unknown as number) / 2)).attr('text-anchor', 'middle').style('fill', 'black')
    d3.selectAll('.print_credit').text('Source: Data from Gallup World Poll ('+year+')')

    d3.selectAll('.print_element').style('display', 'block')

    send_this_svg_to_print(this_svg_node, svg_width, svg_height, 'World_Happiness_Report.png')
    // d3.selectAll('.print_text').style('display', 'none')
    d3.selectAll('.print_element').style('display', 'none')


  }

export function MapComponents(props:{data:json_type[]}){
    const[active_variable, setVariable] = useState<string>()
    const [yearSelection, setyearSelection] = useState('2024');
    const [regionSelection, setregionSelection] = useState('World');
    const [year_options, setYearOptions] = useState<(string | number | Date | undefined)[]>()
    const [yearsDrawn, setYearsDrawn] = useState<boolean>(true)

    const await_csv_data = async function test_func(){
        const year_array:(string | number | Date | undefined)[] = []
        props.data.forEach(function(d,i){
          if(year_array.includes(d['YE']) === false && d['YE'] != ''){
            year_array.push(d['YE'])
          }
          if(i === (props.data.length-1)){
            setYearOptions(year_array.sort(d3.descending))
            setYearsDrawn(true)
          }
        })
    }
     useEffect(() => {
        setVariable('LI')
        await_csv_data()
        if(year_options){
        //   console.log('changing')
        }
      }, [yearsDrawn]);

    if(active_variable){
      console.log(active_variable)
          return (<div className="flex flex-col lg:flex-row w-full grow">
            <div className="min-w-[300px] lg:overflow-auto">
            <SidebarMenu selection={active_variable} changeSelection={setVariable}/>
              {/*<SidebarMenu selection={active_variable}></ SidebarMenu >*/}
            </div>
            <div className="flex flex-col grow h-full p-0 xl:p-2">
              <div className="dropdownRow flex lg:flex-row flex-col">
                <ClientFilterDropdown title={'Filter by year'} options ={year_options}  variable ={yearSelection} changeSelection={setyearSelection}       
                selected_options={[]}
                setSelectedOption={[]}/>
                <ClientFilterDropdown title={'Filter by region'} options ={regions}  variable ={regionSelection} changeSelection={setregionSelection}       
                selected_options={[]}
                setSelectedOption={[]}/>
                <DownloadButton download_function={()=>DownloadMap(parseInt(yearSelection))}/>
              </div>
              <div className="flex w-full grow">
                <D3MapEncrypted data = {props.data} variable={active_variable} currentYear={yearSelection} region={regionSelection}/>
              </div>
            </div>
      </div>)
    }
}

// function D3MapEncrypted({data, variable, currentYear, region}:{data:json_type[],  variable: string, currentYear:string, region:string}) {


//   const [world_data, set_world] = useState<Topology<Objects<GeoJsonProperties>>>()
//   const [region_data, set_regions] = useState<Topology<Objects<GeoJsonProperties>>>()

//   const [paths_loaded, setPathsLoaded] = useState<boolean>(false)
//   const [regions_loaded, setRegionsLoaded] = useState<boolean>(false)
//   const [allCheckText, updateallCheckText] = useState<boolean>(false)

//   const [mapHeight, setMapHeight] = useState<number>()
//   const [mapWidth, setMapWidth] = useState<number>()
//   const [isLoading, setIsLoading] = useState<boolean>(true)

  
//   const getBaseUrl = () => {
//     // Check if window is defined (client-side)
//     if (typeof window !== 'undefined') {
//       // Get the current origin (protocol + hostname + port)
//       return window.location.origin;
//     }
    
//     // For server-side rendering, we can fallback to a default or use other Next.js context
//     return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
//   };


// const loadInitialData = async () => {
//       await Promise.all([await_World(), await_world_Regions()]);
//     };
//   const await_World = async function test_func(){
//     const baseUrl = getBaseUrl();
//     setIsLoading(true); // Set loading to true when fetching starts
//     try {
//       const world = await d3.json<Topology<Objects<GeoJsonProperties>>>(`${baseUrl}/data/world-updated`)
//       // .then(function(d){
//           // console.log('calling world')
//           set_world(world)
//           setPathsLoaded(true)
//           return world
//           // return d
//       // })
//     } catch (error) {
//       console.error("Error loading world data:", error);
//     }

//   }

//   const await_world_Regions = async function test_func(){
//     console.log('testing')
//     const baseUrl = getBaseUrl();
//     try {

//       const world_as_regions_file = await d3.json<Topology<Objects<GeoJsonProperties>>>(`${baseUrl}/data/regions_boundaries.topojson`)
//       //  .then(function(d){
//           set_regions(world_as_regions_file)
//           setRegionsLoaded(true)
//           return world_as_regions_file

      
//     } catch (error) {
//       console.error("Error loading region data:", error);
//     }  }

//   d3.select("#zoom_in").on("click", function() {
//         //@ts-expect-error error with type of zoom

//         zoom.scaleBy(d3.select('.map_svg').transition().duration(750), 1.5);
//   });
//   d3.select("#zoom_out").on("click", function() {
//     //@ts-expect-error error with type of zoom
//     zoom.scaleBy(d3.select('.map_svg').transition().duration(750), 0.5);
//   });

//   const map_element = d3.select("#map").node() as HTMLElement | null;

//   useEffect(() => {
//   }, [region_data, world_data]);
//   useEffect(() => {
//     if(!isLoading && world_data && region_data && mapHeight && mapWidth) {
//       drawMap(data, world_data, region_data, variable, currentYear, region, updateallCheckText, mapHeight, mapWidth);
//       }
//   }, [variable, currentYear, region, isLoading]);

//   useEffect(() => {

//     if(map_element){
//       setMapWidth(map_element?.getBoundingClientRect().width ?? 800)
//       setMapHeight(map_element?.getBoundingClientRect().height ?? 600) // Default height
//     }

//   }, [map_element]);
//   useEffect(() => {

//     loadInitialData()
//       // await_World()
//       // await_world_Regions()
//   },[])

//   useEffect(() => {
//     // if(!world_data){
//     //   console.log(world_data)
//     //   await_World()
//     // }
//     // // console.log(world_data)

//     // await_world_Regions()
//     if(paths_loaded && regions_loaded && mapHeight && mapWidth){
//       setIsLoading(false); // Set loading to false once everything is ready

//       drawMap(data!, world_data!, region_data!, variable, currentYear, region, updateallCheckText, mapHeight, mapWidth);
//     }
// }, [paths_loaded, regions_loaded, mapHeight, mapWidth]);

// console.log(isLoading)
// if(isLoading) {
//   // Return loading indicator when data is being fetched
//   return (
//     <div id="map" className="line_chart w-full flex items-center justify-center">
//       <div className="loading-indicator">
//         <p>Loading map data...</p>
//         {/* Add a spinner or other loading animation here if desired */}
//       </div>
//     </div>
//   );
// }    
// return (
//     <div key="test" id="map" className="line_chart  w-full">
//       <svg className="map_svg" height={mapHeight} width={mapWidth}><rect className="map_rect"></rect><g className="map_g"></g>
//       <text className="print_text print_element print_credit"></text>
//       <g className="map_legend_printentries print_text print_element"></g>
//       </svg>
//       <div className="reset_map">
//         <div className={region === 'World' ? "px-4 p-2 zoom_btn shadow-lg flex items-center justify-center " :  "px-4 p-2 zoom_btn shadow-lg flex items-center justify-center"} id="zoom_in"><p>+</p></div>
//         <div className={region === 'World' ? "px-4 p-2 zoom_btn shadow-lg flex items-center justify-center " :  " cursor-not-allowed px-4 p-2 zoom_btn shadow-lg flex items-center justify-center"}  id="zoom_out" ><p>-</p></div>
//         <div className="px-4 p-2 zoom_btn shadow-lg" onClick={()=> resetMap(variable,world_data! )}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
//           <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
//         </svg>
//       </div>

//       </div>
//       <div className="map_tooltip shadow-lg"></div>

//       <div className="md:absolute relative map_legend">
//         {/*{variable.split(" _ ")[1]}*/}

    
//        <input data-ref="All" type="checkbox" className="checkbox pr-4 all_bands_checkbox" ></input>
//        <label>{allCheckText ? ' Select All': ' Deselect All'}</label>
//         <div className="map_legend_entries">

//         </div>
//         <label className=" pl-3"><span className="legend_box_sq" style={{'backgroundColor':'#e5e7eb'}}></span>No data</label>
        
  
//       </div>
//     </div>
//   );
// }

let cachedWorldData: Topology<Objects<GeoJsonProperties>> | null | undefined = null;
let cachedRegionData: Topology<Objects<GeoJsonProperties>> | null | undefined = null;
let dataAlreadyLoaded = false;

function D3MapEncrypted({data, variable, currentYear, region}:{data:json_type[], variable: string, currentYear:string, region:string}) {
  const [allCheckText, updateallCheckText] = useState<boolean>(false);
  const [mapHeight, setMapHeight] = useState<number>();
  const [mapWidth, setMapWidth] = useState<number>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // We don't need local state for world/region data since we're using global variables
  // but we can use useState to trigger re-renders after data loads
  const [dataReady, setDataReady] = useState(false);

  // Set up zoom controls
  d3.select("#zoom_in").on("click", function() {
    // Use a type assertion to fix the type error
    zoom.scaleBy(d3.select('.map_svg') as any, 1.5);
  });
  
  d3.select("#zoom_out").on("click", function() {
    // Use a type assertion to fix the type error
    zoom.scaleBy(d3.select('.map_svg') as any, 0.5);
  });

  const map_element = d3.select("#map").node() as HTMLElement | null;

  // Helper function to get base URL
  const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  };

  // Load data with global cache
  useEffect(() => {
    const fetchData = async () => {
      // Check if data is already loaded
      if (dataAlreadyLoaded && cachedWorldData && cachedRegionData) {
        console.log('Using cached map data');
        setDataReady(true);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      const baseUrl = getBaseUrl();
      
      try {
        // Load both datasets in parallel
        const [worldDataResult, regionDataResult] = await Promise.all([
          d3.json<Topology<Objects<GeoJsonProperties>>>(`${baseUrl}/data/world-updated.topojson`),
          d3.json<Topology<Objects<GeoJsonProperties>>>(`${baseUrl}/data/regions_boundaries.topojson`)
        ]);
        
        // Update cache
        if (worldDataResult && regionDataResult) {
          cachedWorldData = worldDataResult;
          cachedRegionData = regionDataResult;
          dataAlreadyLoaded = true;
          
          console.log('Map data loaded and cached globally');
          setDataReady(true);
        } else {
          console.error('Failed to load map data: one or both datasets are undefined');
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading map data:', error);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Set map dimensions
  useEffect(() => {
    if (map_element) {
      setMapWidth(map_element?.getBoundingClientRect().width ?? 800);
      setMapHeight(map_element?.getBoundingClientRect().height ?? 600);
    }
  }, [map_element]);

  // Draw map when data and dimensions are available
  useEffect(() => {
    if (!isLoading && dataReady && cachedWorldData && cachedRegionData && mapHeight && mapWidth) {
      drawMap(data, cachedWorldData, cachedRegionData, variable, currentYear, region, updateallCheckText, mapHeight, mapWidth);
    }
  }, [variable, currentYear, region, isLoading, dataReady, mapHeight, mapWidth, data]);

  if (isLoading || !dataReady) {
    return (
      <div id="map" className="line_chart w-full flex items-center justify-center">
        <div className="loading-indicator">
          <p>Loading map data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div key="test" id="map" className="line_chart w-full">
      <svg className="map_svg" height={mapHeight} width={mapWidth}>
        <rect className="map_rect"></rect>
        <g className="map_g"></g>
        <text className="print_text print_element print_credit"></text>
        <g className="map_legend_printentries print_text print_element"></g>
      </svg>
      <div className="reset_map">
        <div className={region === 'World' ? "px-4 p-2 zoom_btn shadow-lg flex items-center justify-center " :  "px-4 p-2 zoom_btn shadow-lg flex items-center justify-center"} id="zoom_in"><p>+</p></div>
        <div className={region === 'World' ? "px-4 p-2 zoom_btn shadow-lg flex items-center justify-center " :  " cursor-not-allowed px-4 p-2 zoom_btn shadow-lg flex items-center justify-center"}  id="zoom_out" ><p>-</p></div>
        <div className="px-4 p-2 zoom_btn shadow-lg" onClick={()=> resetMap(variable, cachedWorldData!)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
          </svg>
        </div>
      </div>
      <div className="map_tooltip shadow-lg"></div>

      <div className="md:absolute relative map_legend">
        <input data-ref="All" type="checkbox" className="checkbox pr-4 all_bands_checkbox" ></input>
        <label>{allCheckText ? ' Select All': ' Deselect All'}</label>
        <div className="map_legend_entries"></div>
        <label className=" pl-3"><span className="legend_box_sq" style={{'backgroundColor':'#e5e7eb'}}></span>No data</label>
      </div>
    </div>
  );
}

export default D3MapEncrypted;