import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { CreatePostModal } from './CreatePostModal';

export const CreatePostButton = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-20 right-4 md:bottom-8 bg-red-500 text-white rounded-full p-4 shadow-lg hover:bg-red-600 transition-colors"
        aria-label="Create new post"
      >
        <Plus className="w-6 h-6" />
      </button>

      <CreatePostModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};