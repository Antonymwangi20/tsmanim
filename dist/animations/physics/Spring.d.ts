import { Animation } from '../../core/Animation.js';
import { Node } from '../../core/Node.js';
export interface SpringConfig {
    mass?: number;
    stiffness?: number;
    damping?: number;
    initialVelocity?: number;
}
export declare class SpringPhysics {
    private mass;
    private stiffness;
    private damping;
    private velocity;
    private position;
    constructor(config?: SpringConfig);
    update(deltaTime: number, target: number): number;
    isAtRest(threshold?: number): boolean;
    estimateDuration(): number;
    getState(): {
        position: number;
        velocity: number;
    };
    reset(): void;
}
export declare class SpringAnimation extends Animation {
    private spring;
    private startValue;
    private targetValue;
    private property;
    private lastFrameTime;
    constructor(target: Node, property: 'scale' | 'rotation' | 'opacity', targetValue: number, springConfig?: SpringConfig);
    setStartTime(time: number): void;
    private getCurrentValue;
    update(time: number): void;
    reverse(): Animation;
}
export declare const SpringPresets: {
    bouncy: {
        mass: number;
        stiffness: number;
        damping: number;
    };
    smooth: {
        mass: number;
        stiffness: number;
        damping: number;
    };
    gentle: {
        mass: number;
        stiffness: number;
        damping: number;
    };
    crisp: {
        mass: number;
        stiffness: number;
        damping: number;
    };
};
//# sourceMappingURL=Spring.d.ts.map