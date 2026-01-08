import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Basic 3D Cereal Box Component
 * A simple box model that can be customized with colors and text
 */
export default function CerealBox({ 
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  color = '#F0544F',
  label = 'PROJECT',
  number = '01',
  isHovered = false,
  isSelected = false,
  onClick,
  ...props 
}) {
  const meshRef = useRef();
  const groupRef = useRef();

  // Animate on hover/selection
  useFrame((state) => {
    if (meshRef.current && groupRef.current) {
      // Gentle floating animation (only when not selected)
      if (!isSelected) {
        groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      } else {
        groupRef.current.position.y = position[1];
      }
      
      // Hover animation - slight rotation
      if (isHovered && !isSelected) {
        meshRef.current.rotation.y += 0.01;
        meshRef.current.scale.setScalar(scale * 1.1);
      } else if (isSelected) {
        // When selected, maintain scale but don't auto-rotate (user controls it)
        meshRef.current.scale.setScalar(scale * 1.2);
      } else {
        meshRef.current.rotation.y = rotation[1];
        meshRef.current.scale.setScalar(scale);
      }
    }
  });

  // Box dimensions (cereal box proportions)
  const width = 1.2;
  const height = 1.8;
  const depth = 0.4;

  return (
    <group ref={groupRef} position={position} {...props}>
      {/* Main box body */}
      <RoundedBox
        ref={meshRef}
        args={[width, height, depth]}
        radius={0.05}
        smoothness={4}
        onClick={(e) => {
          e.stopPropagation();
          if (onClick) {
            onClick(e);
          }
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
        }}
      >
        <meshStandardMaterial
          color={color}
          roughness={0.7}
          metalness={0.3}
        />
      </RoundedBox>

      {/* Front face label - using plane with texture for now */}
      <mesh position={[0, 0.3, depth / 2 + 0.01]}>
        <planeGeometry args={[width * 0.8, 0.3]} />
        <meshStandardMaterial color="#FFF5E0" />
      </mesh>
      
      {/* Simple text representation - will be replaced with proper text later */}
      {/* For now, we'll use colored planes to represent labels */}
      
      {/* Number badge */}
      <mesh position={[-width / 2 + 0.15, height / 2 - 0.15, depth / 2 + 0.01]}>
        <planeGeometry args={[0.2, 0.2]} />
        <meshStandardMaterial color="#FFF5E0" />
      </mesh>

      {/* Side panel (left) */}
      <Box
        args={[depth, height, width]}
        position={[-width / 2 - depth / 2, 0, 0]}
      >
        <meshStandardMaterial
          color={new THREE.Color(color).multiplyScalar(0.8)}
          roughness={0.7}
        />
      </Box>

      {/* Side panel (right) */}
      <Box
        args={[depth, height, width]}
        position={[width / 2 + depth / 2, 0, 0]}
      >
        <meshStandardMaterial
          color={new THREE.Color(color).multiplyScalar(0.8)}
          roughness={0.7}
        />
      </Box>

      {/* Top panel */}
      <Box
        args={[width, depth, depth]}
        position={[0, height / 2 + depth / 2, 0]}
      >
        <meshStandardMaterial
          color={new THREE.Color(color).multiplyScalar(0.9)}
          roughness={0.7}
        />
      </Box>

      {/* Bottom panel */}
      <Box
        args={[width, depth, depth]}
        position={[0, -height / 2 - depth / 2, 0]}
      >
        <meshStandardMaterial
          color={new THREE.Color(color).multiplyScalar(0.9)}
          roughness={0.7}
        />
      </Box>
    </group>
  );
}

