"use client";
import { useEffect } from "react";

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/service-worker.js')
          .then(registration => {
            console.log('ServiceWorker registration successful');
          })
          .catch(error => {
            console.error('ServiceWorker registration failed:', error);
          });
      });
    }
  }, []);

  return null;
} 