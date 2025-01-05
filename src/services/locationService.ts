import axios from 'axios';
import { mockCityData } from '../data/mockCityData';

const GEONAMES_API = 'https://secure.geonames.org/searchJSON';
const FALLBACK_GEONAMES_API = 'https://api.geonames.org/searchJSON';

export const searchCity = async (query: string) => {
  try {
    const makeRequest = async (url: string) => {
      return await axios.get(url, {
        params: {
          q: query,
          maxRows: 10,
          username: 'adeeshaikh',
          featureClass: 'P',
          country: 'IN',
        },
      });
    };

    let response;
    try {
      response = await makeRequest(GEONAMES_API);
    } catch (primaryError) {
      console.warn('Primary GeoNames API failed, trying fallback:', primaryError);
      response = await makeRequest(FALLBACK_GEONAMES_API);
    }

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
    // Return mock data as fallback in case of complete failure
    return mockCityData.filter(city => 
      city.name.toLowerCase().includes(query.toLowerCase())
    );
  }
};