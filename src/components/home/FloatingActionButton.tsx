import React from 'react';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export const FloatingActionButton = () => {
  return (
    <Link
      href="/vendorForm"
      className="fixed bottom-20 right-6 md:bottom-8 md:right-8 bg-red-500 text-white rounded-full p-4 shadow-lg hover:bg-red-600 transition-colors z-50"
      aria-label="Add new vendor"
    >
      <Plus className="w-6 h-6" />
    </Link>
  );
};