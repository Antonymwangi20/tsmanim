/**
 * Updater system for dynamic animations and value tracking
 */
/**
 * Value tracker for animatable variables
 */
export declare class ValueTracker {
    private value;
    private callbacks;
    constructor(initialValue?: number);
    /**
     * Get current value
     */
    getValue(): number;
    /**
     * Set value
     */
    setValue(value: number): this;
    /**
     * Increment value
     */
    increment(amount?: number): this;
    /**
     * Add callback
     */
    onValueChanged(callback: (value: number) => void): this;
    /**
     * Notify all callbacks
     */
    private notifyCallbacks;
    /**
     * Animate to value
     */
    animateTo(targetValue: number, duration?: number): any;
}
/**
 * Complex value tracker (for complex numbers)
 */
export declare class ComplexValueTracker {
    private real;
    private imag;
    private callbacks;
    constructor(real?: number, imag?: number);
    /**
     * Get value as [real, imag]
     */
    getValue(): [number, number];
    /**
     * Set value
     */
    setValue(real: number, imag?: number): this;
    /**
     * Add value
     */
    add(real: number, imag?: number): this;
    /**
     * Add callback
     */
    onValueChanged(callback: (real: number, imag: number) => void): this;
    /**
     * Notify callbacks
     */
    private notifyCallbacks;
}
/**
 * Updater function for dynamic object behavior
 */
export type UpdateFunction = (dt: number, time: number, object: any) => void;
/**
 * Updater manager
 */
export declare class UpdaterManager {
    private updaters;
    private time;
    private lastFrameTime;
    /**
     * Add updater function
     */
    addUpdater(id: string, updateFn: UpdateFunction): this;
    /**
     * Remove updater
     */
    removeUpdater(id: string): this;
    /**
     * Update all objects
     */
    update(currentTime: number, objects: any[]): void;
    /**
     * Clear all updaters
     */
    clear(): this;
    /**
     * Get time
     */
    getTime(): number;
}
/**
 * Animation group helpers
 */
/**
 * Succession - animations run one after another
 */
export declare function Succession(animations: any[], lagTime?: number): any;
/**
 * Simultaneous - animations run at the same time
 */
export declare function Simultaneous(animations: any[]): any;
/**
 * AnimationGroup - base for grouped animations
 */
export declare function AnimationGroup(animations: any[], kwargs?: any): any;
/**
 * LaggedStart - animations staggered with lag
 */
export declare function LaggedStart(animations: any[], lagRatio?: number): any;
/**
 * LaggedEnd - animations with lag at end
 */
export declare function LaggedEnd(animations: any[], lagRatio?: number): any;
/**
 * Custom animation composition
 */
export declare function createAnimationComposition(animations: any[], composition: 'sequence' | 'simultaneous' | 'lagged', options?: any): any;
/**
 * Chain animations sequentially
 */
export declare function chainAnimations(baseAnimation: any, ...followingAnimations: any[]): any;
/**
 * Run animations in parallel
 */
export declare function parallelAnimations(...animations: any[]): any;
//# sourceMappingURL=Updaters.d.ts.map