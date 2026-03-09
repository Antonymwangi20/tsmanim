// src/animations/Transform.ts
import { Animation } from '../core/Animation.js';
import { Vector2 } from '../utils/Vector2.js';
export class Transform extends Animation {
    startScale = 1;
    startRotation = 0;
    startOpacity = 1;
    targetScale = 1;
    targetRotation = 0;
    targetOpacity = 1;
    constructor(target, config = {}) {
        super(target, config);
        this.targetScale = config.scale ?? 1;
        this.targetRotation = config.rotation ?? 0;
        this.targetOpacity = config.opacity ?? 1;
    }
    setStartTime(time) {
        super.setStartTime(time);
        this.startScale = this.target.scale.x;
        this.startRotation = this.target.rotation;
        this.startOpacity = this.target.opacity;
    }
    update(time) {
        const progress = this.getProgress(time);
        const scale = this.startScale + (this.targetScale - this.startScale) * progress;
        this.target.scale = new Vector2(scale, scale);
        this.target.rotation = this.startRotation + (this.targetRotation - this.startRotation) * progress;
        this.target.opacity = this.startOpacity + (this.targetOpacity - this.startOpacity) * progress;
    }
    reverse() {
        return new Transform(this.target, {
            scale: this.startScale,
            rotation: this.startRotation,
            opacity: this.startOpacity,
            duration: this.duration,
            easing: this.easing
        });
    }
}
//# sourceMappingURL=Transform.js.map