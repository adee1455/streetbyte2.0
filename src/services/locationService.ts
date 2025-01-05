import axios from 'axios';
import { mockCityData } from '../data/mockCityData';

const GEONAMES_API = 'http://api.geonames.org/searchJSON';

import { useRouter } from 'next/navigation';

export const searchCity = async (query: string) => {
  try {
    const response = await axios.get(GEONAMES_API, {
      params: {
        q: query,
        maxRows: 10,
        username: 'adeeshaikh',
        featureClass: 'P',
        country: 'IN',
      },
    });

    const uniqueCityNames = Array.from(new Set(response.data.geonames.map((item: any) => item.name)));

    const uniqueCities = uniqueCityNames.map(name => {
      return response.data.geonames.find((item: any) => item.name === name);
    }).filter(item => item !== undefined);

    const filteredCities = uniqueCities.filter(city => 
      city.name.toLowerCase().includes(query.toLowerCase())
    );

    return filteredCities.map((item: any) => ({
      name: item.name,
      fullName: `${item.name}, ${item.adminName1}`,
      lat: item.lat,
      lon: item.lng,
    }));
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
};

export const checkCityAvailability = async (cityName: string) => {

};
