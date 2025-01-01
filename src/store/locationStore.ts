import { create } from 'zustand';
import React from 'react';
interface LocationState {
  city: string | null;
  setCity: (city: string) => void;
  clearCity: () => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  city: null, // Initially null, will be populated in useEffect
  setCity: (city) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedCity', city);
    }
    set({ city });
  },
  clearCity: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('selectedCity');
    }
    set({ city: null });
  },
}));

// Hook to initialize `city` from `localStorage` on the client side
export const useInitializeLocationStore = () => {
  const setCity = useLocationStore((state) => state.setCity);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCity = localStorage.getItem('selectedCity');
      if (storedCity) {
        setCity(storedCity);
      }
    }
  }, [setCity]);
};
