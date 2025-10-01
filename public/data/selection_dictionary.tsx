import * as d3 from "d3";
import {data_replacement_year} from '../../src/constants/constants'
type FunctionDictionary = {
	[category: string]: {
	  [variable: string]: Function;
	};
  };
type SidebarDictionary = {
    [category: string]: {
      [variable: string]: string;
    };
  }; 
type dictionary = {
	  [key: string]: number[] | string;
  };

type LegendObjDictionary = {
	[key: string]: {
	  [key: string]: string | number;
	}[];
 };


export const tooltip_dictionary: dictionary = {
'Life evaluation':'Our global ranking is based on a single life evaluation question: Please imagine a ladder with steps numbered from 0 at the bottom to 10 at the top. The top of the ladder represents the best possible life for you and the bottom of the ladder represents the worst possible life for you. On which step of the ladder would you say you personally feel you stand at this time?', 
'Average (3-year)':'We rank countries by their average life evaluation score over the three preceding years because the larger sample size enables more precise estimates. For example, the ranking in WHR 2025 uses the average of the scores from 2022, 2023, and 2024.',
'Average (annual)':'The average life evaluation score for the year in question.',
// 'Change':'The change in average life evaluation since our first ranking was published in 2012.',
'Change (since 2012)':'The change in average life evaluation since our first ranking was published in 2012.',
'Inequality':'The standard deviation of life evaluation scores. Countries with a higher standard deviation have a wider spread of scores which indicates greater inequality in happiness.',
'Explanatory factors':'Each year, we conduct economic modelling to explain countries’ average life evaluation scores using six variables. Taken together, these six variables explain more than three-quarters of the variation in national life evaluation scores across countries and years.',
'Explanatory factors _ countryView': 'Each year, we conduct economic modelling to explain countries’ average life evaluation scores using six variables. Taken together, these six variables explain more than three-quarters of the variation in national life evaluation scores across countries and years. In the table below, we present three data points for each factor: [Rank] The country’s ranking for that factor compared to other nations, [Value] The value of the factor for the most recent year, [Explains] How much of the country’s life evaluation score is explained by the factor. See worldhappiness.report/faq for more information.',
'Social support':'If you were in trouble, do you have relatives or friends you can count on to help you whenever you need them, or not?',
'GDP per capita':'In terms of Purchasing Power Parity adjusted to constant 2017 international dollars, taken from the World Development Indicators by the World Bank.',
'Healthy life expectancy':'Based on data from the World Health Organization Global Health Observatory. The most recent data is from 2021.',
'Freedom':'Are you satisfied or dissatisfied with your freedom to choose what you do with your life?',
'Generosity':'Have you donated money to a charity in the past month?',
'Perceptions of corruption': "The average of two questions: “Is corruption widespread throughout the government or not?” and “Is corruption widespread within businesses or not?” Where data for government corruption are missing, the perception of business corruption is used as the overall corruption-perception measure.",
'Emotions':'Emotions are well explained by events of the day and they are significant supports for life evaluations. However, we use life evaluations for our rankings because they reflect the circumstances of life as a whole.',
'Positive emotions':'The national average of binary responses (0=no, 1=yes) about three emotions experienced on the previous day: laughter, enjoyment, and interest.',
'Negative emotions':'The national average of binary responses (0=no, 1=yes) about three emotions experienced on the previous day: worry, sadness, and anger.',
'Benevolence':'This section highlights three types of benevolent acts: donating, volunteering, and helping strangers.',
'Donated':'Have you donated money to a charity in the past month?',
'Volunteered':'Have you volunteered your time to an organisation in the past month?',
'Helped a stranger':"Have you helped a stranger or someone you didn’t know who needed help in the past month?",
}


export const x_axis_label_dict:{[key: string]: string}= {
    'Average (3-year)': 'Life Evaluation (0–10)',
    'Average (annual)': 'Life Evaluation (0–10)',
    // 'Change': 'Change in Life Evaluation',
    'Change (since 2012)': 'Change in Life Evaluation',
    'Inequality': 'Standard Deviation',
    'Social support': 'Social Support (%)',
    'GDP per capita': 'GDP Per Capita (US $)',
    'Healthy life expectancy': 'Healthy Life Expectancy (years)',
    'Freedom': 'Freedom (%)',
    'Generosity': 'Generosity (%)',
    'Perceptions of corruption': 'Perceptions of Corruption (%)',
    'Positive emotions': 'Positive Emotions (%)',
    'Negative emotions': 'Negative Emotions (%)',
    'Emotions':'Percentage',
    'Benevolence':'Percentage',
    'Donated': 'Donated (%)',
    'Volunteered': 'Volunteered (%)',
    'Helped a stranger': 'Helped a Stranger (%)'
}

const p = d3.format('.0f');

function percent_rounding(value:string){
    return d3.format('.1f')(parseFloat(value as  unknown as string)) + '%'
}
function zerodp_percent_rounding(value:string){
    console.log(value)
    return d3.format('.0f')(parseFloat(value as  unknown as string)) + '%'
}
function dollar_rounding(value:number){
    if(isNaN(value) === false){
        return '$' +d3.format(',')(value)
    }
    else {return ''}
}
function year_rounding(value:number){
    return d3.format('.1f')(value) + ' years'
}

export const data_table_header_dict:{[key:string]:string}={
    'Life evaluation _ Average (3-year) _ ranking':'Rank',
    'Country name':'Country',
    'Life evaluation _ Average (3-year) _ mean':'Life evaluation',
    'Explanatory factors _ Healthy life expectancy _ ranking': 'Healthy Life Expectancy ('+data_replacement_year+' data)'
}



//@ts-expect error need to define function type
export const variable_value_formatting:{[key:string]:Function}= {
    'Average (3-year)': d3.format('.3f'),
    'Average (annual)': d3.format('.3f'),
    // 'Change': d3.format('.3f'),
    'Change (since 2012)': d3.format('.3f'),
    'Inequality': d3.format('.2f'),
    'Social support': percent_rounding,
    'GDP per capita': dollar_rounding,
    'Healthy life expectancy': year_rounding,
    'Freedom': percent_rounding,
    'Generosity': percent_rounding,
    'Perceptions of corruption': percent_rounding,
    'Positive emotions': percent_rounding,
    'Negative emotions': percent_rounding,
    'Emotions':percent_rounding,
    'Benevolence':percent_rounding,
    'Donated':percent_rounding,
    'Volunteered': percent_rounding,
    'Helped a stranger': percent_rounding,
    'Value':d3.format('.0f'),
    'Contrib. (%)': zerodp_percent_rounding,
    'Rank':d3.format('.0f')
}
export const variable_appendages:{[key: string]: string}= {
    'Average (3-year)': 'Score (0–10)',
    'Average (annual)': 'Score (0–10)',
    // 'Change': 'Change',
    'Change (since 2012)': 'Change (since 2012)',
    'Inequality': 'Standard Deviation',
    'Social support': 'Percentage',
    'GDP per capita': 'US Dollars ($)',
    'Healthy life expectancy': 'Years',
    'Freedom': 'Percentage',
    'Generosity': 'Percentage',
    'Perceptions of corruption': 'Percentage',
    'Positive emotions': 'Percentage',
    'Negative emotions': 'Percentage',
    'Emotions':'Percentage',
    'Benevolence':'Percentage',
    'Donated': 'Percentage',
    'Volunteered': 'Percentage',
    'Helped a stranger': 'Percentage'
}
export const sidebar_dictionary: SidebarDictionary = {
	"Life evaluation":{
		// "Three Year Average":"3_year_avg __ LS Average",
        "Average (3-year)":"Life evaluation _ Average (3-year) _ mean",
		"Average (annual)":"Life evaluation _ Average (annual) _ mean",
        "Change (since 2012)":"Life evaluation _ Change (since 2012) _ mean",
		// "Change":"Life evaluation _ Change _ mean",
        "Inequality":"Life evaluation _ Inequality _ SD"
		// "Distribution":"Life evaluation _ Distribution _ SD",
	},
	"Explanatory factors":{
		"Social support":"Explanatory factors _ Social support _ mean",
		"GDP per capita":"Explanatory factors _ GDP per capita _ mean",
		"Healthy life expectancy":"Explanatory factors _ Healthy life expectancy _ mean",
		"Freedom":"Explanatory factors _ Freedom _ mean",
		"Generosity":"Explanatory factors _ Generosity _ mean",
		"Perceptions of corruption":'Explanatory factors _ Perceptions of corruption _ mean'
	},
	"Emotions":{
		"Positive emotions":"Emotions _ Positive emotions _ mean",
		"Negative emotions":"Emotions _ Negative emotions _ mean"
	},
	"Benevolence":{
		"Donated":"Benevolence _ Donated _ mean",
		"Volunteered":"Benevolence _ Volunteered _ mean",
		"Helped a stranger":"Benevolence _ Helped a stranger _ mean"
	}
}

// export const rounding_dictionary: FunctionDictionary = {
//     //@ts-expect-error need to find format type definition
//     "Explanatory factors _ GDP per capita _ mean":d3.format(',.0f')
// }

export const map_band_dictionary:LegendObjDictionary = 	{
       "Average (3-year)": [
            {
                "color": "#6e276a",
                "min_value": 7.0,
                "max_value": 8.0,
                "text": "7 to 8 (on a 0–10 scale)"
            },
            {
                "color": "#93368d",
                "min_value": 6.0,
                "max_value": 7.0,
                "text": "6 to 7 (on a 0–10 scale)"
            },
            {
                "color": "#a4559d",
                "min_value": 5.0,
                "max_value": 6.0,
                "text": "5 to 6 (on a 0–10 scale)"
            },
            {
                "color": "#b472ad",
                "min_value": 4.0,
                "max_value": 5.0,
                "text": "4 to 5 (on a 0–10 scale)"
            },
            {
                "color": "#c48fbe",
                "min_value": 3.0,
                "max_value": 4.0,
                "text": "3 to 4 (on a 0–10 scale)"
            },
            {
                "color": "#d4acce",
                "min_value": 2.0,
                "max_value": 3.0,
                "text": "2 to 3 (on a 0–10 scale)"
            },
            {
                "color": "#f0d8eb",
                "min_value": 1.0,
                "max_value": 2.0,
                "text": "1 to 2 (on a 0–10 scale)"
            }
        ],
        "Change (since 2012)": [
            {
                "color": "#6e276a",
                "min_value": 1.0,
                "max_value": 999999,
                "text": "Over 1.0 increase"
            },
            {
                "color": "#93368d",
                "min_value": 0.5,
                "max_value": 1.0,
                "text": "0.5 to 1.0 increase"
            },
            {
                "color": "#c48fbe",
                "min_value": 0.0,
                "max_value": 0.5,
                "text": "0.0 to 0.5 increase"
            },
            {
                "color": "#f7c6b1",
                "min_value": -0.5,
                "max_value": 0.0,
                "text": "0.0 to 0.5 decrease"
            },
            {
                "color": "#f28d64",
                "min_value": -1.0,
                "max_value": -0.5,
                "text": "0.5 to 1.0 decrease"
            },
            {
                "color": "#e9683a",
                "min_value": -999999,
                "max_value": -1.0,
                "text": "Over 1.0 decrease"
            }
        ],
                "Average (annual)": [
                {
                    "color": "#6e276a",
                    "min_value": 7.0,
                    "max_value": 8.0,
                    "text": "7 to 8 (on a 0–10 scale)"
                },
                {
                    "color": "#93368d",
                    "min_value": 6.0,
                    "max_value": 7.0,
                    "text": "6 to 7 (on a 0–10 scale)"
                },
                {
                    "color": "#a4559d",
                    "min_value": 5.0,
                    "max_value": 6.0,
                    "text": "5 to 6 (on a 0–10 scale)"
                },
                {
                    "color": "#b472ad",
                    "min_value": 4.0,
                    "max_value": 5.0,
                    "text": "4 to 5 (on a 0–10 scale)"
                },
                {
                    "color": "#c48fbe",
                    "min_value": 3.0,
                    "max_value": 4.0,
                    "text": "3 to 4 (on a 0–10 scale)"
                },
                {
                    "color": "#d4acce",
                    "min_value": 2.0,
                    "max_value": 3.0,
                    "text": "2 to 3 (on a 0–10 scale)"
                },
                {
                    "color": "#f0d8eb",
                    "min_value": 1.0,
                    "max_value": 2.0,
                    "text": "1 to 2 (on a 0–10 scale)"
                }
            ],       
           
    "Inequality": [
            {
                "color": "#6e276a",
                "min_value": 2.8,
                "max_value": 999999,
                "text": "More than 2.8"
            },
            {
                "color": "#93368d",
                "min_value": 2.4,
                "max_value": 2.8,
                "text": "2.4 to 2.8"
            },
            {
                "color": "#b061a6",
                "min_value": 2.0,
                "max_value": 2.4,
                "text": "2.0 to 2.4"
            },
            {
                "color": "#d297c5",
                "min_value": 1.7,
                "max_value": 2.0,
                "text": "1.7 to 2.0"
            },
            {
                "color": "#f0d8eb",
                "min_value": -999999,
                "max_value": 1.7,
                "text": "Less than 1.7"
            }
        ],
    
"Social support": [
    {
        "color": "#25727a",
        "min_value": 90,
        "max_value": 999999,
        "text": "More than 90%"
    },
    {
        "color": "#3c9fa8",
        "min_value": 80,
        "max_value": 90,
        "text": "80% to 90%"
    },
    {
        "color": "#5ba5ad",
        "min_value": 70,
        "max_value": 80,
        "text": "70% to 80%"
    },
    {
        "color": "#8cc9c8",
        "min_value": 60,
        "max_value": 70,
        "text": "60% to 70%"
    },
    {
        "color": "#cfe6e4",
        "min_value": -999999,
        "max_value": 60,
        "text": "Less than 60%"
    }
],
    "GDP per capita": [
        {
            "color": "#25727a",
            "min_value": 80000,
            "max_value": 999999,
            "text": "More than 80,000"
        },
        {
            "color": "#3c9fa8",
            "min_value": 40000,
            "max_value": 80000,
            "text": "40,000 to 80,000"
        },
        {
            "color": "#5ba5ad",
            "min_value": 25000,
            "max_value": 40000,
            "text": "25,000 to 40,000"
        },
        {
            "color": "#8cc9c8",
            "min_value": 10000,
            "max_value": 25000,
            "text": "10,000 to 25,000"
        },
        {
            "color": "#cfe6e4",
            "min_value": -999999,
            "max_value": 10000,
            "text": "Less than 10,000"
        }
    ],
    "Healthy life expectancy": [
        {
            "color": "#25727a",
            "min_value": 68,
            "max_value": 999999,
            "text": "More than 68 years"
        },
        {
            "color": "#3c9fa8",
            "min_value": 63,
            "max_value": 68,
            "text": "63 to 68 years"
        },
        {
            "color": "#5ba5ad",
            "min_value": 57,
            "max_value": 63,
            "text": "57 to 63 years"
        },
        {
            "color": "#8cc9c8",
            "min_value": 52,
            "max_value": 57,
            "text": "52 to 57 years"
        },
        {
            "color": "#cfe6e4",
            "min_value": -999999,
            "max_value": 52,
            "text": "Less than 52 years"
        }
    ],
    "Freedom": [
        {
            "color": "#25727a",
            "min_value": 85,
            "max_value": 999999,
            "text": "More than 85%"
        },
        {
            "color": "#3c9fa8",
            "min_value": 75,
            "max_value": 85,
            "text": "75% to 85%"
        },
        {
            "color": "#5ba5ad",
            "min_value": 65,
            "max_value": 75,
            "text": "65% to 75%"
        },
        {
            "color": "#8cc9c8",
            "min_value": 50,
            "max_value": 65,
            "text": "50% to 65%"
        },
        {
            "color": "#cfe6e4",
            "min_value": -999999,
            "max_value": 50,
            "text": "Less than 50%"
        }
    ],
    "Generosity": [
        {
            "color": "#25727a",
            "min_value": 60,
            "max_value": 999999,
            "text": "More than 60%"
        },
        {
            "color": "#3c9fa8",
            "min_value": 40,
            "max_value": 60,
            "text": "40% to 60%"
        },
        {
            "color": "#5ba5ad",
            "min_value": 30,
            "max_value": 40,
            "text": "30% to 40%"
        },
        {
            "color": "#8cc9c8",
            "min_value": 15,
            "max_value": 30,
            "text": "15% to 30%"
        },
        {
            "color": "#cfe6e4",
            "min_value": -999999,
            "max_value": 15,
            "text": "Less than 15%"
        }
    ],
    "Perceptions of corruption": [
        {
            "color": "#25727a",
            "min_value": 85,
            "max_value": 999999,
            "text": "More than 85%"
        },
        {
            "color": "#3c9fa8",
            "min_value": 70,
            "max_value": 85,
            "text": "70% to 85%"
        },
        {
            "color": "#5ba5ad",
            "min_value": 55,
            "max_value": 70,
            "text": "55% to 70%"
        },
        {
            "color": "#8cc9c8",
            "min_value": 30,
            "max_value": 55,
            "text": "30% to 55%"
        },
        {
            "color": "#cfe6e4",
            "min_value": -999999,
            "max_value": 30,
            "text": "Less than 30%"
        }
    ],
       "Positive emotions": [
            {
                "color": "#b54624",
                "min_value": 75,
                "max_value": 999999,
                "text": "More than 75%"
            },
            {
                "color": "#e9683a",
                "min_value": 67,
                "max_value": 75,
                "text": "67% to 75%"
            },
            {
                "color": "#f28d64",
                "min_value": 60,
                "max_value": 67,
                "text": "60% to 67%"
            },
            {
                "color": "#f7b295",
                "min_value": 50,
                "max_value": 60,
                "text": "50% to 60%"
            },
            {
                "color": "#fde0d3",
                "min_value": -999999,
                "max_value": 50,
                "text": "Less than 50%"
            }
        ],    
    "Negative emotions": [
        {
            "color": "#b54624",
            "min_value": 40,
            "max_value": 999999,
            "text": "More than 40%"
        },
        {
            "color": "#e9683a",
            "min_value": 30,
            "max_value": 40,
            "text": "30% to 40%"
        },
        {
            "color": "#f28d64",
            "min_value": 25,
            "max_value": 30,
            "text": "25% to 30%"
        },
        {
            "color": "#f7b295",
            "min_value": 20,
            "max_value": 25,
            "text": "20% to 25%"
        },
        {
            "color": "#fde0d3",
            "min_value": -999999,
            "max_value": 20,
            "text": "Less than 20%"
        }
    ],
    "Donated": [
            {
                "color": "#25727a",
                "min_value": 60,
                "max_value": 999999,
                "text": "More than 60%"
            },
            {
                "color": "#3c9fa8",
                "min_value": 40,
                "max_value": 60,
                "text": "40% to 60%"
            },
            {
                "color": "#5ba5ad",
                "min_value": 30,
                "max_value": 40,
                "text": "30% to 40%"
            },
            {
                "color": "#8cc9c8",
                "min_value": 15,
                "max_value": 30,
                "text": "15% to 30%"
            },
            {
                "color": "#cfe6e4",
                "min_value": -999999,
                "max_value": 15,
                "text": "Less than 15%"
            }
        ],    
            "Volunteered": [
                {
                    "color": "#0c4e6d",
                    "min_value": 40,
                    "max_value": 999999,
                    "text": "More than 40%"
                },
                {
                    "color": "#116a93",
                    "min_value": 30,
                    "max_value": 40,
                    "text": "30% to 40%"
                },
                {
                    "color": "#5190b1",
                    "min_value": 20,
                    "max_value": 30,
                    "text": "20% to 30%"
                },
                {
                    "color": "#86b2c9",
                    "min_value": 10,
                    "max_value": 20,
                    "text": "10% to 20%"
                },
                {
                    "color": "#c5dbe4",
                    "min_value": -999999,
                    "max_value": 10,
                    "text": "Less than 10%"
                }
            ],
            "Helped a stranger": [
                {
                    "color": "#0c4e6d",
                    "min_value": 70,
                    "max_value": 999999,
                    "text": "More than 70%"
                },
                {
                    "color": "#116a93",
                    "min_value": 60,
                    "max_value": 70,
                    "text": "60% to 70%"
                },
                {
                    "color": "#5190b1",
                    "min_value": 50,
                    "max_value": 60,
                    "text": "50% to 60%"
                },
                {
                    "color": "#86b2c9",
                    "min_value": 40,
                    "max_value": 50,
                    "text": "40% to 50%"
                },
                {
                    "color": "#c5dbe4",
                    "min_value": -999999,
                    "max_value": 40,
                    "text": "Less than 40%"
                }
            ]
        
}