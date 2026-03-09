// src/animations/AdvancedMove.ts
import { Animation } from '../core/Animation.js';
import { Vector2 } from '../utils/Vector2.js';
import { KeyframeTrack, catmullRom } from './Keyframe.js';
export class AdvancedMove extends Animation {
    track;
    path = [];
    usePath = false;
    keyframes = [];
    constructor(target, config = {}) {
        super(target, config);
        // Interpolate between Vector2 values
        this.track = new KeyframeTrack((a, b, t) => a.lerp(b, t));
    }
    // Define movement along a Catmull-Rom or Bézier path
    alongPath(points) {
        if (points.length < 2)
            throw new Error('Path must have at least 2 points');
        this.path = points;
        this.usePath = true;
        return this;
    }
    // Standard keyframe approach for position
    keyframe(time, position, easing) {
        if (time < 0 || time > 1)
            throw new Error('Time must be between 0 and 1');
        // Normalize time to 0-1
        const normalizedTime = time;
        this.keyframes.push({ time: normalizedTime, position, easing });
        // Sort keyframes by time
        this.keyframes.sort((a, b) => a.time - b.time);
        // Rebuild track
        this.track = new KeyframeTrack((a, b, t) => a.lerp(b, t));
        for (const kf of this.keyframes) {
            this.track.add({
                time: kf.time,
                value: kf.position,
                easing: kf.easing
            });
        }
        return this;
    }
    update(time) {
        const progress = this.getProgress(time);
        if (this.usePath) {
            this.target.position = this.evaluatePath(progress);
        }
        else if (this.keyframes.length > 0) {
            this.target.position = this.track.evaluate(progress);
        }
    }
    evaluatePath(t) {
        // Use Catmull-Rom spline for smooth interpolation through path points
        const segmentCount = this.path.length - 1;
        const segmentT = t * segmentCount;
        const index = Math.floor(segmentT);
        const localT = segmentT - index;
        if (index >= segmentCount) {
            return this.path[this.path.length - 1].position.clone();
        }
        // Get the 4 points needed for Catmull-Rom
        const p0 = index === 0
            ? this.path[0].position
            : this.path[Math.max(0, index - 1)].position;
        const p1 = this.path[index].position;
        const p2 = this.path[index + 1].position;
        const p3 = index + 2 < this.path.length
            ? this.path[index + 2].position
            : this.path[this.path.length - 1].position;
        // Apply Catmull-Rom to both X and Y
        const x = catmullRom(p0.x, p1.x, p2.x, p3.x, localT);
        const y = catmullRom(p0.y, p1.y, p2.y, p3.y, localT);
        return new Vector2(x, y);
    }
    reverse() {
        const reversed = new AdvancedMove(this.target, {
            duration: this.duration,
            easing: this.easing
        });
        if (this.usePath) {
            // Reverse path order
            const reversedPath = [...this.path].reverse();
            reversed.alongPath(reversedPath);
        }
        else if (this.keyframes.length > 0) {
            // Reverse keyframes
            const reversedKeyframes = this.keyframes.map(kf => ({
                time: 1 - kf.time,
                position: kf.position,
                easing: kf.easing
            }));
            for (const kf of reversedKeyframes) {
                reversed.keyframe(kf.time, kf.position, kf.easing);
            }
        }
        return reversed;
    }
}
//# sourceMappingURL=AdvancedMove.js.map