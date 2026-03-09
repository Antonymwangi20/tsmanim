import { Easing } from '../utils/Easing.js';
export class Animation {
    target;
    duration;
    easing;
    delay;
    startTime = 0;
    isComplete = false;
    constructor(target, config = {}) {
        this.target = target;
        this.duration = config.duration ?? 1;
        this.easing = config.easing ?? Easing.easeInOutQuad;
        this.delay = config.delay ?? 0;
    }
    setStartTime(time) {
        this.startTime = time + this.delay;
    }
    getProgress(time) {
        if (time < this.startTime)
            return 0;
        const elapsed = time - this.startTime;
        if (elapsed >= this.duration) {
            this.isComplete = true;
            return 1;
        }
        const t = elapsed / this.duration;
        return this.easing(t);
    }
}
//# sourceMappingURL=Animation.js.map