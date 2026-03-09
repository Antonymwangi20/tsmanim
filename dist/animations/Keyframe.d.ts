import { EasingFunction } from '../utils/Easing.js';
export interface Keyframe<T> {
    time: number;
    value: T;
    easing?: EasingFunction;
    tension?: number;
}
export declare class KeyframeTrack<T> {
    private keyframes;
    private interpolator;
    constructor(interpolator: (a: T, b: T, t: number) => T);
    add(keyframe: Keyframe<T>): this;
    evaluate(t: number): T;
}
export declare function cubicBezier(p0: number, p1: number, p2: number, p3: number, t: number): number;
export declare function catmullRom(p0: number, p1: number, p2: number, p3: number, t: number): number;
export declare function hermite(p0: number, p1: number, v0: number, v1: number, t: number): number;
//# sourceMappingURL=Keyframe.d.ts.map