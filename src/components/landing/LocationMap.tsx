import React from 'react';

export const LocationMap = () => {
  return (
    <div className="flex justify-center items-center gap-8">
      <div className="relative w-64 h-96">
        <img
          src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&q=80&w=400"
          alt="Map Illustration"
          className="w-full h-full object-cover rounded-2xl shadow-lg"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-8 h-8 bg-red-500 rounded-full animate-bounce shadow-lg" />
        </div>
      </div>
      <img
        src="https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=300"
        alt="Person Looking at Phone"
        className="hidden md:block w-48 h-96 object-cover rounded-2xl shadow-lg"
      />
    </div>
  );
};