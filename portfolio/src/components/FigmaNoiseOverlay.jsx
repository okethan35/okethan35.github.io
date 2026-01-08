import { memo, useMemo, useEffect, useRef } from 'react';

/**
 * Optimized noise overlay using CSS instead of expensive SVG feTurbulence
 * Uses a small pre-generated noise pattern that tiles efficiently
 */
export const FigmaNoiseOverlay = memo(function FigmaNoiseOverlay() {
  // Generate noise pattern once using canvas - much more performant than SVG filter
  const noiseDataUrl = useMemo(() => {
    // Check if we're in browser environment
    if (typeof document === 'undefined') return '';
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    
    // Small tile size for good performance while maintaining noise quality
    const size = 128;
    canvas.width = size;
    canvas.height = size;
    
    const imageData = ctx.createImageData(size, size);
    const data = imageData.data;
    
    // Generate grayscale noise
    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random() * 255;
      data[i] = noise;     // R
      data[i + 1] = noise; // G
      data[i + 2] = noise; // B
      data[i + 3] = 25;    // A - low opacity for subtle effect
    }
    
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL('image/png');
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10"
      aria-hidden="true"
      style={{
        backgroundImage: noiseDataUrl ? `url(${noiseDataUrl})` : 'none',
        backgroundRepeat: 'repeat',
        opacity: 0.4,
        mixBlendMode: 'overlay',
      }}
    />
  );
});
