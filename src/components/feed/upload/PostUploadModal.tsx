import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Image, Camera } from 'lucide-react';
import { useStore } from '@/store/useStore';
import IconButton from '@/components/shared/IconButton';
import Button from '@/components/shared/Button';
import Avatar from '@/components/shared/Avatar';

const PostUploadModal: React.FC = () => {
  const { isPostUploadModalOpen, closePostUploadModal, addNewPost, currentUser } = useStore();
  const [content, setContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Limit to 4 images
    const filesToProcess = acceptedFiles.slice(0, 4 - mediaFiles.length);
    
    filesToProcess.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setMediaFiles(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  }, [mediaFiles]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    maxFiles: 4,
    maxSize: 5 * 1024 * 1024, // 5MB
  });
  
  const removeMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleSubmit = async () => {
    if (content.trim() || mediaFiles.length > 0) {
      setIsUploading(true);
      
      try {
        // In a real app, you would upload to S3 here
        // For now, we'll just use the data URLs
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate upload delay
        
        addNewPost(content, mediaFiles);
        closePostUploadModal();
        setContent('');
        setMediaFiles([]);
      } catch (error) {
        console.error('Error creating post:', error);
      } finally {
        setIsUploading(false);
      }
    }
  };
  
  if (!isPostUploadModalOpen) return null;
  
  return (
    <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Create Post</h2>
          <IconButton
            icon={<X size={24} />}
            onClick={closePostUploadModal}
          />
        </div>
        
        {/* User info */}
        <div className="p-4 flex items-center space-x-3">
          <Avatar 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            size="md" 
          />
          <div>
            <p className="font-semibold">{currentUser.username}</p>
          </div>
        </div>
        
        {/* Content input */}
        <div className="px-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full border-none focus:outline-none resize-none"
            rows={4}
          />
        </div>
        
        {/* Media preview */}
        {mediaFiles.length > 0 && (
          <div className="p-4">
            <div className={`grid ${
              mediaFiles.length === 1 ? 'grid-cols-1' : 
              mediaFiles.length === 2 ? 'grid-cols-2' : 
              'grid-cols-2'
            } gap-2`}>
              {mediaFiles.map((file, index) => (
                <div key={index} className="relative">
                  <img 
                    src={file} 
                    alt={`Upload ${index + 1}`} 
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <button
                    className="absolute top-2 right-2 bg-black/50 rounded-full p-1"
                    onClick={() => removeMedia(index)}
                  >
                    <X size={16} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Media upload */}
        {mediaFiles.length < 4 && (
          <div className="p-4">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
                isDragActive ? 'border-[#EF4443] bg-red-50' : 'border-gray-300 hover:border-[#EF4443]'
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center">
                {isDragActive ? (
                  <>
                    <Camera size={48} className="text-[#EF4443] mb-2" />
                    <p className="text-[#EF4443]">Drop your photos here</p>
                  </>
                ) : (
                  <>
                    <Image size={48} className="text-gray-400 mb-2" />
                    <p className="text-gray-500">Drag photos here or click to upload</p>
                    <p className="text-gray-400 text-sm mt-1">Up to 4 photos, 5MB each</p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Submit button */}
        <div className="p-4 border-t">
          <Button
            onClick={handleSubmit}
            disabled={isUploading || (content.trim() === '' && mediaFiles.length === 0)}
            variant="primary"
            fullWidth
          >
            {isUploading ? 'Posting...' : 'Post'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostUploadModal; 