"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Loader2 } from 'lucide-react';
import { useLocationStore } from '../../store/locationStore';
import { searchCity, checkCityAvailability } from '../../services/locationService';
import { useDebounce } from '../../hooks/useDebounce';
import { CityUnavailableModal } from './CityUnavailableModal';

export const LocationInput = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [showUnavailableModal, setShowUnavailableModal] = useState(false);
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

  const handleCitySelect = (cityName: string) => {
    setSelectedCity(cityName);
    const isAvailable = checkCityAvailability(cityName);

    if (isAvailable) {
      setCity(cityName);
      router.push('/home');
    } else {
      setShowUnavailableModal(true);
    }
  };

  return (
    <>
      <div className="relative">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your city"
            className="w-full pl-10 pr-4 py-2 border text-gray-900 border-gray-300 rounded-full focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-900 animate-spin" />
          )}
        </div>

        {suggestions.length > 0 && (
          <div className="absolute w-full mt-2 bg-white rounded-lg shadow-lg border text-gray-900 border-gray-200 max-h-60 overflow-y-auto">
            {suggestions.map((city, index) => (
              <button
                key={index}
                onClick={() => handleCitySelect(city.name)}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
              >
                <span className="font-medium">{city.name}</span>
                <span className="text-sm text-gray-500 ml-2">{city.fullName}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <CityUnavailableModal
        isOpen={showUnavailableModal}
        onClose={() => setShowUnavailableModal(false)}
        cityName={selectedCity}
      />
    </>
  );
};