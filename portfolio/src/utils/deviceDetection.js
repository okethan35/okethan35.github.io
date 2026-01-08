/**
 * Device detection utility for 3D performance optimization
 * Determines if device can handle 3D rendering smoothly
 */

export function canHandle3D() {
  // Check for WebGL support (required for Three.js)
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  
  if (!gl) {
    return false; // No WebGL support
  }

  // Check if mobile device (generally less powerful)
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  // Check for low-end device indicators
  const isLowEnd = 
    navigator.hardwareConcurrency < 4 || // Less than 4 CPU cores
    (navigator.deviceMemory && navigator.deviceMemory < 4); // Less than 4GB RAM

  // Allow 3D on desktop or high-end mobile
  return !isMobile || !isLowEnd;
}

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function getDeviceType() {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  
  if (isMobile) {
    return 'mobile';
  }
  
  const isTablet = /iPad|Android/i.test(navigator.userAgent) && window.innerWidth >= 768;
  if (isTablet) {
    return 'tablet';
  }
  
  return 'desktop';
}

