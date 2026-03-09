/**
 * Advanced animation types (drawing, writing, morphing)
 */

import type { AnimationConfig } from './Animations.js';
import type { SimpleAnimationOptions } from './Scene.js';

// ============================================
// CREATION ANIMATIONS
// ============================================

/**
 * Write text like typing
 */
export function WriteAnim(config?: SimpleAnimationOptions): AnimationConfig {
  return {
    type: 'write',
    duration: config?.duration ?? 3,
    delay: config?.delay ?? 0,
    easing: config?.easing ?? 'linear',
    strokeWidth: 2
  };
}

/**
 * Unwrite - reverse of write
 */
export function UnwriteAnim(config?: SimpleAnimationOptions): AnimationConfig {
  return {
    type: 'unwrite',
    duration: config?.duration ?? 2,
    delay: config?.delay ?? 0,
    easing: config?.easing ?? 'linear'
  };
}

/**
 * Create with stroke and then fill
 */
export function DrawBorderThenFillAnim(config?: SimpleAnimationOptions): AnimationConfig {
  return {
    type: 'drawBorderThenFill',
    duration: config?.duration ?? 2,
    delay: config?.delay ?? 0,
    easing: config?.easing ?? 'easeOut',
    strokeDuration: (config?.duration ?? 2) * 0.6,
    fillDuration: (config?.duration ?? 2) * 0.4
  };
}

/**
 * Create animation
 */
export function CreateAnim(config?: SimpleAnimationOptions): AnimationConfig {
  return {
    type: 'create',
    duration: config?.duration ?? 1,
    delay: config?.delay ?? 0,
    easing: config?.easing ?? 'easeOut'
  };
}

/**
 * Spin in from nothing
 */
export function SpinInFromNothingAnim(config?: SimpleAnimationOptions): AnimationConfig {
  return {
    type: 'spinInFromNothing',
    duration: config?.duration ?? 1,
    delay: config?.delay ?? 0,
    easing: config?.easing ?? 'easeOut'
  };
}

/**
 * Create then fade out
 */
export function CreateThenFadeOutAnim(config?: SimpleAnimationOptions): AnimationConfig {
  return {
    type: 'createThenFadeOut',
    duration: config?.duration ?? 1,
    delay: config?.delay ?? 0,
    easing: config?.easing ?? 'easeOut'
  };
}

// ============================================
// TRANSFORMATION ANIMATIONS
// ============================================

/**
 * Transform one object into another
 */
export function TransformAnim(config: any): AnimationConfig {
  return {
    type: 'transform',
    from: config.from,
    to: config.to,
    duration: config.duration ?? 1,
    delay: config.delay ?? 0,
    easing: config.easing ?? 'easeInOut',
    pathFunc: config.pathFunc ?? 'linear'
  };
}

/**
 * Replacement transform (removes old, adds new)
 */
export function ReplacementTransformAnim(config: any): AnimationConfig {
  return {
    type: 'replacementTransform',
    from: config.from,
    to: config.to,
    duration: config.duration ?? 1,
    delay: config.delay ?? 0,
    easing: config.easing ?? 'easeInOut'
  };
}

/**
 * Transform matching shapes
 */
export function TransformMatchingShapesAnim(config: any): AnimationConfig {
  return {
    type: 'transformMatchingShapes',
    from: config.from,
    to: config.to,
    expectedTransformTime: config.expectedTransformTime ?? 1,
    duration: config.duration ?? 1,
    delay: config.delay ?? 0,
    easing: config.easing ?? 'easeInOut'
  };
}

/**
 * Clockwise Transform
 */
export function ClockwiseTransformAnim(config: any): AnimationConfig {
  return {
    type: 'clockwiseTransform',
    from: config.from,
    to: config.to,
    duration: config.duration ?? 1,
    delay: config.delay ?? 0,
    easing: config.easing ?? 'easeInOut',
    direction: 'clockwise'
  };
}

/**
 * Counter-clockwise Transform
 */
export function CounterClockwiseTransformAnim(config: any): AnimationConfig {
  return {
    type: 'counterClockwiseTransform',
    from: config.from,
    to: config.to,
    duration: config.duration ?? 1,
    delay: config.delay ?? 0,
    easing: config.easing ?? 'easeInOut',
    direction: 'counterClockwise'
  };
}

// ============================================
// EMPHASIS & INDICATION
// ============================================

/**
 * Circumscribe - draw circle around object
 */
export function CircumscribeAnim(config?: SimpleAnimationOptions): AnimationConfig {
  return {
    type: 'circumscribe',
    duration: config?.duration ?? 0.5,
    delay: config?.delay ?? 0,
    easing: config?.easing ?? 'easeInOut',
    color: '#FFFF00',
    lineWidth: 2
  };
}

/**
 * Underline an object
 */
export function UnderlineAnim(config?: SimpleAnimationOptions): AnimationConfig {
  return {
    type: 'underline',
    duration: config?.duration ?? 0.5,
    delay: config?.delay ?? 0,
    easing: config?.easing ?? 'easeInOut',
    color: '#FFFF00'
  };
}

/**
 * Overline an object
 */
export function OverlineAnim(config?: SimpleAnimationOptions): AnimationConfig {
  return {
    type: 'overline',
    duration: config?.duration ?? 0.5,
    delay: config?.delay ?? 0,
    easing: config?.easing ?? 'easeInOut',
    color: '#FFFF00'
  };
}

/**
 * Cross out an object
 */
export function CrossOutAnim(config?: SimpleAnimationOptions): AnimationConfig {
  return {
    type: 'crossOut',
    duration: config?.duration ?? 0.5,
    delay: config?.delay ?? 0,
    easing: config?.easing ?? 'easeInOut',
    color: '#FF0000'
  };
}

/**
 * Show passing flash - moving highlight
 */
export function ShowPassingFlashAnim(config?: SimpleAnimationOptions): AnimationConfig {
  return {
    type: 'showPassingFlash',
    duration: config?.duration ?? 0.5,
    delay: config?.delay ?? 0,
    easing: config?.easing ?? 'linear',
    width: 20,
    color: '#FFFF00'
  };
}

/**
 * Show creation then destruction
 */
export function ShowCreationThenDestructionAnim(config?: SimpleAnimationOptions): AnimationConfig {
  return {
    type: 'showCreationThenDestruction',
    duration: config?.duration ?? 2,
    delay: config?.delay ?? 0,
    easing: config?.easing ?? 'easeInOut',
    buildTime: (config?.duration ?? 2) * 0.5,
    destroyTime: (config?.duration ?? 2) * 0.5
  };
}

// ============================================
// SPECIAL EFFECTS
// ============================================

/**
 * Broadcast - ripple effect from point
 */
export function BroadcastAnim(config?: SimpleAnimationOptions): AnimationConfig {
  return {
    type: 'broadcast',
    duration: config?.duration ?? 1.5,
    delay: config?.delay ?? 0,
    easing: config?.easing ?? 'easeOut',
    ripples: 3,
    maxRadius: 100
  };
}

/**
 * Cycle replace - cycle through replacements
 */
export function CycleReplaceAnim(config: any): AnimationConfig {
  return {
    type: 'cycleReplace',
    objects: config.objects,
    duration: config.duration ?? 1,
    delay: config.delay ?? 0,
    easing: config.easing ?? 'easeInOut'
  };
}

/**
 * Apply to each (apply animation to multiple objects with lag)
 */
export function ApplyToEachAnim(config: any): AnimationConfig {
  return {
    type: 'applyToEach',
    animation: config.animation,
    objects: config.objects,
    lagRatio: config.lagRatio ?? 0.05,
    duration: config.duration ?? 1,
    delay: config.delay ?? 0
  };
}

/**
 * Apply method animation
 */
export function ApplyMethodAnim(config: any): AnimationConfig {
  return {
    type: 'applyMethod',
    method: config.method,
    args: config.args ?? [],
    kwargs: config.kwargs ?? {},
    duration: config.duration ?? 1,
    delay: config.delay ?? 0,
    easing: config.easing ?? 'easeInOut'
  };
}

/**
 * Apply function animation
 */
export function ApplyFunctionAnim(config: any): AnimationConfig {
  return {
    type: 'applyFunction',
    function: config.function,
    duration: config.duration ?? 1,
    delay: config.delay ?? 0,
    easing: config.easing ?? 'easeInOut'
  };
}

/**
 * Apply matrix transformation
 */
export function ApplyMatrixAnim(config: any): AnimationConfig {
  return {
    type: 'applyMatrix',
    matrix: config.matrix,
    duration: config.duration ?? 1,
    delay: config.delay ?? 0,
    easing: config.easing ?? 'easeInOut'
  };
}

/**
 * Complex plane transformation
 */
export function ComplexMapAnim(config: any): AnimationConfig {
  return {
    type: 'complexMap',
    function: config.function,
    duration: config.duration ?? 1,
    delay: config.delay ?? 0,
    easing: config.easing ?? 'easeInOut'
  };
}

// ============================================
// MOVEMENT HELPERS
// ============================================

/**
 * Move to target (animation to predefined position)
 */
export function MoveToTargetAnim(config: any): AnimationConfig {
  return {
    type: 'moveToTarget',
    target: config.target,
    duration: config.duration ?? 1,
    delay: config.delay ?? 0,
    easing: config.easing ?? 'easeInOut'
  };
}

/**
 * Shift object
 */
export function ShiftAnim(config: any): AnimationConfig {
  return {
    type: 'shift',
    direction: config.direction ?? [1, 0],
    amount: config.amount ?? 1,
    duration: config.duration ?? 0.5,
    delay: config.delay ?? 0,
    easing: config.easing ?? 'easeInOut'
  };
}

/**
 * Stretch animation
 */
export function StretchAnim(config: any): AnimationConfig {
  return {
    type: 'stretch',
    direction: config.direction ?? [1, 0],
    factor: config.factor ?? 1.5,
    duration: config.duration ?? 1,
    delay: config.delay ?? 0,
    easing: config.easing ?? 'easeInOut'
  };
}

/**
 * Point-wise function animation
 */
export function ApplyPointwiseFunctionAnim(config: any): AnimationConfig {
  return {
    type: 'applyPointwiseFunction',
    function: config.function,
    duration: config.duration ?? 1,
    delay: config.delay ?? 0,
    easing: config.easing ?? 'easeInOut'
  };
}

/**
 * Apply complex function
 */
export function ApplyComplexFunctionAnim(config: any): AnimationConfig {
  return {
    type: 'applyComplexFunction',
    function: config.function,
    duration: config.duration ?? 1,
    delay: config.delay ?? 0,
    easing: config.easing ?? 'easeInOut'
  };
}
