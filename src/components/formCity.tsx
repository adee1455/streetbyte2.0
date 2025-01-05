"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Loader2 } from 'lucide-react';
import { useLocationStore } from '../store/locationStore';
import { searchCity } from '../services/locationService';
import { useDebounce } from '../hooks/useDebounce';

interface FormCityProps {
  onCitySelect: (cityName: string) => void;
}

export const FormCity: React.FC<FormCityProps> = ({ onCitySelect }) => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const debouncedQuery = useDebounce(query, 300);
  const { setCity } = useLocationStore();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length < 3) {
        setSuggestions([]);
        return;
      }

      setLoading(true);

      try {
        const cities = await searchCity(debouncedQuery);
        setSuggestions(cities);
      } catch (err) {
        console.error('Failed to fetch city suggestions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  const handleCitySelect = (cityName: string, event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setQuery(cityName);
    setSuggestions([]);
    console.log("Selected city:", cityName);
    onCitySelect(cityName);
  };

  return (
    <>
      <div className="relative z-10">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your city"
            className="w-full pl-10 pr-4 py-2 border text-gray-900 border-gray-300 rounded-md focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-900 animate-spin" />
          )}
        </div>

        {suggestions.length > 0 && (
          <div className="absolute w-full mt-2 bg-white rounded-lg shadow-lg border text-gray-900 border-gray-200 max-h-60 overflow-y-auto z-20">
            {suggestions.map((city, index) => (
              <button
                type="button"
                key={index}
                onClick={(event) => handleCitySelect(city.name, event)}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
              >
                <span className="font-medium">{city.name}</span>
                <span className="text-sm text-gray-500 ml-2">{city.fullName}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};