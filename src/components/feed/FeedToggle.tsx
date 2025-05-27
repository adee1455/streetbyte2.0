import React from 'react';
import { Globe, MapPin } from 'lucide-react';

interface FeedToggleProps {
  activeFeed: 'global' | 'local';
  onToggle: (type: 'global' | 'local') => void;
}

export const FeedToggle: React.FC<FeedToggleProps> = ({ activeFeed, onToggle }) => {
  return (
    <div className="flex justify-center mb-6">
      <div className="bg-white rounded-lg shadow p-1 flex">
        <button
          onClick={() => onToggle('global')}
          className={`flex items-center px-4 py-2 rounded-md transition-colors ${
            activeFeed === 'global'
              ? 'bg-red-500 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Globe className="w-5 h-5 mr-2" />
          Global Feed
        </button>
        <button
          onClick={() => onToggle('local')}
          className={`flex items-center px-4 py-2 rounded-md transition-colors ${
            activeFeed === 'local'
              ? 'bg-red-500 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <MapPin className="w-5 h-5 mr-2" />
          Local Feed
        </button>
      </div>
    </div>
  );
};