/**
 * Manim-style simple animation scene
 * High-level API for creating animations with minimal boilerplate
 */
import { Scene as CoreScene } from '../core/Scene.js';
import { Node } from '../core/Node.js';
import { Timeline } from '../core/Timeline.js';
import { Circle as CircleShape } from '../shapes/Circle.js';
import { Rect as RectShape } from '../shapes/Rect.js';
import { Text as TextShape } from '../shapes/Text.js';
/**
 * Animation options
 */
export interface SimpleAnimationOptions {
    duration?: number;
    delay?: number;
    easing?: string;
}
/**
 * Manim-style scene wrapper
 */
export declare class ManimScene {
    private scene;
    private timeline;
    private currentTime;
    private objects;
    private objectCounter;
    constructor(config?: any);
    /**
     * Add objects to scene
     */
    add(...objects: Node[]): this;
    /**
     * Play animation (simple wrapper)
     */
    play(animation: any, options?: SimpleAnimationOptions): this;
    /**
     * Wait
     */
    wait(duration?: number): this;
    /**
     * Remove objects
     */
    remove(...objects: Node[]): this;
    /**
     * Get scene
     */
    getScene(): CoreScene;
    /**
     * Get timeline
     */
    getTimeline(): Timeline;
    /**
     * Get current time
     */
    getCurrentTime(): number;
    /**
     * Set time
     */
    setTime(time: number): this;
    /**
     * Get objects
     */
    getObjects(): Node[];
    /**
     * Clear scene
     */
    clear(): this;
}
/**
 * Create circle (simple wrapper)
 */
export declare function Circle(config?: any): CircleShape;
/**
 * Create rectangle
 */
export declare function Rect(config?: any): RectShape;
/**
 * Create text
 */
export declare function SimpleText(content: string, config?: any): TextShape;
/**
 * Simple animation helpers (return animation configs)
 */
export declare function FadeInAnim(config?: any): any;
export declare function FadeOutAnim(config?: any): any;
export declare function RotateAnim(config: any): any;
export declare function ScaleAnim(config: any): any;
export declare function MoveAnim(config: any): any;
//# sourceMappingURL=Scene.d.ts.map