/**
 * Extended animation helpers for Manim-style API
 */
import type { SimpleAnimationOptions } from './Scene.js';
/**
 * Animation configuration interface
 */
export interface AnimationConfig extends SimpleAnimationOptions {
    type: string;
    [key: string]: any;
}
export declare function FadeInAnim(config?: SimpleAnimationOptions): AnimationConfig;
export declare function FadeOutAnim(config?: SimpleAnimationOptions): AnimationConfig;
export declare function MoveAnim(config: any): AnimationConfig;
export declare function RotateAnim(config: any): AnimationConfig;
export declare function ScaleAnim(config: any): AnimationConfig;
export declare function GrowFromCenterAnim(config?: SimpleAnimationOptions): AnimationConfig;
export declare function ShrinkToCenterAnim(config?: SimpleAnimationOptions): AnimationConfig;
export declare function SpinAnim(config: any): AnimationConfig;
export declare function FlipAnim(config?: SimpleAnimationOptions): AnimationConfig;
export declare function ShineAnim(config?: SimpleAnimationOptions): AnimationConfig;
export declare function WriteAnim(config?: SimpleAnimationOptions): AnimationConfig;
export declare function UnwriteAnim(config?: SimpleAnimationOptions): AnimationConfig;
export declare function DrawAnim(config?: SimpleAnimationOptions): AnimationConfig;
export declare function ColorChangeAnim(config: any): AnimationConfig;
export declare function IndicateAnim(config?: SimpleAnimationOptions): AnimationConfig;
export declare function FlashAnim(config?: SimpleAnimationOptions): AnimationConfig;
export declare function PulseAnim(config?: SimpleAnimationOptions): AnimationConfig;
export declare function WiggleAnim(config?: SimpleAnimationOptions): AnimationConfig;
export declare function ShakeAnim(config?: SimpleAnimationOptions): AnimationConfig;
export declare function SwingAnim(config?: SimpleAnimationOptions): AnimationConfig;
export declare function BounceAnim(config?: SimpleAnimationOptions): AnimationConfig;
export declare function WaveAnim(config?: SimpleAnimationOptions): AnimationConfig;
export declare function FollowPathAnim(config: any): AnimationConfig;
export declare function Rotate3DAnim(config: any): AnimationConfig;
/**
 * Run animations in sequence (one after another)
 */
export declare function SequenceAnim(animations: AnimationConfig[], baseConfig?: SimpleAnimationOptions): AnimationConfig;
/**
 * Run animations simultaneously with lag between objects
 */
export declare function LaggedStartAnim(animations: AnimationConfig[], lagRatio?: number): AnimationConfig;
/**
 * Run all animations simultaneously
 */
export declare function SimultaneousAnim(animations: AnimationConfig[], baseConfig?: SimpleAnimationOptions): AnimationConfig;
/**
 * Create a custom animation
 */
export declare function CustomAnim(type: string, config: any): AnimationConfig;
/**
 * Add delay to animation
 */
export declare function withDelay(anim: AnimationConfig, delay: number): AnimationConfig;
/**
 * Reverse animation
 */
export declare function reverseAnim(anim: AnimationConfig): AnimationConfig;
/**
 * Repeat animation
 */
export declare function repeatAnim(anim: AnimationConfig, times?: number): AnimationConfig;
//# sourceMappingURL=Animations.d.ts.map