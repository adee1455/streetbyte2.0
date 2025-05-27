"use client";
import React, { useRef } from 'react';
import Slider from 'react-slick';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useSession } from 'next-auth/react';
import { CreateStoryModal } from './CreateStoryModal';

export const Stories = () => {
  const sliderRef = useRef<Slider>(null);
  const { data: session } = useSession();
  const [showCreateModal, setShowCreateModal] = React.useState(false);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 3,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      }
    ]
  };

  const goToPrev = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  const goToNext = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  return (
    <div className="relative mb-6 bg-white rounded-lg p-4 shadow">
      <div className="relative">
        <button
          onClick={goToPrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-1 shadow-lg"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        
        <button
          onClick={goToNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-1 shadow-lg"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>

        <Slider ref={sliderRef} {...settings} className="mx-6">
          {/* Create Story Button */}
          <div className="px-1">
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-20 h-32 rounded-lg bg-gray-100 flex flex-col items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs text-gray-600">Create Story</span>
            </button>
          </div>

          {/* Story Previews */}
          {[...Array(10)].map((_, i) => (
            <div key={i} className="px-1">
              <button className="relative w-20 h-32 rounded-lg overflow-hidden group">
                <img
                  src={`https://source.unsplash.com/random/200x300?${i}`}
                  alt={`Story ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity" />
                <div className="absolute top-2 left-2 w-8 h-8 rounded-full border-2 border-red-500 overflow-hidden">
                  <img
                    src={session?.user?.image || `https://source.unsplash.com/random/100x100?portrait${i}`}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="absolute bottom-2 left-2 right-2 text-xs text-white text-center line-clamp-2">
                  User Name {i + 1}
                </span>
              </button>
            </div>
          ))}
        </Slider>
      </div>

      <CreateStoryModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
    </div>
  );
};