const projects = [
  {
    name: "Tunnl Vision",
    tagline: "Dyslexia-friendly transit & text overlay.",
    flavor: "Spicy Accessibility",
    meta: "React Native · OCR · Accessibility",
  },
  {
    name: "UCLA Accessibility Map",
    tagline: "Campus navigation that respects your knees.",
    flavor: "Extra Accessible",
    meta: "Next.js · Maps · UX Research",
  },
  {
    name: "Body-CV Analytics",
    tagline: "Biomechanics data prepped for ML breakfast.",
    flavor: "High-Protein Data",
    meta: "Python · Pandas · ML Pipelines",
  },
];

export default function ProjectsSection() {
  return (
    <section id="projects">
      <h2 className="font-display text-3xl md:text-4xl text-cereal-red drop-shadow-[2px_2px_0_#2B1B17] mb-4">
        Limited Edition Flavors
      </h2>
      <p className="text-sm mb-6">
        A few boxes from the shelf. Hover, click, or read the label.
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        {projects.map((p) => (
          <article
            key={p.name}
            className="relative bg-cereal-yellow rounded-2xl border-4 border-cereal-brown p-4 flex flex-col justify-between shadow-[6px_6px_0_#2B1B17] hover:-translate-y-1 hover:shadow-[8px_8px_0_#2B1B17] transition-transform"
          >
            <div>
              <h3 className="font-display text-xl leading-tight text-cereal-red">
                {p.name}
              </h3>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-cereal-brown">
                {p.flavor}
              </p>
              <p className="mt-3 text-sm">{p.tagline}</p>
            </div>
            <p className="mt-4 text-[0.7rem] uppercase tracking-[0.18em] text-cereal-brown">
              {p.meta}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
