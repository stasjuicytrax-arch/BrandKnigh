// Сцена первого экрана: хромовый рыцарь BRK (TZ.md §4.1).
// Канвас фиксирован на весь вьюпорт поверх контента (pointer-events: none), чтобы рыцарь мог
// долететь до слота логотипа в шапке. После посадки канвас прячется, в шапке остаётся SVG.
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, PerformanceMonitor } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ChromeEnv } from './env';
import { useChromeMaterial, useKnightGeometry } from './ChromeKnight';
import { KNIGHT_ASPECT, emitFlight, flight, heroPose, onFlight } from './flight';

const DEG = Math.PI / 180;
const CAMERA: [number, number, number] = [0, 1.4, 10];

// Экранная точка → точка на плоскости z=0 (камера чуть сверху, чтобы была видна контактная тень)
const ndc = new THREE.Vector3();
const dir = new THREE.Vector3();
function screenToPlane(px: number, py: number, vw: number, vh: number, camera: THREE.Camera, out: THREE.Vector3) {
  ndc.set((px / vw) * 2 - 1, -(py / vh) * 2 + 1, 0.5).unproject(camera);
  dir.copy(ndc).sub(camera.position).normalize();
  const t = -camera.position.z / dir.z;
  return out.copy(camera.position).addScaledVector(dir, t);
}
const a = new THREE.Vector3();
const b = new THREE.Vector3();
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function Knight({ phone, still }: { phone: boolean; still: boolean }) {
  const geometry = useKnightGeometry(phone ? 3 : 8);
  // «дыхание» вершин выключено: у плоских крышек экструзии крупные треугольники, шум рисует на них сетку
  const material = useChromeMaterial(false);
  const group = useRef<THREE.Group>(null);
  const shadow = useRef<THREE.Group>(null);
  const tilt = useRef({ x: 0, y: 0 });
  const { size, camera, invalidate } = useThree();
  const firstFrame = useRef(true);

  useEffect(() => onFlight(invalidate), [invalidate]);

  useFrame(({ clock }, dt) => {
    const g = group.current;
    if (!g) return;
    const vw = size.width, vh = size.height;

    const home = heroPose(vw, vh);
    const p = ease(Math.min(1, Math.max(0, flight.progress)));
    const t = flight.target.w ? flight.target : { x: 40, y: 32, w: 56 };
    const cx = home.cx + (t.x - home.cx) * p;
    const cy = home.cy + (t.y - home.cy) * p;
    const w = home.w + (t.w - home.w) * p;

    screenToPlane(cx - w / 2, cy, vw, vh, camera, a);
    screenToPlane(cx + w / 2, cy, vw, vh, camera, b);
    g.position.copy(a).add(b).multiplyScalar(0.5);
    g.scale.setScalar(a.distanceTo(b));

    // дрейф ±12° (период 8 с) + наклон к курсору / гироскопу ±15° на пружине
    const time = still ? 0 : clock.elapsedTime;
    const drift = Math.sin((time / 8) * Math.PI * 2) * 12 * DEG;
    const k = 1 - Math.exp(-dt * 6);
    tilt.current.x += (flight.pointer.y * 15 * DEG - tilt.current.x) * k;
    tilt.current.y += (flight.pointer.x * 15 * DEG - tilt.current.y) * k;
    const calm = 1 - p; // в полёте личное движение затухает, остаётся оборот 360°
    g.rotation.set(tilt.current.x * calm, (drift + tilt.current.y) * calm + p * Math.PI * 2, 0);

    if (shadow.current) {
      // тень лежит под знаком в первом экране и гаснет, как только рыцарь взлетает
      shadow.current.visible = p < 0.3;
      screenToPlane(home.cx - home.w / 2, home.cy, vw, vh, camera, a);
      screenToPlane(home.cx + home.w / 2, home.cy, vw, vh, camera, b);
      const s = a.distanceTo(b);
      shadow.current.position.set((a.x + b.x) / 2, (a.y + b.y) / 2 - s / KNIGHT_ASPECT / 2 - s * 0.06, 0);
      shadow.current.scale.setScalar(s);
    }
    if (firstFrame.current) {
      firstFrame.current = false;
      flight.ready = true;
      emitFlight();
    }
  });

  return (
    <>
      <group ref={group}>
        <mesh geometry={geometry} material={material} />
      </group>
      <group ref={shadow}>
        <ContactShadows opacity={0.25} scale={[1.5, 0.5]} blur={2.4} far={0.7} resolution={phone ? 256 : 512} frames={still ? 1 : Infinity} color="#0b0b0b" />
      </group>
    </>
  );
}

export default function KnightScene({ still = false }: { still?: boolean }) {
  const phone = typeof window !== 'undefined' && window.innerWidth < 768;
  const [dpr, setDpr] = useState(phone ? 1.5 : 1.75);
  const [active, setActive] = useState(true);
  const wrap = useRef<HTMLDivElement>(null);

  // канвас рисует только пока рыцарь виден: в первом экране или в полёте
  useEffect(() => {
    const sync = () => {
      const landed = flight.progress >= 0.999;
      setActive(!landed);
      if (wrap.current) wrap.current.style.visibility = landed ? 'hidden' : 'visible';
    };
    sync();
    return onFlight(sync);
  }, []);

  // наклон к курсору; на телефоне — гироскоп, только после первого жеста и без запроса разрешения
  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      flight.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      flight.pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const orient = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      flight.pointer.x = Math.max(-1, Math.min(1, e.gamma / 30));
      flight.pointer.y = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
    };
    const needsPermission = typeof (DeviceOrientationEvent as unknown as { requestPermission?: unknown }).requestPermission === 'function';
    const arm = () => {
      if (!needsPermission) window.addEventListener('deviceorientation', orient);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('touchstart', arm, { once: true, passive: true });
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('touchstart', arm);
      window.removeEventListener('deviceorientation', orient);
    };
  }, []);

  return (
    <div ref={wrap} className="knight-canvas" aria-hidden>
      <Canvas
        dpr={[1, dpr]}
        frameloop={still ? 'demand' : active ? 'always' : 'never'}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: CAMERA, fov: 30 }}
        onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
      >
        <PerformanceMonitor onDecline={() => setDpr((d) => Math.max(1, d - 0.35))} />
        <ChromeEnv resolution={phone ? 128 : 256} still={still} />
        <Knight phone={phone} still={still} />
      </Canvas>
    </div>
  );
}
