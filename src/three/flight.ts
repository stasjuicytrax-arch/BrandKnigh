// Общее состояние фирменного движения «Полёт» (TZ.md §4.1): DOM пишет, 3D-сцена читает в useFrame.

type Listener = () => void;

export const flight = {
  /** 0 — рыцарь в первом экране, 1 — сел в слот логотипа */
  progress: 0,
  /** Экранный прямоугольник слота логотипа в шапке */
  target: { x: 0, y: 0, w: 0 },
  /** Сцена отрисовала первый кадр (для прелоадера) */
  ready: false,
  pointer: { x: 0, y: 0 },
};

const listeners = new Set<Listener>();
export const onFlight = (fn: Listener) => {
  listeners.add(fn);
  return () => void listeners.delete(fn);
};
export const emitFlight = () => listeners.forEach((fn) => fn());

/** Где стоит рыцарь в первом экране: центр в долях вьюпорта и ширина в px. Одна точка правды для сцены, прелоадера и фолбэка. */
export function heroPose(vw: number, vh: number) {
  const phone = vw < 768;
  return {
    cx: vw / 2,
    cy: vh * (phone ? 0.66 : 0.745),
    w: Math.min(vw * (phone ? 0.64 : 0.3), vh * 0.4),
  };
}

/** Пропорции знака BRK (viewBox knight-path.svg) */
export const KNIGHT_ASPECT = 661 / 395;
