import React, { useState, useRef, useEffect } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

export default function HomeHeroIllustration() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Reset error state when reduced motion preference changes
  useEffect(() => {
    setVideoError(false);
  }, [prefersReducedMotion]);

  // Ensure video plays when it's loaded
  useEffect(() => {
    if (videoRef.current && !prefersReducedMotion && !videoError) {
      videoRef.current.play().catch(() => {
        setVideoError(true);
      });
    }
  }, [prefersReducedMotion, videoError]);

  const handleVideoError = () => {
    setVideoError(true);
  };

  return (
    <div className="absolute inset-0">
      {/* Video background or static fallback */}
      {!prefersReducedMotion && !videoError ? (
        <video
          ref={videoRef}
          src="/assets/generated/hero-video-farm.dim_2400x1200.mp4"
          className="w-full h-full object-cover object-center"
          autoPlay
          loop
          muted
          playsInline
          onError={handleVideoError}
          poster="/assets/generated/hero-photo-real-farm.dim_2400x1200.jpg"
        />
      ) : (
        <img
          src="/assets/generated/hero-photo-real-farm.dim_2400x1200.jpg"
          alt="Real agricultural farm landscape with green crop fields under clear sky"
          className="w-full h-full object-cover object-center"
        />
      )}
      
      {/* Gradient overlay for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/95 to-background/70" />
    </div>
  );
}
