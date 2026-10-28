// Первый экран (TZ.md §4.1, DESIGN.md v2 §6): стеклянный узел с радужным переливом проходит сквозь слоган.
// Перенос design/concept/index.html в R3F один в один: те же шейдер света, текстура слогана, материал, свет и поведение.
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

type Props = {
  /** Сцена в кадре: вне экрана рендер стоит */
  visible: boolean;
  /** Прогресс скролла первого экрана 0..1 (поворот узла) */
  scroll: { current: number };
  /** Начать печать SOLUTION (после загрузки) */
  typing: boolean;
  reduced: boolean;
  /** 0..1 — узел собирается из прозрачности во время загрузки (прелоадер TZ.md §3.1) */
  appear: { current: number };
  onReady: () => void;
};

const BG_VERT = /* glsl */ `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`;
const BG_FRAG = /* glsl */ `varying vec2 vUv; uniform float uT; uniform float uAspect;
  float blob(vec2 p, vec2 c, float r){ return smoothstep(r, 0.0, length(p-c)); }
  void main(){
    vec2 p = vUv; p.x *= uAspect;
    vec3 base = vec3(0.953,0.961,0.937);
    vec3 lime = vec3(0.824,1.0,0.122);
    vec3 mint = vec3(0.80,0.95,0.86);
    float t = uT*0.12;
    float a = blob(p, vec2(uAspect*(0.22+0.08*sin(t*1.3)), 0.30+0.08*cos(t)), 0.55);
    float b = blob(p, vec2(uAspect*(0.80+0.06*cos(t*0.9)), 0.78+0.06*sin(t*1.1)), 0.50);
    float c = blob(p, vec2(uAspect*(0.55+0.10*sin(t*0.7)), 0.10), 0.40);
    vec3 col = base;
    col = mix(col, lime, a*0.55);
    col = mix(col, mint, b*0.70);
    col = mix(col, lime*0.95+0.05, c*0.35);
    gl_FragColor = vec4(col,1.0);
    #include <colorspace_fragment>
  }`;

function visibleSize(camera: THREE.PerspectiveCamera, z: number) {
  const d = camera.position.z - z;
  const h = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * d;
  return { w: h * camera.aspect, h };
}

/** Слоган «WE CREATE / DIGITAL / _SOLUTION» на canvas: курсор мигает 530 мс, SOLUTION печатается 70 мс/буква. */
function useSloganTexture(typing: boolean, reduced: boolean) {
  const { size } = useThree();
  const state = useRef({ typed: 8, cursorOn: true });
  const canvas = useMemo(() => document.createElement('canvas'), []);
  const texture = useMemo(() => {
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, [canvas]);

  const draw = useRef(() => {});
  draw.current = () => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = size.width, h = size.height;
    const dpr = Math.min(window.devicePixelRatio, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const mobile = w < 700;
    const fs = Math.min(W * (mobile ? 0.118 : 0.084), H * 0.2);
    ctx.font = `800 ${fs}px Unbounded`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#0B0B0B';
    const lh = fs * 0.98;
    const cy = H * (mobile ? 0.4 : 0.47);
    const { typed, cursorOn } = state.current;
    const lines = ['WE CREATE', 'DIGITAL', 'SOLUTION'.slice(0, typed)];
    lines.forEach((l, i) => {
      const y = cy + (i - 1) * lh + fs * 0.36;
      if (i === 2) {
        const full = ctx.measureText('_SOLUTION').width;
        const x0 = W / 2 - full / 2;
        ctx.textAlign = 'left';
        if (cursorOn) ctx.fillRect(x0, y - fs * 0.02, fs * 0.5, fs * 0.11);
        ctx.fillText(l, x0 + fs * 0.62, y);
        ctx.textAlign = 'center';
      } else ctx.fillText(l, W / 2, y);
    });
    texture.needsUpdate = true;
  };

  useEffect(() => {
    draw.current();
  }, [size.width, size.height]);

  // печать и стирание SOLUTION
  useEffect(() => {
    if (!typing || reduced) return;
    let timer = 0;
    const s = state.current;
    s.typed = 0;
    draw.current();
    const step = () => {
      s.typed++;
      draw.current();
      timer = window.setTimeout(s.typed < 8 ? step : erase, s.typed < 8 ? 70 : 5200);
    };
    const erase = () => {
      s.typed--;
      draw.current();
      timer = window.setTimeout(s.typed > 0 ? erase : step, s.typed > 0 ? 35 : 300);
    };
    timer = window.setTimeout(step, 400);
    return () => clearTimeout(timer);
  }, [typing, reduced]);

  // мигание курсора
  useEffect(() => {
    if (reduced) return;
    const t = window.setInterval(() => {
      state.current.cursorOn = !state.current.cursorOn;
      draw.current();
    }, 530);
    return () => clearInterval(t);
  }, [reduced]);

  return texture;
}

function Scene({ visible, scroll, typing, reduced, appear, onReady }: Props) {
  const { gl, scene, camera, size } = useThree();
  const cam = camera as THREE.PerspectiveCamera;
  const bg = useRef<THREE.Mesh>(null);
  const text = useRef<THREE.Mesh>(null);
  const knot = useRef<THREE.Mesh>(null);
  const pivot = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const ready = useRef(false);
  const mobile = size.width < 700;

  const bgMat = useMemo(
    () => new THREE.ShaderMaterial({ uniforms: { uT: { value: 0 }, uAspect: { value: 1 } }, vertexShader: BG_VERT, fragmentShader: BG_FRAG, depthWrite: false }),
    [],
  );
  const texture = useSloganTexture(typing, reduced);
  const knotGeo = useMemo(() => new THREE.TorusKnotGeometry(1, 0.34, mobile ? 160 : 360, mobile ? 32 : 64, 2, 3), [mobile]);
  const glass = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff, transmission: 1, thickness: 1.4, roughness: 0.04, ior: 1.42,
        iridescence: 1, iridescenceIOR: 1.35, iridescenceThicknessRange: [120, 520],
        dispersion: 5, clearcoat: 1, clearcoatRoughness: 0.05,
        attenuationColor: new THREE.Color('#E9FF9A'), attenuationDistance: 2.6,
        specularIntensity: 1, envMapIntensity: 1.25,
      }),
    [],
  );

  // рендерер и окружение как в образце
  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.05;
    gl.outputColorSpace = THREE.SRGBColorSpace;
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    return () => {
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);

  // размеры: фон и слоган на всю видимую область, узел в долях
  useEffect(() => {
    const vb = visibleSize(cam, -8);
    bg.current?.scale.set(vb.w * 1.1, vb.h * 1.1, 1);
    bgMat.uniforms.uAspect.value = cam.aspect;
    const vt = visibleSize(cam, 0);
    text.current?.scale.set(vt.w, vt.h, 1);
    const s = Math.min(vt.w, vt.h) * (mobile ? 0.25 : 0.2);
    knot.current?.scale.setScalar(s);
    pivot.current?.position.set(mobile ? 0 : vt.w * 0.06, mobile ? -vt.h * 0.06 : -vt.h * 0.02, 0);
  }, [size.width, size.height, cam, bgMat, mobile]);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      mouse.current.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', move);
    return () => window.removeEventListener('pointermove', move);
  }, []);

  useFrame(({ clock }) => {
    if (!visible || !knot.current || !pivot.current) return;
    const t = clock.getElapsedTime();
    const m = mouse.current;
    m.x += (m.tx - m.x) * 0.05;
    m.y += (m.ty - m.y) * 0.05;
    bgMat.uniforms.uT.value = t;
    const spin = reduced ? 0 : t;
    const sp = scroll.current;
    knot.current.rotation.x = spin * 0.18 + m.y * 0.5 + sp * 1.4;
    knot.current.rotation.y = spin * 0.26 + m.x * 0.7 + sp * 2.2;
    knot.current.rotation.z = Math.sin(spin * 0.3) * 0.25;
    const target = (reduced ? 0 : Math.sin(t * 0.8) * 0.06) + (mobile ? -0.3 : -0.1);
    pivot.current.position.y += (target - pivot.current.position.y) * 0.04;
    // загрузка: узел собирается из прозрачности (масштаб 0.6→1, перелив разгорается)
    const k = appear.current;
    pivot.current.scale.setScalar(0.6 + 0.4 * (1 - Math.pow(1 - k, 3)));
    glass.iridescence = k;
    cam.position.x = m.x * 0.35;
    cam.position.y = -m.y * 0.25;
    cam.lookAt(0, 0, 0);
    if (!ready.current) {
      ready.current = true;
      onReady();
    }
  });

  return (
    <>
      <mesh ref={bg} position-z={-8} material={bgMat}>
        <planeGeometry args={[1, 1]} />
      </mesh>
      <mesh ref={text}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={texture} alphaTest={0.5} toneMapped={false} />
      </mesh>
      <group ref={pivot}>
        <mesh ref={knot} geometry={knotGeo} material={glass} />
      </group>
      <directionalLight color="#D2FF1F" intensity={2.2} position={[4, 3, 5]} />
      <directionalLight color="#ffffff" intensity={1.4} position={[-5, -2, 3]} />
    </>
  );
}

export default function HeroScene(props: Props) {
  const phone = typeof window !== 'undefined' && window.innerWidth < 900;
  const [dpr, setDpr] = useState(phone ? 1.5 : 1.75);
  return (
    <Canvas
      className="hero__gl"
      aria-hidden
      dpr={[1, dpr]}
      frameloop={props.visible ? 'always' : 'never'}
      gl={{ antialias: true, alpha: false }}
      camera={{ position: [0, 0, 12], fov: 32, near: 0.1, far: 100 }}
    >
      <PerformanceMonitor onDecline={() => setDpr((d) => Math.max(1, d - 0.35))} />
      <Scene {...props} />
    </Canvas>
  );
}
