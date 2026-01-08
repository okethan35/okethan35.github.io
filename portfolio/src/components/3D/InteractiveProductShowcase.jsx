import { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { gsap } from 'gsap';
import CerealBox from './CerealBox';
import SceneLights from './SceneLights';
import { canHandle3D } from '../../utils/deviceDetection';

/**
 * Camera controller that smoothly transitions when focusing on a model
 */
function CameraController({ focusedIndex, gridCols, spacing, startX, startZ }) {
  const { camera } = useThree();
  const controlsRef = useRef();
  const animationRef = useRef(null);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    // Kill any existing animations
    if (animationRef.current) {
      animationRef.current.kill();
      animationRef.current = null;
    }

    // Don't animate if already animating or controls not ready
    if (isAnimatingRef.current || !controlsRef.current) {
      return;
    }

    isAnimatingRef.current = true;

    const setupAnimation = () => {
      if (!controlsRef.current) {
        isAnimatingRef.current = false;
        return;
      }

      if (focusedIndex !== null) {
        // Calculate focused model position
        const row = Math.floor(focusedIndex / gridCols);
        const col = focusedIndex % gridCols;
        const targetX = startX + col * spacing;
        const targetZ = startZ + row * spacing;

        // Disable controls during animation
        controlsRef.current.enabled = false;

        // Animate camera position
        const cameraStart = {
          x: camera.position.x,
          y: camera.position.y,
          z: camera.position.z,
        };

        const cameraEnd = {
          x: targetX,
          y: 2,
          z: targetZ + 4,
        };

        // Animate controls target
        const targetStart = {
          x: controlsRef.current.target.x,
          y: controlsRef.current.target.y,
          z: controlsRef.current.target.z,
        };

        const targetEnd = {
          x: targetX,
          y: 0,
          z: targetZ,
        };

        animationRef.current = gsap.to({ progress: 0 }, {
          progress: 1,
          duration: 1,
          ease: 'power2.inOut',
          onUpdate: function() {
            const t = this.progress;
            // Interpolate camera position
            camera.position.x = cameraStart.x + (cameraEnd.x - cameraStart.x) * t;
            camera.position.y = cameraStart.y + (cameraEnd.y - cameraStart.y) * t;
            camera.position.z = cameraStart.z + (cameraEnd.z - cameraStart.z) * t;

            // Interpolate controls target
            if (controlsRef.current) {
              controlsRef.current.target.x = targetStart.x + (targetEnd.x - targetStart.x) * t;
              controlsRef.current.target.y = targetStart.y + (targetEnd.y - targetStart.y) * t;
              controlsRef.current.target.z = targetStart.z + (targetEnd.z - targetStart.z) * t;
              controlsRef.current.update();
            }
          },
          onComplete: () => {
            // Re-enable controls after animation
            if (controlsRef.current) {
              controlsRef.current.enabled = true;
            }
            isAnimatingRef.current = false;
          },
        });
      } else {
        // Return to overview position
        controlsRef.current.enabled = false;

        const cameraStart = {
          x: camera.position.x,
          y: camera.position.y,
          z: camera.position.z,
        };

        const cameraEnd = { x: 0, y: 3, z: 8 };

        const targetStart = {
          x: controlsRef.current.target.x,
          y: controlsRef.current.target.y,
          z: controlsRef.current.target.z,
        };

        const targetEnd = { x: 0, y: 0, z: 0 };

        animationRef.current = gsap.to({ progress: 0 }, {
          progress: 1,
          duration: 1,
          ease: 'power2.inOut',
          onUpdate: function() {
            const t = this.progress;
            camera.position.x = cameraStart.x + (cameraEnd.x - cameraStart.x) * t;
            camera.position.y = cameraStart.y + (cameraEnd.y - cameraStart.y) * t;
            camera.position.z = cameraStart.z + (cameraEnd.z - cameraStart.z) * t;

            if (controlsRef.current) {
              controlsRef.current.target.x = targetStart.x + (targetEnd.x - targetStart.x) * t;
              controlsRef.current.target.y = targetStart.y + (targetEnd.y - targetStart.y) * t;
              controlsRef.current.target.z = targetStart.z + (targetEnd.z - targetStart.z) * t;
              controlsRef.current.update();
            }
          },
          onComplete: () => {
            if (controlsRef.current) {
              controlsRef.current.enabled = true;
            }
            isAnimatingRef.current = false;
          },
        });
      }
    };

    // Small delay to ensure controls are mounted
    const timeoutId = setTimeout(setupAnimation, 50);

    return () => {
      clearTimeout(timeoutId);
      if (animationRef.current) {
        animationRef.current.kill();
        animationRef.current = null;
      }
      isAnimatingRef.current = false;
    };
  }, [focusedIndex, camera, gridCols, spacing, startX, startZ]);

  return (
    <OrbitControls
      ref={controlsRef}
      enabled={focusedIndex !== null}
      enablePan={focusedIndex !== null}
      enableZoom={focusedIndex !== null}
      enableRotate={focusedIndex !== null}
      minDistance={3}
      maxDistance={10}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 2}
    />
  );
}

/**
 * Enhanced 3D Product Showcase with Interactive Rotation
 * Click a box to focus and rotate it, click outside to return to overview
 */
export default function InteractiveProductShowcase({ 
  projects = [],
  onProjectClick,
  accentColor = '#F0544F'
}) {
  const [hoveredProject, setHoveredProject] = useState(null);
  const [focusedProject, setFocusedProject] = useState(null);
  const [error, setError] = useState(null);

  // Fallback to 2D if device can't handle 3D
  if (!canHandle3D()) {
    return (
      <div className="p-8 text-center text-cereal-brown">
        <p>3D view not available on this device</p>
        {/* Fallback 2D grid would go here */}
      </div>
    );
  }

  // Error boundary
  if (error) {
    return (
      <div className="p-8 text-center text-cereal-brown">
        <p className="text-red-600">Error loading 3D showcase: {error.message}</p>
        <button 
          onClick={() => setError(null)}
          className="mt-4 px-4 py-2 bg-cereal-red text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  // Calculate grid layout
  const gridCols = Math.ceil(Math.sqrt(projects.length));
  const spacing = 2.5;
  const startX = -(gridCols - 1) * spacing / 2;
  const startZ = -(gridCols - 1) * spacing / 2;

  const handleProjectClick = (project, index, event) => {
    try {
      if (event) {
        event.stopPropagation();
      }
      
      if (focusedProject === index) {
        // Clicking the focused model again deselects it
        setFocusedProject(null);
      } else {
        // Focus on this model
        setFocusedProject(index);
        if (onProjectClick) {
          onProjectClick(project, index);
        }
      }
    } catch (err) {
      console.error('Error handling project click:', err);
      setError(err);
    }
  };

  const handleBackgroundClick = () => {
    try {
      setFocusedProject(null);
    } catch (err) {
      console.error('Error handling background click:', err);
      setError(err);
    }
  };

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden border-2 border-cereal-brown relative">
      {/* Instructions overlay */}
      {focusedProject === null ? (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-cereal-cream/90 px-4 py-2 rounded-lg border-2 border-cereal-brown shadow-lg pointer-events-none">
          <p className="text-xs sm:text-sm text-cereal-brown font-semibold">
            Click a box to rotate and examine
          </p>
        </div>
      ) : (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-cereal-cream/90 px-4 py-2 rounded-lg border-2 border-cereal-brown shadow-lg pointer-events-none">
          <p className="text-xs sm:text-sm text-cereal-brown font-semibold">
            Drag to rotate • Scroll to zoom • Click outside to return
          </p>
        </div>
      )}

      <Canvas
        shadows
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        onPointerMissed={handleBackgroundClick}
        onCreated={(state) => {
          // Ensure camera is set up correctly
          state.camera.position.set(0, 3, 8);
          state.camera.lookAt(0, 0, 0);
        }}
      >
        <Suspense fallback={null}>
          {/* Camera and controls */}
          <CameraController
            focusedIndex={focusedProject}
            gridCols={gridCols}
            spacing={spacing}
            startX={startX}
            startZ={startZ}
          />

          {/* Lighting */}
          <SceneLights showControls={false} />

          {/* Grid of cereal boxes */}
          {projects.map((project, index) => {
            const row = Math.floor(index / gridCols);
            const col = index % gridCols;
            const x = startX + col * spacing;
            const z = startZ + row * spacing;
            const isFocused = focusedProject === index;
            const isHovered = hoveredProject === index;

            return (
              <CerealBox
                key={project.id || index}
                position={[x, 0, z]}
                rotation={[0, Math.PI / 6, 0]}
                scale={isFocused ? 1.2 : 1}
                color={project.accentColor || accentColor}
                label={project.title || `Project ${index + 1}`}
                number={String(index + 1).padStart(2, '0')}
                isHovered={isHovered && !isFocused}
                isSelected={isFocused}
                onClick={(e) => {
                  e.stopPropagation();
                  handleProjectClick(project, index, e);
                }}
                onPointerOver={(e) => {
                  e.stopPropagation();
                  setHoveredProject(index);
                }}
                onPointerOut={() => setHoveredProject(null)}
              />
            );
          })}

          {/* Ground plane for shadows */}
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -1, 0]}
            receiveShadow
            onPointerDown={(e) => {
              // Only deselect if clicking directly on the ground (not through a box)
              if (e.object === e.target) {
                handleBackgroundClick();
              }
            }}
          >
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="#FFF5E0" />
          </mesh>
        </Suspense>
      </Canvas>
    </div>
  );
}
