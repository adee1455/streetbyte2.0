import React from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  hasStory?: boolean;
  seen?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
};

export default function Avatar({ 
  src, 
  alt, 
  size = 'md',
  hasStory = false,
  seen = false,
  className 
}: AvatarProps) {
  return (
    <div className={cn(
      'relative rounded-full overflow-hidden',
      sizeClasses[size],
      hasStory && !seen && 'ring-2 ring-[#EF4443]',
      hasStory && seen && 'ring-2 ring-gray-300',
      className
    )}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </div>
  );
} 