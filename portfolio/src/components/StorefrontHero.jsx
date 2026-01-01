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
  const [isPlaying, setIsPlaying] = useState(false);

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
					duration: 0.25,
					ease: "power2.out",
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
					duration: 0.25,
					ease: "power2.out",
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

      // Step 1: doors slide open
      tl.to(
        "#DoorsLeft",
        {
          xPercent: -85, // tweak so doors slide fully off-frame
          duration: 2.0,
        },
        0 // start at time 0
      ).to(
        "#DoorsRight",
        {
          xPercent: 85,
          duration: 2.0,
        },
        0 // same time → symmetrical
      );

      // Optional: brighten interior / walls a bit as doors open
      tl.to(
        "#WallLeft, #WallRight",
        {
          opacity: 0.9,
          duration: 0.4,
        },
        0.1
      );

      // Step 2: zoom card toward camera & fade out
      tl.to(
        cardRef.current,
        {
          scale: 2.0,
					yPercent: -4,
          opacity: 0,
          duration: 1.2,
          ease: "power3.in",
        },
        1.3 // start a bit after doors begin moving
      );

			// subtle settling early in the animation
			tl.to(
        shadowRef.current,
        {
          opacity: 0,
          filter: "blur(18px)",
          scaleX: 1.08,
          scaleY: 1.08,
          duration: 1.1,
          ease: "power3.in",
        },
        1.2
      );

			tl.call(() => onEnterStore?.(), [], 1.3); // <-- start transition exactly when zoom begins

      tlRef.current = tl;
    }, rootRef);

    return () => ctx.revert();
  }, [onEnterStore]);

  const handleClick = () => {
    if (isPlaying) return;
    setIsPlaying(true);
		hoverTlRef.current?.pause(); // keep current hover transforms
		tlRef.current?.invalidate().restart(); // recalc start values + play
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#C2352B] overflow-hidden">
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
