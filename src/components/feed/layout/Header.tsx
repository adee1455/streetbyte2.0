import React from 'react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';

export default function Header() {
  const { openPostUploadModal } = useStore();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">

        
        <div className="flex items-center space-x-4">
          <button
            onClick={openPostUploadModal}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Create Post
          </button>
        </div>
      </div>
    </header>
  );
} 