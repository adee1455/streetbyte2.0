import React from 'react';
import { Camera } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Navigation } from '../layout/Navigation';

export const ProfileHeader = () => {
  const { user } = useAuthStore();

  return (
    <div className="relative">
      <div className="h-32 bg-gradient-to-r from-red-500 to-red-600" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-16">
          <div className="flex items-end">
            <div className="relative pt-5">
              <img
                src={(user as any)?.photoURL || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=120'}
                alt="Profile"
                className="h-32 w-32 rounded-full border-4 border-white object-cover"
              />
              <button className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow-lg">
                <Camera className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="ml-4 pb-4 pt-4">
              <h1 className="text-2xl  font-bold text-gray-900">{user?.name || 'User Name'}</h1>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
      <Navigation/>
    </div>
  );
};