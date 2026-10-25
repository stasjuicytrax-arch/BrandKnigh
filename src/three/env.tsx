// Окружение для хрома (DESIGN.md §6): две белые панели, лаймовая полоса, чёрная снизу. Внешние HDR не нужны.
// Фон окружения светло-серый, чтобы хром на белой странице читался серебром, а не графитом.
// Лаймовая полоса раз в 6 с проезжает по дуге, и по металлу бежит лаймовый блик.
import { Environment, Lightformer } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Group } from 'three';

const PERIOD = 6;
const SWEEP = 1.6; // сколько секунд из шести полоса в движении

export function ChromeEnv({ resolution = 256, still = false }: { resolution?: number; still?: boolean }) {
  const lime = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!lime.current || still) return;
    const t = clock.elapsedTime % PERIOD;
    const k = Math.min(1, t / SWEEP);
    const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
    const a = 0.9 - e * 1.8; // дуга справа налево перед объектом
    lime.current.position.set(Math.sin(a) * 6.5, 0.4, Math.cos(a) * 6.5);
    lime.current.lookAt(0, 0, 0);
  });

  return (
    <Environment resolution={resolution} frames={still ? 1 : Infinity} background={false}>
      <color attach="background" args={['#6b6b67']} />
      {/* белые широкие: сверху и слева */}
      <Lightformer form="rect" intensity={2.4} color="#ffffff" position={[0, 5, 1]} rotation-x={Math.PI / 2} scale={[14, 4, 1]} />
      <Lightformer form="rect" intensity={1.8} color="#ffffff" position={[-5, 0.5, 2]} rotation-y={Math.PI / 2} scale={[10, 4, 1]} />
      {/* за камерой: ленты, которые отражаются в плоских гранях букв и бегут по ним при дрейфе.
          Камера смотрит чуть сверху, поэтому грани видят зону ниже горизонта */}
      <Lightformer form="rect" intensity={2} color="#ffffff" position={[0, -1.1, 7]} scale={[16, 1.5, 1]} />
      <Lightformer form="rect" intensity={1} color="#0b0b0b" position={[0, -0.18, 7]} scale={[16, 0.32, 1]} />
      <Lightformer form="rect" intensity={1.5} color="#ffffff" position={[0, 0.35, 7]} scale={[16, 0.5, 1]} />
      <Lightformer form="rect" intensity={1} color="#0b0b0b" position={[0, -2.35, 7]} scale={[16, 0.9, 1]} />
      <Lightformer form="rect" intensity={1.2} color="#ffffff" position={[0, 2.4, 7]} scale={[16, 2, 1]} />
      {/* узкая лаймовая полоса, ездит по дуге */}
      <group ref={lime} position={[4.5, 0.4, 2.5]}>
        <Lightformer form="rect" intensity={3.4} color="#d2ff1f" scale={[0.7, 10, 1]} />
      </group>
      {/* чёрный пол: контраст в металле */}
      <Lightformer form="rect" intensity={1} color="#0b0b0b" position={[0, -4, 1]} rotation-x={-Math.PI / 2} scale={[14, 8, 1]} />
    </Environment>
  );
}
