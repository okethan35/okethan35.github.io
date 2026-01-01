import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import StorefrontHero from "./components/StorefrontHero";
import ShelfScreen from "./components/ShelfScreen";
import { FigmaNoiseOverlay } from "./components/FigmaNoiseOverlay";

export default function App() {
  const heroWrapRef = useRef(null);
  const shelfWrapRef = useRef(null);
  const overlayRef = useRef(null);
  const transitioningRef = useRef(false);

  const [showHero, setShowHero] = useState(true);
  const [showShelf, setShowShelf] = useState(false);

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

  const enterStore = () => {
    if (transitioningRef.current) return;
    transitioningRef.current = true;

    const COVER_IN = 0.75;   // how long to fade to white
    const REVEAL_OUT = 0.65; // how long to fade back out
    const REVEAL_DELAY = 0.08;

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

      // 1) Fade overlay to full white (storefront continues animating underneath)
      tl.to(overlayRef.current, { autoAlpha: 1, duration: COVER_IN }, 0);

      // 2) Once fully white, swap screens (no one can see the swap)
      tl.add(() => {
        setShowHero(false); // unmount hero while white is fully covering
        if (shelfWrapRef.current) gsap.set(shelfWrapRef.current, { autoAlpha: 1 });
      }, COVER_IN);

      // 3) Let shelf settle in while still covered / just as it starts revealing
      tl.to(
        shelfWrapRef.current,
        { scale: 1, filter: "blur(0px)", duration: 0.55, ease: "power2.out" },
        COVER_IN
      );

      // 4) Fade overlay out to reveal shelf
      tl.to(
        overlayRef.current,
        { autoAlpha: 0, duration: REVEAL_OUT },
        COVER_IN + REVEAL_DELAY
      );
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* If you want noise everywhere, put it once here */}
      <FigmaNoiseOverlay />

      {showHero && (
        <div ref={heroWrapRef} className="absolute inset-0">
          <StorefrontHero onEnterStore={enterStore} />
        </div>
      )}

      {showShelf && (
        <div ref={shelfWrapRef} className="absolute inset-0">
          <ShelfScreen />
        </div>
      )}

      {/* Transition overlay (cream matches your paper/packaging vibe) */}
      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 bg-[#FFF5E0]"
      />
    </div>
  );
}
