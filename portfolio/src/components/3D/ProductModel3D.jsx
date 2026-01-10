import { useRef, useEffect, useMemo, Suspense, memo } from 'react';
import { useGLTF, Clone } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { gsap } from 'gsap';
import * as THREE from 'three';

/**
 * Hook to improve texture quality with anisotropic filtering
 * Applies to all textures in the scene for crisp text and details
 */
function useImproveTextures(scene, anisotropyLevel = 16) {
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
          // Apply anisotropic filtering
          tex.anisotropy = anisotropy;
          // Use better texture filtering for sharper results
          tex.minFilter = THREE.LinearMipmapLinearFilter;
          tex.magFilter = THREE.LinearFilter;
          // Generate mipmaps if not already present
          if (tex.generateMipmaps !== false) {
            tex.generateMipmaps = true;
          }
          tex.needsUpdate = true;
        });
      });
    });
  }, [scene, gl, anisotropyLevel]);
}

// Preload at module level
useGLTF.preload('/models/sample.glb');

/**
 * 3D Product Model Component
 */
const ModelContent = memo(function ModelContent({ modelPath, position, scale, rotationAngle = 0, immediate = false, modelRotation = [0, 0, 0], anisotropy = 16 }) {
  const { scene } = useGLTF(modelPath);
  const groupRef = useRef();
  
  // Apply anisotropic filtering to improve texture quality
  useImproveTextures(scene, anisotropy);

  // Calculate center offset once when scene loads
  const centerOffset = useMemo(() => {
    if (!scene) return new THREE.Vector3();
    const box = new THREE.Box3().setFromObject(scene);
    return box.getCenter(new THREE.Vector3());
  }, [scene]);

  // Set initial rotation on mount (including modelRotation offset)
  useEffect(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.set(
      (modelRotation[0] * Math.PI) / 180,
      (modelRotation[1] * Math.PI) / 180,
      (modelRotation[2] * Math.PI) / 180
    );
  }, [modelRotation]);

  // Animate rotation in 3D space (Three.js rotation) with cleanup
  useEffect(() => {
    if (!groupRef.current || !scene) return;
    
    // Convert degrees to radians for Three.js, add modelRotation offset
    const baseRotationY = (modelRotation[1] * Math.PI) / 180;
    const rotationRadians = (rotationAngle * Math.PI) / 180;
    const targetY = baseRotationY + rotationRadians;
    
    if (immediate) {
      // Set immediately without animation
      groupRef.current.rotation.y = targetY;
      return;
    }
    
    // Animate to rotation
    const tween = gsap.to(groupRef.current.rotation, {
      y: targetY,
      duration: 0.6,
      ease: 'power2.inOut',
    });

    return () => tween.kill();
  }, [rotationAngle, immediate, scene, modelRotation]);

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
  immediate = false,
  modelRotation = [0, 0, 0], // [x, y, z] rotation in degrees to fix backwards models
  anisotropy = 16 // Anisotropic filtering level (16 for focused, 8 for shelf)
}) {
  return (
    <Suspense fallback={null}>
      <ModelContent 
        modelPath={modelPath}
        position={position}
        scale={scale}
        rotationAngle={rotationAngle}
        immediate={immediate}
        modelRotation={modelRotation}
        anisotropy={anisotropy}
      />
    </Suspense>
  );
}
