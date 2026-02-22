import './ShelfBackground.css';

/**
 * CSS-based 3D shelf background component
 * Creates a realistic grocery store shelf appearance using CSS transforms
 * Fully responsive and lightweight alternative to image assets
 */
export default function ShelfBackground({ className = '' }) {
  return (
    <div className={`shelf-background ${className}`}>
      {/* Left side support */}
      <div className="shelf-side shelf-side-left"></div>
      
      {/* Right side support */}
      <div className="shelf-side shelf-side-right"></div>
      
      {/* Back wall of the shelf unit */}
      <div className="shelf-back-wall"></div>
      
      {/* Shelf levels – one plank per level */}
      <div className="shelf-level shelf-level-1"></div>
      <div className="shelf-level shelf-level-2"></div>
      <div className="shelf-level shelf-level-3"></div>
      <div className="shelf-level shelf-level-4"></div>
      
      {/* Bottom base/floor */}
      <div className="shelf-base"></div>
    </div>
  );
}

