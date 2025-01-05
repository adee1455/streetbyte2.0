"use client";
import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
}

export default function InstallAppBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      const beforeInstallPromptEvent = e as BeforeInstallPromptEvent; // Cast to BeforeInstallPromptEvent
      beforeInstallPromptEvent.preventDefault(); // Prevent automatic prompt
      setDeferredPrompt(beforeInstallPromptEvent); // Save the event for triggering later
      setShowBanner(true); // Show the banner
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
  }, []);

  useEffect(() => {
    const dismissed = localStorage.getItem('installBannerDismissed');
    if (dismissed === 'true') {
      setShowBanner(false);
    }
  }, []);

  const handleClose = () => {
    setShowBanner(false);
    localStorage.setItem('installBannerDismissed', 'true');
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setDeferredPrompt(null);
      setShowBanner(false);
    }
  };

  const isInStandaloneMode =
    typeof window !== 'undefined' &&
    (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone);

  if (isInStandaloneMode || !showBanner) {
    return null;
  }

  return (
    <div className="top-0 left-0 w-full bg-red-500 text-white p-3 flex justify-between items-center z-50">
      <span
        className="pr-5 tracking-tighter cursor-pointer"
        onClick={handleClose}
      >
        x
      </span>
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
