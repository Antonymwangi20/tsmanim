import { Animation, AnimationConfig } from '../core/Animation.js';
import { Node } from '../core/Node.js';
export interface TransformConfig extends AnimationConfig {
    scale?: number;
    rotation?: number;
    opacity?: number;
}
export declare class Transform extends Animation {
    private startScale;
    private startRotation;
    private startOpacity;
    private targetScale;
    private targetRotation;
    private targetOpacity;
    constructor(target: Node, config?: TransformConfig);
    setStartTime(time: number): void;
    update(time: number): void;
    reverse(): Animation;
}
//# sourceMappingURL=Transform.d.ts.map