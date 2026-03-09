// src/animations/FadeOut.ts
import { Animation } from '../core/Animation.js';
import { FadeIn } from './FadeIn.js';
export class FadeOut extends Animation {
    startOpacity = 1;
    constructor(target, config = {}) {
        super(target, { ...config, duration: config.duration ?? 0.5 });
    }
    setStartTime(time) {
        super.setStartTime(time);
        this.startOpacity = this.target.opacity;
    }
    update(time) {
        const progress = this.getProgress(time);
        this.target.opacity = this.startOpacity * (1 - progress);
        if (progress >= 1) {
            this.target.visible = false;
        }
    }
    reverse() {
        return new FadeIn(this.target, {
            duration: this.duration,
            easing: this.easing
        });
    }
}
//# sourceMappingURL=FadeOut.js.map