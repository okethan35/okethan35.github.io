import { useRef, useEffect, useMemo, Suspense, memo } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Clone } from '@react-three/drei';
import { gsap } from 'gsap';
import * as THREE from 'three';

// Preload model at module level for instant access
useGLTF.preload('/models/sample.glb');

/**
 * 3D Model for shelf display
 */
const ShelfModelContent = memo(function ShelfModelContent({ modelPath, isHovered }) {
  const { scene } = useGLTF(modelPath);
  const groupRef = useRef();
  
  // Calculate center offset once when scene loads
  const centerOffset = useMemo(() => {
    if (!scene) return new THREE.Vector3();
    const box = new THREE.Box3().setFromObject(scene);
    return box.getCenter(new THREE.Vector3());
  }, [scene]);

  // Set initial state on mount (no animation)
  useEffect(() => {
    if (!groupRef.current) return;
    // Ensure scale and position start at defaults
    groupRef.current.scale.set(1, 1, 1);
    groupRef.current.position.set(0, 0, 0);
  }, []);

  // Hover animation with proper cleanup
  useEffect(() => {
    if (!groupRef.current) return;
    
    const positionTween = isHovered
      ? gsap.to(groupRef.current.position, { y: 0.15, duration: 0.3, ease: 'power2.out' })
      : gsap.to(groupRef.current.position, { y: 0, duration: 0.3, ease: 'power2.out' });
    
    const scaleTween = isHovered
      ? gsap.to(groupRef.current.scale, { x: 1.15, y: 1.15, z: 1.15, duration: 0.3, ease: 'power2.out' })
      : gsap.to(groupRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.3, ease: 'power2.out' });

    // Cleanup: kill tweens on unmount or before next run
    return () => {
      positionTween.kill();
      scaleTween.kill();
    };
  }, [isHovered]);

  if (!scene) {
    return null;
  }

  return (
    <group ref={groupRef}>
      {/* Use Clone from drei for proper instancing, center with offset */}
      <Clone 
        object={scene} 
        position={[-centerOffset.x, -centerOffset.y, -centerOffset.z]}
      />
    </group>
  );
});

const ShelfProduct3D = memo(function ShelfProduct3D({ product, isHovered }) {
  if (!product.modelPath) {
    return null;
  }

  // Calculate scale to match focused view apparent size
  const focusedScale = product.modelScale !== undefined ? product.modelScale : 1.5;
  const shelfScale = focusedScale * (400 / 5) * (3 / 180);

  return (
    <div 
      style={{ 
        width: '180px', 
        height: '220px',
        overflow: 'visible',
        position: 'relative',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        dpr={1} // Fixed DPR for consistency
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: true,
        }}
        style={{ 
          width: '180px', 
          height: '220px',
        }}
        resize={{ scroll: false, debounce: { scroll: 0, resize: 0 } }}
        onCreated={({ gl }) => {
          gl.setClearColor('#000000', 0);
          // Force proper viewport size
          gl.setSize(180, 220);
        }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-5, 3, -5]} intensity={0.4} />
        
        <Suspense fallback={null}>
          <group scale={shelfScale}>
            <ShelfModelContent modelPath={product.modelPath} isHovered={isHovered} />
          </group>
        </Suspense>
      </Canvas>
    </div>
  );
});

export default ShelfProduct3D;

