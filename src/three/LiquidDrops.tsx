// Капли жидкого хрома для прелоадера (TZ.md §3.1): 7 шаров MarchingCubes стягиваются в одну каплю
// в точке, где в первом экране стоит рыцарь.
import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { MarchingCubes } from 'three/examples/jsm/objects/MarchingCubes.js';
import { ChromeEnv } from './env';

const BALLS = Array.from({ length: 7 }, (_, i) => {
  const a = (i / 7) * Math.PI * 2;
  return { x: Math.cos(a) * 0.3, y: Math.sin(a * 1.7) * 0.18, z: Math.sin(a) * 0.12, r: 0.45 + (i % 3) * 0.12 };
});

function Drops({ start, merge }: { start: number; merge: number }) {
  const material = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: '#ffffff', metalness: 1, roughness: 0.05, clearcoat: 1 }),
    [],
  );
  const mc = useMemo(() => {
    const m = new MarchingCubes(48, material, false, false, 60000);
    m.isolation = 60;
    return m;
  }, [material]);
  const t0 = useRef<number | null>(null);

  useFrame(({ clock }) => {
    if (t0.current === null) t0.current = clock.elapsedTime;
    const t = (clock.elapsedTime - t0.current) * 1000;
    const k = Math.min(1, Math.max(0, (t - start) / merge));
    const e = 1 - Math.pow(1 - k, 3);
    mc.reset();
    BALLS.forEach((b, i) => {
      const wob = Math.sin(t / 380 + i) * 0.03 * (1 - e);
      const spread = 1 - e;
      mc.addBall(0.5 + (b.x + wob) * spread, 0.5 + (b.y - wob) * spread, 0.5 + b.z * spread, b.r * (0.5 + 0.5 * e), 12);
    });
    mc.update();
  });

  return <primitive object={mc} scale={1.1} />;
}

export default function LiquidDrops({ merge = 700 }: { merge?: number }) {
  return (
    <Canvas dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }} camera={{ position: [0, 0, 6], fov: 30 }}>
      <ChromeEnv resolution={128} />
      <Drops start={120} merge={merge} />
    </Canvas>
  );
}
