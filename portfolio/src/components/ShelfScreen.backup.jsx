import { useState, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

const SECTIONS = {
  home: {
    id: "home",
    title: "Hey, I'm Ethan — full-stack dev & maker.",
    eyebrow: "WELCOME TO ETHAN'S PANTRY",
    body: [
      "I build playful, pragmatic products across web, mobile, and ML.",
      "Pick an aisle above to explore featured projects, skills, and how to get in touch.",
    ],
    chips: ["Full-Stack Engineering", "UCLA 2026", "React · Node · ML"],
    accentColor: "#F0544F",
    bgGradient: "from-cereal-red to-cereal-deep",
    // PLACEHOLDER: Add your custom icon/illustration path here
    icon: null, // e.g., "/assets/icons/home-icon.svg"
  },
  featured: {
    id: "featured",
    title: "Featured Flavors",
    eyebrow: "AISLE 01 · FEATURED PROJECTS",
    body: [
      "These are my flagship projects — the ones that best represent how I think about product, engineering, and shipping things that feel good to use.",
      "Click individual boxes (coming next) to dive into case studies with stack, decisions, and what I learned.",
    ],
    chips: ["Flagship work", "Case studies", "Hands-on builds"],
    accentColor: "#F0544F",
    bgGradient: "from-cereal-red to-cereal-deep",
    // PLACEHOLDER: Add your custom icon/illustration path here
    icon: null, // e.g., "/assets/icons/featured-icon.svg"
  },
  skills: {
    id: "skills",
    title: "Skills & Stack",
    eyebrow: "AISLE 02 · SKILLS",
    body: [
      "My main ingredients: JavaScript/TypeScript, React/React Native, Node/Express, Postgres/SQL, and ML tooling.",
      "On the shelves: languages, frameworks, data/ML, infrastructure, and design tools.",
    ],
    chips: ["Languages", "Frameworks", "Infra & tooling"],
    accentColor: "#1FA9A4",
    bgGradient: "from-cereal-teal to-cereal-blue",
    // PLACEHOLDER: Add your custom icon/illustration path here
    icon: null, // e.g., "/assets/icons/skills-icon.svg"
  },
  ingredients: {
    id: "ingredients",
    title: "Ingredients & Nutrition",
    eyebrow: "AISLE 03 · INGREDIENTS",
    body: [
      "A more structured breakdown of my skills, from frontend ergonomics to backend APIs and data pipelines.",
      "Think of this as the nutrition label for how I work: strengths, experience level, and what I'm currently leveling up.",
    ],
    chips: ["Skill breakdown", "Experience levels", "Currently learning"],
    accentColor: "#F4C542",
    bgGradient: "from-cereal-yellow to-cereal-red",
    // PLACEHOLDER: Add your custom icon/illustration path here
    icon: null, // e.g., "/assets/icons/ingredients-icon.svg"
  },
  whereToBuy: {
    id: "whereToBuy",
    title: "Where to Buy",
    eyebrow: "AISLE 04 · CONTACT",
    body: [
      "Want to work together, chat about an idea, or just talk snacks?",
      "This is where you'll find my email, LinkedIn, GitHub, and a link to my resume.",
    ],
    chips: ["Email", "LinkedIn", "GitHub · Resume"],
    accentColor: "#2F6FED",
    bgGradient: "from-cereal-blue to-cereal-teal",
    // PLACEHOLDER: Add your custom icon/illustration path here
    icon: null, // e.g., "/assets/icons/contact-icon.svg"
  },
};

const AISLES = [
  { id: "home", label: "HOME", number: null },
  { id: "featured", label: "FEATURED", number: "01" },
  { id: "skills", label: "SKILLS", number: "02" },
  { id: "ingredients", label: "INGREDIENTS", number: "03" },
  { id: "whereToBuy", label: "CONTACT", number: "04" },
];

export default function ShelfScreen() {
  const [activeSection, setActiveSection] = useState("home");
  const section = SECTIONS[activeSection];
  
  const contentRef = useRef(null);
  const titleRef = useRef(null);
  const bodyRefs = useRef([]);
  const chipsRef = useRef(null);
  const buttonsRef = useRef(null);
  const packageRef = useRef(null);
  const previousSectionRef = useRef(activeSection);

  // GSAP animation setup
  useLayoutEffect(() => {
    if (!packageRef.current || !titleRef.current) return;

    const getAisleIndex = (id) => AISLES.findIndex((a) => a.id === id);
    const prevIndex = getAisleIndex(previousSectionRef.current);
    const currentIndex = getAisleIndex(activeSection);
    const isMovingForward = currentIndex > prevIndex;
    const isInitialLoad = previousSectionRef.current === activeSection;

    const ctx = gsap.context(() => {
      if (isInitialLoad) {
        // Initial load - set initial states and animate in
        // Ensure package is visible but scaled down
        gsap.set(packageRef.current, {
          scale: 0.9,
          x: 0,
          rotation: 0,
          opacity: 1,
        });
        
        // Set content elements to hidden
        const contentElements = [
          titleRef.current,
          ...bodyRefs.current.filter(Boolean),
          chipsRef.current,
          buttonsRef.current,
        ].filter(Boolean);
        
        gsap.set(contentElements, {
          opacity: 0,
          y: 20,
        });

        // Set initial scale for chips
        if (chipsRef.current?.children) {
          gsap.set(chipsRef.current.children, { scale: 0, opacity: 0 });
        }

        // Set initial state for buttons
        if (buttonsRef.current?.children) {
          gsap.set(buttonsRef.current.children, { opacity: 0, y: 20 });
        }

        // Small delay to ensure DOM is ready
        const tl = gsap.timeline({ defaults: { ease: "power2.out" }, delay: 0.1 });
        
        tl.to(packageRef.current, {
          scale: 1,
          duration: 0.6,
          ease: "expo.out",
        }, 0)
          .to(titleRef.current, { opacity: 1, y: 0, duration: 0.5 }, 0.2)
          .to(bodyRefs.current.filter(Boolean), {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.15,
          }, 0.4)
          .to(chipsRef.current?.children || [], {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            stagger: 0.08,
            ease: "back.out(1.5)",
          }, 0.7)
          .to(buttonsRef.current?.children || [], {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.1,
          }, 0.9);
      } else {
        // Section change - animate out old, animate in new
        const exitTl = gsap.timeline({
          defaults: { ease: "power2.in" },
          onComplete: () => {
            // Reset new content for entrance
            gsap.set([titleRef.current, ...bodyRefs.current.filter(Boolean), chipsRef.current, buttonsRef.current].filter(Boolean), {
              opacity: 0,
              y: 20,
            });
            
            if (chipsRef.current?.children) {
              gsap.set(chipsRef.current.children, { scale: 0 });
            }
            
            if (buttonsRef.current?.children) {
              gsap.set(buttonsRef.current.children, { opacity: 0, y: 20 });
            }
            
            gsap.set(packageRef.current, {
              scale: 0.8,
              x: isMovingForward ? 100 : -100,
              rotation: isMovingForward ? 5 : -5,
              opacity: 1,
            });

            // Animate in new content
            const enterTl = gsap.timeline({ defaults: { ease: "power2.out" } });
            
            enterTl.to(packageRef.current, {
              scale: 1,
              x: 0,
              rotation: 0,
              duration: 0.6,
              ease: "expo.out",
            }, 0)
              .to(titleRef.current, { opacity: 1, y: 0, duration: 0.5 }, 0.2)
              .to(bodyRefs.current.filter(Boolean), {
                opacity: 1,
                y: 0,
                duration: 0.4,
                stagger: 0.15,
              }, 0.4)
              .to(chipsRef.current?.children || [], {
                opacity: 1,
                scale: 1,
                duration: 0.3,
                stagger: 0.08,
                ease: "back.out(1.5)",
              }, 0.7)
              .to(buttonsRef.current?.children || [], {
                opacity: 1,
                y: 0,
                duration: 0.4,
                stagger: 0.1,
              }, 0.9);
          },
        });

        exitTl.to(packageRef.current, {
          scale: 0.8,
          x: isMovingForward ? -100 : 100,
          rotation: isMovingForward ? -5 : 5,
          opacity: 0,
          duration: 0.3,
        })
          .to([titleRef.current, ...bodyRefs.current.filter(Boolean), chipsRef.current, buttonsRef.current].filter(Boolean), {
            opacity: 0,
            y: -20,
            duration: 0.2,
            stagger: 0.05,
          }, 0);
      }
    }, contentRef);

    previousSectionRef.current = activeSection;
    return () => ctx.revert();
  }, [activeSection]);

  // Update body refs array
  const setBodyRef = (el, index) => {
    bodyRefs.current[index] = el;
  };

  return (
    <main className="min-h-screen bg-[#C2352B] text-cereal-brown flex flex-col">
      {/* AISLE NAVIGATION */}
      <nav className="w-full bg-cereal-cream border-b-2 sm:border-b-4 border-cereal-brown sticky top-0 z-40 shadow-[0_2px_0_rgba(43,27,23,0.25)] sm:shadow-[0_4px_0_rgba(43,27,23,0.25)]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 overflow-x-auto scrollbar-hide py-3 sm:py-4">
            {AISLES.map((aisle) => {
              const isActive = activeSection === aisle.id;
              return (
                <AisleButton
                  key={aisle.id}
                  aisle={aisle}
                  isActive={isActive}
                  onClick={() => setActiveSection(aisle.id)}
                  accentColor={SECTIONS[aisle.id]?.accentColor || "#F0544F"}
                />
              );
            })}
          </div>
        </div>
      </nav>

      {/* PRODUCT SHOWCASE */}
      <section className="flex-1 flex items-start sm:items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-6 sm:py-8 md:py-12 lg:py-16">
        <div ref={contentRef} className="w-full max-w-5xl">
          <div
            ref={packageRef}
            className="bg-cereal-cream rounded-2xl sm:rounded-3xl border-2 sm:border-3 md:border-4 border-cereal-brown shadow-[0_8px_0_rgba(43,27,23,0.4)] sm:shadow-[0_12px_0_rgba(43,27,23,0.45)] md:shadow-[0_16px_0_rgba(43,27,23,0.5)] lg:shadow-[0_20px_0_rgba(43,27,23,0.5)] overflow-hidden relative group"
            style={{
              borderColor: section.accentColor,
            }}
          >
            {/* Animated background accent */}
            <div 
              className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500"
              style={{
                background: `linear-gradient(135deg, ${section.accentColor} 0%, ${section.accentColor}dd 100%)`,
              }}
            />
            {/* Package Header */}
            <div
              className="px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 py-4 sm:py-5 md:py-6 lg:py-8 border-b-2 sm:border-b-3 md:border-b-4 border-cereal-brown/20 relative z-10"
              style={{ borderColor: section.accentColor }}
            >
              <div className="flex items-start justify-between gap-3 sm:gap-4 relative z-10">
                <div className="flex-1 min-w-0">
                  <div className="inline-flex items-center px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 mb-3 sm:mb-4 rounded-full border-2 border-cereal-brown shadow-[2px_2px_0_#2B1B17] sm:shadow-[3px_3px_0_#2B1B17]"
                    style={{ backgroundColor: section.accentColor }}
                  >
                    <span className="text-[0.6rem] sm:text-[0.65rem] md:text-[0.7rem] lg:text-[0.75rem] tracking-[0.15em] sm:tracking-[0.18em] uppercase font-semibold text-cereal-cream">
                      {section.eyebrow}
                    </span>
                  </div>
                  <h1
                    ref={titleRef}
                    className="font-semibold text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-cereal-brown leading-tight opacity-0 break-words"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {section.title}
                  </h1>
                </div>
                
                {/* PLACEHOLDER: Custom icon/illustration area */}
                {section.icon ? (
                  <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24">
                    <img
                      src={section.icon}
                      alt=""
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="hidden sm:flex flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-cereal-brown/10 rounded-lg items-center justify-center border-2 border-dashed border-cereal-brown/30">
                    <span className="text-[0.6rem] sm:text-xs text-cereal-brown/40">ICON</span>
                  </div>
                )}
              </div>
            </div>

            {/* Package Content */}
            <div className="px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 py-4 sm:py-5 md:py-6 lg:py-8 xl:py-10 relative z-10">
              <div className="space-y-3 sm:space-y-4 md:space-y-5 text-sm sm:text-base md:text-lg leading-relaxed text-[#3B3734]">
                {section.body.map((p, idx) => (
                  <p
                    key={idx}
                    ref={(el) => setBodyRef(el, idx)}
                    className="opacity-0"
                  >
                    {p}
                  </p>
                ))}
              </div>

              {section.chips && (
                <div ref={chipsRef} className="mt-6 sm:mt-7 md:mt-8 lg:mt-10 flex flex-wrap gap-2 sm:gap-2.5 md:gap-3">
                  {section.chips.map((chip, idx) => (
                    <span
                      key={chip}
                      className="inline-flex items-center rounded-full border-2 border-cereal-brown/40 bg-cereal-cream px-3 py-1.5 sm:px-3.5 sm:py-2 md:px-4 md:py-2 text-xs sm:text-sm uppercase tracking-[0.1em] sm:tracking-[0.12em] text-cereal-brown font-semibold shadow-[1px_1px_0_rgba(43,27,23,0.2)] sm:shadow-[2px_2px_0_rgba(43,27,23,0.2)] opacity-0 scale-0"
                      style={{ borderColor: section.accentColor + "80" }}
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              )}

              {activeSection === "home" && (
                <div ref={buttonsRef} className="mt-6 sm:mt-7 md:mt-8 lg:mt-10 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => setActiveSection("featured")}
                    className="inline-flex items-center justify-center rounded-full border-2 border-cereal-brown bg-cereal-red px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold text-cereal-cream shadow-[3px_3px_0_#2B1B17] sm:shadow-[4px_4px_0_#2B1B17] hover:-translate-y-[2px] hover:shadow-[5px_5px_0_#2B1B17] sm:hover:shadow-[6px_6px_0_#2B1B17] active:translate-y-0 active:shadow-[3px_3px_0_#2B1B17] sm:active:shadow-[4px_4px_0_#2B1B17] transition-all duration-200 opacity-0 w-full sm:w-auto"
                  >
                    View featured projects
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSection("whereToBuy")}
                    className="inline-flex items-center justify-center rounded-full border-2 border-cereal-brown bg-cereal-cream px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold text-cereal-brown shadow-[3px_3px_0_#2B1B17] sm:shadow-[4px_4px_0_#2B1B17] hover:-translate-y-[2px] hover:shadow-[5px_5px_0_#2B1B17] sm:hover:shadow-[6px_6px_0_#2B1B17] active:translate-y-0 active:shadow-[3px_3px_0_#2B1B17] sm:active:shadow-[4px_4px_0_#2B1B17] transition-all duration-200 opacity-0 w-full sm:w-auto"
                  >
                    Contact & resume
                  </button>
                </div>
              )}

              {/* PLACEHOLDER: Section-specific content areas */}
              {activeSection === "featured" && (
                <div className="mt-6 sm:mt-8 md:mt-10 p-4 sm:p-6 md:p-8 bg-gradient-to-br from-cereal-red/10 to-cereal-deep/10 rounded-xl sm:rounded-2xl border-2 border-dashed border-cereal-red/30">
                  <p className="text-xs sm:text-sm text-cereal-brown/70 italic mb-2">
                    PLACEHOLDER: Add your project cards/grid here
                  </p>
                  <p className="text-[0.65rem] sm:text-xs text-cereal-brown/50">
                    Suggested: Grid of project cards with hover effects, click to open detailed modals
                  </p>
                </div>
              )}
              
              {activeSection === "skills" && (
                <div className="mt-6 sm:mt-8 md:mt-10 p-4 sm:p-6 md:p-8 bg-gradient-to-br from-cereal-teal/10 to-cereal-blue/10 rounded-xl sm:rounded-2xl border-2 border-dashed border-cereal-teal/30">
                  <p className="text-xs sm:text-sm text-cereal-brown/70 italic mb-2">
                    PLACEHOLDER: Add your skills visualization here
                  </p>
                  <p className="text-[0.65rem] sm:text-xs text-cereal-brown/50">
                    Suggested: Interactive skill bars, progress circles, or tag clouds with hover effects
                  </p>
                </div>
              )}
              
              {activeSection === "ingredients" && (
                <div className="mt-6 sm:mt-8 md:mt-10 p-4 sm:p-6 md:p-8 bg-gradient-to-br from-cereal-yellow/10 to-cereal-red/10 rounded-xl sm:rounded-2xl border-2 border-dashed border-cereal-yellow/30">
                  <p className="text-xs sm:text-sm text-cereal-brown/70 italic mb-2">
                    PLACEHOLDER: Add your detailed skills breakdown here
                  </p>
                  <p className="text-[0.65rem] sm:text-xs text-cereal-brown/50">
                    Suggested: Expandable accordion sections, detailed skill matrices, experience timelines
                  </p>
                </div>
              )}
              
              {activeSection === "whereToBuy" && (
                <div className="mt-6 sm:mt-8 md:mt-10 p-4 sm:p-6 md:p-8 bg-gradient-to-br from-cereal-blue/10 to-cereal-teal/10 rounded-xl sm:rounded-2xl border-2 border-dashed border-cereal-blue/30">
                  <p className="text-xs sm:text-sm text-cereal-brown/70 italic mb-2">
                    PLACEHOLDER: Add your contact links and resume here
                  </p>
                  <p className="text-[0.65rem] sm:text-xs text-cereal-brown/50">
                    Suggested: Interactive contact cards, social links with hover animations, resume download button
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// Aisle Navigation Button Component
function AisleButton({ aisle, isActive, onClick, accentColor }) {
  const buttonRef = useRef(null);
  const glowRef = useRef(null);
  const rippleRef = useRef(null);
  const hoverAnimationRef = useRef(null);

  useLayoutEffect(() => {
    if (!buttonRef.current) return;

    const ctx = gsap.context(() => {
      // Kill any existing hover animations
      if (hoverAnimationRef.current) {
        hoverAnimationRef.current.kill();
        hoverAnimationRef.current = null;
      }

      if (isActive) {
        // Reset any hover transforms first
        gsap.set(buttonRef.current, { scale: 1, y: 0 });
        
        gsap.to(buttonRef.current, {
          scale: 1.08,
          duration: 0.3,
          ease: "back.out(1.7)",
        });
        gsap.to(glowRef.current, {
          opacity: 0.4,
          scale: 1.3,
          duration: 0.4,
          ease: "power2.out",
        });
      } else {
        // Reset to default state
        gsap.set(buttonRef.current, { scale: 1, y: 0 });
        gsap.to(buttonRef.current, {
          scale: 1,
          duration: 0.2,
          ease: "power2.out",
        });
        gsap.to(glowRef.current, {
          opacity: 0,
          scale: 1,
          duration: 0.2,
          ease: "power2.out",
        });
      }
    }, buttonRef);

    return () => ctx.revert();
  }, [isActive]);

  const handleMouseEnter = () => {
    if (!isActive && buttonRef.current) {
      // Kill any existing animation
      if (hoverAnimationRef.current) {
        hoverAnimationRef.current.kill();
      }
      
      hoverAnimationRef.current = gsap.to(buttonRef.current, {
        scale: 1.05,
        y: -3,
        duration: 0.25,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = () => {
    // Always reset hover state, regardless of active state
    if (buttonRef.current) {
      // Kill any running hover animation
      if (hoverAnimationRef.current) {
        hoverAnimationRef.current.kill();
        hoverAnimationRef.current = null;
      }
      
      // Reset to appropriate state based on active
      if (isActive) {
        gsap.to(buttonRef.current, {
          scale: 1.08,
          y: 0,
          duration: 0.2,
          ease: "power2.out",
        });
      } else {
        gsap.to(buttonRef.current, {
          scale: 1,
          y: 0,
          duration: 0.2,
          ease: "power2.out",
        });
      }
    }
  };

  const handleClick = (e) => {
    // Ripple effect
    if (rippleRef.current && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      gsap.set(rippleRef.current, {
        left: x,
        top: y,
        scale: 0,
        opacity: 0.6,
      });
      
      gsap.to(rippleRef.current, {
        scale: 4,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      });
    }
    
    onClick();
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 lg:px-6 lg:py-3 rounded-md sm:rounded-lg border-2 font-bold text-xs sm:text-sm md:text-base uppercase tracking-wide sm:tracking-wider transition-all duration-200 overflow-hidden whitespace-nowrap ${
        isActive
          ? "text-cereal-cream shadow-[3px_3px_0_#2B1B17] sm:shadow-[4px_4px_0_#2B1B17]"
          : "text-cereal-brown bg-cereal-cream border-cereal-brown/40 hover:border-cereal-brown shadow-[2px_2px_0_rgba(43,27,23,0.3)] hover:shadow-[3px_3px_0_rgba(43,27,23,0.4)]"
      }`}
      style={{
        backgroundColor: isActive ? accentColor : undefined,
        borderColor: isActive ? accentColor : undefined,
      }}
    >
      <span className="relative z-10">
        {aisle.number && (
          <span className="text-[0.65em] sm:text-[0.7em] opacity-90 mr-0.5 sm:mr-1 font-extrabold">AISLE {aisle.number}</span>
        )}
        {aisle.label}
      </span>
      {isActive && (
        <span
          ref={glowRef}
          className="absolute inset-0 rounded-lg opacity-0 blur-lg -z-0"
          style={{
            backgroundColor: accentColor,
          }}
        />
      )}
      <span
        ref={rippleRef}
        className="absolute w-4 h-4 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
        style={{
          backgroundColor: accentColor,
        }}
      />
    </button>
  );
}

