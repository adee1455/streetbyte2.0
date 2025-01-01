"use client";
import React, { useState } from 'react';
import { ProfileHeader } from '../../../src/components/profile/ProfileHeader';
import { ProfileTabs } from '../../../src/components/profile/ProfileTabs';
import { ReviewsTab } from '../../../src/components/profile/tabs/ReviewsTab';
import { VendorsTab } from '../../../src/components/profile/tabs/VendorsTab';
import { SettingsTab } from '../../../src/components/profile/tabs/SettingsTab';
import { SupportTab } from '../../../src/components/profile/tabs/SupportTab';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('reviews');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'reviews':
        return <ReviewsTab />;
      case 'vendors':
        return <VendorsTab />;
      case 'settings':
        return <SettingsTab />;
      case 'support':
        return <SupportTab />;
      default:
        return <ReviewsTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileHeader />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="mt-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};