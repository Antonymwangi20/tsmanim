/**
 * Advanced animation types (drawing, writing, morphing)
 */
import type { AnimationConfig } from './Animations.js';
import type { SimpleAnimationOptions } from './Scene.js';
/**
 * Write text like typing
 */
export declare function WriteAnim(config?: SimpleAnimationOptions): AnimationConfig;
/**
 * Unwrite - reverse of write
 */
export declare function UnwriteAnim(config?: SimpleAnimationOptions): AnimationConfig;
/**
 * Create with stroke and then fill
 */
export declare function DrawBorderThenFillAnim(config?: SimpleAnimationOptions): AnimationConfig;
/**
 * Create animation
 */
export declare function CreateAnim(config?: SimpleAnimationOptions): AnimationConfig;
/**
 * Spin in from nothing
 */
export declare function SpinInFromNothingAnim(config?: SimpleAnimationOptions): AnimationConfig;
/**
 * Create then fade out
 */
export declare function CreateThenFadeOutAnim(config?: SimpleAnimationOptions): AnimationConfig;
/**
 * Transform one object into another
 */
export declare function TransformAnim(config: any): AnimationConfig;
/**
 * Replacement transform (removes old, adds new)
 */
export declare function ReplacementTransformAnim(config: any): AnimationConfig;
/**
 * Transform matching shapes
 */
export declare function TransformMatchingShapesAnim(config: any): AnimationConfig;
/**
 * Clockwise Transform
 */
export declare function ClockwiseTransformAnim(config: any): AnimationConfig;
/**
 * Counter-clockwise Transform
 */
export declare function CounterClockwiseTransformAnim(config: any): AnimationConfig;
/**
 * Circumscribe - draw circle around object
 */
export declare function CircumscribeAnim(config?: SimpleAnimationOptions): AnimationConfig;
/**
 * Underline an object
 */
export declare function UnderlineAnim(config?: SimpleAnimationOptions): AnimationConfig;
/**
 * Overline an object
 */
export declare function OverlineAnim(config?: SimpleAnimationOptions): AnimationConfig;
/**
 * Cross out an object
 */
export declare function CrossOutAnim(config?: SimpleAnimationOptions): AnimationConfig;
/**
 * Show passing flash - moving highlight
 */
export declare function ShowPassingFlashAnim(config?: SimpleAnimationOptions): AnimationConfig;
/**
 * Show creation then destruction
 */
export declare function ShowCreationThenDestructionAnim(config?: SimpleAnimationOptions): AnimationConfig;
/**
 * Broadcast - ripple effect from point
 */
export declare function BroadcastAnim(config?: SimpleAnimationOptions): AnimationConfig;
/**
 * Cycle replace - cycle through replacements
 */
export declare function CycleReplaceAnim(config: any): AnimationConfig;
/**
 * Apply to each (apply animation to multiple objects with lag)
 */
export declare function ApplyToEachAnim(config: any): AnimationConfig;
/**
 * Apply method animation
 */
export declare function ApplyMethodAnim(config: any): AnimationConfig;
/**
 * Apply function animation
 */
export declare function ApplyFunctionAnim(config: any): AnimationConfig;
/**
 * Apply matrix transformation
 */
export declare function ApplyMatrixAnim(config: any): AnimationConfig;
/**
 * Complex plane transformation
 */
export declare function ComplexMapAnim(config: any): AnimationConfig;
/**
 * Move to target (animation to predefined position)
 */
export declare function MoveToTargetAnim(config: any): AnimationConfig;
/**
 * Shift object
 */
export declare function ShiftAnim(config: any): AnimationConfig;
/**
 * Stretch animation
 */
export declare function StretchAnim(config: any): AnimationConfig;
/**
 * Point-wise function animation
 */
export declare function ApplyPointwiseFunctionAnim(config: any): AnimationConfig;
/**
 * Apply complex function
 */
export declare function ApplyComplexFunctionAnim(config: any): AnimationConfig;
//# sourceMappingURL=AdvancedAnimations.d.ts.map