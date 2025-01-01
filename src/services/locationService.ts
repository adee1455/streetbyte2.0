import axios from 'axios';
import { mockCityData } from '../data/mockCityData';

const NOMINATIM_API = 'https://nominatim.openstreetmap.org/search';

export const searchCity = async (query: string) => {
  try {
    const response = await axios.get(NOMINATIM_API, {
      params: {
        q: `${query}, India`,
        format: 'json',
        countrycodes: 'in',
        limit: 5,
      },
    });

    return response.data.map((item: any) => ({
      name: item.display_name.split(',')[0],
      fullName: item.display_name,
      lat: item.lat,
      lon: item.lon,
    }));
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
};

export const checkCityAvailability = (cityName: string) => {
  // In a real app, this would be an API call
  return mockCityData.some(
    (city) => city.name.toLowerCase() === cityName.toLowerCase()
  );
};