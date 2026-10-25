import { useCallback, useEffect, useState } from 'react';
import { Cursor } from '@/components/Cursor';
import { Header } from '@/components/Header';
import { Preloader, shouldPreload } from '@/components/Preloader';
import { AliveScene } from '@/sections/AliveScene';
import { Hello } from '@/sections/Hello';
import { Hero } from '@/sections/Hero';
import { Placeholders } from '@/sections/Placeholders';
import { initScroll, ScrollTrigger } from '@/lib/scroll';

export default function App() {
  const [preload] = useState(shouldPreload);
  const [entered, setEntered] = useState(!preload);
  const [preloading, setPreloading] = useState(preload);
  const reveal = useCallback(() => setEntered(true), []);
  const done = useCallback(() => setPreloading(false), []);

  useEffect(() => {
    initScroll();
    const t = setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <Header />
      <main>
        <Hero entered={entered} />
        <Hello />
        <AliveScene />
        <Placeholders />
      </main>
      <Cursor />
      {preloading && <Preloader onReveal={reveal} onDone={done} />}
    </>
  );
}
