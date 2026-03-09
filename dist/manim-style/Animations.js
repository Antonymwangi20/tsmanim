/**
 * Extended animation helpers for Manim-style API
 */
// ============================================
// BASIC ANIMATIONS
// ============================================
export function FadeInAnim(config) {
    return {
        type: 'fadeIn',
        duration: config?.duration ?? 1,
        delay: config?.delay ?? 0,
        easing: config?.easing ?? 'easeInOut'
    };
}
export function FadeOutAnim(config) {
    return {
        type: 'fadeOut',
        duration: config?.duration ?? 1,
        delay: config?.delay ?? 0,
        easing: config?.easing ?? 'easeInOut'
    };
}
export function MoveAnim(config) {
    return {
        type: 'move',
        from: config.from,
        to: config.to,
        duration: config.duration ?? 1,
        delay: config.delay ?? 0,
        easing: config.easing ?? 'easeInOut'
    };
}
export function RotateAnim(config) {
    return {
        type: 'rotate',
        angle: config.angle,
        duration: config.duration ?? 1,
        delay: config.delay ?? 0,
        easing: config.easing ?? 'easeInOut'
    };
}
export function ScaleAnim(config) {
    return {
        type: 'scale',
        scale: config.scale,
        duration: config.duration ?? 1,
        delay: config.delay ?? 0,
        easing: config.easing ?? 'easeInOut'
    };
}
// ============================================
// GROW/SHRINK ANIMATIONS
// ============================================
export function GrowFromCenterAnim(config) {
    return {
        type: 'growFromCenter',
        duration: config?.duration ?? 1,
        delay: config?.delay ?? 0,
        easing: config?.easing ?? 'easeOut'
    };
}
export function ShrinkToCenterAnim(config) {
    return {
        type: 'shrinkToCenter',
        duration: config?.duration ?? 1,
        delay: config?.delay ?? 0,
        easing: config?.easing ?? 'easeIn'
    };
}
// ============================================
// APPEARANCE ANIMATIONS
// ============================================
export function SpinAnim(config) {
    return {
        type: 'spin',
        angle: config.angle ?? Math.PI * 2,
        duration: config.duration ?? 1,
        delay: config.delay ?? 0,
        easing: config.easing ?? 'linear',
        direction: config.direction ?? 1 // 1 for clockwise, -1 for counter-clockwise
    };
}
export function FlipAnim(config) {
    return {
        type: 'flip',
        duration: config?.duration ?? 0.5,
        delay: config?.delay ?? 0,
        easing: config?.easing ?? 'easeInOut'
    };
}
export function ShineAnim(config) {
    return {
        type: 'shine',
        duration: config?.duration ?? 2,
        delay: config?.delay ?? 0,
        easing: config?.easing ?? 'linear'
    };
}
// ============================================
// WRITING/DRAWING ANIMATIONS
// ============================================
export function WriteAnim(config) {
    return {
        type: 'write',
        duration: config?.duration ?? 2,
        delay: config?.delay ?? 0,
        easing: config?.easing ?? 'linear',
        runTime: config?.duration ?? 2
    };
}
export function UnwriteAnim(config) {
    return {
        type: 'unwrite',
        duration: config?.duration ?? 2,
        delay: config?.delay ?? 0,
        easing: config?.easing ?? 'linear'
    };
}
export function DrawAnim(config) {
    return {
        type: 'draw',
        duration: config?.duration ?? 1,
        delay: config?.delay ?? 0,
        easing: config?.easing ?? 'easeInOut'
    };
}
// ============================================
// COLOR ANIMATIONS
// ============================================
export function ColorChangeAnim(config) {
    return {
        type: 'colorChange',
        colorFrom: config.from ?? '#FFFFFF',
        colorTo: config.to ?? '#000000',
        duration: config.duration ?? 1,
        delay: config.delay ?? 0,
        easing: config.easing ?? 'easeInOut'
    };
}
// ============================================
// INDICATION/EMPHASIS ANIMATIONS
// ============================================
export function IndicateAnim(config) {
    return {
        type: 'indicate',
        duration: config?.duration ?? 0.5,
        delay: config?.delay ?? 0,
        easing: config?.easing ?? 'easeInOut',
        scaleUp: 1.2,
        scaleDown: 1
    };
}
export function FlashAnim(config) {
    return {
        type: 'flash',
        duration: config?.duration ?? 0.3,
        delay: config?.delay ?? 0,
        easing: config?.easing ?? 'easeInOut',
        color: '#FFFF00'
    };
}
export function PulseAnim(config) {
    return {
        type: 'pulse',
        duration: config?.duration ?? 1,
        delay: config?.delay ?? 0,
        easing: config?.easing ?? 'easeInOut',
        scaleUp: 1.1,
        repetitions: 3
    };
}
// ============================================
// COMPLEX ANIMATIONS
// ============================================
export function WiggleAnim(config) {
    return {
        type: 'wiggle',
        duration: config?.duration ?? 1,
        delay: config?.delay ?? 0,
        easing: config?.easing ?? 'linear',
        amplitude: 5,
        frequency: 5
    };
}
export function ShakeAnim(config) {
    return {
        type: 'shake',
        duration: config?.duration ?? 0.5,
        delay: config?.delay ?? 0,
        easing: config?.easing ?? 'linear',
        distance: 10,
        frequency: 10
    };
}
export function SwingAnim(config) {
    return {
        type: 'swing',
        duration: config?.duration ?? 2,
        delay: config?.delay ?? 0,
        easing: config?.easing ?? 'easeInOut',
        angle: Math.PI / 6
    };
}
export function BounceAnim(config) {
    return {
        type: 'bounce',
        duration: config?.duration ?? 1,
        delay: config?.delay ?? 0,
        easing: config?.easing ?? 'easeInOut',
        height: 50,
        repetitions: 3
    };
}
export function WaveAnim(config) {
    return {
        type: 'wave',
        duration: config?.duration ?? 2,
        delay: config?.delay ?? 0,
        easing: config?.easing ?? 'linear',
        amplitude: 10,
        frequency: 5
    };
}
// ============================================
// PATH-BASED ANIMATIONS
// ============================================
export function FollowPathAnim(config) {
    return {
        type: 'followPath',
        path: config.path, // Array of Vector2 points
        duration: config.duration ?? 1,
        delay: config.delay ?? 0,
        easing: config.easing ?? 'easeInOut'
    };
}
// ============================================
// 3D ANIMATIONS
// ============================================
export function Rotate3DAnim(config) {
    return {
        type: 'rotate3d',
        axis: config.axis ?? [0, 1, 0], // [x, y, z]
        angle: config.angle ?? Math.PI / 2,
        duration: config.duration ?? 1,
        delay: config.delay ?? 0,
        easing: config.easing ?? 'easeInOut'
    };
}
// ============================================
// COMPOSITE/GROUP ANIMATIONS
// ============================================
/**
 * Run animations in sequence (one after another)
 */
export function SequenceAnim(animations, baseConfig) {
    return {
        type: 'sequence',
        animations,
        duration: animations.reduce((sum, anim) => sum + (anim.duration ?? 1), 0),
        delay: baseConfig?.delay ?? 0,
        easing: baseConfig?.easing ?? 'linear'
    };
}
/**
 * Run animations simultaneously with lag between objects
 */
export function LaggedStartAnim(animations, lagRatio = 0.1) {
    return {
        type: 'laggedStart',
        animations,
        lagRatio,
        duration: animations.length > 0 ? (animations[0].duration ?? 1) + animations.length * lagRatio : 0
    };
}
/**
 * Run all animations simultaneously
 */
export function SimultaneousAnim(animations, baseConfig) {
    const maxDuration = Math.max(...animations.map(a => a.duration ?? 1), 0);
    return {
        type: 'simultaneous',
        animations,
        duration: baseConfig?.duration ?? maxDuration,
        delay: baseConfig?.delay ?? 0,
        easing: baseConfig?.easing ?? 'linear'
    };
}
// ============================================
// ANIMATION UTILITIES
// ============================================
/**
 * Create a custom animation
 */
export function CustomAnim(type, config) {
    return {
        type,
        ...config,
        duration: config.duration ?? 1,
        delay: config.delay ?? 0,
        easing: config.easing ?? 'easeInOut'
    };
}
/**
 * Add delay to animation
 */
export function withDelay(anim, delay) {
    return {
        ...anim,
        delay
    };
}
/**
 * Reverse animation
 */
export function reverseAnim(anim) {
    return {
        ...anim,
        reversed: true
    };
}
/**
 * Repeat animation
 */
export function repeatAnim(anim, times = 2) {
    return {
        ...anim,
        type: 'repeat',
        animation: anim,
        times
    };
}
//# sourceMappingURL=Animations.js.map