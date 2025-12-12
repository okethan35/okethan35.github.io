import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function PantryHero() {
  const sectionRef = useRef(null);
  const shelfRef = useRef(null);
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
          end: "+=300%",   // longer = more scroll to play the sequence
          scrub: true,
          pin: true,
        },
      });

      // Base state: all boxes on the shelf
      gsap.set([box1Ref.current, box2Ref.current, box3Ref.current, box4Ref.current], {
        zIndex: 1,
        scale: 1,
        x: 0,
        y: 0,
        opacity: 1,
      });

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
          .to(box, { rotation: 2, duration: 0.15, yoyo: true, repeat: 1 }, ">")
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

      // 4 “beats” in the sequence
      focusBox(box1Ref.current);
      focusBox(box2Ref.current);
      focusBox(box3Ref.current);
      focusBox(box4Ref.current);

      // Fade out the shelf at the end
      tl.to(
        shelfRef.current,
        {
          opacity: 0,
          duration: 0.5,
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
      className="relative h-screen bg-cereal-cream border-b-4 border-cereal-brown overflow-hidden"
    >
      {/* Shelf background */}
      <div
        ref={shelfRef}
        className="relative h-full flex flex-col items-center justify-center"
      >
        {/* Back wall */}
        <div className="absolute inset-0 bg-gradient-to-b from-cereal-yellow to-cereal-cream" />

        {/* Shelf plank */}
        <div className="absolute bottom-[30%] left-0 right-0 h-4 bg-cereal-brown shadow-[0_8px_0_rgba(0,0,0,0.2)]" />

        {/* Header text */}
        <div className="relative mb-10 text-center">
          <p className="uppercase tracking-[0.3em] text-[0.6rem] text-cereal-brown">
            ETHAN&apos;S PANTRY
          </p>
          <h1 className="font-display text-4xl md:text-5xl text-cereal-red drop-shadow-[3px_3px_0_#2B1B17]">
            Limited Edition Flavors
          </h1>
        </div>

        {/* Products on shelf */}
        <div className="relative flex gap-6 md:gap-10 items-end">
          {/* Box 1: Cereal (You) */}
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

          {/* Box 2: Chips (Projects) */}
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

          {/* Box 3: Jar (Skills) */}
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

          {/* Box 4: Bottle (Contact) */}
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
    </section>
  );
}
