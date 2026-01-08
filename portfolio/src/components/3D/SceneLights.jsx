import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';

/**
 * Lighting setup for 3D scenes
 * Provides ambient and directional lighting for cereal boxes
 */
export default function SceneLights({ showControls = false }) {
  const lightRef = useRef();

  // Subtle light animation
  useFrame((state) => {
    if (lightRef.current) {
      lightRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.5) * 2;
      lightRef.current.position.z = Math.cos(state.clock.elapsedTime * 0.5) * 2;
    }
  });

  return (
    <>
      {/* Ambient light - soft overall illumination */}
      <ambientLight intensity={0.6} />
      
      {/* Main directional light - simulates sunlight */}
      <directionalLight
        ref={lightRef}
        position={[5, 5, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Fill light - reduces harsh shadows */}
      <directionalLight
        position={[-5, 3, -5]}
        intensity={0.3}
      />
      
      {/* Point light - adds depth */}
      <pointLight
        position={[0, 5, 0]}
        intensity={0.5}
        distance={10}
      />

      {/* Environment for realistic reflections */}
      <Environment preset="sunset" />

      {/* Optional orbit controls for camera */}
      {showControls && (
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={15}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
        />
      )}
    </>
  );
}

