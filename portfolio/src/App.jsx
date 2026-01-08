import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import StorefrontHero from "./components/StorefrontHero";
import ShelfScreen from "./components/ShelfScreen";
import { FigmaNoiseOverlay } from "./components/FigmaNoiseOverlay";

export default function App() {
  const heroWrapRef = useRef(null);
  const shelfWrapRef = useRef(null);
  const overlayRef = useRef(null);
  const transitioningRef = useRef(false);
  const scrollTimeoutRef = useRef(null);

  const [showHero, setShowHero] = useState(true);
  const [showShelf, setShowShelf] = useState(false);

  // Hide scrollbars during hero animation
  useEffect(() => {
    if (showHero) {
      document.documentElement.classList.add("no-scrollbar");
      document.body.classList.add("no-scrollbar");
    } else {
      document.documentElement.classList.remove("no-scrollbar");
      document.body.classList.remove("no-scrollbar");
    }
  }, [showHero]);

  const FLASH_IN = 0.35;
  const FLASH_HOLD = 0.12;
  const FLASH_OUT = 0.45;

  useLayoutEffect(() => {
    // Shelf starts hidden
    gsap.set(shelfWrapRef.current, {
      autoAlpha: 0,
      scale: 1.03,
      filter: "blur(10px)",
      pointerEvents: "none",
    });

    // Overlay starts hidden
    gsap.set(overlayRef.current, { autoAlpha: 0 });
  }, []);

  // Auto-hide scrollbar on scroll
  useEffect(() => {
    const handleScroll = () => {
      // Add scrolling class to show scrollbar
      document.documentElement.classList.add("scrolling");
      document.body.classList.add("scrolling");

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Hide scrollbar after scrolling stops (1 second delay)
      scrollTimeoutRef.current = setTimeout(() => {
        document.documentElement.classList.remove("scrolling");
        document.body.classList.remove("scrolling");
      }, 1000);
    };

    // Also show on mouse move near scrollbar area
    const handleMouseMove = (e) => {
      if (window.innerWidth - e.clientX < 50) {
        document.documentElement.classList.add("scrolling");
        document.body.classList.add("scrolling");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const enterStore = () => {
    if (transitioningRef.current) return;
    transitioningRef.current = true;

    const COVER_IN = 2.8;    // Match zoom duration for smooth coordination
    const REVEAL_OUT = 0.8;    // Slightly longer for smoother reveal
    const REVEAL_DELAY = 0.15; // Longer delay for better anticipation

    // Mount shelf now (it will be invisible until we set it visible under full white)
    setShowShelf(true);

    requestAnimationFrame(() => {
      // IMPORTANT: when shelf first mounts, hide it immediately
      if (shelfWrapRef.current) {
        gsap.set(shelfWrapRef.current, {
          autoAlpha: 0,
          scale: 1.03,
          filter: "blur(10px)",
          pointerEvents: "none",
        });
      }

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        onComplete: () => {
          gsap.set(shelfWrapRef.current, { pointerEvents: "auto" });
          transitioningRef.current = false;
        },
      });

      // 1) Fade overlay to full white with premium easing
      tl.to(
        overlayRef.current,
        {
          autoAlpha: 1,
          duration: COVER_IN,
          ease: "power1.inOut", // Smoother, more natural fade
        },
        0
      );

      // 2) Once fully white, swap screens (no one can see the swap)
      tl.add(() => {
        setShowHero(false); // unmount hero while white is fully covering
        if (shelfWrapRef.current) gsap.set(shelfWrapRef.current, { autoAlpha: 1 });
      }, COVER_IN);

      // 3) Let shelf settle in with premium easing
      tl.to(
        shelfWrapRef.current,
        {
          scale: 1,
          filter: "blur(0px)",
          duration: 0.7, // Longer for smoother settle
          ease: "expo.out", // Premium easing - smooth deceleration
        },
        COVER_IN - 0.1 // Start slightly before full white for seamless transition
      );

      // 4) Fade overlay out to reveal shelf with smooth easing
      tl.to(
        overlayRef.current,
        {
          autoAlpha: 0,
          duration: REVEAL_OUT,
          ease: "power1.out", // Smooth, natural fade out
        },
        COVER_IN + REVEAL_DELAY
      );
    });
  };

  return (
    <div className="relative min-h-screen bouncy-scroll" style={{ overflow: showHero ? 'hidden' : 'auto' }}>
      {/* If you want noise everywhere, put it once here */}
      <FigmaNoiseOverlay />

      {showHero && (
        <div ref={heroWrapRef} className="absolute inset-0 overflow-hidden" style={{ overflow: 'hidden' }}>
          <StorefrontHero onEnterStore={enterStore} />
        </div>
      )}

      {showShelf && (
        <div ref={shelfWrapRef} className="relative">
          <ShelfScreen />
        </div>
      )}

      {/* Transition overlay (cream matches your paper/packaging vibe) */}
      <div
        ref={overlayRef}
        className="pointer-events-none fixed inset-0 bg-[#FFF5E0] z-50"
      />
    </div>
  );
}
