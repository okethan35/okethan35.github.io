import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function GroceryShelfHero() {
  const sectionRef = useRef(null);
  const mainShelfRef = useRef(null);
  const box1Ref = useRef(null);
  const box2Ref = useRef(null);
  const box3Ref = useRef(null);
  const box4Ref = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=300%",   // adjust for how long you want the sequence
          scrub: true,
          pin: true,
        },
      });

      // Base state for all boxes
      gsap.set(
        [box1Ref.current, box2Ref.current, box3Ref.current, box4Ref.current],
        {
          zIndex: 1,
          scale: 1,
          y: 0,
          opacity: 1,
        }
      );

      const focusBox = (box) => {
        tl.to(
          box,
          {
            zIndex: 10,
            y: -40,
            scale: 1.12,
            duration: 0.4,
            ease: "power2.out",
          },
          "+=0.1"
        )
          .to(
            box,
            {
              rotation: 2,
              duration: 0.15,
              yoyo: true,
              repeat: 1,
              transformOrigin: "50% 100%",
            },
            ">" // after the slide up
          )
          .to(
            box,
            {
              y: 100,
              opacity: 0,
              duration: 0.4,
              ease: "power2.in",
            },
            "+=0.3"
          );
      };

      // Sequence: each product steps forward then exits
      focusBox(box1Ref.current);
      focusBox(box2Ref.current);
      focusBox(box3Ref.current);
      focusBox(box4Ref.current);

      // Fade out whole hero at the end so main site takes over
      tl.to(
        mainShelfRef.current,
        {
          opacity: 0,
          duration: 0.6,
          ease: "power1.out",
        },
        "+=0.2"
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-cereal-cream border-b-4 border-cereal-brown"
    >
      {/* store background */}
      <div className="absolute inset-0 bg-gradient-to-b from-cereal-yellow/50 via-cereal-cream to-cereal-brown/15" />

      {/* slight “ceiling” and “floor” tint */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-cereal-brown/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-cereal-brown/20 to-transparent" />

      {/* shelves container */}
      <div className="relative h-full max-w-6xl mx-auto">
        {/* top shelf glimpse */}
        <ShelfGlimpseTop />

        {/* main shelf */}
        <div
          ref={mainShelfRef}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-4"
        >
          {/* label/tag on the shelf front */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center px-6 py-3 bg-cereal-red border-4 border-cereal-brown rounded-full shadow-[4px_4px_0_#2B1B17]">
              <span className="font-display text-xl md:text-2xl text-cereal-cream tracking-[0.12em] uppercase">
                ETHAN&apos;S PANTRY
              </span>
            </div>
          </div>

          {/* shelf plank */}
          <div className="relative">
            {/* plank */}
            <div className="h-5 bg-cereal-brown shadow-[0_10px_0_rgba(0,0,0,0.25)] rounded-sm" />

            {/* products sitting on the plank */}
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 flex gap-6 md:gap-10 items-end">
              {/* Cereal box: you */}
              <div
                ref={box1Ref}
                className="w-28 md:w-32 h-40 bg-cereal-yellow border-4 border-cereal-brown rounded-md shadow-[6px_6px_0_#2B1B17] flex flex-col justify-between p-3"
              >
                <p className="font-display text-sm leading-tight text-cereal-red">
                  ETHAN
                </p>
                <p className="text-[0.6rem] uppercase tracking-[0.18em] text-cereal-brown">
                  Original Flavor
                </p>
              </div>

              {/* Chips bag: projects */}
              <div
                ref={box2Ref}
                className="w-24 md:w-28 h-36 bg-cereal-red border-4 border-cereal-brown rounded-[1.5rem_1.5rem_0.8rem_0.8rem] shadow-[6px_6px_0_#2B1B17] flex flex-col justify-between p-3"
              >
                <p className="font-display text-xs leading-tight text-cereal-cream">
                  Projects
                </p>
                <p className="text-[0.55rem] uppercase tracking-[0.18em] text-cereal-cream">
                  Crunchy Bites
                </p>
              </div>

              {/* Jar: skills */}
              <div
                ref={box3Ref}
                className="w-24 md:w-28 h-32 bg-cereal-teal border-4 border-cereal-brown rounded-[1.5rem_1.5rem_0.75rem_0.75rem] shadow-[6px_6px_0_#2B1B17] flex flex-col justify-between p-3"
              >
                <p className="font-display text-xs text-cereal-cream">
                  Skills
                </p>
                <p className="text-[0.55rem] uppercase tracking-[0.18em] text-cereal-cream">
                  Ingredients
                </p>
              </div>

              {/* Bottle: contact */}
              <div
                ref={box4Ref}
                className="w-20 md:w-24 h-36 bg-cereal-blue border-4 border-cereal-brown rounded-[999px] shadow-[6px_6px_0_#2B1B17] flex flex-col justify-between p-3"
              >
                <p className="font-display text-xs text-cereal-cream">
                  Contact
                </p>
                <p className="text-[0.55rem] uppercase tracking-[0.18em] text-cereal-cream">
                  Drink Me
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* bottom shelf glimpse */}
        <ShelfGlimpseBottom />
      </div>
    </section>
  );
}

/* ---- helper components for top/bottom glimpses ---- */

function ShelfGlimpseTop() {
  return (
    <div className="absolute left-1/2 top-[18%] -translate-x-1/2 w-full px-6 opacity-70">
      {/* plank */}
      <div className="h-4 bg-cereal-brown rounded-sm shadow-[0_8px_0_rgba(0,0,0,0.25)]" />
      {/* little product bottoms peeking down */}
      <div className="absolute top-[-48px] left-1/2 -translate-x-1/2 flex gap-4">
        <div className="w-12 h-10 bg-cereal-red border-4 border-cereal-brown rounded-md" />
        <div className="w-10 h-8 bg-cereal-yellow border-4 border-cereal-brown rounded-md" />
        <div className="w-12 h-9 bg-cereal-teal border-4 border-cereal-brown rounded-md" />
      </div>
    </div>
  );
}

function ShelfGlimpseBottom() {
  return (
    <div className="absolute left-1/2 bottom-[18%] -translate-x-1/2 w-full px-6 opacity-70">
      {/* plank */}
      <div className="h-4 bg-cereal-brown rounded-sm shadow-[0_8px_0_rgba(0,0,0,0.25)]" />
      {/* little product tops peeking up */}
      <div className="absolute bottom-[-48px] left-1/2 -translate-x-1/2 flex gap-4 items-end">
        <div className="w-10 h-18 bg-cereal-yellow border-4 border-cereal-brown rounded-t-full" />
        <div className="w-8 h-14 bg-cereal-red border-4 border-cereal-brown rounded-t-full" />
        <div className="w-10 h-16 bg-cereal-blue border-4 border-cereal-brown rounded-t-full" />
      </div>
    </div>
  );
}
