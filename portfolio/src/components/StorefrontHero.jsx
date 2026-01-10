import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import StorefrontSvg from "../assets/Storefront.svg?react";
import { FigmaNoiseOverlay } from "./FigmaNoiseOverlay";

export default function StorefrontHero({ onEnterStore }) {
  const rootRef = useRef(null);
  const cardRef = useRef(null);
  const shadowRef = useRef(null);
	const hoverTlRef = useRef(null);
  const tlRef = useRef(null);
  const onEnterStoreRef = useRef(onEnterStore);
  const [isPlaying, setIsPlaying] = useState(false);

  // Keep the ref updated without causing effect re-runs
  useLayoutEffect(() => {
    onEnterStoreRef.current = onEnterStore;
  });

  useLayoutEffect(() => {
    // gsap.context keeps selectors scoped to this component
    const ctx = gsap.context(() => {  
			gsap.set(cardRef.current, { transformOrigin: "50% 50%" });
			gsap.set(shadowRef.current, { transformOrigin: "50% 50%" });

			gsap.set(shadowRef.current, {
				opacity: 0.55,
				filter: "blur(0px)",
				scaleX: 1,
				scaleY: 1,
				x: 14,
				y: 14,
			});

			gsap.set([cardRef.current, shadowRef.current], { willChange: "transform, filter" });

			hoverTlRef.current = gsap.timeline({ paused: true }).to(
				cardRef.current,
				{
					y: -8,
					scale: 1.02,
					duration: 0.4,
					ease: "power1.out", // Smoother, more natural easing
				},
				0
			).to(
				shadowRef.current,
				{
					// slightly more spread + softer + lighter
					opacity: 0.35,
					filter: "blur(1px)",
					scaleX: 1.03,
					scaleY: 1.02,
					duration: 0.4,
					ease: "power1.out", // Match card timing
				},
				0
			);

			const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power2.inOut" },
        onComplete: () => {
          setIsPlaying(false);
        },
      });

      // Initial state (in case you need to enforce anything)
      gsap.set("#DoorsLeft", { xPercent: 0 });
      gsap.set("#DoorsRight", { xPercent: 0 });

      // Step 1: doors slide open with premium easing
      tl.to(
        "#DoorsLeft",
        {
          xPercent: -85,
          duration: 2.2, // Slightly longer for smoother feel
          ease: "expo.out", // Premium easing - starts fast, ends smooth
        },
        0
      ).to(
        "#DoorsRight",
        {
          xPercent: 85,
          duration: 2.2,
          ease: "expo.out",
        },
        0
      );

      // Brighten interior / walls with smooth fade
      tl.to(
        "#WallLeft, #WallRight",
        {
          opacity: 0.9,
          duration: 0.8, // Longer, smoother fade
          ease: "power2.inOut",
        },
        0.2 // Start slightly after doors for natural flow
      );

      // Step 2: zoom card toward camera with premium easing
      // Start zoom slightly before doors fully open for smoother transition
      tl.to(
        cardRef.current,
        {
          scale: 3.0,
					yPercent: -4,
          opacity: 0,
          duration: 2.8, // Slightly longer for more immersive feel
          ease: "power2.in", // Smoother acceleration than power3
        },
        1.0 // Start earlier for better flow
      );

			// Shadow fade with coordinated timing
			tl.to(
        shadowRef.current,
        {
          opacity: 0,
          filter: "blur(20px)", // Slightly more blur for smoother fade
          scale: 3.0, // Match card's scale
          x: 42, // Scale the offset: 14 * 3.0 = 42
          y: 42, // Scale the offset: 14 * 3.0 = 42
          yPercent: -4, // Match card's upward movement
          duration: 2.8, // Match card duration for synchronized movement
          ease: "power2.in",
        },
        1.0 // Start at same time as card zoom
      );

			tl.call(() => onEnterStoreRef.current?.(), [], 1.0); // Start transition when zoom begins

      tlRef.current = tl;
    }, rootRef);

    return () => ctx.revert();
  }, []); // Empty deps - effect only runs once on mount

  const handleClick = () => {
    if (isPlaying) return;
    setIsPlaying(true);
		hoverTlRef.current?.pause(); // keep current hover transforms
		tlRef.current?.invalidate().restart(); // recalc start values + play
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#C2352B] overflow-hidden" style={{ overflow: 'hidden', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
			<button
        ref={rootRef}
        type="button"
        onClick={handleClick}
				onMouseEnter={() => !isPlaying && hoverTlRef.current?.play()}
				onMouseLeave={() => !isPlaying && hoverTlRef.current?.reverse()}
        className="
          relative
          cursor-pointer
          outline-none
          duration-300
          focus-visible:ring-4
          focus-visible:ring-[#F0544F]/40
        "
      >
				<div
					ref={shadowRef}
					className="
						pointer-events-none
						absolute inset-0
						rounded-sm
						z-0
						bg-[rgba(30,18,14,0.55)]
					"
				/>
				<div
          ref={cardRef}
          className="
            relative z-10
          "
        >
					<StorefrontSvg className="w-[625px] h-auto rounded-sm" />
				</div>
      </button>
    </div>
  );
}
