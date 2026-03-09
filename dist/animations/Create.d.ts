import { Animation, AnimationConfig } from '../core/Animation.js';
import { Node } from '../core/Node.js';
export declare class Create extends Animation {
    private originalScale;
    constructor(target: Node, config?: AnimationConfig);
    setStartTime(time: number): void;
    update(time: number): void;
    reverse(): Animation;
}
//# sourceMappingURL=Create.d.ts.map