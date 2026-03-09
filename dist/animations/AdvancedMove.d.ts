import { Animation, AnimationConfig } from '../core/Animation.js';
import { Node } from '../core/Node.js';
import { Vector2 } from '../utils/Vector2.js';
import { EasingFunction } from '../utils/Easing.js';
export interface PathPoint {
    position: Vector2;
    controlIn?: Vector2;
    controlOut?: Vector2;
}
export interface AdvancedMoveConfig extends AnimationConfig {
    useVelocitySync?: boolean;
}
export declare class AdvancedMove extends Animation {
    private track;
    private path;
    private usePath;
    private keyframes;
    constructor(target: Node, config?: AdvancedMoveConfig);
    alongPath(points: PathPoint[]): this;
    keyframe(time: number, position: Vector2, easing?: EasingFunction): this;
    update(time: number): void;
    private evaluatePath;
    reverse(): Animation;
}
//# sourceMappingURL=AdvancedMove.d.ts.map