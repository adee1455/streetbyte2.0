"use client";
import React, { useState } from 'react';
import { LocationInput } from './landing/LocationInput';
import { Search, MapPin, Utensils, Star, Building, ChevronLeft, ChevronRight, LucideIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;  // Since you're using Lucide icons
  bgColor: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ 
  title, 
  description, 
  icon: Icon, 
  bgColor 
}) => (
  <div className={`${bgColor} rounded-xl p-8 text-white w-full max-w-sm mx-auto h-64 flex flex-col justify-between`}>
    <div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-lg opacity-90">{description}</p>
    </div>
    <div className="flex justify-between items-end">
      <button className="bg-white text-gray-800 px-4 py-2 rounded-lg font-semibold">
        Learn More
      </button>
      <Icon className="w-12 h-12 opacity-90" />
    </div>
  </div>
);

export default function Landing(){
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const features = [
    {
      title: "Find Local Vendors",
      description: "Discover authentic and hidden food places near you with real-time locations",
      icon: Search,
      bgColor: "bg-purple-600"
    },
    {
      title: "Real Reviews",
      description: "Make informed decisions with genuine customer reviews and ratings",
      icon: Star,
      bgColor: "bg-red-500"
    },
    {
      title: "Menu & Prices",
      description: "Browse complete menus and prices before you visit",
      icon: Utensils,
      bgColor: "bg-blue-600"
    },
    {
      title: "Live Tracking",
      description: "Get real-time updates on vendor locations and timings",
      icon: MapPin,
      bgColor: "bg-orange-500"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === features.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? features.length - 1 : prev - 1));
  };
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex flex-col">
        <div className="px-4 py-2">
          <LocationInput />
        </div>

        <div className='bg-white h-full mt-2'>

        <div className=''>
                    <img src="/hero.jpeg" alt="" />
                </div>
                
  <div className="px-4 py-6 bg-gradient-to-b from-white to-gray-100">
    <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-[#EF4443] mb-6">Find the Best Food Spots Near You</h2>
              <p className="text-lg text-gray-600 mb-8">
                 Explore hidden gems, authentic street food, and top-rated local vendors with ease. 
                 Start your culinary adventure today!
               </p>

        <div className="relative">
           <img 
              src="/map.svg" 
              alt="Location Map" 
              className="mx-auto w-72 h-auto drop-shadow-md"
            />
      
        </div>
      </div>
  </div>


          {/* Feature Carousel Section */}
        <div className="px-4 py-12 bg-gray-50">
          <h2 className="text-3xl font-bold text-center mb-8 text-[#EF4443]">Why Choose Streetbyte?</h2>
          
          <div className="relative">
            {/* Carousel Navigation */}
            <button 
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            
            <button 
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>

            {/* Carousel Cards */}
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {features.map((feature, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <FeatureCard {...feature} />
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Indicators */}
            <div className="flex justify-center mt-6 gap-2">
              {features.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    currentSlide === index ? 'bg-red-500 w-4' : 'bg-gray-300'
                  } transition-all duration-300`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="px-4 py-12 bg-gradient-to-b from-white to-gray-50">
  <div className="max-w-lg mx-auto text-center">
    <div className="flex items-center justify-center mb-6">
      <Building className="w-8 h-8 text-red-500 mr-2" />
      <h2 className="text-3xl font-bold text-[#EF4443]">Available in</h2>
    </div>

    <div className="relative">
      <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-xl p-8 shadow-2xl">
        <div className="flex flex-col items-center">
          <img 
            src="/nashik.jpg" 
            alt="Nashik" 
            className="rounded-full w-24 h-24 border-4 border-white shadow-lg mb-4"
          />
          <h3 className="text-2xl font-bold text-white mb-2">Nashik</h3>
          <p className="text-white text-opacity-90 mb-4">
            Exploring the food culture of the Wine Capital of India
          </p>
          <button onClick={() => router.push('/')} className="bg-white text-red-500 px-6 py-2 rounded-lg font-semibold shadow-md hover:bg-gray-100">
            Discover Now
          </button>
        </div>
      </div>

      <div className="absolute -top-6 right-6 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center">
        <MapPin className="w-8 h-8 text-red-500" />
      </div>
    </div>
  </div>
</div>


          </div>

      </main>
    </div>
  );
};

