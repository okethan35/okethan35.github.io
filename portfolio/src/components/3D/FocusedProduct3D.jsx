import { Suspense, memo } from 'react';
import { Canvas } from '@react-three/fiber';
import ProductModel3D from './ProductModel3D';
import { useGLTF } from '@react-three/drei';

// Preload model at module level
useGLTF.preload('/models/sample.glb');

/**
 * 3D Canvas wrapper for focused product view
 * Optimized with demand rendering and reduced overdraw
 */
const FocusedProduct3D = memo(function FocusedProduct3D({ product, rotationAngle = 0, immediate = false }) {
  if (!product.modelPath) {
    return null;
  }

  const modelScale = product.modelScale !== undefined ? product.modelScale : 1.5;

  return (
    <div 
      style={{ 
        width: '400px', 
        height: '500px',
        position: 'relative',
        overflow: 'visible',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 2]} // Limit pixel ratio
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
        }}
        style={{ 
          width: '100%',
          height: '100%',
          overflow: 'visible',
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('#000000', 0);
        }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-5, 3, -5]} intensity={0.5} />
        
        <Suspense fallback={null}>
          <ProductModel3D
            modelPath={product.modelPath}
            scale={modelScale}
            rotationAngle={rotationAngle}
            immediate={immediate}
          />
        </Suspense>
      </Canvas>
    </div>
  );
});

export default FocusedProduct3D;
