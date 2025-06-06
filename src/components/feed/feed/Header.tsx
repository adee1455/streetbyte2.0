import React from 'react';
import { useStore } from '@/store/useStore';
import { Camera } from 'lucide-react';
import IconButton from '../shared/IconButton';

export default function Header() {
  const { setPostUploadModalOpen } = useStore();

  const handleCreatePost = () => {
    setPostUploadModalOpen(true);
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Feed</h1>
        <IconButton
          icon={<Camera size={24} />}
          onClick={handleCreatePost}
          variant="ghost"
          size="md"
        />
      </div>
    </div>
  );
} 