import { Animation, AnimationConfig } from '../core/Animation.js';
import { Node } from '../core/Node.js';
export declare class FadeIn extends Animation {
    constructor(target: Node, config?: AnimationConfig);
    setStartTime(time: number): void;
    update(time: number): void;
    reverse(): Animation;
}
//# sourceMappingURL=FadeIn.d.ts.map