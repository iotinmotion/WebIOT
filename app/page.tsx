import Nav from "./_components/Nav";
import Hero from "./_components/Hero";
import Platform from "./_components/Platform";
import Solutions from "./_components/Solutions";
import Projects from "./_components/Projects";
import News from "./_components/News";
import Pillars from "./_components/Pillars";
import Timeline from "./_components/Timeline";
import About from "./_components/About";
import Clients from "./_components/Clients";
import Contact from "./_components/Contact";
import Footer from "./_components/Footer";
import ScrollTop from "./_components/ScrollTop";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Platform />
        <Solutions />
        <Projects />
        <News />
        <Pillars />
        <Timeline />
        <About />
        <Clients />
        <Contact />
      </main>
      <Footer />
      <ScrollTop />
    </>
  );
}
