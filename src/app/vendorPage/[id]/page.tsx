"use client";
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Vendor } from '../../../types';

// Dynamically importing the vendor page component (with SSR disabled)
const DynamicComponent = dynamic(() => import('../../vendor-page/page'), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});


interface VendorPageProps {
  params: Promise<{ id: string }>;
}

export default function Page({ params }: VendorPageProps) {
  // Unwrap `params` with React's `use` directive
  const { id } = React.use(params);

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const response = await fetch(`/api/vendorPage?id=${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        if (data && typeof data === 'object' && data.id) {
          setVendor(data as Vendor);
        } else {
          throw new Error('Invalid data format received.');
        }
      } catch (err) {
        console.error('Error fetching vendor data:', err);
        setError('Unable to load vendor information. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch data when the `id` parameter is available
    if (id) {
      fetchVendor();
    }
  }, [id]);

  if (loading) {
    return <div>Loading vendor information...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {/* Pass vendor data as props to the dynamic component */}
      {vendor && <DynamicComponent vendor={vendor} />}
    </div>
  );
}
