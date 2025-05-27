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

interface UserProfile {
  id: number;
  name: string;
  email: string;
  profile_image: string | null;
  auth_provider: string;
  created_at: Date;
}

export default function Profile() {
  console.log('Profile page rendering...');
  const router = useRouter();
  const { data: session, status } = useSession();
  console.log('Session data:', session);
  console.log('Session status:', status);
  console.log('Session user data:', session?.user);

  const isAuthenticated = status === 'authenticated';
  const [activeTab, setActiveTab] = useState('vendors');

  useEffect(() => {
    console.log('Profile page useEffect running...', { isAuthenticated, status });
    if (status === 'loading') {
      console.log('Session loading, not redirecting');
      return;
    }
    
    if (!isAuthenticated) {
      console.log('Not authenticated, redirecting to signin');
      router.push('/auth/signin');
    } else {
      console.log('Authenticated, staying on profile page');
    }
  }, [isAuthenticated, status, router]);

  // Show loading state while session is being fetched
  if (status === 'loading') {
    console.log('Rendering loading spinner');
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'vendors':
        return <VendorsTab />;
      case 'reviews':
        return <ReviewsTab />;
      case 'settings':
        return <SettingsTab />;
      case 'support':
        return <SupportTab />;
      default:
        return <ReviewsTab />;
    }
  };

  console.log('Rendering ProfileHeader with:', {
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    photoURL: session?.user?.image || '',
  });

  // Log if not authenticated before returning null
  if (!isAuthenticated || !session?.user) {
    console.log('Not authenticated or no user, not rendering profile content');
  }

  return (
    <>
      {isAuthenticated && session?.user ? (
        <div className="min-h-screen bg-white">
          <ProfileHeader 
            name={session.user.name || ''} 
            email={session.user.email || ''} 
            photoURL={session.user.image || ''} 
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