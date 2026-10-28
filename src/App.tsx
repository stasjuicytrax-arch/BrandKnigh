import { useEffect } from 'react';
import { Cursor } from '@/components/Cursor';
import { Header } from '@/components/Header';
import { AliveScene } from '@/sections/AliveScene';
import { Hello } from '@/sections/Hello';
import { Hero } from '@/sections/Hero';
import { Placeholders } from '@/sections/Placeholders';
import { initScroll, ScrollTrigger } from '@/lib/scroll';

export default function App() {
  useEffect(() => {
    initScroll();
    const t = setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Hello />
        <AliveScene />
        <Placeholders />
      </main>
      <Cursor />
    </>
  );
}
