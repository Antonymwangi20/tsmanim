// src/animations/Move.ts
import { Animation } from '../core/Animation.js';
import { Vector2 } from '../utils/Vector2.js';
export class Move extends Animation {
    startPos = new Vector2(0, 0);
    targetPos = new Vector2(0, 0);
    constructor(target, config = {}) {
        super(target, config);
        this.targetPos = new Vector2(config.x ?? 0, config.y ?? 0);
    }
    setStartTime(time) {
        super.setStartTime(time);
        this.startPos = this.target.position.clone();
    }
    update(time) {
        const progress = this.getProgress(time);
        this.target.position = this.startPos.lerp(this.targetPos, progress);
    }
    reverse() {
        return new Move(this.target, {
            x: this.startPos.x,
            y: this.startPos.y,
            duration: this.duration,
            easing: this.easing
        });
    }
}
//# sourceMappingURL=Move.js.map