// src/animations/FadeIn.ts
import { Animation } from '../core/Animation.js';
import { FadeOut } from './FadeOut.js';
export class FadeIn extends Animation {
    constructor(target, config = {}) {
        super(target, { ...config, duration: config.duration ?? 0.5 });
    }
    setStartTime(time) {
        super.setStartTime(time);
        this.target.opacity = 0;
        this.target.visible = true;
    }
    update(time) {
        const progress = this.getProgress(time);
        this.target.opacity = progress;
    }
    reverse() {
        return new FadeOut(this.target, {
            duration: this.duration,
            easing: this.easing
        });
    }
}
//# sourceMappingURL=FadeIn.js.map