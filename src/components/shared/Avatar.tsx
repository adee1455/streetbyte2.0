import React from 'react';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  hasStory?: boolean;
  seen?: boolean;
  onClick?: () => void;
}

const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt, 
  size = 'md', 
  hasStory = false,
  seen = false,
  onClick
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };
  
  const borderSize = {
    sm: 'p-[2px]',
    md: 'p-[2px]',
    lg: 'p-[3px]'
  };
  
  return (
    <div 
      className={`relative rounded-full ${hasStory ? borderSize[size] : ''} ${
        hasStory 
          ? seen 
            ? 'bg-gray-300' 
            : 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500' 
          : ''
      }`}
      onClick={onClick}
    >
      <img
        src={src}
        alt={alt}
        className={`${sizeClasses[size]} rounded-full object-cover ${onClick ? 'cursor-pointer' : ''}`}
      />
    </div>
  );
};

export default Avatar;