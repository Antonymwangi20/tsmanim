import { Animation, AnimationConfig } from '../core/Animation.js';
import { Node } from '../core/Node.js';
export interface MoveConfig extends AnimationConfig {
    x?: number;
    y?: number;
}
export declare class Move extends Animation {
    private startPos;
    private targetPos;
    constructor(target: Node, config?: MoveConfig);
    setStartTime(time: number): void;
    update(time: number): void;
    reverse(): Animation;
}
//# sourceMappingURL=Move.d.ts.map