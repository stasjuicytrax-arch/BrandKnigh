import { useEffect } from 'react';
import { Cursor } from '@/components/Cursor';
import { Header } from '@/components/Header';
import { GlassFilter } from '@/components/ui/liquid-glass';
import { AliveScene } from '@/sections/AliveScene';
import { Characters, Identity } from '@/sections/Brand';
import { Clients } from '@/sections/Clients';
import { Contact, Footer } from '@/sections/Contact';
import { Hello } from '@/sections/Hello';
import { Hero } from '@/sections/Hero';
import { Posters } from '@/sections/Posters';
import { Services } from '@/sections/Services';
import { Sites } from '@/sections/Sites';
import { Videos } from '@/sections/Videos';
import { initMagnetic, initReveals } from '@/lib/motion';
import { initScroll, ScrollTrigger } from '@/lib/scroll';

export default function App() {
  useEffect(() => {
    initScroll();
    const offReveal = initReveals(document.body);
    const offMagnet = initMagnetic();
    const t = setTimeout(() => ScrollTrigger.refresh(), 600);
    return () => {
      clearTimeout(t);
      offReveal();
      offMagnet();
    };
  }, []);

  return (
    <>
      <GlassFilter />
      <Header />
      <main>
        <Hero />
        <Hello />
        <AliveScene />
        <Videos />
        <Posters />
        <Sites />
        <Services />
        <Identity />
        <Characters />
        <Clients />
        <Contact />
      </main>
      <Footer />
      <Cursor />
    </>
  );
}
