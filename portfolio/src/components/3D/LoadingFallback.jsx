/**
 * Loading fallback for 3D components
 * Shows while 3D assets are loading
 */
export default function LoadingFallback() {
  return (
    <div className="w-full h-[600px] flex items-center justify-center bg-cereal-cream rounded-lg border-2 border-cereal-brown">
      <div className="text-center">
        <div className="inline-block w-12 h-12 border-4 border-cereal-brown border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-cereal-brown font-semibold">Loading 3D showcase...</p>
      </div>
    </div>
  );
}

