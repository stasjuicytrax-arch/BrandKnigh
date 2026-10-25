// Возможности устройства. Читать один раз при старте: от них зависят 3D, Lenis, курсор.

const mq = (q: string) => typeof matchMedia === 'function' && matchMedia(q).matches;

export const reducedMotion = () => mq('(prefers-reduced-motion: reduce)');
export const finePointer = () => mq('(hover: hover) and (pointer: fine)');
export const isPhone = () => mq('(max-width: 767px)');

/** Слабое устройство: футер без 3D (TZ.md §5). */
export const lowEnd = () => {
  const n = navigator as Navigator & { deviceMemory?: number };
  return (n.hardwareConcurrency ?? 8) <= 4 || (n.deviceMemory ?? 8) <= 4;
};

let gl: boolean | null = null;
export const webglOk = () => {
  if (gl !== null) return gl;
  try {
    const c = document.createElement('canvas');
    gl = Boolean(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    gl = false;
  }
  return gl;
};

export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
