import React, { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

interface AddressSectionProps {
  address: string;
}

const mapContainerStyle = {
  width: "100%",
  height: "600px",
};

export const AddressSection: React.FC<AddressSectionProps> = ({ address }) => {
  const [geocodeCoordinates, setGeocodeCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDnFERa1oyGkz3C8hWtPWi0UGtx1iD1FxM", // Use environment variable
  });

  useEffect(() => {
    const geocodeAddress = async () => {
      if (address && typeof address === 'string' && address.trim() !== '') {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address }, (results, status) => {
          if (status === "OK" && results[0]) {
            const { lat, lng } = results[0].geometry.location;
            setGeocodeCoordinates({ lat: lat(), lng: lng() });
            setError(null); // Reset error if geocoding is successful
          } else {
            setError(`Geocode was not successful for the following reason: ${status}`);
            console.error("Geocode failed:", status);
          }
        });
      } else {
        setError("Invalid address provided for geocoding.");
      }
    };

    if (isLoaded) {
      geocodeAddress();
    }
  }, [address, isLoaded]);

  if (loadError) {
    return <div>Error loading Google Maps</div>;
  }

  return (
    <div className="bg-white shadow-sm mt-3">
      <div className="max-w-5xl mx-auto px-4 py-4">
        <h2 className="text-xl font-Proxima font-semibold mb-4">Address</h2>
        <div className="flex items-start gap-2 mb-4">
          <MapPin className="w-5 h-5 text-gray-500 mt-1" />
          <p className="text-gray-700">{address}</p>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>} {/* Error message */}
        <div className="h-52 focus:outline-none rounded-lg overflow-hidden">
          {isLoaded && geocodeCoordinates ? (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              zoom={14}
              center={geocodeCoordinates}
            >
              <Marker position={geocodeCoordinates} />
            </GoogleMap>
          ) : (
            !isLoaded && !error && <div>Loading map...</div> // Show loading text while waiting for map to load
          )}
        </div>
      </div>
    </div>
  );
};
