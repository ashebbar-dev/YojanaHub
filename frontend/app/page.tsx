'use client';

import { Header } from '@/components/header';
import { HeroSection } from '@/components/hero-section';
import { PersonaQuickStart } from '@/components/persona-quick-start';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <PersonaQuickStart />
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-4">YojanaHub - Empowering Citizens with Information</p>
          <div className="text-sm">
            Built for the Hackathon Demo • Phase 4 Complete
          </div>
        </div>
      </footer>
    </div>
  );
}
