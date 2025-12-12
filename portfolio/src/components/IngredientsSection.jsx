export default function IngredientsSection() {
  return (
    <section id="skills" className="mt-16">
      <h2 className="font-display text-3xl md:text-4xl text-cereal-red drop-shadow-[2px_2px_0_#2B1B17] mb-4">
        Ingredients
      </h2>
      <p className="text-sm mb-4">
        A not-so-secret blend of tools and flavors I cook with most often.
      </p>

      <div className="bg-white rounded-2xl border-4 border-cereal-brown p-6 md:p-8 shadow-[6px_6px_0_#2B1B17] grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-body font-semibold text-xs uppercase tracking-[0.2em] mb-2">
            Primary Flavors
          </h3>
          <ul className="space-y-1 text-sm">
            <li>• JavaScript / TypeScript</li>
            <li>• React, React Native, Expo</li>
            <li>• Node.js, Express</li>
            <li>• Python for ML &amp; data</li>
            <li>• SQL &amp; relational databases</li>
          </ul>
        </div>
        <div>
          <h3 className="font-body font-semibold text-xs uppercase tracking-[0.2em] mb-2">
            Seasonings
          </h3>
          <ul className="space-y-1 text-sm">
            <li>• Tailwind CSS &amp; design systems</li>
            <li>• GSAP / Framer Motion animations</li>
            <li>• Git, GitHub, CI/CD basics</li>
            <li>• Accessibility-first mindset</li>
            <li>• Linguistics &amp; UX writing</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
