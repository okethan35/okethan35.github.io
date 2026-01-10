import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { gsap } from 'gsap';
import FocusedProduct3D from './3D/FocusedProduct3D';
import ShelfProduct3D from './3D/ShelfProduct3D';

/**
 * 3D Grocery Store Experience
 * Full 3D store with floating nav, camera transitions, and item focus
 */

const AISLES = [
  {
    id: 'featured',
    label: 'FEATURED',
    number: '01',
    color: '#F0544F',
    products: [
      {
        id: 'project-1',
        title: 'FEATURED PROJECT',
        subtitle: 'My Flagship Work',
        color: '#F0544F',
        description: 'This is a detailed description of my featured project. It showcases my skills in full-stack development, problem-solving, and creating user-friendly applications.',
        tech: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'],
        shelfPosition: { row: 0, col: 0 },
        modelPath: '/models/ethan_cereal_box.glb',
        modelScale: 0.04, // Optional: Custom scale (default: 1.5)
        modelRotation: [0, 180, 0], // Optional: [x, y, z] rotation in degrees to fix backwards models (180° on Y axis flips it)
        useModal: true, // Uncomment to use modal view (left item + right modal) instead of centered view
      },
      {
        id: 'project-2',
        title: 'SKILLS SHOWCASE',
        subtitle: 'Technical Expertise',
        color: '#1FA9A4',
        description: 'A comprehensive display of my technical skills and experience across various technologies and frameworks.',
        tech: ['JavaScript', 'TypeScript', 'Python', 'React'],
        shelfPosition: { row: 0, col: 1 },
        modelPath: '/models/ethan_cereal_box.glb',
        modelScale: 0.04,
        modelRotation: [0, 180, 0], // Optional: [x, y, z] rotation in degrees to fix backwards models
      },
      {
        id: 'project-3',
        title: 'INGREDIENTS',
        subtitle: 'Skill Breakdown',
        color: '#F4C542',
        description: 'Detailed breakdown of my skills, experience levels, and what I\'m currently learning and improving.',
        tech: ['Frontend', 'Backend', 'ML', 'DevOps'],
        shelfPosition: { row: 1, col: 0 },
        modelPath: '/models/sample.glb',
        modelScale: 0.04,
      },
      {
        id: 'project-4',
        title: 'CONTACT',
        subtitle: 'Get In Touch',
        color: '#2F6FED',
        description: 'Want to work together, chat about an idea, or just talk snacks? Here\'s how to reach me.',
        tech: ['Email', 'LinkedIn', 'GitHub', 'Resume'],
        shelfPosition: { row: 1, col: 1 },
        modelPath: '/models/sample.glb',
        modelScale: 0.04,
      },
    ],
  },
  {
    id: 'skills',
    label: 'SKILLS',
    number: '02',
    color: '#1FA9A4',
    products: [
      {
        id: 'skill-1',
        title: 'LANGUAGES',
        subtitle: 'Programming Languages',
        color: '#1FA9A4',
        description: 'JavaScript, TypeScript, Python, and more.',
        tech: ['JavaScript', 'TypeScript', 'Python', 'SQL'],
        shelfPosition: { row: 0, col: 0 },
      },
      {
        id: 'skill-2',
        title: 'FRAMEWORKS',
        subtitle: 'Tech Frameworks',
        color: '#1FA9A4',
        description: 'React, Node.js, Express, and more.',
        tech: ['React', 'Node.js', 'Express', 'Next.js'],
        shelfPosition: { row: 0, col: 1 },
      },
    ],
  },
  {
    id: 'ingredients',
    label: 'INGREDIENTS',
    number: '03',
    color: '#F4C542',
    products: [
      {
        id: 'ingredient-1',
        title: 'FRONTEND',
        subtitle: 'Frontend Skills',
        color: '#F4C542',
        description: 'React, CSS, UI/UX design.',
        tech: ['React', 'CSS', 'UI/UX'],
        shelfPosition: { row: 0, col: 0 },
      },
    ],
  },
  {
    id: 'contact',
    label: 'CONTACT',
    number: '04',
    color: '#2F6FED',
    products: [
      {
        id: 'contact-1',
        title: 'GET IN TOUCH',
        subtitle: 'Contact Me',
        color: '#2F6FED',
        description: 'Email, LinkedIn, GitHub links.',
        tech: ['Email', 'LinkedIn', 'GitHub'],
        shelfPosition: { row: 0, col: 0 },
      },
    ],
  },
];

export default function GroceryStore3D({ onAisleChange }) {
  const [activeAisle, setActiveAisle] = useState('featured');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0); // Track cumulative rotation
  const [rotationImmediate, setRotationImmediate] = useState(false); // Skip animation flag
  const [viewState, setViewState] = useState('aisle'); // 'aisle' | 'item-focused' | 'item-modal'
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [isModalExiting, setIsModalExiting] = useState(false);

  const sceneRef = useRef(null);
  const shelfRef = useRef(null);
  const itemRefs = useRef({});
  const modalRef = useRef(null);
  const focusedItemRef = useRef(null);
  const dimOverlayRef = useRef(null);

  const currentAisle = AISLES.find(a => a.id === activeAisle) || AISLES[0];

  // Camera swoosh animation when switching aisles
  useLayoutEffect(() => {
    if (sceneRef.current && viewState === 'aisle') {
      gsap.to(sceneRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: 'power2.out',
      });
    }
  }, [activeAisle, viewState]);

  // Animate focused item when it appears
  useLayoutEffect(() => {
    if (focusedItemRef.current && selectedItem) {
      // Set initial position immediately to prevent flash
      gsap.set(focusedItemRef.current, {
        x: startPosition.x,
        y: startPosition.y,
        scale: 1,
        rotationY: 0, // Always start at 0 when item first appears
        opacity: 1,
      });
      

      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        if (viewState === 'item-focused') {
          // Animate to center for focused view
          gsap.to(focusedItemRef.current, {
            x: 0,
            y: 0,
            scale: 2.75,
            rotationY: 0,
            duration: 0.8,
            ease: 'power2.inOut',
          });
        } else if (viewState === 'item-modal') {
          // Animate item to slightly left of center for modal view
          // Adjust these values to tweak item positioning:
          const itemHorizontalOffset = -0.16; // Negative = left, Positive = right (as % of screen width)
          const itemVerticalOffset = 0; // Negative = up, Positive = down (in pixels)
          const itemScale = 2.75; // Scale of the item
          
          const targetX = window.innerWidth * itemHorizontalOffset;
          const targetY = itemVerticalOffset;
          
          gsap.to(focusedItemRef.current, {
            x: targetX,
            y: targetY,
            scale: itemScale,
            rotationY: 0,
            duration: 0.8,
            ease: 'power2.inOut',
          });
        }
      });
    }
  }, [viewState, selectedItem, startPosition]);

  // Animate modal opening
  useLayoutEffect(() => {
    if (!modalRef.current || viewState !== 'item-modal') return;

    // Reset exit flag when entering modal view
    setIsModalExiting(false);
    
    // Set initial state for opening animation
    gsap.set(modalRef.current, {
      x: 100,
      opacity: 0,
      scale: 0.9,
    });

    // Opening animation - slide in from right and fade in
    // Delay by 0.4s to start after item animation starts
    gsap.to(modalRef.current, {
      x: 0,
      opacity: 1,
      scale: 1,
      duration: 0.5,
      delay: 0.4, // Wait for item animation to finish
      ease: 'power2.out',
    });
  }, [viewState]);

  // Prevent body scrolling when item is selected
  useEffect(() => {
    if (viewState === 'item-focused' || viewState === 'item-modal') {
      // Store original overflow values
      const originalOverflow = document.body.style.overflow;
      const originalOverflowX = document.body.style.overflowX;
      const originalOverflowY = document.body.style.overflowY;
      
      // Prevent scrolling
      document.body.style.overflow = 'hidden';
      document.body.style.overflowX = 'hidden';
      document.body.style.overflowY = 'hidden';
      
      return () => {
        // Restore original overflow values
        document.body.style.overflow = originalOverflow;
        document.body.style.overflowX = originalOverflowX;
        document.body.style.overflowY = originalOverflowY;
      };
    }
  }, [viewState]);

  // Rotation is now handled by the 3D model's Three.js rotation, not CSS
  // No container rotation needed

  // Handle aisle change - simplified transition to avoid 3D canvas sizing issues
  const handleAisleChange = (aisleId) => {
    if (aisleId === activeAisle || viewState === 'item-focused') return;
    
    setSelectedItem(null);
    setViewState('aisle');
    setIsFlipped(false);
    setRotationAngle(0);
    
    // Clear item refs before switching
    itemRefs.current = {};
    
    if (sceneRef.current) {
      // Simpler fade transition - no scale to avoid canvas sizing issues
      gsap.to(sceneRef.current, {
        opacity: 0,
        x: -50,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => {
          setActiveAisle(aisleId);
          if (onAisleChange) onAisleChange(aisleId);
          
          gsap.fromTo(sceneRef.current,
            { opacity: 0, x: 50 },
            {
              opacity: 1,
              x: 0,
              duration: 0.35,
              ease: 'power2.out',
            }
          );
        },
      });
    } else {
      setActiveAisle(aisleId);
      if (onAisleChange) onAisleChange(aisleId);
    }
  };

  // Handle item selection (centered view)
  const handleItemClick = (item) => {
    if (viewState === 'item-focused' || viewState === 'item-modal') return;
    
    const itemElement = itemRefs.current[item.id];
    if (!itemElement) return;

    // Get item's current position relative to viewport center
    const rect = itemElement.getBoundingClientRect();
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const itemCenterX = rect.left + rect.width / 2;
    const itemCenterY = rect.top + rect.height / 2;

    // Store start position for animation
    setStartPosition({
      x: itemCenterX - centerX,
      y: itemCenterY - centerY,
    });

    setSelectedItem(item);
    setViewState('item-focused');
    setIsFlipped(false);
    setRotationAngle(0); // Reset rotation when selecting new item

    // Dim overlay
    if (dimOverlayRef.current) {
      gsap.to(dimOverlayRef.current, {
        opacity: 1,
        duration: 0.5,
      });
    }
  };

  // Handle item selection with modal (left-positioned item + right modal)
  const handleItemClickWithModal = (item) => {
    if (viewState === 'item-focused' || viewState === 'item-modal') return;
    
    const itemElement = itemRefs.current[item.id];
    if (!itemElement) return;

    // Get item's current position relative to viewport center
    const rect = itemElement.getBoundingClientRect();
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const itemCenterX = rect.left + rect.width / 2;
    const itemCenterY = rect.top + rect.height / 2;

    // Store original position (without offset) for animation start
    setStartPosition({
      x: itemCenterX - centerX, // Original position, no offset
      y: itemCenterY - centerY,
    });

    setSelectedItem(item);
    setViewState('item-modal');
    setIsFlipped(false);
    setRotationAngle(0);

    // Dim overlay
    if (dimOverlayRef.current) {
      gsap.to(dimOverlayRef.current, {
        opacity: 1,
        duration: 0.5,
      });
    }
  };

  // Handle back to aisle
  const handleBackToAisle = () => {
    if (!selectedItem || !focusedItemRef.current) return;

    // If in modal view, trigger exit animation first BEFORE changing state
    if (viewState === 'item-modal' && modalRef.current) {
      setIsModalExiting(true);
      // Kill any existing animations on the modal to prevent conflicts
      gsap.killTweensOf(modalRef.current);
      // Animate from current state to exit state
      gsap.fromTo(
        modalRef.current,
        {
          x: gsap.getProperty(modalRef.current, "x") || 0, // Get current x value
          opacity: gsap.getProperty(modalRef.current, "opacity") || 1, // Get current opacity
          scale: gsap.getProperty(modalRef.current, "scale") || 1, // Get current scale
        },
        {
          x: 100,
          opacity: 0,
          scale: 0.9,
          delay: 0.2,
          duration: 0.4,
          ease: 'power2.out',
        }
      );
    }

    // Normalize rotation to 0-360 range to find current side
    const normalizedAngle = ((rotationAngle % 360) + 360) % 360;
    
    // If showing back side (90-270°), we need to flip once to front
    if (normalizedAngle > 90 && normalizedAngle < 270) {
      // On back side - first snap to normalized angle (no animation)
      setRotationImmediate(true);
      setRotationAngle(normalizedAngle);
      // Then animate to 0 (one flip)
      requestAnimationFrame(() => {
        setRotationImmediate(false);
        setRotationAngle(0);
      });
    } else {
      // Already on front side - just reset (no animation needed)
      setRotationImmediate(true);
      setRotationAngle(0);
      requestAnimationFrame(() => {
        setRotationImmediate(false);
      });
    }
    
    // Calculate original shelf position
    const itemElement = itemRefs.current[selectedItem.id];
    let targetX = startPosition.x - 1;
    let targetY = startPosition.y - 0.5;
    
    if (itemElement && viewState === 'item-modal') {
      // Recalculate original position for modal view (remove left offset)
      const rect = itemElement.getBoundingClientRect();
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const itemCenterX = rect.left + rect.width / 2;
      const itemCenterY = rect.top + rect.height / 2;
      targetX = itemCenterX - centerX - 1;
      targetY = itemCenterY - centerY - 0.5;
    }
    
    // Animate back to shelf position (rotation will animate via the 3D model)
    gsap.to(focusedItemRef.current, {
      x: targetX,
      y: targetY,
      scale: 1.02,
      duration: 0.8,
      ease: 'power2.inOut',
      onComplete: () => {
        setSelectedItem(null);
        setViewState('aisle');
        setIsFlipped(false);
        setIsModalExiting(false);
      },
    });

    // Hide overlay
    if (dimOverlayRef.current) {
      gsap.to(dimOverlayRef.current, {
        opacity: 0,
        duration: 0.5,
      });
    }
  };

  // Handle item flip - add 180 degrees each time for continuous rotation
  const handleFlip = () => {
    if (!selectedItem) return;
    setRotationAngle(prev => prev + 180); // Add 180 degrees each flip
    setIsFlipped(!isFlipped); // Still toggle for content display logic
  };

  // Handle clicking outside (on overlay) to close
  const handleOverlayClick = () => {
    if (viewState === 'item-focused' || viewState === 'item-modal') {
      handleBackToAisle();
    }
  };

  return (
    <div className="w-full h-full min-h-screen relative overflow-hidden bg-gradient-to-br from-cereal-cream via-cereal-cream to-cereal-brown/10">
      {/* Floating Navigation */}
      <div 
        className="absolute top-4 left-1/2 -translate-x-1/2 z-[10] flex gap-2 bg-cereal-cream/95 backdrop-blur-sm px-4 py-2 rounded-lg border-2 border-cereal-brown shadow-lg"
        style={{ pointerEvents: viewState === 'item-focused' ? 'none' : 'auto' }}
      >
        {AISLES.map((aisle) => (
          <button
            key={aisle.id}
            onClick={() => handleAisleChange(aisle.id)}
            disabled={viewState === 'item-focused' || viewState === 'item-modal'}
            className={`px-3 py-1.5 rounded-md border-2 font-bold text-xs uppercase transition-all ${
              activeAisle === aisle.id
                ? 'bg-cereal-brown text-cereal-cream border-cereal-brown shadow-[2px_2px_0_#2B1B17]'
                : 'bg-cereal-cream text-cereal-brown border-cereal-brown/40 hover:border-cereal-brown shadow-[1px_1px_0_rgba(43,27,23,0.3)]'
            }`}
            style={{
              backgroundColor: activeAisle === aisle.id ? aisle.color : undefined,
              borderColor: activeAisle === aisle.id ? aisle.color : undefined,
            }}
          >
            {aisle.number && (
              <span className="text-[0.7em] opacity-90 mr-1">AISLE {aisle.number}</span>
            )}
            {aisle.label}
          </button>
        ))}
      </div>

      {/* 3D Scene Container */}
      <div
        ref={sceneRef}
        className="w-full h-full flex items-start justify-center relative pt-36"
        style={{ pointerEvents: viewState === 'item-focused' ? 'none' : 'auto' }}
      >
        {/* Shelf Container */}
        <div
          ref={shelfRef}
          className="relative"
          style={{ overflow: 'visible' }}
        >
          {/* Products on Shelf - Grid Layout */}
          {/* Key on container forces complete remount when aisle changes */}
          <div key={activeAisle} className="flex flex-col gap-6 items-center" style={{ overflow: 'visible' }}>
            {[0, 1].map((row) => {
              const rowProducts = currentAisle.products.filter(p => p.shelfPosition.row === row);
              if (rowProducts.length === 0) return null;
              
              return (
                <div key={row} className="flex gap-6" style={{ overflow: 'visible' }}>
                  {rowProducts.map((product) => (
                    <ShelfProductWrapper
                      key={`${activeAisle}-${product.id}`}
                      product={product}
                      index={currentAisle.products.indexOf(product)}
                      setItemRef={(el) => {
                        if (el) itemRefs.current[product.id] = el;
                      }}
                      selectedItem={selectedItem}
                      viewState={viewState}
                      onItemClick={handleItemClick}
                      onItemClickWithModal={handleItemClickWithModal}
                    />
                  ))}
                </div>
              );
            })}
          </div>

          {/* Shelf Backdrop */}
          <div
            className="absolute rounded-lg border-4 border-cereal-brown shadow-[12px_12px_0_rgba(43,27,23,0.2)]"
            style={{
              left: '50%',
              top: '50%',
              width: '600px',
              height: '450px',
              transform: 'translate(-50%, -50%)',
              backgroundColor: '#FFF5E0',
              zIndex: -1,
            }}
          />
        </div>
      </div>

      {/* Dim Overlay - Click to close */}
      <div
        ref={dimOverlayRef}
        className="absolute inset-0 bg-cereal-brown/80 cursor-pointer"
        style={{ 
          opacity: 0, 
          zIndex: 50,
          pointerEvents: (viewState === 'item-focused' || viewState === 'item-modal') ? 'auto' : 'none',
        }}
        onClick={handleOverlayClick}
      />

      {/* Focused Item Container - Above overlay (centered view) */}
      {selectedItem && viewState === 'item-focused' && (
        <div
          className="fixed inset-0 flex items-center justify-center pointer-events-none"
          style={{ 
            zIndex: 60,
            perspective: '1000px', // Add perspective for proper 3D rotation
            overflow: 'hidden', // Prevent any overflow that could cause scrolling
          }}
        >
          <div
            ref={focusedItemRef}
            className="pointer-events-auto cursor-pointer preserve-3d"
            style={{ 
              transformStyle: 'preserve-3d',
              transformOrigin: '50% 50%',
              opacity: 1, // Ensure it's visible immediately
            }}
            onClick={handleFlip}
          >
            <FocusedProductCard
              product={selectedItem}
              rotationAngle={rotationAngle}
              immediate={rotationImmediate}
            />
          </div>
        </div>
      )}

      {/* Modal View - Item on left, modal on right */}
      {selectedItem && (viewState === 'item-modal' || isModalExiting) && (
        <div
          className="fixed inset-0 pointer-events-none"
          style={{ 
            zIndex: 60,
            perspective: '1000px',
            overflow: 'hidden', // Prevent any overflow that could cause scrolling
          }}
        >
          {/* 3D Item - positioned by GSAP transforms, slightly left of center */}
          <div
            ref={focusedItemRef}
            className="pointer-events-auto cursor-pointer preserve-3d"
            style={{ 
              position: 'fixed', // Use fixed to stay viewport-relative, not affected by scroll
              left: '50%', // Center horizontally (GSAP x transform adjusts from here)
              top: '50%',  // Center vertically (GSAP y transform adjusts from here)
              transform: 'translate(-50%, -50%)', // Center the element itself
              transformStyle: 'preserve-3d',
              transformOrigin: '50% 50%',
              opacity: 1,
              willChange: 'transform', // Optimize for transforms
            }}
            onClick={handleFlip}
          >
            <FocusedProductCard
              product={selectedItem}
              rotationAngle={rotationAngle}
              immediate={rotationImmediate}
            />
          </div>

          {/* Modal container - constrained to middle 70% of screen */}
          <div
            className="fixed inset-0 flex items-center justify-center pointer-events-none"
            style={{ 
              width: '70vw',
              maxWidth: '1400px',
              left: '45%',
              transform: 'translateX(-50%)',
            }}
          >
            {/* Modal on the right side of the 70% container */}
            <div 
              ref={modalRef}
              className={isModalExiting ? "pointer-events-none flex-shrink-0" : "pointer-events-auto flex-shrink-0"}
              style={{ 
                width: '500px', 
                maxHeight: '80vh',
                marginLeft: 'auto',
                willChange: 'transform, opacity', // Optimize for animations
              }}
            >
              <ItemModal product={selectedItem} onClose={handleBackToAisle} />
            </div>
          </div>
        </div>
      )}

      {/* Back Button */}
      {(viewState === 'item-focused' || viewState === 'item-modal') && (
        <button
          onClick={handleBackToAisle}
          className="fixed top-12 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 bg-cereal-cream border-2 border-cereal-brown rounded-lg shadow-[3px_3px_0_#2B1B17] hover:shadow-[4px_4px_0_#2B1B17] hover:-translate-y-[2px] transition-all font-bold text-cereal-brown text-sm"
        >
          ← Back to Shelf
        </button>
      )}

      {/* Flip Hint */}
      {viewState === 'item-focused' && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-cereal-cream/90 px-4 py-2 rounded-lg border-2 border-cereal-brown shadow-lg pointer-events-none">
          <p className="text-xs text-cereal-brown font-semibold">
            {isFlipped ? 'Click card to flip back' : 'Click card to see details'}
          </p>
        </div>
      )}

      {/* Instructions */}
      {viewState === 'aisle' && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-cereal-cream/90 px-4 py-2 rounded-lg border-2 border-cereal-brown shadow-lg z-30">
          <p className="text-xs sm:text-sm text-cereal-brown font-semibold">
            Click a product to examine it
          </p>
        </div>
      )}
    </div>
  );
}

// Shelf Product Wrapper - handles hover state for both 3D and CSS cards
// 
// To use modal view for specific items, add onItemClickWithModal prop:
// <ShelfProductWrapper
//   ...
//   onItemClick={handleItemClick}  // Default centered view
//   onItemClickWithModal={handleItemClickWithModal}  // Optional: left + modal view
// />
// Then in your product data, you can conditionally use different handlers
function ShelfProductWrapper({ product, index, setItemRef, selectedItem, viewState, onItemClick, onItemClickWithModal }) {
  const [isHovered, setIsHovered] = useState(false);
  const wrapperRef = useRef(null);
  const isSelected = selectedItem?.id === product.id;

  // Smoothly fade out when selected, with a slight delay to allow focused item to appear first
  useEffect(() => {
    if (wrapperRef.current && isSelected && (viewState === 'item-focused' || viewState === 'item-modal')) {
      // Small delay to ensure focused item is positioned first
      const timeout = setTimeout(() => {
        gsap.to(wrapperRef.current, {
          opacity: 0,
          duration: 0.2,
          ease: 'power2.out',
        });
      }, 50); // 50ms delay

      return () => clearTimeout(timeout);
    } else if (wrapperRef.current && !isSelected) {
      // Immediately show when not selected
      gsap.set(wrapperRef.current, { opacity: 1 });
    }
  }, [isSelected, viewState]);

  return (
    <div
      ref={(el) => {
        wrapperRef.current = el;
        setItemRef(el);
      }}
      className="cursor-pointer"
      style={{ 
        width: '180px',
        height: '220px',
        display: 'inline-block',
        position: 'relative',
        flexShrink: 0,
        overflow: 'visible', // Allow visual overflow, but container stays fixed size
      }}
      onClick={() => {
        // Use modal view if handler is provided and product has useModal flag
        // Otherwise use default centered view
        if (onItemClickWithModal && product.useModal) {
          onItemClickWithModal(product);
        } else {
          onItemClick(product);
        }
      }}
      onMouseEnter={() => viewState === 'aisle' && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {product.modelPath ? (
        <ShelfProduct3D
          product={product}
          isHovered={isHovered}
        />
      ) : (
        <ProductBox
          product={product}
          index={index}
          isHoverable={viewState === 'aisle'}
        />
      )}
    </div>
  );
}

// Product Box Component (for shelf display)
function ProductBox({ product, index, isHoverable }) {
  const boxRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useLayoutEffect(() => {
    if (boxRef.current && isHoverable) {
      if (isHovered) {
        gsap.to(boxRef.current, {
          y: -15,
          scale: 1.15,
          duration: 0.3,
          ease: 'power2.out',
        });
      } else {
        gsap.to(boxRef.current, {
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    }
  }, [isHovered, isHoverable]);

  return (
    <div
      ref={boxRef}
      className="relative"
      style={{ width: '180px', height: '220px' }}
      onMouseEnter={() => isHoverable && setIsHovered(true)}
      onMouseLeave={() => isHoverable && setIsHovered(false)}
    >
      <div
        className="absolute inset-0 rounded-lg border-4 border-cereal-brown shadow-[8px_8px_0_rgba(43,27,23,0.3)] flex flex-col items-center justify-center p-3"
        style={{ backgroundColor: product.color }}
      >
        <div className="text-center">
          <div className="text-[0.6rem] font-bold text-cereal-cream/80 mb-1">
            {String(index + 1).padStart(2, '0')}
          </div>
          <div className="text-xs font-bold text-cereal-cream leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
            {product.title.split(' ')[0]}
          </div>
        </div>
      </div>
    </div>
  );
}

// Focused Product Card Component (for focused view with flip)
// Rotation is handled by the 3D model's Three.js rotation
function FocusedProductCard({ product, rotationAngle = 0, immediate = false }) {
  // Try to use 3D model if available, otherwise fall back to CSS 3D card
  const model3D = product.modelPath ? (
    <FocusedProduct3D product={product} rotationAngle={rotationAngle} immediate={immediate} />
  ) : null;

  // If 3D model is available and loaded, use it
  if (model3D) {
    return model3D;
  }

  // Fallback to CSS 3D card
  return (
    <div
      className="relative preserve-3d"
      style={{ 
        transformStyle: 'preserve-3d',
        width: '112px', 
        height: '144px',
      }}
    >
      {/* Front Face */}
      <div
        className="absolute inset-0 backface-hidden rounded-lg border-4 border-cereal-brown shadow-[8px_8px_0_rgba(43,27,23,0.3)] flex flex-col items-center justify-center p-3"
        style={{
          backgroundColor: product.color,
          backfaceVisibility: 'hidden',
        }}
      >
        <div className="text-center">
          <div className="text-[0.6rem] font-bold text-cereal-cream/80 mb-1">
            {product.subtitle}
          </div>
          <div className="text-xs font-bold text-cereal-cream leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
            {product.title.split(' ')[0]}
          </div>
        </div>
      </div>

      {/* Back Face */}
      <div
        className="absolute inset-0 backface-hidden rounded-lg border-4 border-cereal-brown shadow-[8px_8px_0_rgba(43,27,23,0.3)] flex flex-col p-2 bg-cereal-cream overflow-hidden"
        style={{
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
        }}
      >
        <div className="text-center mb-1">
          <div
            className="inline-block px-2 py-0.5 rounded-full text-[0.5rem] font-bold text-cereal-cream mb-1"
            style={{ backgroundColor: product.color }}
          >
            {product.subtitle}
          </div>
          <h3 className="text-[0.6rem] font-bold text-cereal-brown mb-1" style={{ fontFamily: 'var(--font-display)' }}>
            {product.title}
          </h3>
        </div>
        <p className="text-[0.45rem] text-cereal-brown/80 mb-1 leading-tight line-clamp-3">
          {product.description}
        </p>
        <div className="mt-auto">
          <div className="flex gap-0.5 flex-wrap justify-center">
            {product.tech.slice(0, 3).map((tech, idx) => (
              <span
                key={idx}
                className="px-1 py-0.5 border border-cereal-brown/40 rounded text-[0.4rem] text-cereal-brown font-semibold"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Item Modal Component Template
 * 
 * This is a customizable template for displaying detailed information about a product.
 * Copy this component and customize it for each item that needs a modal view.
 * 
 * Usage: Add a custom modal function in your product data or create item-specific modals.
 * 
 * Example product data:
 * {
 *   id: 'project-1',
 *   // ... other properties
 *   modalContent: 'custom' // or a function reference
 * }
 */
function ItemModal({ product, onClose }) {
  // You can customize this based on product.id or product.modalContent
  // For now, this is a template you can copy and customize
  
  return (
    <div className="bg-cereal-cream rounded-lg border-4 border-cereal-brown shadow-[12px_12px_0_rgba(43,27,23,0.3)] p-6 overflow-y-auto max-h-[80vh]">
      {/* Header */}
      <div className="mb-4 pb-4 border-b-2 border-cereal-brown/30">
        <div 
          className="inline-block px-3 py-1 rounded-full text-xs font-bold text-cereal-cream mb-2"
          style={{ backgroundColor: product.color }}
        >
          {product.subtitle}
        </div>
        <h2 
          className="text-2xl font-bold text-cereal-brown mb-1"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {product.title}
        </h2>
      </div>

      {/* Description */}
      <div className="mb-6">
        <p className="text-sm text-cereal-brown/90 leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* Tech Stack */}
      {product.tech && product.tech.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-bold text-cereal-brown mb-3 uppercase tracking-wide">
            Tech Stack
          </h3>
          <div className="flex flex-wrap gap-2">
            {product.tech.map((tech, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 border-2 border-cereal-brown/40 rounded-md text-xs text-cereal-brown font-semibold bg-cereal-cream/50"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Custom Content Area - Add your custom content here */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-cereal-brown mb-3 uppercase tracking-wide">
          Details
        </h3>
        <div className="text-sm text-cereal-brown/80 space-y-2">
          {/* 
            CUSTOMIZE THIS SECTION FOR EACH ITEM:
            
            Example customizations:
            - Project highlights
            - Key features
            - Challenges overcome
            - Links to demos/repos
            - Screenshots/images
            - Timeline
            - etc.
          */}
          <p>Add your custom content here for {product.title}</p>
        </div>
      </div>

      {/* Action Buttons (optional) */}
      <div className="flex gap-3 pt-4 border-t-2 border-cereal-brown/30">
        {/* Example: Add links, buttons, etc. */}
        <button
          onClick={onClose}
          className="px-4 py-2 bg-cereal-brown text-cereal-cream rounded-md font-bold text-sm hover:bg-cereal-brown/90 transition-colors"
        >
          Close
        </button>
        {/* Add more buttons as needed:
        <a href="..." className="px-4 py-2 bg-[product.color] text-cereal-cream rounded-md font-bold text-sm">
          View Project
        </a>
        */}
      </div>
    </div>
  );
}
