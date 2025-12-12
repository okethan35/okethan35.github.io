export default function AboutSection() {
  return (
    <section id="about">
      <h2 className="font-display text-3xl md:text-4xl text-cereal-red drop-shadow-[2px_2px_0_#2B1B17] mb-4">
        Story on the Back of the Box
      </h2>
      <div className="bg-white rounded-2xl border-4 border-cereal-brown p-6 md:p-8 shadow-[6px_6px_0_#2B1B17] text-sm leading-relaxed">
        <p className="mb-3">
          Hey, I’m Ethan — a CS &amp; Linguistics student at UCLA who likes
          mixing software engineering with accessibility, ML, and a little bit
          of food-nerd energy.
        </p>
        <p className="mb-3">
          I&apos;ve built things like dyslexia-friendly reading tools, campus
          accessibility maps, and biomech data pipelines. I love turning messy
          real-world problems into interfaces and systems that feel delightful
          to use.
        </p>
        <p>
          When I&apos;m not coding, I&apos;m probably figuring out how to make a
          better pastry, planning a snowboard trip, or overthinking typography
          choices for projects like this one.
        </p>
      </div>
    </section>
  );
}
