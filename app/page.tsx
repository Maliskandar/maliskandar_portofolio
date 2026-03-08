import BackendSpotlight from '@/components/BackendSpontlight';
import ContactTerminal from '@/components/ContactTerminal';
import ProjectBento from '@/components/ProjectBento';
import TechOrbit from '@/components/TechOrbit';
import Hero from '../components/Hero';
import AboutMe from '@/components/AboutMe';
import Certifications from '@/components/Certifications';

export default function Home() {
  return (
    <main className="bg-dark min-h-screen">
      <Hero />
      <AboutMe />
      <Certifications />
      <TechOrbit />
      <ProjectBento />
      <BackendSpotlight />
      <ContactTerminal />
    </main>
  );
}