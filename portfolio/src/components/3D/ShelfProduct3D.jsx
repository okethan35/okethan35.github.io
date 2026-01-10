import { useRef, useEffect, useMemo, Suspense, memo } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Clone, Environment } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { gsap } from 'gsap';
import * as THREE from 'three';

/**
 * Hook to improve texture quality with anisotropic filtering
 * Applies to all textures in the scene for crisp text and details
 */
function useImproveTextures(scene, anisotropyLevel = 8) {
  const { gl } = useThree();

  useEffect(() => {
    if (!scene) return;
    
    const max = gl.capabilities.getMaxAnisotropy();
    const anisotropy = Math.min(anisotropyLevel, max);
    
    scene.traverse((o) => {
      if (!o.isMesh) return;
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      mats.forEach((m) => {
        [
          m.map,
          m.normalMap,
          m.roughnessMap,
          m.metalnessMap,
          m.aoMap,
          m.emissiveMap,
        ].forEach((tex) => {
          if (!tex) return;
          tex.anisotropy = anisotropy;
          tex.needsUpdate = true;
        });
      });
    });
  }, [scene, gl, anisotropyLevel]);
}

// Preload model at module level for instant access
useGLTF.preload('/models/sample.glb');

/**
 * 3D Model for shelf display
 */
const ShelfModelContent = memo(function ShelfModelContent({ modelPath, isHovered, modelRotation = [0, 0, 0] }) {
  const { scene } = useGLTF(modelPath);
  const groupRef = useRef();
  
  // Apply anisotropic filtering (8 for shelf view - good balance of quality/performance)
  useImproveTextures(scene, 8);
  
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
    // Apply modelRotation offset
    groupRef.current.rotation.set(
      (modelRotation[0] * Math.PI) / 180,
      (modelRotation[1] * Math.PI) / 180,
      (modelRotation[2] * Math.PI) / 180
    );
  }, [modelRotation]);

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
        dpr={[1, 2]} // Renders at DPR up to 2 on retina displays
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
          // Debug: log actual DPR and canvas size
          // console.log("Shelf dpr", gl.getPixelRatio(), "size", gl.domElement.width, gl.domElement.height);
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
          <group scale={shelfScale}>
            <ShelfModelContent 
              modelPath={product.modelPath} 
              isHovered={isHovered}
              modelRotation={product.modelRotation || [0, 0, 0]}
            />
          </group>
        </Suspense>
      </Canvas>
    </div>
  );
});

export default ShelfProduct3D;

