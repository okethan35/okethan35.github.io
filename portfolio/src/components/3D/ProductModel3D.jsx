import { useRef, useEffect, useMemo, Suspense, memo } from 'react';
import { useGLTF, Clone } from '@react-three/drei';
import { gsap } from 'gsap';
import * as THREE from 'three';

// Preload at module level
useGLTF.preload('/models/sample.glb');

/**
 * 3D Product Model Component
 */
const ModelContent = memo(function ModelContent({ modelPath, position, scale, rotationAngle = 0, immediate = false }) {
  const { scene } = useGLTF(modelPath);
  const groupRef = useRef();

  // Calculate center offset once when scene loads
  const centerOffset = useMemo(() => {
    if (!scene) return new THREE.Vector3();
    const box = new THREE.Box3().setFromObject(scene);
    return box.getCenter(new THREE.Vector3());
  }, [scene]);

  // Set initial rotation on mount
  useEffect(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.set(0, 0, 0);
  }, []);

  // Animate rotation in 3D space (Three.js rotation) with cleanup
  useEffect(() => {
    if (!groupRef.current || !scene) return;
    
    // Convert degrees to radians for Three.js
    const rotationRadians = (rotationAngle * Math.PI) / 180;
    
    if (immediate) {
      // Set immediately without animation
      groupRef.current.rotation.y = rotationRadians;
      return;
    }
    
    // Animate to rotation
    const tween = gsap.to(groupRef.current.rotation, {
      y: rotationRadians,
      duration: 0.6,
      ease: 'power2.inOut',
    });

    return () => tween.kill();
  }, [rotationAngle, immediate, scene]);

  if (!scene) {
    return null;
  }

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <Clone 
        object={scene} 
        position={[-centerOffset.x, -centerOffset.y, -centerOffset.z]}
      />
    </group>
  );
});

export default function ProductModel3D({ 
  modelPath, 
  position = [0, 0, 0],
  scale = 1,
  rotationAngle = 0,
  immediate = false
}) {
  return (
    <Suspense fallback={null}>
      <ModelContent 
        modelPath={modelPath}
        position={position}
        scale={scale}
        rotationAngle={rotationAngle}
        immediate={immediate}
      />
    </Suspense>
  );
}
