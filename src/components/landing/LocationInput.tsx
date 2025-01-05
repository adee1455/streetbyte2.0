"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Loader2, AlertCircle } from 'lucide-react';
import { useLocationStore } from '../../store/locationStore';
import { searchCity } from '../../services/locationService';
import { useDebounce } from '../../hooks/useDebounce';
import { CityUnavailableModal } from './CityUnavailableModal';

interface City {
  name: string;
  fullName: string;
}

export const LocationInput = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [showUnavailableModal, setShowUnavailableModal] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const { setCity } = useLocationStore();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length < 3) {
        setSuggestions([]);
        setError(null);
        return;
      }
  
      setLoading(true);
      setError(null);
  
      try {
        const cities = await searchCity(debouncedQuery);
        // Transform the response to match City interface
        const transformedCities: City[] = cities.map(city => ({
          name: city.name,
          fullName: 'fullName' in city ? city.fullName : `${city.name}${city.available ? ' (Available)' : ''}`
        }));
        setSuggestions(transformedCities);
      } catch (err) {
        console.error('Failed to fetch city suggestions:', err);
        setError('Failed to fetch city suggestions. Please try again.');
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchSuggestions();
  }, [debouncedQuery]);

  const handleCitySelect = async (cityName: string) => {
    setSelectedCity(cityName);
  
    try {
      const response = await fetch(`/api/check-vendors?city=${encodeURIComponent(cityName)}`);
      const isAvailable = await response.json();
  
      if (isAvailable) {
        setCity(cityName);
        router.push("/home");
      } else {
        setShowUnavailableModal(true);
      }
    } catch (error) {
      console.error("Error checking city availability:", error);
      setShowUnavailableModal(true); // Show modal in case of an API error
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
            className={`w-full pl-10 pr-4 py-2 border text-gray-900 rounded-full focus:outline-none focus:ring-1 
              ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-red-500 focus:ring-red-500'}`}
            aria-label="City search"
            aria-invalid={!!error}
            aria-describedby={error ? "error-message" : undefined}
          />
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-900 animate-spin" />
          )}
        </div>

        {error && (
          <div 
            id="error-message"
            className="mt-2 text-sm text-red-500 flex items-center gap-1"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {suggestions.length > 0 && (
          <div 
            className="absolute w-full mt-2 bg-white rounded-lg shadow-lg border text-gray-900 border-gray-200 max-h-60 overflow-y-auto"
            role="listbox"
          >
            {suggestions.map((city, index) => (
              <button
                key={index}
                onClick={() => handleCitySelect(city.name)}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                role="option"
                aria-selected={selectedCity === city.name}
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
