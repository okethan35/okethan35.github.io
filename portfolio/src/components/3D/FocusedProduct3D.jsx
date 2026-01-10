import { Suspense, memo } from 'react';
import { Canvas } from '@react-three/fiber';
import ProductModel3D from './ProductModel3D';
import { useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';

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

  // Reduce scale by half to compensate for doubled canvas size (400->800, 500->1000)
  const baseScale = product.modelScale !== undefined ? product.modelScale : 1.5;
  const modelScale = baseScale * 0.5;

  return (
    <div 
      style={{ 
        width: '800px', // Even higher resolution for maximum quality
        height: '1000px', // Even higher resolution for maximum quality
        position: 'relative',
        overflow: 'visible',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={3} // Fixed DPR of 3 for maximum quality (even sharper than 2x)
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          precision: 'highp', // High precision for better quality
          toneMappingExposure: 1.0, // Reduced to prevent color washing
          logarithmicDepthBuffer: true, // Better depth precision
          preserveDrawingBuffer: true, // Preserve for screenshots/quality
        }}
        style={{ 
          width: '100%',
          height: '100%',
          overflow: 'visible',
        }}
        onCreated={({ gl, scene, camera }) => {
          gl.setClearColor('#000000', 0);
          // DPR is now fixed at 3 via Canvas prop for maximum quality
          // Debug: log actual DPR and canvas size
          // console.log("Focused dpr", gl.getPixelRatio(), "size", gl.domElement.width, gl.domElement.height);
          // Enable better rendering quality
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
          gl.shadowMap.autoUpdate = true;
          // Better color output
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.0; // Reduced to prevent color washing
          // Maximum quality settings
          gl.antialias = true;
          gl.preserveDrawingBuffer = true;
          // Additional quality improvements
          gl.sortObjects = true; // Proper depth sorting
          gl.physicallyCorrectLights = false; // Keep false for artistic control
        }}
      >
        {/* Ambient light - minimal to preserve colors */}
        <ambientLight intensity={0.2} />
        
        {/* Main directional light - reduced to prevent washing */}
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        
        {/* Fill light - minimal to preserve shadow depth */}
        <directionalLight position={[-5, 3, -5]} intensity={0.15} />
        
        {/* Top light - very minimal */}
        <directionalLight position={[0, 8, 0]} intensity={0.08} />
        
        {/* Point light - minimal */}
        <pointLight position={[3, 3, 3]} intensity={0.03} distance={10} />
        
        {/* Environment - reduced intensity to prevent color washing */}
        <Environment preset="sunset" />
        
        <Suspense fallback={null}>
          <ProductModel3D
            modelPath={product.modelPath}
            scale={modelScale}
            rotationAngle={rotationAngle}
            immediate={immediate}
            modelRotation={product.modelRotation || [0, 0, 0]}
            anisotropy={16} // Higher anisotropy for focused view (crisp text)
          />
        </Suspense>
      </Canvas>
    </div>
  );
});

export default FocusedProduct3D;
