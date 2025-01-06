"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Landing from '@/components/landing';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const storedCity = localStorage.getItem('selectedCity');
    if (storedCity) {
      router.push('/home');
    }
  }, [router]);

  return <Landing />;
}
