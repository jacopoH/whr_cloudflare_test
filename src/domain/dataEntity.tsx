export type dictionary = {[key: string]:string}
export type json_type = {
    //@ts-expect-error -- ye string error
    'YE'?: Date | string | number | undefined; // Adjust based on your data structure
    [key: string]: string | number | null | undefined; // Allow additional properties
  }