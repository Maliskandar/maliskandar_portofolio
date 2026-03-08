import ContactTerminal from '@/components/ContactTerminal';
import ProjectBento from '@/components/ProjectBento';
import TechMarquee from '@/components/TechMarquee';
import Hero from '../components/Hero';
import AboutMe from '@/components/AboutMe';
import Certifications from '@/components/Certifications';

export default function Home() {
  return (
    <main className="bg-dark min-h-screen">
      <Hero />
      <AboutMe />
      <Certifications />

      <TechMarquee />
      <ProjectBento />
      <ContactTerminal />
    </main>
  );
}