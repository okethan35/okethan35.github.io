export default function ContactSection() {
  return (
    <section id="contact">
      <h2 className="font-display text-3xl md:text-4xl text-cereal-red drop-shadow-[2px_2px_0_#2B1B17] mb-4">
        Where to Find This Flavor
      </h2>
      <div className="bg-cereal-yellow rounded-2xl border-4 border-cereal-brown p-6 md:p-8 shadow-[6px_6px_0_#2B1B17] flex flex-wrap gap-4 items-center">
        <p className="text-sm max-w-md">
          Want to chat about an internship, collaboration, or project? Grab a
          box off the shelf:
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="mailto:youremail@example.com"
            className="px-4 py-2 bg-cereal-red text-cereal-cream text-xs font-semibold rounded-full border-2 border-cereal-brown hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#2B1B17] transition-transform"
          >
            EMAIL
          </a>
          <a
            href="https://github.com/your-handle"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-cereal-cream text-cereal-brown text-xs font-semibold rounded-full border-2 border-cereal-brown hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#2B1B17] transition-transform"
          >
            GITHUB
          </a>
          <a
            href="https://www.linkedin.com/in/your-handle"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-cereal-teal text-cereal-cream text-xs font-semibold rounded-full border-2 border-cereal-brown hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#2B1B17] transition-transform"
          >
            LINKEDIN
          </a>
        </div>
      </div>
    </section>
  );
}
