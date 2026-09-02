'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface GameImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  sizes?: string;
}

export function GameImage({
  src,
  alt,
  fill = true,
  priority = false,
  className = 'object-cover',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw',
}: GameImageProps) {
  const [imgSrc, setImgSrc] = useState(src || '/fallback-game.svg');
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#050811]">
      {/* Loading Skeleton Shimmer */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 animate-pulse z-0" />
      )}

      <Image
        src={imgSrc}
        alt={alt}
        fill={fill}
        priority={priority}
        sizes={sizes}
        className={`${className} transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImgSrc('/fallback-game.svg');
          setIsLoading(false);
        }}
      />
    </div>
  );
}