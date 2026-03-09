/**
 * Manim-style utilities: constants, helpers, and coordinate system
 */

// ============================================
// COORDINATE SYSTEM & DIRECTIONS
// ============================================

export const ORIGIN = [0, 0] as const;
export const UP = [0, 1] as const;
export const DOWN = [0, -1] as const;
export const LEFT = [-1, 0] as const;
export const RIGHT = [1, 0] as const;

export const UL = [-1, 1] as const; // Up-Left
export const UR = [1, 1] as const; // Up-Right
export const DL = [-1, -1] as const; // Down-Left
export const DR = [1, -1] as const; // Down-Right

// ============================================
// SCALING FACTORS
// ============================================
export const DEFAULT_STROKE_WIDTH = 2;
export const DEFAULT_FONT_SIZE = 24;
export const DEFAULT_ANIMATION_DURATION = 1;

// ============================================
// EASING FUNCTIONS (Rate Functions in Manim)
// ============================================
export enum EasingType {
  LINEAR = 'linear',
  EASE_IN = 'easeIn',
  EASE_OUT = 'easeOut',
  EASE_IN_OUT = 'easeInOut',
  EASE_IN_QUAD = 'easeInQuad',
  EASE_OUT_QUAD = 'easeOutQuad',
  EASE_IN_OUT_QUAD = 'easeInOutQuad',
  EASE_IN_CUBIC = 'easeInCubic',
  EASE_OUT_CUBIC = 'easeOutCubic',
  EASE_IN_OUT_CUBIC = 'easeInOutCubic',
  EASE_IN_QUART = 'easeInQuart',
  EASE_OUT_QUART = 'easeOutQuart',
  EASE_IN_OUT_QUART = 'easeInOutQuart',
  EASE_IN_QUINT = 'easeInQuint',
  EASE_OUT_QUINT = 'easeOutQuint',
  EASE_IN_OUT_QUINT = 'easeInOutQuint',
  EASE_IN_SINE = 'easeInSine',
  EASE_OUT_SINE = 'easeOutSine',
  EASE_IN_OUT_SINE = 'easeInOutSine',
  EASE_IN_EXPO = 'easeInExpo',
  EASE_OUT_EXPO = 'easeOutExpo',
  EASE_IN_OUT_EXPO = 'easeInOutExpo',
  EASE_IN_CIRC = 'easeInCirc',
  EASE_OUT_CIRC = 'easeOutCirc',
  EASE_IN_OUT_CIRC = 'easeInOutCirc',
  EASE_IN_ELASTIC = 'easeInElastic',
  EASE_OUT_ELASTIC = 'easeOutElastic',
  EASE_IN_OUT_ELASTIC = 'easeInOutElastic',
  EASE_IN_BACK = 'easeInBack',
  EASE_OUT_BACK = 'easeOutBack',
  EASE_IN_OUT_BACK = 'easeInOutBack',
  EASE_IN_BOUNCE = 'easeInBounce',
  EASE_OUT_BOUNCE = 'easeOutBounce',
  EASE_IN_OUT_BOUNCE = 'easeInOutBounce',
  SMOOTH = 'smooth',
  RUSH_INTO = 'rushInto',
  RUSH_FROM = 'rushFrom',
  SLOW_INTO = 'slowInto',
  SLOW_FROM = 'slowFrom'
}

// ============================================
// RATE FUNCTION ALIASES (Manim-style names)
// ============================================
export const smooth = EasingType.EASE_IN_OUT_CUBIC;
export const linear = EasingType.LINEAR;
export const ease_in_sine = EasingType.EASE_IN_SINE;
export const ease_out_sine = EasingType.EASE_OUT_SINE;
export const ease_in_out_sine = EasingType.EASE_IN_OUT_SINE;
export const ease_in_cubic = EasingType.EASE_IN_CUBIC;
export const ease_out_cubic = EasingType.EASE_OUT_CUBIC;
export const ease_in_out_cubic = EasingType.EASE_IN_OUT_CUBIC;

// ============================================
// VECTOR UTILITIES
// ============================================
export type Vector2 = [number, number];

export function vectorAdd(v1: Vector2, v2: Vector2): Vector2 {
  return [v1[0] + v2[0], v1[1] + v2[1]];
}

export function vectorSub(v1: Vector2, v2: Vector2): Vector2 {
  return [v1[0] - v2[0], v1[1] - v2[1]];
}

export function vectorMult(v: Vector2, scalar: number): Vector2 {
  return [v[0] * scalar, v[1] * scalar];
}

export function vectorDist(v1: Vector2, v2: Vector2): number {
  const dx = v2[0] - v1[0];
  const dy = v2[1] - v1[1];
  return Math.sqrt(dx * dx + dy * dy);
}

export function vectorNorm(v: Vector2): number {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
}

export function vectorNormalize(v: Vector2): Vector2 {
  const norm = vectorNorm(v);
  return norm === 0 ? [0, 0] : [v[0] / norm, v[1] / norm];
}

export function vectorAngle(v: Vector2): number {
  return Math.atan2(v[1], v[0]);
}

// ============================================
// ANGLE UTILITIES
// ============================================
export const DEG = Math.PI / 180; // Convert degrees to radians
export const PI = Math.PI;
export const TAU = 2 * Math.PI; // Full circle in radians

// ============================================
// INTERPOLATION UTILITIES
// ============================================
export function interpolate(v1: Vector2, v2: Vector2, t: number): Vector2 {
  return [v1[0] + (v2[0] - v1[0]) * t, v1[1] + (v2[1] - v1[1]) * t];
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// ============================================
// POSITIONING HELPERS
// ============================================
export function alignPoint(basePoint: Vector2, direction: Vector2, distance: number = 1): Vector2 {
  return vectorAdd(basePoint, vectorMult(vectorNormalize(direction), distance));
}

export function findCenter(points: Vector2[]): Vector2 {
  if (points.length === 0) return [0, 0] as Vector2;
  const sum = points.reduce((acc, p) => vectorAdd(acc, p), [0, 0] as Vector2);
  return vectorMult(sum, 1 / points.length);
}
