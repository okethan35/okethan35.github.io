import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import CerealBox from './CerealBox';
import SceneLights from './SceneLights';
import { canHandle3D } from '../../utils/deviceDetection';

/**
 * 3D Product Showcase Scene
 * Displays projects as 3D cereal boxes in a grid layout
 */
export default function ProductShowcase({ 
  projects = [],
  onProjectClick,
  accentColor = '#F0544F'
}) {
  const [hoveredProject, setHoveredProject] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  // Fallback to 2D if device can't handle 3D
  if (!canHandle3D()) {
    return (
      <div className="p-8 text-center text-cereal-brown">
        <p>3D view not available on this device</p>
        {/* Fallback 2D grid would go here */}
      </div>
    );
  }

  // Calculate grid layout
  const gridCols = Math.ceil(Math.sqrt(projects.length));
  const spacing = 2.5;
  const startX = -(gridCols - 1) * spacing / 2;
  const startZ = -(gridCols - 1) * spacing / 2;

  const handleProjectClick = (project, index) => {
    setSelectedProject(selectedProject === index ? null : index);
    if (onProjectClick) {
      onProjectClick(project, index);
    }
  };

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden border-2 border-cereal-brown">
      <Canvas
        shadows
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]} // Device pixel ratio for performance
        camera={{ position: [0, 3, 8], fov: 50 }}
      >
        <Suspense fallback={null}>

          {/* Lighting */}
          <SceneLights showControls={false} />

          {/* Grid of cereal boxes */}
          {projects.map((project, index) => {
            const row = Math.floor(index / gridCols);
            const col = index % gridCols;
            const x = startX + col * spacing;
            const z = startZ + row * spacing;

            return (
              <CerealBox
                key={project.id || index}
                position={[x, 0, z]}
                rotation={[0, Math.PI / 6, 0]} // Slight rotation for visual interest
                scale={1}
                color={project.accentColor || accentColor}
                label={project.title || `Project ${index + 1}`}
                number={String(index + 1).padStart(2, '0')}
                isHovered={hoveredProject === index}
                isSelected={selectedProject === index}
                onClick={() => handleProjectClick(project, index)}
                onPointerOver={() => setHoveredProject(index)}
                onPointerOut={() => setHoveredProject(null)}
              />
            );
          })}

          {/* Ground plane for shadows */}
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -1, 0]}
            receiveShadow
          >
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="#FFF5E0" />
          </mesh>
        </Suspense>
      </Canvas>
    </div>
  );
}

