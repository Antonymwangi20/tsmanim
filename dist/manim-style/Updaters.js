/**
 * Updater system for dynamic animations and value tracking
 */
/**
 * Value tracker for animatable variables
 */
export class ValueTracker {
    value = 0;
    callbacks = [];
    constructor(initialValue = 0) {
        this.value = initialValue;
    }
    /**
     * Get current value
     */
    getValue() {
        return this.value;
    }
    /**
     * Set value
     */
    setValue(value) {
        this.value = value;
        this.notifyCallbacks();
        return this;
    }
    /**
     * Increment value
     */
    increment(amount = 1) {
        this.value += amount;
        this.notifyCallbacks();
        return this;
    }
    /**
     * Add callback
     */
    onValueChanged(callback) {
        this.callbacks.push(callback);
        return this;
    }
    /**
     * Notify all callbacks
     */
    notifyCallbacks() {
        for (const callback of this.callbacks) {
            callback(this.value);
        }
    }
    /**
     * Animate to value
     */
    animateTo(targetValue, duration = 1) {
        return {
            type: 'trackValue',
            tracker: this,
            targetValue,
            duration
        };
    }
}
/**
 * Complex value tracker (for complex numbers)
 */
export class ComplexValueTracker {
    real = 0;
    imag = 0;
    callbacks = [];
    constructor(real = 0, imag = 0) {
        this.real = real;
        this.imag = imag;
    }
    /**
     * Get value as [real, imag]
     */
    getValue() {
        return [this.real, this.imag];
    }
    /**
     * Set value
     */
    setValue(real, imag = 0) {
        this.real = real;
        this.imag = imag;
        this.notifyCallbacks();
        return this;
    }
    /**
     * Add value
     */
    add(real, imag = 0) {
        this.real += real;
        this.imag += imag;
        this.notifyCallbacks();
        return this;
    }
    /**
     * Add callback
     */
    onValueChanged(callback) {
        this.callbacks.push(callback);
        return this;
    }
    /**
     * Notify callbacks
     */
    notifyCallbacks() {
        for (const callback of this.callbacks) {
            callback(this.real, this.imag);
        }
    }
}
/**
 * Updater manager
 */
export class UpdaterManager {
    updaters = new Map();
    time = 0;
    lastFrameTime = 0;
    /**
     * Add updater function
     */
    addUpdater(id, updateFn) {
        this.updaters.set(id, updateFn);
        return this;
    }
    /**
     * Remove updater
     */
    removeUpdater(id) {
        this.updaters.delete(id);
        return this;
    }
    /**
     * Update all objects
     */
    update(currentTime, objects) {
        const dt = currentTime - this.lastFrameTime;
        this.time = currentTime;
        this.lastFrameTime = currentTime;
        for (const [id, updateFn] of this.updaters) {
            for (const obj of objects) {
                updateFn(dt, this.time, obj);
            }
        }
    }
    /**
     * Clear all updaters
     */
    clear() {
        this.updaters.clear();
        return this;
    }
    /**
     * Get time
     */
    getTime() {
        return this.time;
    }
}
/**
 * Animation group helpers
 */
/**
 * Succession - animations run one after another
 */
export function Succession(animations, lagTime = 0) {
    return {
        type: 'succession',
        animations,
        lagTime
    };
}
/**
 * Simultaneous - animations run at the same time
 */
export function Simultaneous(animations) {
    return {
        type: 'simultaneous',
        animations
    };
}
/**
 * AnimationGroup - base for grouped animations
 */
export function AnimationGroup(animations, kwargs) {
    return {
        type: 'group',
        animations,
        ...kwargs
    };
}
/**
 * LaggedStart - animations staggered with lag
 */
export function LaggedStart(animations, lagRatio = 0.05) {
    return {
        type: 'laggedStart',
        animations,
        lagRatio
    };
}
/**
 * LaggedEnd - animations with lag at end
 */
export function LaggedEnd(animations, lagRatio = 0.05) {
    return {
        type: 'laggedEnd',
        animations,
        lagRatio
    };
}
/**
 * Custom animation composition
 */
export function createAnimationComposition(animations, composition, options) {
    switch (composition) {
        case 'sequence':
            return Succession(animations, options?.lagTime ?? 0);
        case 'simultaneous':
            return Simultaneous(animations);
        case 'lagged':
            return LaggedStart(animations, options?.lagRatio ?? 0.05);
        default:
            return Simultaneous(animations);
    }
}
/**
 * Chain animations sequentially
 */
export function chainAnimations(baseAnimation, ...followingAnimations) {
    return Succession([baseAnimation, ...followingAnimations]);
}
/**
 * Run animations in parallel
 */
export function parallelAnimations(...animations) {
    return Simultaneous(animations);
}
//# sourceMappingURL=Updaters.js.map