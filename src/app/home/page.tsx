"use client";
import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '../../../src/components/ui/Input';
import { Button } from '../../../src/components/ui/Button';
import { CategoryScroll } from '../../../src/components/home/CategoryScroll';
import { Navigation } from '../../../src/components/layout/Navigation';
import { LocationHeader } from '../../../src/components/home/LocationHeader';
import { FloatingActionButton } from '../../../src/components/home/FloatingActionButton';
import dynamic from 'next/dynamic';
import { useLocationStore } from '../../store/locationStore';

const DynamicComponent = dynamic(() => import('../../../src/components/home/VendorCard'), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

interface Card {
  id: string;
  name: string;
  description: string;
  address: string;
  contact_number: string;
  rating: string;
  foodType: string;
  images: string[];
  menu: string[];
}

export default function Page() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { city } = useLocationStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const fetchCards = async (selectedCity: string) => {
    try {
      setLoading(true);
      setError(null);

      if (!selectedCity) {
        setError("Please select a city");
        setLoading(false);
        return;
      }

      const queryParams = new URLSearchParams({
        city: selectedCity,
        ...(searchQuery && { search: searchQuery }),
        ...(selectedCategory && { category: selectedCategory }),
      });

      const response = await fetch(`/api/cards?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCards(data);
    } catch (error) {
      console.error("Error fetching cards:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch vendors");
    } finally {
      setLoading(false);
    }
  };

  // Update the search input section
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (city) {
      fetchCards(city);
    }
  };

  // Initial load
  useEffect(() => {
    // Check localStorage directly for initial load
    const storedCity = localStorage.getItem('selectedCity');
    if (storedCity) {
      fetchCards(storedCity);
    }
  }, []); // Empty dependency array for initial load

  // React to city changes
  useEffect(() => {
    if (city) {
      fetchCards(city);
    }
  }, [city, searchQuery, selectedCategory]); // Dependency on city changes

  return (
    <div className="pb-16 md:pb-0">
      <div className="bg-white top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <LocationHeader />
          
          <Input
            icon={<Search className="w-5 h-5" />}
            placeholder="Search for street food vendors..."
            className="mb-4 mt-4"
            value={searchQuery}
            onChange={handleSearch}
          />
          
          <CategoryScroll 
            onCategorySelect={setSelectedCategory} 
            selectedCategory={selectedCategory}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Popular Near You</h2>
          <Button variant="outline" size="sm">
            See All
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            cards.map((card) => (
              <DynamicComponent
                key={card.id}
                vendor={card}
              />
            ))
          )}
        </div>
      </div>

      <FloatingActionButton />
      <Navigation />
    </div>
  );
}
