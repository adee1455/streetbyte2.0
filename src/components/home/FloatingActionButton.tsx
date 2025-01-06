// components/home/FloatingActionButton.tsx
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { LoginPrompt } from '../auth/LoginPrompt';

export const FloatingActionButton = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleClick = () => {
    if (status === 'authenticated') {
      router.push('/vendorForm');
    } else {
      setShowLoginPrompt(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="fixed bottom-20 right-6 md:bottom-8 md:right-8 bg-red-500 text-white rounded-full p-4 shadow-lg hover:bg-red-600 transition-colors z-40"
        aria-label="Add new vendor"
      >
        <Plus className="w-6 h-6" />
      </button>

      {showLoginPrompt && (
        <LoginPrompt onClose={() => setShowLoginPrompt(false)} />
      )}
    </>
  );
};