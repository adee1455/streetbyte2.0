import React from 'react';
import { Star, MapPin, Settings, HelpCircle } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const tabs: Tab[] = [
  { id: 'reviews', label: 'Reviews', icon: <Star className="w-5 h-5" /> },
  { id: 'vendors', label: 'Vendors', icon: <MapPin className="w-5 h-5" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  { id: 'support', label: 'Support', icon: <HelpCircle className="w-5 h-5" /> },
];

interface ProfileTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="border-b border-gray-200 overflow-x-auto">
      <nav className="flex space-x-5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center px-0 py-4 border-b-2 text-sm font-medium ${
              activeTab === tab.id
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.icon}
            <span className="ml-2">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};