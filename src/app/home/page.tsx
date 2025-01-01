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

// Example of dynamically importing a component
const DynamicComponent = dynamic(() => import('../../../src/components/home/VendorCard'), {
  loading: () => <p>Loading...</p>,
  ssr: false, // Disable server-side rendering
});
interface Card {
  id: string;
  name: string;
  description: string;
  address: string;
  contact_number: string;
  rating: string; // Keep as string since the API returns it as a string
  foodType: string;
  images: string[];
  menu: string[];
}

export default function Page() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true); // Initial state should be true for loading
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch(`/api/cards`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          console.error("Response was not JSON:", text);
          throw new TypeError("Oops, we haven't got JSON!");
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          setCards(data);
        } else {
          throw new Error("Invalid data format received.");
        }
      } catch (error) {
        console.error("Error fetching cards:", error);
        setError("Unable to load vendors. Please try again later.");
        setCards([]); // Optionally set cards to an empty list on error
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  return (
    <div className="pb-16 md:pb-0">
      <div className="bg-white top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <LocationHeader />
          
          <Input
            icon={<Search className="w-5 h-5" />}
            placeholder="Search for street food vendors..."
            className="mb-4 mt-4"
          />
          
          <CategoryScroll />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Popular Near You</h2>
          <Button variant="outline" size="sm">
            See All
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="text-center">Loading...</div> // You can replace this with a spinner or skeleton
          ) : error ? (
            <div className="text-center text-red-500">{error}</div> // Show error message if any
          ) : (
            cards.map((card) => (
              <DynamicComponent
                key={card.id} // Use the card's id as a unique key
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
};
