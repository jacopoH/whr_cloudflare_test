import { saveAs } from 'file-saver';
import * as d3 from "d3";

// Helper function to add Proxima Nova font for legend elements
export const applyProximaNovaToLegend = function(svgNode) {
  // Check if svg is a DOM node or a D3 selection
  const svg = svgNode.select ? svgNode : d3.select(svgNode);
  
  // Select all text elements in the legend and apply Proxima Nova font
  svg.selectAll('.legend text')
    .style('font-family', '"Proxima Nova", "Helvetica Neue", Arial, sans-serif');
  
  // If you have specific legend class names, you can target them directly
  svg.selectAll('.legend-title, .legend-label')
    .style('font-family', '"Proxima Nova", "Helvetica Neue", Arial, sans-serif');
    
  return svgNode; // Return the original SVG node
}

export const send_this_svg_to_print = function(this_svg, this_width, this_height, filename){
  // No need to reassign this_svg as we're not modifying the reference
  applyProximaNovaToLegend(this_svg);
  
  var svgString = getSVGString(this_svg);
  svgString2Image( svgString, 2*this_width, 2*this_height, 'png', save );
  
  function save( dataBlob ){
    saveAs( dataBlob, filename);
  }
}

// Below are the functions that handle actual exporting
function getSVGString( svgNode ) {
  svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
  var cssStyleText = getCSSStyles( svgNode );
  
  // Add Proxima Nova font-face definition to ensure it's included in export
  var fontFaceStyle = `
    @font-face {
      font-family: 'Proxima Nova';
      font-style: normal;
      font-weight: normal;
      src: local('Proxima Nova'), local('ProximaNova');
    }
  `;
  
  cssStyleText = fontFaceStyle + cssStyleText;
  appendCSS( cssStyleText, svgNode );

  var serializer = new XMLSerializer();
  var svgString = serializer.serializeToString(svgNode);
  svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink=');
  svgString = svgString.replace(/NS\d+:href/g, 'xlink:href');

  return svgString;

  function getCSSStyles( parentElement ) {
    var selectorTextArr = [];

    // Add Parent element Id and Classes to the list
    if (parentElement.id) {
      selectorTextArr.push( '#'+parentElement.id );
    }
    if (parentElement.classList) {
      for (var c = 0; c < parentElement.classList.length; c++)
        if ( !contains('.'+parentElement.classList[c], selectorTextArr) )
          selectorTextArr.push( '.'+parentElement.classList[c] );
    }

    // Add Children element Ids and Classes to the list
    var nodes = parentElement.getElementsByTagName('*');
    for (var i = 0; i < nodes.length; i++) {
      var id = nodes[i].id;
      if (id && !contains('#'+id, selectorTextArr))
        selectorTextArr.push( '#'+id );

      var classes = nodes[i].classList;
      if (classes) {
        for (var c = 0; c < classes.length; c++)
          if ( !contains('.'+classes[c], selectorTextArr) )
            selectorTextArr.push( '.'+classes[c] );
      }
    }

    // Extract CSS Rules
    var extractedCSSText = '';
    for (var i = 0; i < document.styleSheets.length; i++) {
      var s = document.styleSheets[i];

      try {
          if(!s.cssRules) continue;
      } catch( e ) {
            if(e.name !== 'SecurityError') throw e; // for Firefox
            continue;
          }

      var cssRules = s.cssRules;
      for (var r = 0; r < cssRules.length; r++) {
        if ( contains( cssRules[r].selectorText, selectorTextArr ) )
          extractedCSSText += cssRules[r].cssText;
      }
    }
    
    // Add an explicit rule for all text elements to use Proxima Nova
    extractedCSSText += `
    .legend text, .legend-title, .legend-label, text { 
      font-family: "Proxima Nova", "Helvetica Neue", Arial, sans-serif !important; 
    }
    
    /* Apply to all text elements to ensure font is used in the legend */
    text {
      font-family: "Proxima Nova", "Helvetica Neue", Arial, sans-serif !important;
    }`;

    return extractedCSSText;

    function contains(str,arr) {
      return arr.indexOf( str ) === -1 ? false : true;
    }
  }

  function appendCSS( cssText, element ) {
    var styleElement = document.createElement('style');
    styleElement.setAttribute('type','text/css');
    styleElement.innerHTML = cssText;
    var refNode = element.hasChildNodes() ? element.children[0] : null;
    element.insertBefore( styleElement, refNode );
  }
}

function svgString2Image( svgString, test_width, test_height, format, callback ) {
  var format = format ? format : 'png';

  var imgsrc = 'data:image/svg+xml;base64,'+ btoa( unescape( encodeURIComponent( svgString ) ) );

  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');

  canvas.width = test_width;
  canvas.height = test_height;

  var image = new Image();
  image.onload = function() {
    context.clearRect ( 0, 0, test_width, test_height );
    context.drawImage(image, 0, 0, test_width, test_height);

    canvas.toBlob( function(blob) {
      var filesize = Math.round( blob.length/1024 ) + ' KB';
      if ( callback ) callback( blob, filesize );
    });
  };

  image.src = imgsrc;
}

// Example usage:
// 1. Create your SVG with D3
// const svg = d3.select("#chart").append("svg")
//   .attr("width", width)
//   .attr("height", height);
//
// 2. Create legend
// const legend = svg.append("g")
//   .attr("class", "legend")
//   .attr("transform", `translate(${width - 100}, 20)`);
//
// 3. Apply Proxima Nova to legend (optional, already done in export)
// applyProximaNovaToLegend(svg);
//
// 4. Export SVG when needed
// send_this_svg_to_print(svg.node(), width, height, "chart.png");