import { useState, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';

/**
 * Point-and-Click 3D Aisle Navigation
 * Cartoony, artsy style with CSS 3D transforms
 */

// Sample products data - replace with your actual projects
const SAMPLE_PRODUCTS = [
  {
    id: 'project-1',
    title: 'FEATURED PROJECT',
    subtitle: 'My Flagship Work',
    color: '#F0544F',
    description: 'This is a detailed description of my featured project. It showcases my skills in full-stack development.',
    tech: ['React', 'Node.js', 'PostgreSQL'],
  },
  {
    id: 'project-2',
    title: 'SKILLS SHOWCASE',
    subtitle: 'Technical Expertise',
    color: '#1FA9A4',
    description: 'A comprehensive display of my technical skills and experience across various technologies.',
    tech: ['JavaScript', 'TypeScript', 'Python'],
  },
  {
    id: 'project-3',
    title: 'INGREDIENTS',
    subtitle: 'Skill Breakdown',
    color: '#F4C542',
    description: 'Detailed breakdown of my skills, experience levels, and what I\'m currently learning.',
    tech: ['Frontend', 'Backend', 'ML'],
  },
  {
    id: 'project-4',
    title: 'CONTACT',
    subtitle: 'Get In Touch',
    color: '#2F6FED',
    description: 'Want to work together? Here\'s how to reach me.',
    tech: ['Email', 'LinkedIn', 'GitHub'],
  },
];

export default function PointAndClickAisle({ products = SAMPLE_PRODUCTS, accentColor = '#F0544F' }) {
  const [view, setView] = useState('aisle'); // 'aisle' | 'product'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  
  const aisleRef = useRef(null);
  const productViewRef = useRef(null);
  const productCardRef = useRef(null);

  // Animate view transitions
  useLayoutEffect(() => {
    if (view === 'product' && productViewRef.current) {
      gsap.fromTo(productViewRef.current, 
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
      );
    }
  }, [view]);

  // Animate product card flip
  useLayoutEffect(() => {
    if (productCardRef.current) {
      gsap.to(productCardRef.current, {
        rotateY: isFlipped ? 180 : 0,
        duration: 0.6,
        ease: 'power2.inOut',
      });
    }
  }, [isFlipped]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setView('product');
    setIsFlipped(false);
  };

  const handleBackToAisle = () => {
    setView('aisle');
    setSelectedProduct(null);
    setIsFlipped(false);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  if (view === 'product' && selectedProduct) {
    return (
      <div className="w-full h-[600px] relative overflow-hidden bg-gradient-to-br from-cereal-cream to-cereal-brown/5 rounded-lg border-2 border-cereal-brown">
        {/* Back button */}
        <button
          onClick={handleBackToAisle}
          className="absolute top-4 left-4 z-20 px-4 py-2 bg-cereal-cream border-2 border-cereal-brown rounded-lg shadow-[3px_3px_0_#2B1B17] hover:shadow-[4px_4px_0_#2B1B17] hover:-translate-y-[2px] transition-all font-bold text-cereal-brown text-sm"
        >
          ← Back to Aisle
        </button>

        {/* Product View Container */}
        <div
          ref={productViewRef}
          className="w-full h-full flex items-center justify-center perspective-1000"
          style={{ perspective: '1000px' }}
        >
          {/* 3D Product Card */}
          <div
            ref={productCardRef}
            className="relative w-64 h-80 preserve-3d cursor-pointer"
            style={{ transformStyle: 'preserve-3d' }}
            onClick={handleFlip}
          >
            {/* Front Face */}
            <div
              className="absolute inset-0 backface-hidden rounded-2xl border-4 border-cereal-brown shadow-[8px_8px_0_rgba(43,27,23,0.3)] flex flex-col items-center justify-center p-6"
              style={{
                backgroundColor: selectedProduct.color,
                backfaceVisibility: 'hidden',
                transform: 'rotateY(0deg)',
              }}
            >
              <div className="text-center">
                <div className="text-xs font-bold text-cereal-cream/80 mb-2 tracking-wider">
                  {selectedProduct.subtitle}
                </div>
                <h3 className="text-2xl font-bold text-cereal-cream mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                  {selectedProduct.title}
                </h3>
                <div className="text-sm text-cereal-cream/90 mb-4">
                  Click to see details
                </div>
                <div className="flex gap-2 justify-center flex-wrap">
                  {selectedProduct.tech.slice(0, 3).map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-cereal-cream/20 border border-cereal-cream/40 rounded-full text-xs text-cereal-cream font-semibold"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Back Face */}
            <div
              className="absolute inset-0 backface-hidden rounded-2xl border-4 border-cereal-brown shadow-[8px_8px_0_rgba(43,27,23,0.3)] flex flex-col p-6 bg-cereal-cream overflow-y-auto"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              <div className="text-center mb-4">
                <div
                  className="inline-block px-4 py-2 rounded-full text-xs font-bold text-cereal-cream mb-3"
                  style={{ backgroundColor: selectedProduct.color }}
                >
                  {selectedProduct.subtitle}
                </div>
                <h3 className="text-xl font-bold text-cereal-brown mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                  {selectedProduct.title}
                </h3>
              </div>
              <p className="text-sm text-cereal-brown/80 mb-4 leading-relaxed">
                {selectedProduct.description}
              </p>
              <div className="mt-auto">
                <div className="text-xs font-bold text-cereal-brown/60 mb-2 uppercase tracking-wide">
                  Technologies
                </div>
                <div className="flex gap-2 flex-wrap">
                  {selectedProduct.tech.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 border-2 border-cereal-brown/40 rounded-lg text-xs text-cereal-brown font-semibold"
                      style={{ borderColor: selectedProduct.color + '80' }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Flip hint */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-cereal-cream/90 px-4 py-2 rounded-lg border-2 border-cereal-brown shadow-lg">
            <p className="text-xs text-cereal-brown font-semibold">
              {isFlipped ? 'Click to flip back' : 'Click card to see details'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Aisle View
  return (
    <div className="w-full h-[600px] relative overflow-hidden bg-gradient-to-br from-cereal-cream via-cereal-cream to-cereal-brown/10 rounded-lg border-2 border-cereal-brown">
      {/* Aisle Container with 3D Perspective */}
      <div
        ref={aisleRef}
        className="w-full h-full flex items-center justify-center"
        style={{ perspective: '1200px', perspectiveOrigin: 'center center' }}
      >
        {/* Isometric Shelf Scene */}
        <div
          className="relative"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'rotateX(20deg) rotateY(-30deg) scale(0.9)',
          }}
        >
          {/* Shelf Structure */}
          <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
            {/* Top Shelf */}
            <div
              className="absolute"
              style={{
                left: '50%',
                top: '20%',
                transform: 'translateX(-50%) translateY(-50%) translateZ(-30px)',
              }}
            >
              <div className="flex gap-6">
                {products.slice(0, 2).map((product, idx) => (
                  <ProductBox
                    key={product.id}
                    product={product}
                    onClick={() => handleProductClick(product)}
                    index={idx}
                  />
                ))}
              </div>
            </div>

            {/* Middle Shelf */}
            <div
              className="absolute"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translateX(-50%) translateY(-50%)',
              }}
            >
              <div className="flex gap-6">
                {products.slice(2, 4).map((product, idx) => (
                  <ProductBox
                    key={product.id}
                    product={product}
                    onClick={() => handleProductClick(product)}
                    index={idx + 2}
                  />
                ))}
              </div>
            </div>

            {/* Shelf Backdrop */}
            <div
              className="absolute rounded-lg border-4 border-cereal-brown shadow-[12px_12px_0_rgba(43,27,23,0.2)]"
              style={{
                left: '50%',
                top: '50%',
                width: '400px',
                height: '300px',
                transform: 'translateX(-50%) translateY(-50%) translateZ(-60px)',
                backgroundColor: '#FFF5E0',
              }}
            />
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-cereal-cream/90 px-4 py-2 rounded-lg border-2 border-cereal-brown shadow-lg z-10">
        <p className="text-xs sm:text-sm text-cereal-brown font-semibold">
          Click a product to examine it
        </p>
      </div>
    </div>
  );
}

// Individual Product Box Component
function ProductBox({ product, onClick, index }) {
  const boxRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useLayoutEffect(() => {
    if (boxRef.current) {
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
  }, [isHovered]);

  return (
    <div
      ref={boxRef}
      className="cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Simplified Cartoony Box - Using CSS transforms for 3D effect */}
      <div
        className="w-24 h-32 rounded-lg border-4 border-cereal-brown shadow-[8px_8px_0_rgba(43,27,23,0.3)] flex flex-col items-center justify-center p-3 relative"
        style={{
          backgroundColor: product.color,
          transform: 'skewY(-2deg) rotateX(5deg)',
          transition: 'all 0.3s ease',
        }}
      >
        <div className="text-center">
          <div className="text-[0.6rem] font-bold text-cereal-cream/80 mb-1">
            {String(index + 1).padStart(2, '0')}
          </div>
          <div className="text-xs font-bold text-cereal-cream leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
            {product.title.split(' ')[0]}
          </div>
        </div>
        
        {/* 3D depth effect using pseudo-elements */}
        <div
          className="absolute inset-0 rounded-lg border-4 border-cereal-brown opacity-30"
          style={{
            backgroundColor: product.color,
            transform: 'translate(4px, 4px) translateZ(-10px)',
            zIndex: -1,
          }}
        />
      </div>
    </div>
  );
}

