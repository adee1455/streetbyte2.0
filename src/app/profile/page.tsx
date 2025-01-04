"use client";
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ProfileHeader } from '../../../src/components/profile/ProfileHeader';
import { ProfileTabs } from '../../../src/components/profile/ProfileTabs';
import { ReviewsTab } from '../../../src/components/profile/tabs/ReviewsTab';
import { VendorsTab } from '../../../src/components/profile/tabs/VendorsTab';
import { SettingsTab } from '../../../src/components/profile/tabs/SettingsTab';
import { SupportTab } from '../../../src/components/profile/tabs/SupportTab';
import { useAuthStore } from '../../store/authStore';

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isAuthenticated = status === 'authenticated';
  const [activeTab, setActiveTab] = useState('');
  const { isAuthenticated: authStoreIsAuthenticated, setIsAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/signin');
    }
  }, [isAuthenticated, router]);

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
    <>
      {isAuthenticated ? (
        <div className="min-h-screen bg-gray-50">
          <ProfileHeader 
            name={session?.user.name ?? ''} 
            email={session?.user.email ?? ''} 
            photoURL={session?.user.image ?? ''} 
          />
          
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
            <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="mt-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}