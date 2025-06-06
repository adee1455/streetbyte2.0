export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js', {
          scope: '/'
        })
        .then((registration) => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
          
          // Check for updates every hour
          setInterval(() => {
            registration.update();
          }, 60 * 60 * 1000);
        })
        .catch((error) => {
          console.error('ServiceWorker registration failed:', error);
        });
    });
  }
} 