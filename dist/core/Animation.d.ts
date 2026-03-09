import { Node } from './Node.js';
import { EasingFunction } from '../utils/Easing.js';
export interface AnimationConfig {
    duration?: number;
    easing?: EasingFunction;
    delay?: number;
}
export declare abstract class Animation {
    target: Node;
    duration: number;
    easing: EasingFunction;
    delay: number;
    startTime: number;
    isComplete: boolean;
    constructor(target: Node, config?: AnimationConfig);
    setStartTime(time: number): void;
    getProgress(time: number): number;
    abstract update(time: number): void;
    abstract reverse(): Animation;
}
//# sourceMappingURL=Animation.d.ts.map