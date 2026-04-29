import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({ 
  src, 
  alt, 
  className, 
  fallbackSrc = "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200", 
  ...props 
}) => {
  const [error, setError] = useState(false);
  const [triedFallback, setTriedFallback] = useState(false);

  const handleError = () => {
    if (!triedFallback && fallbackSrc) {
      setTriedFallback(true);
    } else {
      setError(true);
    }
  };

  if (error || !src) {
    return (
      <div className={`flex items-center justify-center bg-muted/30 border border-border/50 ${className}`}>
        <div className="text-center p-4">
          <ImageOff className="mx-auto h-8 w-8 text-muted-foreground/30 mb-2" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/20 italic">Visual unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={triedFallback ? fallbackSrc : src}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
      referrerPolicy="no-referrer"
      {...props}
    />
  );
};
