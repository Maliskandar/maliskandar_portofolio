import BackendSpotlight from '@/components/BackendSpontlight';
import ContactTerminal from '@/components/ContactTerminal';
import ProjectBento from '@/components/ProjectBento';
import TechOrbit from '@/components/TechOrbit';
import Hero from '../components/Hero';

export default function Home() {
  return (
    <main className="bg-dark min-h-screen">
      <Hero />
      <TechOrbit />
      <ProjectBento />
      <BackendSpotlight />
      <ContactTerminal />
    </main>
  );
}