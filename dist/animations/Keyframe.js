export class KeyframeTrack {
    keyframes = [];
    interpolator;
    constructor(interpolator) {
        this.interpolator = interpolator;
    }
    add(keyframe) {
        this.keyframes.push(keyframe);
        this.keyframes.sort((a, b) => a.time - b.time);
        return this;
    }
    evaluate(t) {
        if (this.keyframes.length === 0)
            throw new Error('No keyframes');
        if (this.keyframes.length === 1)
            return this.keyframes[0].value;
        // Find surrounding keyframes
        let i = 0;
        while (i < this.keyframes.length - 1 && this.keyframes[i + 1].time <= t) {
            i++;
        }
        if (i >= this.keyframes.length - 1) {
            return this.keyframes[this.keyframes.length - 1].value;
        }
        const k1 = this.keyframes[i];
        const k2 = this.keyframes[i + 1];
        const localT = (t - k1.time) / (k2.time - k1.time);
        const easedT = k1.easing ? k1.easing(localT) : localT;
        return this.interpolator(k1.value, k2.value, easedT);
    }
}
// Cubic Bézier interpolation for smooth curves
export function cubicBezier(p0, p1, p2, p3, t) {
    const u = 1 - t;
    return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
}
// Catmull-Rom spline interpolation
export function catmullRom(p0, p1, p2, p3, t) {
    const t2 = t * t;
    const t3 = t2 * t;
    return 0.5 * (2 * p1 +
        (-p0 + p2) * t +
        (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
        (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
}
// Hermite interpolation
export function hermite(p0, p1, v0, v1, t) {
    const t2 = t * t;
    const t3 = t2 * t;
    return ((2 * t3 - 3 * t2 + 1) * p0 +
        (t3 - 2 * t2 + t) * v0 +
        (-2 * t3 + 3 * t2) * p1 +
        (t3 - t2) * v1);
}
//# sourceMappingURL=Keyframe.js.map