import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import {tooltip_dictionary} from '../../public/data/selection_dictionary'
import ClickAwayListener from '@mui/material/ClickAwayListener';
import {useState} from 'react'

import {country_codes} from '../../public/data/country_codes'
export const OpenArrow = () => {
	return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
};

export const CloseArrow = () => {
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" /></svg>
};


export const DownloadButton = (props:{download_function:React.MouseEventHandler<HTMLDivElement>}) => {
  return (<div className="flex flex-row items-end justify-between p-4 interactive"  onClick={props.download_function} ><svg xmlns="http://www.w3.org/2000/svg" 
  fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-4">
		  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
		</svg> <span >  Download as image</span></div>)
};


export const FlagIcon = (props:{country:string}) => {

 
  return (<img className="flag_icon"  src={"/images/flags_iso_3/"+props.country+".png"} ></img>)
};

export const Burger_icon = () => {
  return (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#E0288A" className="size-8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg> )
}
export const Close_icon = () => {
  return (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#E0288A" className="size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg> )
}
export const InfoIcon = (props:{variable:string, this_key:string}) => {

  const [open, setOpen] = useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = (e:React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation()  
    console.log('clicking')
    setOpen(true);

  };


  return (<Tooltip 
  title={tooltip_dictionary[props.variable]} key={props.this_key}
  onClose={handleTooltipClose}
  open={open}
  // disableFocusListener
  // disableHoverListener
  // disableTouchListener
  slotProps={{
    tooltip: {
      sx: {
        bgcolor: '#F4F4F4',
        color:'black',
        fontFamily:'proxima-nova',
        boxShadow:'5px 5px 5px rgba(0, 0, 0, 0.1)',
        '& .MuiTooltip-arrow': {
          color: '#F4F4F4',
        },
      },
    }}
  }
  >
    <svg onClick={handleTooltipOpen} onTouchEnd={(e)=>handleTooltipOpen} width="800px" height="800px"  fill="black" xmlns="http://www.w3.org/2000/svg" className="info_icon interactive">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 3.53846C7.32682 3.53846 3.53846 7.32682 3.53846 12C3.53846 16.6732 7.32682 20.4615 12 20.4615C16.6732 20.4615 20.4615 16.6732 20.4615 12C20.4615 7.32682 16.6732 3.53846 12 3.53846ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12Z" fill="black"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 16.359C12.4248 16.359 12.7692 16.0146 12.7692 15.5897V11.4872C12.7692 11.0623 12.4248 10.7179 12 10.7179C11.5752 10.7179 11.2308 11.0623 11.2308 11.4872V15.5897C11.2308 16.0146 11.5752 16.359 12 16.359Z" fill="black"/>
        <path d="M13.0256 8.41026C13.0256 7.84381 12.5664 7.38462 12 7.38462C11.4336 7.38462 10.9744 7.84381 10.9744 8.41026C10.9744 8.9767 11.4336 9.4359 12 9.4359C12.5664 9.4359 13.0256 8.9767 13.0256 8.41026Z" fill="black"/>
    </svg>

 
</Tooltip>)
// reinstate around tooltip if click acitvation needed
// <ClickAwayListener  onClickAway={handleTooltipClose}>
// </ClickAwayListener>)



};