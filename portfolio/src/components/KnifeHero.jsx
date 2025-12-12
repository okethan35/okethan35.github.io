import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function KnifeHero() {
  const sectionRef = useRef(null);
  const heroPanelRef = useRef(null);
  const knifeRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=150%",   // how much scroll distance controls the animation
          scrub: true,     // tie animation progress to scroll
          pin: true,       // keep hero pinned while the animation plays
        },
      });

      // Knife drops in
      tl.fromTo(
        knifeRef.current,
        { y: "-120%", rotate: -10 },
        { y: "0%", rotate: 0, duration: 0.35, ease: "power2.out" }
      )
        // Hero “peels” up to reveal content
        .to(
          heroPanelRef.current,
          {
            yPercent: -100,
            duration: 0.9,
            ease: "power2.inOut",
          },
          "-=0.1" // overlap with knife motion a bit
        );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-cereal-cream border-b-4 border-cereal-brown"
    >
      {/* Hero = front of the cereal box */}
      <div
        ref={heroPanelRef}
        className="absolute inset-0 z-20 bg-cereal-yellow flex flex-col md:flex-row items-center justify-center gap-10 px-6"
      >
        {/* subtle halftone overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-10 mix-blend-multiply"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(0,0,0,0.35) 1px, transparent 1px)",
            backgroundSize: "4px 4px",
          }}
        />

        {/* Left: text block */}
        <div className="relative max-w-md text-center md:text-left">
          <p className="uppercase tracking-[0.25em] text-[0.6rem] md:text-xs text-cereal-brown mb-3">
            LITTLE FAT DEV · NET WT. 2025
          </p>

          <h1 className="relative font-display text-5xl md:text-7xl leading-none text-cereal-red drop-shadow-[4px_4px_0_#2B1B17]">
            ETHAN
            <span className="block text-cereal-deep mt-1">TRAN</span>
          </h1>

          <p className="mt-4 font-body text-sm md:text-base">
            CS &amp; Linguistics @ UCLA · building spicy, accessible web and ML
            projects with a retro crunch.
          </p>

          <div className="mt-6 inline-flex flex-wrap items-center gap-3 justify-center md:justify-start">
            <span className="px-4 py-2 bg-cereal-teal text-cereal-cream text-xs font-semibold rounded-full border-2 border-cereal-brown">
              100% REAL PROJECTS
            </span>
            <span className="px-4 py-2 bg-cereal-red text-cereal-cream text-xs font-semibold rounded-full border-2 border-cereal-brown">
              SPICY PORTFOLIO · LIMITED EDITION
            </span>
          </div>
        </div>

        {/* Right: “mascot” / portrait bubble */}
        <div className="relative">
          <div className="w-44 h-44 md:w-56 md:h-56 rounded-full bg-cereal-cream border-[6px] border-cereal-brown overflow-hidden flex items-center justify-center">
            {/* Placeholder – later you can drop in a halftone photo of yourself */}
            <span className="font-body text-xs text-center px-4">
              Drop a retro halftone portrait of you here.
            </span>
          </div>
          {/* little sticker */}
          <div className="absolute -bottom-3 -right-4 bg-cereal-blue text-cereal-cream text-[0.65rem] font-semibold px-3 py-1 rounded-full border-2 border-cereal-brown">
            ASIAN SNACK DEV ★
          </div>
        </div>
      </div>

      {/* Knife (for now, a simple stylized knife made of divs) */}
      <div
        ref={knifeRef}
        className="absolute z-30 -top-28 left-1/2 -translate-x-1/2 w-24 md:w-32 flex flex-col items-center"
      >
        {/* handle */}
        <div className="w-10 md:w-12 h-5 bg-cereal-brown rounded-full mb-1"></div>
        {/* blade */}
        <div className="w-[3px] h-20 md:h-24 bg-cereal-cream shadow-[0_0_0_3px_#2B1B17] relative">
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-l-[10px] border-r-[10px] border-b-[14px] border-l-transparent border-r-transparent border-b-cereal-cream shadow-[0_2px_0_#2B1B17]" />
        </div>
      </div>
    </section>
  );
}
