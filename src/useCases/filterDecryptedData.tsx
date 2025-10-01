

type json_type = Record<string, string>;

export async function filterDecryptedData(data:json_type[], country:string, header:string) {

  console.log('calling function')

  const filtered_data = filterDataByHeader(data, country, header)
  // console.log(filtered_data)
  // return data.filter((entity) => {
  //   if(country != ''){
  //     if ((country && entity['Country name']  !== country)) return false;
  //   }


  //   // if ((filter.region && entity.region  !== filter.region)) return false;
  //   // if (filter.year && entity.year  !== filter.year) return false;

  //   return true;
  // });
  return filtered_data
};


function filterDataByHeader(data:json_type[], country:string, header:string) {
  const filtered_data_array= [] as json_type[]

  const header_array = Object.keys(data[0]).filter(function(key){
            if(key.includes(header) === true){
                return key
            }
          })

  data.filter(function(d){
      if(d['Country name'] === country){
        const this_obj = {} as json_type;

        header_array.map(function(key){
            this_obj['Country name'] = d['Country name']
            this_obj['Year'] = d['Year']
            this_obj[key] = d[key]
        });

        filtered_data_array.push(this_obj);

        return d
      }


  })
  console.log(filtered_data_array)
  return filtered_data_array


}