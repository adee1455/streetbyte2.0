"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

// Type for the install prompt event
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
}

export default function InstallAppBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if app is already installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches || 
                       (window.navigator as any).standalone;
    
    if (isInstalled) {
      setShowBanner(false);
      return;
    }

    // Show banner by default
    setShowBanner(true);

    // Handle install prompt for Chrome/Android
    const handleInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleInstallPrompt as EventListener);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt as EventListener);
    };
  }, []);

  const handleInstallClick = async () => {
    // If we have the install prompt, use it
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
          setShowBanner(false);
          setDeferredPrompt(null);
        }
      } catch (error) {
        console.error('Install prompt error:', error);
        router.push('/install');
      }
    } else {
      // If no prompt is available, redirect to install page
      router.push('/install');
    }
  };

  if (!showBanner) return null;

  return (
    <div className="top-0 left-0 w-full bg-red-500 text-white p-3 flex justify-between items-center z-50">
      <button 
        onClick={() => setShowBanner(false)}
        className="pr-5 tracking-tighter cursor-pointer"
        aria-label="Close banner"
      >
        ✕
      </button>
      
      <span className="text-sm font-semibold">
        Install StreetByte for a better experience!
      </span>
      
      <button
        onClick={handleInstallClick}
        className="bg-white text-red-500 py-1 px-3 w-32 rounded hover:bg-gray-100"
      >
        Install App
      </button>
    </div>
  );
}