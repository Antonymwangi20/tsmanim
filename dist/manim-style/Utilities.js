/**
 * Manim-style utilities: constants, helpers, and coordinate system
 */
// ============================================
// COORDINATE SYSTEM & DIRECTIONS
// ============================================
export const ORIGIN = [0, 0];
export const UP = [0, 1];
export const DOWN = [0, -1];
export const LEFT = [-1, 0];
export const RIGHT = [1, 0];
export const UL = [-1, 1]; // Up-Left
export const UR = [1, 1]; // Up-Right
export const DL = [-1, -1]; // Down-Left
export const DR = [1, -1]; // Down-Right
// ============================================
// SCALING FACTORS
// ============================================
export const DEFAULT_STROKE_WIDTH = 2;
export const DEFAULT_FONT_SIZE = 24;
export const DEFAULT_ANIMATION_DURATION = 1;
// ============================================
// EASING FUNCTIONS (Rate Functions in Manim)
// ============================================
export var EasingType;
(function (EasingType) {
    EasingType["LINEAR"] = "linear";
    EasingType["EASE_IN"] = "easeIn";
    EasingType["EASE_OUT"] = "easeOut";
    EasingType["EASE_IN_OUT"] = "easeInOut";
    EasingType["EASE_IN_QUAD"] = "easeInQuad";
    EasingType["EASE_OUT_QUAD"] = "easeOutQuad";
    EasingType["EASE_IN_OUT_QUAD"] = "easeInOutQuad";
    EasingType["EASE_IN_CUBIC"] = "easeInCubic";
    EasingType["EASE_OUT_CUBIC"] = "easeOutCubic";
    EasingType["EASE_IN_OUT_CUBIC"] = "easeInOutCubic";
    EasingType["EASE_IN_QUART"] = "easeInQuart";
    EasingType["EASE_OUT_QUART"] = "easeOutQuart";
    EasingType["EASE_IN_OUT_QUART"] = "easeInOutQuart";
    EasingType["EASE_IN_QUINT"] = "easeInQuint";
    EasingType["EASE_OUT_QUINT"] = "easeOutQuint";
    EasingType["EASE_IN_OUT_QUINT"] = "easeInOutQuint";
    EasingType["EASE_IN_SINE"] = "easeInSine";
    EasingType["EASE_OUT_SINE"] = "easeOutSine";
    EasingType["EASE_IN_OUT_SINE"] = "easeInOutSine";
    EasingType["EASE_IN_EXPO"] = "easeInExpo";
    EasingType["EASE_OUT_EXPO"] = "easeOutExpo";
    EasingType["EASE_IN_OUT_EXPO"] = "easeInOutExpo";
    EasingType["EASE_IN_CIRC"] = "easeInCirc";
    EasingType["EASE_OUT_CIRC"] = "easeOutCirc";
    EasingType["EASE_IN_OUT_CIRC"] = "easeInOutCirc";
    EasingType["EASE_IN_ELASTIC"] = "easeInElastic";
    EasingType["EASE_OUT_ELASTIC"] = "easeOutElastic";
    EasingType["EASE_IN_OUT_ELASTIC"] = "easeInOutElastic";
    EasingType["EASE_IN_BACK"] = "easeInBack";
    EasingType["EASE_OUT_BACK"] = "easeOutBack";
    EasingType["EASE_IN_OUT_BACK"] = "easeInOutBack";
    EasingType["EASE_IN_BOUNCE"] = "easeInBounce";
    EasingType["EASE_OUT_BOUNCE"] = "easeOutBounce";
    EasingType["EASE_IN_OUT_BOUNCE"] = "easeInOutBounce";
    EasingType["SMOOTH"] = "smooth";
    EasingType["RUSH_INTO"] = "rushInto";
    EasingType["RUSH_FROM"] = "rushFrom";
    EasingType["SLOW_INTO"] = "slowInto";
    EasingType["SLOW_FROM"] = "slowFrom";
})(EasingType || (EasingType = {}));
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
export function vectorAdd(v1, v2) {
    return [v1[0] + v2[0], v1[1] + v2[1]];
}
export function vectorSub(v1, v2) {
    return [v1[0] - v2[0], v1[1] - v2[1]];
}
export function vectorMult(v, scalar) {
    return [v[0] * scalar, v[1] * scalar];
}
export function vectorDist(v1, v2) {
    const dx = v2[0] - v1[0];
    const dy = v2[1] - v1[1];
    return Math.sqrt(dx * dx + dy * dy);
}
export function vectorNorm(v) {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
}
export function vectorNormalize(v) {
    const norm = vectorNorm(v);
    return norm === 0 ? [0, 0] : [v[0] / norm, v[1] / norm];
}
export function vectorAngle(v) {
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
export function interpolate(v1, v2, t) {
    return [v1[0] + (v2[0] - v1[0]) * t, v1[1] + (v2[1] - v1[1]) * t];
}
export function lerp(a, b, t) {
    return a + (b - a) * t;
}
// ============================================
// POSITIONING HELPERS
// ============================================
export function alignPoint(basePoint, direction, distance = 1) {
    return vectorAdd(basePoint, vectorMult(vectorNormalize(direction), distance));
}
export function findCenter(points) {
    if (points.length === 0)
        return [0, 0];
    const sum = points.reduce((acc, p) => vectorAdd(acc, p), [0, 0]);
    return vectorMult(sum, 1 / points.length);
}
//# sourceMappingURL=Utilities.js.map