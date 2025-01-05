"use client";
import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
}

interface Navigator {
  standalone?: boolean;
}

export default function InstallAppBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
      console.log('beforeinstallprompt event fired');
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => {
    const dismissed = localStorage.getItem('installBannerDismissed');
    if (dismissed) {
      setShowBanner(false);
    }
  }, []);
  
  const handleClose = () => {
    setShowBanner(false);
    localStorage.setItem('installBannerDismissed', 'true');
  };
  

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setDeferredPrompt(null);
        setShowBanner(false);
      });
    }
  };

  const isInStandaloneMode =
    typeof window !== 'undefined' &&
    (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone);

  console.log('isInStandaloneMode:', isInStandaloneMode);
  console.log('showBanner:', showBanner);

  if (isInStandaloneMode) {
    return null;
  }

  return (
    <div className="top-0 left-0 w-full bg-red-500 text-white p-3 flex justify-between items-center">
      <span
        className="pr-5 tracking-tighter cursor-pointer"
        onClick={() => setShowBanner(false)}
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
