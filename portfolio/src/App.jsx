import KnifeHero from "./components/KnifeHero";
import PantryHero from "./components/PantryHero";
import GroceryShelfHero from "./components/GroceryShelfHero";
import IngredientsSection from "./components/IngredientsSection";
import ProjectsSection from "./components/ProjectsSection";
import AboutSection from "./components/AboutSection";
import ContactSection from "./components/ContactSection";

function App() {
  return (
    <div className="bg-cereal-cream text-cereal-brown">
      {/* Hero with knife slice */}
      <GroceryShelfHero />

      {/* Main “back of the box” content */}
      <main className="max-w-5xl mx-auto px-4 pb-24 space-y-24">
        <IngredientsSection />
        <ProjectsSection />
        <AboutSection />
        <ContactSection />
      </main>
    </div>
  );
}

export default App;
