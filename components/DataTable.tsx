import React, { useState, useEffect, useRef } from 'react';
import { DataGrid, GridColDef, GridToolbarProps, GridRenderCellParams, ToolbarPropsOverrides, GridTreeNodeWithRender } from '@mui/x-data-grid';
import Chip, { ChipProps } from "@mui/material/Chip";
import { InfoIcon, FlagIcon } from '../src/constants/icons';
import { checkRounding} from '../src/constants/calculations';
import { amended_data_array, amended_data_years } from '../src/constants/constants';

import { GridToolbarQuickFilter } from '@mui/x-data-grid/components';
import { data_table_header_dict } from '../public/data/selection_dictionary';
import { country_codes } from '../public/data/country_codes';
import * as d3 from 'd3';
import { headerMap, reverse_headerMap } from '../public/data/headerMap';

type json_type = Record<string, string | number>;
const country_headers = ['Factor', 'Value', 'Rank', 'Explains'];

function getChipProps(params: GridRenderCellParams, key: string): ChipProps {
  // console.log(params)
  // console.log(key)
  if (key === "Factor") {
  //   if(params.value === 'Healthy life expectancy'){
  //     return {
  //     icon: <InfoIcon variable={params.value} this_key={params.value} />,
  //     label: params.value + '*',
  //   };
  // }
  // else{
    return {
      icon: <InfoIcon variable={params.value} this_key={params.value} />,
      label: params.value,
    };
  // }

  } 
  else if (key === "NA") {
    let active_country_code;
    Object.keys(country_codes).map(function(key) {
      if (country_codes[key] === params.value) {
        active_country_code = key;
      }
    });
    
    if (active_country_code) {
      return {
        icon: <FlagIcon country={active_country_code} />,
        label: <a href={"/country/" + active_country_code}><strong>{params.value}</strong></a>,
      };
    } else {
      return { label: <strong>{params.value}</strong> };
    }
  } else {
    return {
      label: checkRounding((key.split(' _ ')[1] ? key.split(' _ ')[1] : key), params.value),
    };
  }
}

const DataTable = (props: {
    data: json_type[], 
    columns: string[], 
    settings: string, 
    year: string, 
    region: string, 
    height: number | string, 
    full_table: boolean,
    autoSizeHeight?: boolean
}) => {
  const [year_data, setYearData] = useState<json_type[]>();
  const [sort_count, setSortCount] = useState<number>(0);
  const [active_sortOrder, setActiveSortOrder] = useState<string | null | undefined>('');
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const [tableDrawn, setTableDrawn] = useState<boolean>(false);

  console.log(props.data)

  // Calculate column widths based on container size
  useEffect(() => {
    const updateColumnWidths = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.clientWidth;
      const isMobile = containerWidth < 768;
      
      // Fixed widths for specific columns - adjusted for mobile
      const fixedWidths:{[key:string]:number} = {
          'Rank': 70,
          'NA': isMobile ? 150 : 200,
          'Factor': isMobile ? 150 : 233,
          'Value': isMobile ? 150 : 300,
          'Explains': isMobile ? 150 : 300,
          'Life evaluation _ Average (3-year) _ ranking': 50,
          'Life evaluation _ Average (3-year) _ mean': 99
      };
      
      // Calculate how many dynamic columns we have
      const fixedColumns = Object.keys(fixedWidths).filter(col => props.columns.includes(col));
      const dynamicColumns = props.columns.filter(col => !fixedColumns.includes(col));
      
      // Calculate total fixed width
      const totalFixedWidth = fixedColumns.reduce((sum, col) => sum + fixedWidths[col], 0);
      
      // For mobile, we set a fixed minimum width rather than trying to fit all columns
      const dynamicColumnWidth = isMobile 
        ? 75 // Fixed minimum width on mobile
        : Math.max(75, (containerWidth - totalFixedWidth) / Math.max(1, dynamicColumns.length));
      
      // Create a widths object
      const widths: Record<string, number> = {};
      props.columns.forEach(key => {
        if (key in fixedWidths) {
          widths[key] = fixedWidths[key];
        } else {
          widths[key] = dynamicColumnWidth;
        }
      });
      
      setColumnWidths(widths);
    };

    // Initial calculation
    updateColumnWidths();
    
    // Add resize listener
    const ResizeObserver = window.ResizeObserver || class MockResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
    
    const resizeObserver = new ResizeObserver(updateColumnWidths);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    // Clean up
    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, [props.columns, containerRef.current]);


  function updateRows() {
    if (props.data.length > 0 && props.data) {
      props.data.forEach(function(d: json_type, i: number) {
        d.id = (i + 1);
        props.columns.forEach(function(header) {

          if (parseFloat(d[header] as unknown as string) && (header != 'Year' && props.full_table === true)) {
            // if(amended_data_array.includes(header) && d['DA'] === 'Amended'){
            //   d[header] = parseFloat(d[header] as unknown as string) + '*'
            // }
            // else{
              d[header] = parseFloat(d[header] as unknown as string);

            // }
          } else {
            d[header] = (d[header]);
          }
        });
      });
      
      const this_year_data = props.data.filter(function(d: json_type) {
          // if(header === 'ME'){

          // }
        if ((parseInt(d['YE'] as unknown as string) === parseInt(props.year) || props.year === 'All years') && 
          (d['RE'] === props.region || props.region.includes(d['RE'] as unknown as string) || props.region === 'All' || props.region === 'World')) {
          return d;
        }
      }).sort(function(a, b) {
        const v1= a['EV']
        const v2= b['EV']
        // if (active_sortOrder === 'desc' || active_sortOrder === '') {
          if (v1 === '' && v2 !== '') return 1;
          if (v1 !== '' && v2 === '') return -1;
          if (v1 === '' && v2 === '') return 0;
        // } else if (active_sortOrder === 'asc') {
          // if (v1 === '' ) {return 1;}
          // else  {
            return d3.ascending(v1, v2)
          // }
        // }
    
        // return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
      })
    

      // const sorted_year_data = this_year_data.sort(function(a, b) {
      //   const valueA = a['Life evaluation _ Average (3-year) _ ranking'];
      //   const valueB = b['Life evaluation _ Average (3-year) _ ranking'];
        
      //   // Check for empty values and always place them at the end
      //   if (valueA === '' || valueA === null || valueA === undefined) return 1;
      //   if (valueB === '' || valueB === null || valueB === undefined) return -1;
        
      //   // Regular sorting for non-empty values
      //   return d3.ascending(valueA, valueB);
      // });
      setYearData(this_year_data);
      setTableDrawn(true)
    }
  }

  const customSortComparator = (v1: string | number, v2: string | number) => {
        console.log(v1)
    console.log(v2)
    // if((v1 as string).includes('*') || (v2 as string).includes('*')){
    //   v1 = (v1 as string).replaceAll('*', '')
    //   v2 = (v1 as string).replaceAll('*', '')
    // }
    // if(active_sortOrder != 'clear_all'){
      if (active_sortOrder === 'desc' || active_sortOrder === ''|| active_sortOrder === 'clear_all') {
        if (v1 === '' && v2 !== '') return 1;
        if (v1 !== '' && v2 === '') return -1;
        if (v1 === '' && v2 === '') return 0;
      } else {
        if (v1 === '' && v2 !== '') return -1;
        if (v1 !== '' && v2 === '') return 1;
        if (v1 === '' && v2 === '') return 0;
      }
  
      return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
    // }
 
  };

  function get_column_headers(key: string) {
    if (headerMap[key] === 'Explanatory factors _ Healthy life expectancy _ ranking' && amended_data_years.includes(props.year) ) {
      return data_table_header_dict[headerMap[key]];
    }
    else if (data_table_header_dict[headerMap[key]] && headerMap[key] != 'Explanatory factors _ Healthy life expectancy _ ranking') {
      return data_table_header_dict[headerMap[key]];
    } else if (headerMap[key].includes('rank')) {
      return headerMap[key].split(' _ ')[1];
    } else if (headerMap[key].split(' _ ')[1]) {
      return headerMap[key].split(' _ ')[1];
    } else {
      return headerMap[key];
    }
  }

  useEffect(() => {
    setActiveSortOrder('clear_all')
    updateRows();
  }, [props.year, props.region, props.data]);

  // Create columns with fixed widths for specific columns and dynamic for the rest
  const columns: GridColDef[] = props.columns.map((key, index) => ({
    field: key,
    headerName: get_column_headers(key),
    // tooltip:'testing',
    width: columnWidths[key] || (key === 'Country name' ? 200 : key === 'Factor' ? 233 : key === 'Rank' ? 70 : key === 'Life evaluation _ Average (3-year) _ ranking' ? 50 : key === 'Life evaluation _ Average (3-year) _ mean' ? 99 : 75),
    minWidth: key === 'Rank' ? 50 : key === 'Country name' ? 150 : key === 'Factor' ? 233 : key === 'Life evaluation _ Average (3-year) _ ranking' ? 50 : key === 'Life evaluation _ Average (3-year) _ mean' ? 99 : 75,
    flex: props.full_table ? 0 : 1, // Set to 0 to prevent columns from expanding and breaking mobile layout
    headerAlign: key === 'Country name' ? 'left' : 'center', // Align Country name header to the left
    align: key === 'Country name' || key === 'Factor' ? 'left' : 'center',
    renderCell: (params: GridRenderCellParams) => {
      if (!params.value && params.value !== 0) return '-';
      
      if(amended_data_array.includes(key)){ 
        return params.value
      }
      if (headerMap[key] === 'Factor' || headerMap[key] === 'Country name') {
        // Use Chip for Factor and Country name
        return <Chip 
          variant="outlined" 
          size="medium" 
          {...getChipProps(params, key)} 
          sx={{ justifyContent: 'flex-start', width: '100%' }} // Added width: '100%' to ensure full width alignment
        />;
      }
      // For other fields, make Life evaluation _ Average (3-year) _ ranking bold
      const content = props.full_table ? checkRounding(headerMap[key], params.value) : params.value;
      return <div style={{ 
        width: '100%', 
        textAlign: headerMap[key] === 'Country name' || headerMap[key] === 'Factor' ? 'left' : 'center',
        fontWeight: (headerMap[key] === 'Life evaluation _ Average (3-year) _ ranking' || headerMap[key] === 'Life evaluation _ Average (3-year) _ mean') ? 'bold' : 'normal'

      }}>
        {content}
      </div>;
    },
    sortComparator: customSortComparator,
    headerClassName: `${headerMap[key].includes('Change (since 2021)') ? 'bg-black' : `bg-${headerMap[key].split(' _ ')[0].replaceAll(' ', '').replaceAll('%', '').replaceAll('.', '').replaceAll('(', '').replaceAll(')', '')}`} header-align-fix`,
    sortable: !(key === 'Region name'),
    columnIndex: index,
  }));

  // State to track auto-height
  const [autoHeight, setAutoHeight] = useState(false);
  const [tableHeight, setTableHeight] = useState<number | string>(props.height);
  
  // Handle auto-height based on number of rows
  useEffect(() => {
    if (year_data && year_data.length > 0) {
      // Calculate appropriate height based on number of rows
      const rowHeight = props.full_table ? 52 : 35;
      const headerHeight = props.full_table ? 95 : 36;
      const paginationHeight = 56; // Account for pagination controls
      
      // Limit to 100 rows per page due to MUI DataGrid MIT version limitations
      const visibleRows = Math.min(year_data.length, 100);
      const calculatedHeight = (visibleRows * rowHeight) + headerHeight + paginationHeight;
      
      // If height prop is "auto", use calculated height, otherwise use provided height
      if (props.height === 'auto') {
        setAutoHeight(true);
        setTableHeight(calculatedHeight);
      } else {
        setAutoHeight(false);
        setTableHeight(props.height);
      }
    }
  }, [year_data, props.height, props.full_table]);

  if (columns.length > 0 && props.data.length > 0) {
    return (
      <div 
        className="data-table mt-4" 
        style={{ 
          height: 'auto',
          width: '100%',
          position: 'relative',
          overflowX: 'auto', // Enable horizontal scrolling
          WebkitOverflowScrolling: 'touch' // For smooth scrolling on iOS
        }}
        ref={containerRef}
      >
        {/* Add a style tag to fix vertical alignment issues */}
        <style>
          {`
            /* Fix for header vertical alignment - apply to ALL headers */
            .MuiDataGrid-columnHeaderTitleContainer {
              display: flex !important;
              flex-direction: column !important;
              align-items: center !important;
              justify-content: center !important;
              height: 100% !important;
              padding-top: 0 !important;
            }
            
            /* Force all header titles to have consistent display */
            .MuiDataGrid-columnHeaderTitle {
              display: flex !important;
              width: 100% !important;
              overflow: visible !important;
              text-align: center !important;
              margin: auto 0 !important;
              line-height: 1.2 !important;
              font-weight: bold !important;
              justify-content: center !important;
              align-items: center !important;
              height: auto !important;
            }
            
            /* Special alignment for Country name header */
            .MuiDataGrid-columnHeader[data-field="Country name"] .MuiDataGrid-columnHeaderTitleContainer {
              align-items: flex-start !important;
              padding-left: 16px !important;
            }
            
            .MuiDataGrid-columnHeader[data-field="Country name"] .MuiDataGrid-columnHeaderTitle {
              text-align: left !important;
              justify-content: flex-start !important;
            }
            
            /* Special alignment for Country name cells */
            .MuiDataGrid-cell[data-field="Country name"] {
              text-align: left !important;
              padding-left: 16px !important;
            }
            
            /* Country name cell content should be left aligned */
            .MuiDataGrid-cell[data-field="Country name"] > * {
              justify-content: flex-start !important;
              text-align: left !important;
              width: 100% !important;
            }
            
            /* Force all headers to display sort icon in same vertical position */
            .header-align-fix .MuiDataGrid-iconButtonContainer {
              position: relative;
              margin-top: 0; /* Changed from auto to bring the sort button closer to the title */
              margin-bottom: 2px; /* Add small bottom margin */
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              width: 14px;
              height: 14px; /* Explicit height to control spacing */
            }
            
            /* Ensure all headers have the same structure */
            .header-align-fix {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: space-between;
              padding-top: 0 !important;
            }
            
            /* Pagination footer styles */
            .MuiTablePagination-root {
              color: rgba(0, 0, 0, 0.87);
              overflow: auto;
              font-weight: 400;
              font-size: 0.875rem;
              line-height: 1.43;
              margin-top: 8px;
            }
            
            .MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows {
              margin: 0;
            }

            /* For desktop, set Factor column width */
              @media (min-width: 769px) {
                .MuiDataGrid-cell[data-field="Factor"] {
                  min-width: 233px !important;
                  width: 233px !important;
                }
              }
            
            /* Mobile-specific styles for horizontal scrolling */
            @media (max-width: 768px) {
              .data-table {
                overflow-x: auto !important;
                -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
              }
              
              /* Make sure all cells have minimum width on mobile */
              .MuiDataGrid-cell {
                min-width: 75px !important;
                white-space: nowrap;
              }
              
              /* Ensure Country name and Factor columns have proper width */
              .MuiDataGrid-cell[data-field="Country name"], 
              .MuiDataGrid-cell[data-field="Factor"] {
                min-width: 150px !important;
              }
              
              /* Add visible scroll indicator on mobile */
              .data-table:after {
                content: "";
                position: absolute;
                right: 0;
                top: 0;
                bottom: 0;
                width: 15px;
                background: linear-gradient(to right, rgba(255,255,255,0), rgba(0,0,0,0.1));
                pointer-events: none;
              }
            }
          `}
        </style>
        
        {props.full_table === true ? (
          <DataGrid
            rows={year_data || []}
            columns={columns}
            checkboxSelection={false}
            // Proper pagination settings for MIT version (max 100 rows)
            initialState={{
              pagination: {
                paginationModel: { pageSize: 100, page: 0 },
              },
            }}
            pageSizeOptions={[25, 50, 100]}
            pagination
            paginationMode="client"
            sx={{
              border: 0,
              '& .MuiFormControl-root': {
                marginBottom: '1rem',
              },
              '.MuiDataGrid-iconButtonContainer': {
                visibility: 'visible',
              },
              '.MuiDataGrid-sortIcon': {
                opacity: 'inherit !important',
                color: "white"
              },
              '& .MuiDataGrid-columnHeader': {
                whiteSpace: 'normal',
                lineHeight: '1.2',
                height: 'auto',
                minHeight: '80px',
                display: 'flex',
                textAlign: 'center',
                overflow: 'visible',
                fontSize: '0.75rem',
                padding: '0',
                alignItems: 'center',
                justifyContent: 'center',
              },
              // Force consistent structure for Country name column header
              '& .MuiDataGrid-columnHeader[data-field="Country name"]': {
                textAlign: 'left',
                justifyContent: 'flex-start',
              },
              '& .MuiDataGrid-columnHeaderTitleContainer': {
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                display: 'flex',
                padding: 0,
                margin: 0,
              },
              // Standardize title display with !important to override any conflicting styles
              '& .MuiDataGrid-columnHeaderTitle': {
                whiteSpace: 'normal',
                textAlign: 'center',
                fontSize: '0.75rem',
                margin: 'auto 0',
                padding: 0,
                display: 'flex',
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                lineHeight: '1.2',
                overflow: 'visible',
                fontWeight: 'bold',
                height: 'auto',
              },
              // Special styling for Country name header
              '& .MuiDataGrid-columnHeader[data-field="Country name"] .MuiDataGrid-columnHeaderTitleContainer': {
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                paddingLeft: '16px',
              },
              '& .MuiDataGrid-columnHeader[data-field="Country name"] .MuiDataGrid-columnHeaderTitle': {
                textAlign: 'left',
                justifyContent: 'flex-start',
              },
              // Country name cell content should be left aligned
              '& .MuiDataGrid-cell[data-field="Country name"]': {
                textAlign: 'left',
                paddingLeft: '16px',
              },
              // Center align all cell content except Country name and Factor
              '& .MuiDataGrid-cell': {
                fontSize: '0.75rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                textAlign: 'center',
                justifyContent: 'center',
                alignItems: 'center',
              },
              // Keep Country name and Factor left-aligned
              '& .MuiDataGrid-cell[data-field="Country name"], & .MuiDataGrid-cell[data-field="Factor"]': {
                textAlign: 'left',
                justifyContent: 'flex-start',
              },
              // Modify scrollbar behavior for mobile compatibility
              '& .MuiDataGrid-virtualScroller': {
                overflow: 'auto !important', // Changed from 'visible' to 'auto'
                overflowX: 'auto !important', // Changed from 'visible' to 'auto'
                overflowY: 'auto !important', // Changed from 'visible' to 'auto'
              },
              // Control overall table sizing but allow scrolling
              '& .MuiDataGrid-main': {
                overflow: 'auto !important', // Changed from 'visible' to 'auto'
                maxHeight: 'unset !important',
              },
              // Allow content to scroll on mobile
              '& .MuiDataGrid-virtualScrollerContent': {
                minWidth: 'fit-content', // Changed from '100%' to 'fit-content'
                overflow: 'auto !important', // Changed from 'visible' to 'auto'
              },
              // Enable scrolling for mobile
              '& .MuiDataGrid-virtualScrollerRenderZone': {
                position: 'relative !important',
                overflow: 'auto !important', // Changed from 'visible' to 'auto'
              },
              // Fix for table container with scrolling enabled
              '& .MuiDataGrid-root': {
                overflow: 'auto !important', // Changed from 'visible' to 'auto'
                overflowX: 'auto !important', // Changed from 'visible' to 'auto'
                overflowY: 'auto !important', // Changed from 'visible' to 'auto'
                maxHeight: 'unset !important',
              },
              // Fix for sort icon positioning
              '& .MuiDataGrid-iconButtonContainer': {
                padding: 0,
                marginLeft: 0,
                width: '14px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: 'auto',
                marginTop: '2px',
                position: 'relative',
                height: '14px', /* Fixed height to control spacing */
              },
              // Fix for sort icon
              '& .MuiDataGrid-sortIcon': {
                fontSize: '0.85rem',
                marginLeft: 0,
              },
              // Pagination footer styles
              '& .MuiTablePagination-root': {
                overflow: 'auto',
              },
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                margin: 0,
              },
            }}
            // Remove hideFooter to show pagination controls
            // hideFooter={true}
            disableRowSelectionOnClick
            disableColumnMenu={true}
            onSortModelChange={function(newSortModel) {
              if (newSortModel[0]) {
                setActiveSortOrder(newSortModel[0]['sort']);
              }
              // else{
              //   setActiveSortOrder('asc');
              // }
            }}
            slots={{
              toolbar: GridToolbarQuickFilter as React.JSXElementConstructor<
                GridToolbarProps & ToolbarPropsOverrides
              > | null | undefined,
            }}
            localeText={{
              toolbarQuickFilterPlaceholder: "Search for a Country",
              MuiTablePagination: {
                labelRowsPerPage: "Rows per page:",
                labelDisplayedRows: ({ from, to, count }) => 
                  `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
              }
            }}
            getRowClassName={(params) => {
              return params.indexRelativeToCurrentPage % 2 === 0
                ? 'bg-grey table-row'
                : 'bg-white table-row';
            }}
          />
        ) : (
          <DataGrid
            rows={year_data || []}
            columns={columns}
            checkboxSelection={false}
            disableColumnSorting
            disableColumnFilter
            // Proper pagination settings for MIT version (max 100 rows)
            initialState={{
              pagination: {
                paginationModel: { pageSize: 25, page: 0 },
              },
            }}
            pageSizeOptions={[10, 25, 50, 100]}
            pagination
            paginationMode="client"
            sx={{ 
              border: 10, 
              '& .MuiToolbar-root': {
                display: 'none'
              },
              '& .MuiDataGrid-columnHeaderTitleContainer': {
                paddingTop: '3px'
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 'bold', // Make all headers bold
              },
              // Special alignment for Country name header and cells
              '& .MuiDataGrid-columnHeader[data-field="Country name"]': {
                textAlign: 'left',
                justifyContent: 'flex-start',
              },
              '& .MuiDataGrid-columnHeader[data-field="Country name"] .MuiDataGrid-columnHeaderTitleContainer': {
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                paddingLeft: '16px',
              },
              '& .MuiDataGrid-columnHeader[data-field="Country name"] .MuiDataGrid-columnHeaderTitle': {
                textAlign: 'left',
                justifyContent: 'flex-start',
              },
              '& .MuiDataGrid-cell[data-field="Country name"]': {
                textAlign: 'left',
                paddingLeft: '16px',
              },
              // Modify scrollbar behavior for mobile compatibility
              '& .MuiDataGrid-virtualScroller': {
                overflow: 'auto !important',
                overflowX: 'auto !important',
                overflowY: 'auto !important',
              },
              // Control overall table sizing but allow scrolling
              '& .MuiDataGrid-main': {
                overflow: 'auto !important',
                maxHeight: 'unset !important',
              },
              // Allow content to scroll on mobile
              '& .MuiDataGrid-virtualScrollerContent': {
                minWidth: 'fit-content',
                overflow: 'auto !important',
              },
              // Enable scrolling for mobile
              '& .MuiDataGrid-virtualScrollerRenderZone': {
                position: 'relative !important',
                overflow: 'auto !important',
              },
              // Fix for table container with scrolling enabled
              '& .MuiDataGrid-root': {
                overflow: 'auto !important',
                overflowX: 'auto !important',
                overflowY: 'auto !important',
                maxHeight: 'unset !important',
              },
              // Pagination footer styles
              '& .MuiTablePagination-root': {
                overflow: 'auto',
              },
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                margin: 0,
              },
            }}
            disableRowSelectionOnClick
            disableColumnMenu={true}
            rowHeight={35}
            columnHeaderHeight={36}
            autoHeight={autoHeight}
            getRowClassName={(params) => {
              return params.indexRelativeToCurrentPage % 2 === 0 
                ? 'bg-grey table-row' 
                : 'bg-white table-row';
            }}
          />
        )}
      </div>
    );
  } else {
    return <div>No data for 2024</div>;
  }
};

export default DataTable;