/**
 * Manim-style utilities: constants, helpers, and coordinate system
 */
export declare const ORIGIN: readonly [0, 0];
export declare const UP: readonly [0, 1];
export declare const DOWN: readonly [0, -1];
export declare const LEFT: readonly [-1, 0];
export declare const RIGHT: readonly [1, 0];
export declare const UL: readonly [-1, 1];
export declare const UR: readonly [1, 1];
export declare const DL: readonly [-1, -1];
export declare const DR: readonly [1, -1];
export declare const DEFAULT_STROKE_WIDTH = 2;
export declare const DEFAULT_FONT_SIZE = 24;
export declare const DEFAULT_ANIMATION_DURATION = 1;
export declare enum EasingType {
    LINEAR = "linear",
    EASE_IN = "easeIn",
    EASE_OUT = "easeOut",
    EASE_IN_OUT = "easeInOut",
    EASE_IN_QUAD = "easeInQuad",
    EASE_OUT_QUAD = "easeOutQuad",
    EASE_IN_OUT_QUAD = "easeInOutQuad",
    EASE_IN_CUBIC = "easeInCubic",
    EASE_OUT_CUBIC = "easeOutCubic",
    EASE_IN_OUT_CUBIC = "easeInOutCubic",
    EASE_IN_QUART = "easeInQuart",
    EASE_OUT_QUART = "easeOutQuart",
    EASE_IN_OUT_QUART = "easeInOutQuart",
    EASE_IN_QUINT = "easeInQuint",
    EASE_OUT_QUINT = "easeOutQuint",
    EASE_IN_OUT_QUINT = "easeInOutQuint",
    EASE_IN_SINE = "easeInSine",
    EASE_OUT_SINE = "easeOutSine",
    EASE_IN_OUT_SINE = "easeInOutSine",
    EASE_IN_EXPO = "easeInExpo",
    EASE_OUT_EXPO = "easeOutExpo",
    EASE_IN_OUT_EXPO = "easeInOutExpo",
    EASE_IN_CIRC = "easeInCirc",
    EASE_OUT_CIRC = "easeOutCirc",
    EASE_IN_OUT_CIRC = "easeInOutCirc",
    EASE_IN_ELASTIC = "easeInElastic",
    EASE_OUT_ELASTIC = "easeOutElastic",
    EASE_IN_OUT_ELASTIC = "easeInOutElastic",
    EASE_IN_BACK = "easeInBack",
    EASE_OUT_BACK = "easeOutBack",
    EASE_IN_OUT_BACK = "easeInOutBack",
    EASE_IN_BOUNCE = "easeInBounce",
    EASE_OUT_BOUNCE = "easeOutBounce",
    EASE_IN_OUT_BOUNCE = "easeInOutBounce",
    SMOOTH = "smooth",
    RUSH_INTO = "rushInto",
    RUSH_FROM = "rushFrom",
    SLOW_INTO = "slowInto",
    SLOW_FROM = "slowFrom"
}
export declare const smooth = EasingType.EASE_IN_OUT_CUBIC;
export declare const linear = EasingType.LINEAR;
export declare const ease_in_sine = EasingType.EASE_IN_SINE;
export declare const ease_out_sine = EasingType.EASE_OUT_SINE;
export declare const ease_in_out_sine = EasingType.EASE_IN_OUT_SINE;
export declare const ease_in_cubic = EasingType.EASE_IN_CUBIC;
export declare const ease_out_cubic = EasingType.EASE_OUT_CUBIC;
export declare const ease_in_out_cubic = EasingType.EASE_IN_OUT_CUBIC;
export type Vector2 = [number, number];
export declare function vectorAdd(v1: Vector2, v2: Vector2): Vector2;
export declare function vectorSub(v1: Vector2, v2: Vector2): Vector2;
export declare function vectorMult(v: Vector2, scalar: number): Vector2;
export declare function vectorDist(v1: Vector2, v2: Vector2): number;
export declare function vectorNorm(v: Vector2): number;
export declare function vectorNormalize(v: Vector2): Vector2;
export declare function vectorAngle(v: Vector2): number;
export declare const DEG: number;
export declare const PI: number;
export declare const TAU: number;
export declare function interpolate(v1: Vector2, v2: Vector2, t: number): Vector2;
export declare function lerp(a: number, b: number, t: number): number;
export declare function alignPoint(basePoint: Vector2, direction: Vector2, distance?: number): Vector2;
export declare function findCenter(points: Vector2[]): Vector2;
//# sourceMappingURL=Utilities.d.ts.map