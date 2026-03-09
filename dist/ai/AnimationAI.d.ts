import { Node } from '../core/Node.js';
import { Animation } from '../core/Animation.js';
import { Vector2 } from '../utils/Vector2.js';
export interface MotionPattern {
    name: string;
    velocityProfile: number[];
    anticipation: number;
    overshoot: number;
}
/**
 * AI-powered animation assistant for motion prediction,
 * intelligent keyframe optimization, and animation suggestions
 */
export declare class AnimationAI {
    private patternLibrary;
    constructor();
    private loadDefaultPatterns;
    /**
     * Auto-complete animation based on start/end states with motion prediction
     */
    suggestAnimation(node: Node, targetState: {
        position?: Vector2;
        rotation?: number;
        scale?: number;
    }, style?: 'bounce' | 'mechanical' | 'organic' | 'ease-in-out'): Animation[];
    /**
     * Smart keyframe reduction using Ramer-Douglas-Peucker algorithm
     * Simplifies animation curves while preserving visual quality
     */
    optimizeKeyframes(keyframes: Array<{
        time: number;
        value: number;
    }>, tolerance?: number): Array<{
        time: number;
        value: number;
    }>;
    /**
     * Ramer-Douglas-Peucker simplification algorithm
     */
    private rdpSimplify;
    /**
     * Calculate perpendicular distance from point to line
     */
    private pointLineDistance;
    /**
     * Calculate smoothed path between two points
     */
    private calculateSmoothedPath;
    /**
     * Analyze animation curve for motion characteristics
     */
    analyzeMotion(keyframes: Array<{
        time: number;
        value: number;
    }>): {
        avgVelocity: number;
        peakVelocity: number;
        acceleration: number;
        isLinear: boolean;
    };
    /**
     * Suggest optimal easing function based on motion analysis
     */
    suggestEasing(keyframes: Array<{
        time: number;
        value: number;
    }>): string;
}
export declare const animationAI: AnimationAI;
//# sourceMappingURL=AnimationAI.d.ts.map