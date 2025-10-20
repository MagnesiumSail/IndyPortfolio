import NavBar from '../components/defaultfolio/NavBar';
import Hero from '../components/defaultfolio/Hero';
import About from '../components/defaultfolio/About';
import Projects from '../components/defaultfolio/Projects';
import Contact from '../components/defaultfolio/Contact';
import ParallaxWaves from '../components/defaultfolio/Waves';
import Footer from '../components/defaultfolio/Footer';

export default function Page() {
  return (
    <main className="bg-[#0f1115] text-gray-300 min-h-screen font-[Inter] overflow-x-hidden">
      <NavBar />

      {/* Sections */}
      <Hero />
      <About />
      <Projects />
      <Contact />
      <Footer />
      <ParallaxWaves />
    </main>
  );
}
