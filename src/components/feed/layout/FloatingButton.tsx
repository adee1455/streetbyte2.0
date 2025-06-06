import React from 'react';
import { useStore } from '@/store/useStore';

export default function FloatingButton() {
  const { openPostUploadModal } = useStore();

  return (
    <button
      onClick={openPostUploadModal}
      className="fixed bottom-24 right-6 w-14 h-14 bg-[#EF4443] text-white rounded-full shadow-lg hover:bg-[#ab2727] transition-colors flex items-center justify-center"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
    </button>
  );
} 