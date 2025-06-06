"use client";
import { useEffect } from "react";

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', async () => {
        try {
          // Unregister any existing service workers
          const registrations = await navigator.serviceWorker.getRegistrations();
          for (const registration of registrations) {
            await registration.unregister();
          }

          // Register new service worker
          const registration = await navigator.serviceWorker.register('/service-worker.js', {
            scope: '/'
          });

          console.log('ServiceWorker registration successful with scope:', registration.scope);

          // Handle updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('New service worker installed');
                }
              });
            }
          });
        } catch (error) {
          console.error('ServiceWorker registration failed:', error);
        }
      });
    }
  }, []);

  return null;
} 