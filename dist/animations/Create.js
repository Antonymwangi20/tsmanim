// src/animations/Create.ts
import { Animation } from '../core/Animation.js';
import { Vector2 } from '../utils/Vector2.js';
import { Easing } from '../utils/Easing.js';
import { FadeOut } from './FadeOut.js';
export class Create extends Animation {
    originalScale = 1;
    constructor(target, config = {}) {
        super(target, { ...config, duration: config.duration ?? 0.5 });
        this.easing = config.easing ?? Easing.easeOutBounce;
    }
    setStartTime(time) {
        super.setStartTime(time);
        this.originalScale = this.target.scale.x;
        this.target.scale = new Vector2(0, 0);
        this.target.visible = true;
    }
    update(time) {
        const progress = this.getProgress(time);
        const scale = this.originalScale * progress;
        this.target.scale = new Vector2(scale, scale);
    }
    reverse() {
        return new FadeOut(this.target, {
            duration: this.duration,
            easing: this.easing
        });
    }
}
//# sourceMappingURL=Create.js.map