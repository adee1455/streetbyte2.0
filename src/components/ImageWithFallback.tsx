import React, { useState } from 'react';
import Image from 'next/image';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
}) => {
  const [imgSrc, setImgSrc] = useState<string>(() => {
    // Handle relative URLs
    if (src.startsWith('/')) {
      return src;
    }
    // Handle absolute URLs
    try {
      new URL(src);
      return src;
    } catch {
      // If URL is invalid, return fallback
      return '/imageError.png';
    }
  });

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      onError={() => setImgSrc('/imageError.png')}
      unoptimized={false}
    />
  );
};

export default ImageWithFallback; 