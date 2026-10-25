// Знак BRK, выдавленный из SVG-контура и отлитый в жидком хроме (TZ.md §4.1).
// Ширина геометрии нормализована к 1, чтобы сцена задавала размер в экранных px.
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import knightSvg from './knight-path.svg?raw';

export function useKnightGeometry(bevelSegments: number) {
  return useMemo(() => {
    const data = new SVGLoader().parse(knightSvg);
    const shapes = data.paths.flatMap((p) => SVGLoader.createShapes(p));
    const box = new THREE.Box2();
    shapes.forEach((s) => s.getPoints().forEach((pt) => box.expandByPoint(pt)));
    const width = box.max.x - box.min.x;
    const u = width; // 1 ед. мира = ширина знака
    const geo = new THREE.ExtrudeGeometry(shapes, {
      // ТЗ: depth 0.35 / bevel 0.04 в своих единицах; на рендере при такой глубине буквы читались как кирпичи,
      // поэтому глубина 9% ширины знака (см. NOTES.md, этап 3)
      depth: 0.09 * u,
      bevelEnabled: true,
      bevelSize: 0.02 * u,
      bevelThickness: 0.022 * u,
      bevelSegments,
      curveSegments: bevelSegments > 3 ? 16 : 8,
    });
    // SVG смотрит вниз по Y: разворот на 180° вокруг X ставит буквы прямо и не меняет обход граней
    geo.rotateX(Math.PI);
    geo.center();
    geo.scale(1 / u, 1 / u, 1 / u);
    // свои нормали экструзии: крышки строго плоские (сглаживание с фаской рисовало на них полосы)
    return geo;
  }, [bevelSegments]);
}

/** Хром с «дыханием»: слабое смещение вершин по шуму (амплитуда 0.015 при ширине 2). */
export function useChromeMaterial(breathe: boolean) {
  const uniforms = useRef({ uTime: { value: 0 } });
  const material = useMemo(() => {
    const m = new THREE.MeshPhysicalMaterial({
      color: '#ffffff',
      metalness: 1,
      roughness: 0.06,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
    });
    if (breathe) {
      m.onBeforeCompile = (shader) => {
        shader.uniforms.uTime = uniforms.current.uTime;
        shader.vertexShader = shader.vertexShader
          .replace('#include <common>', '#include <common>\nuniform float uTime;')
          .replace(
            '#include <begin_vertex>',
            `#include <begin_vertex>
            float n = sin(position.x * 9.0 + uTime * 0.9) * sin(position.y * 11.0 - uTime * 0.7)
                    + 0.5 * sin((position.x + position.y) * 17.0 + uTime * 1.3);
            transformed += normal * n * 0.0075 * 0.66;`,
          );
      };
    }
    return m;
  }, [breathe]);
  useFrame((_, dt) => {
    uniforms.current.uTime.value += dt;
  });
  return material;
}
