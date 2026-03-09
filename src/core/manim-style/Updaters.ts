/**
 * Updater system for dynamic animations and value tracking
 */

import type { Node } from '../Node.js';

/**
 * Value tracker for animatable variables
 */
export class ValueTracker {
  private value: number = 0;
  private callbacks: ((value: number) => void)[] = [];

  constructor(initialValue: number = 0) {
    this.value = initialValue;
  }

  /**
   * Get current value
   */
  getValue(): number {
    return this.value;
  }

  /**
   * Set value
   */
  setValue(value: number): this {
    this.value = value;
    this.notifyCallbacks();
    return this;
  }

  /**
   * Increment value
   */
  increment(amount: number = 1): this {
    this.value += amount;
    this.notifyCallbacks();
    return this;
  }

  /**
   * Add callback
   */
  onValueChanged(callback: (value: number) => void): this {
    this.callbacks.push(callback);
    return this;
  }

  /**
   * Notify all callbacks
   */
  private notifyCallbacks(): void {
    for (const callback of this.callbacks) {
      callback(this.value);
    }
  }

  /**
   * Animate to value
   */
  animateTo(targetValue: number, duration: number = 1): any {
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
  private real: number = 0;
  private imag: number = 0;
  private callbacks: ((real: number, imag: number) => void)[] = [];

  constructor(real: number = 0, imag: number = 0) {
    this.real = real;
    this.imag = imag;
  }

  /**
   * Get value as [real, imag]
   */
  getValue(): [number, number] {
    return [this.real, this.imag];
  }

  /**
   * Set value
   */
  setValue(real: number, imag: number = 0): this {
    this.real = real;
    this.imag = imag;
    this.notifyCallbacks();
    return this;
  }

  /**
   * Add value
   */
  add(real: number, imag: number = 0): this {
    this.real += real;
    this.imag += imag;
    this.notifyCallbacks();
    return this;
  }

  /**
   * Add callback
   */
  onValueChanged(callback: (real: number, imag: number) => void): this {
    this.callbacks.push(callback);
    return this;
  }

  /**
   * Notify callbacks
   */
  private notifyCallbacks(): void {
    for (const callback of this.callbacks) {
      callback(this.real, this.imag);
    }
  }
}

/**
 * Updater function for dynamic object behavior
 */
export type UpdateFunction = (
  dt: number,
  time: number,
  object: any
) => void;

/**
 * Updater manager
 */
export class UpdaterManager {
  private updaters: Map<string, UpdateFunction> = new Map();
  private time: number = 0;
  private lastFrameTime: number = 0;

  /**
   * Add updater function
   */
  addUpdater(id: string, updateFn: UpdateFunction): this {
    this.updaters.set(id, updateFn);
    return this;
  }

  /**
   * Remove updater
   */
  removeUpdater(id: string): this {
    this.updaters.delete(id);
    return this;
  }

  /**
   * Update all objects
   */
  update(currentTime: number, objects: any[]): void {
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
  clear(): this {
    this.updaters.clear();
    return this;
  }

  /**
   * Get time
   */
  getTime(): number {
    return this.time;
  }
}

/**
 * Animation group helpers
 */

/**
 * Succession - animations run one after another
 */
export function Succession(animations: any[], lagTime: number = 0): any {
  return {
    type: 'succession',
    animations,
    lagTime
  };
}

/**
 * Simultaneous - animations run at the same time
 */
export function Simultaneous(animations: any[]): any {
  return {
    type: 'simultaneous',
    animations
  };
}

/**
 * AnimationGroup - base for grouped animations
 */
export function AnimationGroup(animations: any[], kwargs?: any): any {
  return {
    type: 'group',
    animations,
    ...kwargs
  };
}

/**
 * LaggedStart - animations staggered with lag
 */
export function LaggedStart(animations: any[], lagRatio: number = 0.05): any {
  return {
    type: 'laggedStart',
    animations,
    lagRatio
  };
}

/**
 * LaggedEnd - animations with lag at end
 */
export function LaggedEnd(animations: any[], lagRatio: number = 0.05): any {
  return {
    type: 'laggedEnd',
    animations,
    lagRatio
  };
}

/**
 * Custom animation composition
 */
export function createAnimationComposition(
  animations: any[],
  composition: 'sequence' | 'simultaneous' | 'lagged',
  options?: any
): any {
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
export function chainAnimations(
  baseAnimation: any,
  ...followingAnimations: any[]
): any {
  return Succession([baseAnimation, ...followingAnimations]);
}

/**
 * Run animations in parallel
 */
export function parallelAnimations(...animations: any[]): any {
  return Simultaneous(animations);
}
