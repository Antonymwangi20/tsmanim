import { Animation, AnimationConfig } from '../core/Animation.js';
import { Node } from '../core/Node.js';
export declare class FadeOut extends Animation {
    private startOpacity;
    constructor(target: Node, config?: AnimationConfig);
    setStartTime(time: number): void;
    update(time: number): void;
    reverse(): Animation;
}
//# sourceMappingURL=FadeOut.d.ts.map