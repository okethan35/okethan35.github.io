import { useState } from "react";
import shelfSvg from "../assets/Shelf.svg";

const SECTIONS = {
  home: {
    title: "Hey, I’m Ethan — full-stack dev & maker.",
    eyebrow: "WELCOME TO ETHAN'S PANTRY",
    body: [
      "I build playful, pragmatic products across web, mobile, and ML.",
      "Pick a product shelf on the left to explore featured projects, skills, and how to get in touch.",
    ],
    chips: ["Full-Stack Engineering", "UCLA 2026", "React · Node · ML"],
  },
  featured: {
    title: "Featured Flavors",
    eyebrow: "AISLE 01 · FEATURED PROJECTS",
    body: [
      "These are my flagship projects — the ones that best represent how I think about product, engineering, and shipping things that feel good to use.",
      "Click individual boxes (coming next) to dive into case studies with stack, decisions, and what I learned.",
    ],
    chips: ["Flagship work", "Case studies", "Hands-on builds"],
  },
  skills: {
    title: "Skills & Stack",
    eyebrow: "AISLE 02 · SKILLS",
    body: [
      "My main ingredients: JavaScript/TypeScript, React/React Native, Node/Express, Postgres/SQL, and ML tooling.",
      "On the shelves: languages, frameworks, data/ML, infrastructure, and design tools.",
    ],
    chips: ["Languages", "Frameworks", "Infra & tooling"],
  },
  ingredients: {
    title: "Ingredients & Nutrition",
    eyebrow: "AISLE 03 · INGREDIENTS",
    body: [
      "A more structured breakdown of my skills, from frontend ergonomics to backend APIs and data pipelines.",
      "Think of this as the nutrition label for how I work: strengths, experience level, and what I'm currently leveling up.",
    ],
    chips: ["Skill breakdown", "Experience levels", "Currently learning"],
  },
  whereToBuy: {
    title: "Where to Buy",
    eyebrow: "AISLE 04 · CONTACT",
    body: [
      "Want to work together, chat about an idea, or just talk snacks?",
      "This is where you’ll find my email, LinkedIn, GitHub, and a link to my resume.",
    ],
    chips: ["Email", "LinkedIn", "GitHub · Resume"],
  },
};

const SHELF_HOTSPOTS = [
  { id: "featured", aria: "Featured Flavors shelf", top: "5%", height: "20%" },
  { id: "skills", aria: "Skills shelf", top: "28%", height: "18%" },
  {
    id: "ingredients",
    aria: "Ingredients & Nutrition shelf",
    top: "48%",
    height: "20%",
  },
  {
    id: "whereToBuy",
    aria: "Where to Buy shelf",
    top: "71%",
    height: "20%",
  },
];

export default function ShelfScreen() {
  const [activeSection, setActiveSection] = useState("home");
  const section = SECTIONS[activeSection];

  return (
    <main className="min-h-screen bg-[#3B3734] text-cereal-brown flex flex-col md:flex-row items-stretch">
      {/* LEFT: Shelf (bigger) */}
      <section className="md:flex-[0_0_40%] w-full bg-cereal-cream flex items-center justify-center px-6 py-10">
        <div className="relative w-full max-w-xl">
          <img
            src={shelfSvg}
            alt="Grocery shelf navigation"
            className="w-full h-auto pointer-events-none select-none"
          />

          {SHELF_HOTSPOTS.map((spot) => (
            <button
              key={spot.id}
              type="button"
              aria-label={spot.aria}
              onClick={() => setActiveSection(spot.id)}
              className={`absolute left-0 right-0 group ${
                activeSection === spot.id ? "cursor-default" : "cursor-pointer"
              }`}
              style={{ top: spot.top, height: spot.height }}
            >
              <span
                className={`block w-full h-full transition ${
                  activeSection === spot.id
                    ? "bg-black/5"
                    : "bg-transparent group-hover:bg-black/4"
                }`}
              />
            </button>
          ))}
        </div>
      </section>

      {/* RIGHT: Content panel */}
      <section className="flex-1 flex items-center justify-center px-6 md:px-10 py-10">
        <div className="w-full max-w-3xl">
          <div className="bg-cereal-cream rounded-3xl border border-black/10 shadow-[0_16px_0_rgba(43,27,23,0.35)] px-6 sm:px-10 py-8 sm:py-10">
            <div className="inline-flex items-center px-4 py-1.5 mb-5 rounded-full border-2 border-cereal-brown bg-cereal-red shadow-[3px_3px_0_#2B1B17]">
              <span className="text-[0.7rem] tracking-[0.18em] uppercase font-semibold text-cereal-cream">
                {section.eyebrow}
              </span>
            </div>

            <h1 className="font-semibold text-xl sm:text-2xl md:text-3xl text-cereal-brown mb-4">
              {section.title}
            </h1>

            <div className="space-y-3 text-sm sm:text-base leading-relaxed text-[#3B3734]">
              {section.body.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {section.chips && (
              <div className="mt-6 flex flex-wrap gap-2">
                {section.chips.map((chip) => (
                  <span
                    key={chip}
                    className="inline-flex items-center rounded-full border border-[#2B1B17]/30 bg-cereal-cream px-3 py-1 text-[0.7rem] uppercase tracking-[0.12em] text-[#2B1B17]/80"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            )}

            {activeSection === "home" && (
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setActiveSection("featured")}
                  className="inline-flex items-center justify-center rounded-full border-2 border-[#2B1B17] bg-[#F0544F] px-5 py-2 text-sm font-semibold text-cereal-cream shadow-[3px_3px_0_#2B1B17] hover:-translate-y-[2px] hover:shadow-[5px_5px_0_#2B1B17] transition"
                >
                  View featured projects
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSection("whereToBuy")}
                  className="inline-flex items-center justify-center rounded-full border-2 border-[#2B1B17] bg-[#FFF5E0] px-5 py-2 text-sm font-semibold text-[#2B1B17] hover:-translate-y-[2px] hover:shadow-[3px_3px_0_#2B1B17] transition"
                >
                  Contact & resume
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
