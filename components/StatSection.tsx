import React from 'react';

const StatSection = ({data}:{data:{[key: string]: string | number}}) => {
  return (
    <div className="flex flex-row w-full justify-between text-center mt-2">
      {Object.keys(data).map((stat:string | number, index:number) => (
        <div key={stat + '-' + index} className="md:w-1/6  w-1/2 px-2">
          <h2 className="border-b-2 border-purple">{data[stat]}</h2>
          <p>{stat}</p>
        </div>
      ))}
    </div>
  );
};

export default StatSection;
