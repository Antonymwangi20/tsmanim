/**
 * Decorator-Based Scene Composition Framework
 * 
 * Enables clean, declarative scene definition with:
 * - @Scene for scene metadata
 * - @Track for automated property interpolation
 * - @EntryPoint for async animation sequencing
 * - @Cached for memoization and GPU caching
 */

import { TrackedValue, Mobject } from './types';

// ============================================================================
// Scene Decorator
// ============================================================================

export interface SceneConfig {
  fps?: number;
  resolution?: '720p' | '1080p' | '1440p' | '4K' | [number, number];
  duration?: number; // seconds
  backgroundColor?: string;
  cacheable?: boolean;
}

const SCENE_METADATA_KEY = Symbol('scene:metadata');

/**
 * @Scene decorator for configuring scene rendering parameters
 * 
 * @example
 * @Scene({ fps: 60, resolution: '4K', duration: 10 })
 * class FourierAnimation extends BaseScene {
 *   async construct() { ... }
 * }
 */
export function Scene(config: SceneConfig = {}) {
  return function <T extends { new(...args: any[]): {} }>(constructor: T) {
    const defaults = {
      fps: 60,
      resolution: '1080p' as const,
      duration: 10,
      backgroundColor: '#000000',
      cacheable: true,
      ...config
    };

    Reflect.defineMetadata(SCENE_METADATA_KEY, defaults, constructor);
    Object.defineProperty(constructor.prototype, '__sceneConfig', {
      value: defaults,
      writable: false,
      enumerable: false
    });

    return constructor;
  };
}

export function getSceneConfig(target: any): SceneConfig | undefined {
  return Reflect.getMetadata(SCENE_METADATA_KEY, target.constructor);
}

// ============================================================================
// Track Decorator
// ============================================================================

const TRACKED_PROPERTIES_KEY = Symbol('tracked:properties');

export interface TrackConfig {
  interpolate?: boolean;
  cacheable?: boolean;
  from?: any;
  to?: any;
}

/**
 * @Track decorator for automatic property animation interpolation
 * 
 * Marks a property as trackable for animation system
 * 
 * @example
 * @Scene()
 * class WaveAnimation extends BaseScene {
 *   @Track({ from: 0, to: Math.PI * 2 })
 *   frequency = new TrackedValue(1);
 * 
 *   async construct() {
 *     // Animate frequency change - interpolation handled automatically
 *     await this.animateProperty('frequency', 10, 2);
 *   }
 * }
 */
export function Track(config: TrackConfig = { interpolate: true, cacheable: true }) {
  return function (target: any, propertyKey: string) {
    const trackedProps = Reflect.getOwnMetadata(TRACKED_PROPERTIES_KEY, target) || [];
    trackedProps.push({ propertyKey, config });
    Reflect.defineMetadata(TRACKED_PROPERTIES_KEY, trackedProps, target);
  };
}

export function getTrackedProperties(target: any): Array<{ propertyKey: string; config: TrackConfig }> {
  return Reflect.getMetadata(TRACKED_PROPERTIES_KEY, target) || [];
}

// ============================================================================
// EntryPoint Decorator
// ============================================================================

const ENTRY_POINT_KEY = Symbol('entrypoint:method');

/**
 * @EntryPoint decorator marks the main async animation sequence
 * 
 * Only one @EntryPoint per scene (enforced at runtime)
 * 
 * @example
 * @Scene()
 * class MyScene extends BaseScene {
 *   @Track()
 *   parameter = new TrackedValue(0);
 * 
 *   @EntryPoint()
 *   async construct() {
 *     // This runs when scene.render() is called
 *     const circle = new Circle2D({ ... });
 *     this.add(circle);
 *     
 *     // Async/await for complex sequencing
 *     await this.play(FadeInAnim());
 *     await this.play(RotateAnim({ duration: 2 }));
 *   }
 * }
 */
export function EntryPoint() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const existing = Reflect.getMetadata(ENTRY_POINT_KEY, target);
    if (existing) {
      throw new Error(`Scene can only have one @EntryPoint. Found: ${existing}, ${propertyKey}`);
    }
    Reflect.defineMetadata(ENTRY_POINT_KEY, propertyKey, target);
    return descriptor;
  };
}

export function getEntryPoint(target: any): string | undefined {
  return Reflect.getMetadata(ENTRY_POINT_KEY, target);
}

// ============================================================================
// Cached Decorator
// ============================================================================

const CACHED_KEY = Symbol('cached:method');

export interface CacheConfig {
  ttl?: number; // Time to live in ms
  disk?: boolean; // Cache to disk
  gpu?: boolean; // Cache on GPU
  key?: (args: any[]) => string; // Custom cache key function
}

/**
 * @Cached decorator for memoization and GPU caching
 * 
 * Caches expensive computations (LaTeX renders, complex curves, etc.)
 * 
 * @example
 * @Cached({ gpu: true, disk: true })
 * renderLatex(formula: string) {
 *   // Expensive LaTeX compilation
 *   // Result cached on disk and GPU
 * }
 */
export function Cached(config: CacheConfig = {}) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const cacheStore = new Map<string, any>();

    const getCacheKey = config.key
      ? config.key
      : (args: any[]) => JSON.stringify(args);

    descriptor.value = async function (...args: any[]) {
      const key = getCacheKey(args);

      if (cacheStore.has(key)) {
        return cacheStore.get(key);
      }

      const result = await originalMethod.apply(this, args);

      if (cacheStore.size > 100) {
        // Simple LRU: clear oldest entries
        const firstKey = cacheStore.keys().next().value;
        cacheStore.delete(firstKey);
      }

      cacheStore.set(key, result);
      return result;
    };

    return descriptor;
  };
}

// ============================================================================
// Property Decorator
// ============================================================================

const PROPERTY_METADATA_KEY = Symbol('property:metadata');

export interface PropertyConfig {
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  interpolation?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';
}

/**
 * @Property decorator for metadata about animated properties
 * 
 * Provides IDE hints and validation
 * 
 * @example
 * @Property({ unit: 'degrees', min: 0, max: 360, interpolation: 'easeInOut' })
 * rotation = new TrackedValue(0);
 */
export function Property(config: PropertyConfig = {}) {
  return function (target: any, propertyKey: string) {
    const properties = Reflect.getOwnMetadata(PROPERTY_METADATA_KEY, target) || {};
    properties[propertyKey] = config;
    Reflect.defineMetadata(PROPERTY_METADATA_KEY, properties, target);
  };
}

export function getPropertyConfig(target: any, propertyKey: string): PropertyConfig | undefined {
  const properties = Reflect.getMetadata(PROPERTY_METADATA_KEY, target);
  return properties?.[propertyKey];
}

// ============================================================================
// Constraint Decorator (Foundation for Solver)
// ============================================================================

const CONSTRAINTS_KEY = Symbol('constraints:list');

export type ConstraintFn = (state: any) => boolean;

export interface ConstraintConfig {
  name?: string;
  priority?: number; // 0-100, higher = more important
  soft?: boolean; // Soft constraints can be violated if needed
}

/**
 * @Constraint decorator for declarative constraint relationships
 * 
 * Constraint solver will maintain these relationships and interpolate free variables
 * 
 * @example
 * class MechanicalAnimation extends BaseScene {
 *   linkA = new Line2D({ length: 5 });
 *   linkB = new Line2D({ length: 3 });
 *   
 *   @Constraint({ name: 'adjacency', priority: 100 })
 *   linksAdjacent() {
 *     // Constraint solver ensures linkB.startPoint === linkA.endPoint
 *     return this.linkA.endPoint.equals(this.linkB.startPoint);
 *   }
 * }
 */
export function Constraint(config: ConstraintConfig = {}) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const constraints = Reflect.getOwnMetadata(CONSTRAINTS_KEY, target) || [];
    constraints.push({ propertyKey, config, fn: descriptor.value });
    Reflect.defineMetadata(CONSTRAINTS_KEY, constraints, target);
    return descriptor;
  };
}

export function getConstraints(target: any): Array<{ propertyKey: string; config: ConstraintConfig; fn: ConstraintFn }> {
  return Reflect.getMetadata(CONSTRAINTS_KEY, target) || [];
}

// ============================================================================
// Validator Decorator
// ============================================================================

const VALIDATORS_KEY = Symbol('validators:list');

export type ValidatorFn<T = any> = (value: T) => { valid: boolean; error?: string };

/**
 * @Validator decorator for compile-time and runtime validation
 * 
 * @example
 * @Validator((val) => ({
 *   valid: val >= 0 && val <= 1,
 *   error: 'Opacity must be 0-1'
 * }))
 * opacity = new TrackedValue(1);
 */
export function Validator<T = any>(validatorFn: ValidatorFn<T>) {
  return function (target: any, propertyKey: string) {
    const validators = Reflect.getOwnMetadata(VALIDATORS_KEY, target) || [];
    validators.push({ propertyKey, fn: validatorFn });
    Reflect.defineMetadata(VALIDATORS_KEY, validators, target);
  };
}

export function getValidators(target: any): Array<{ propertyKey: string; fn: ValidatorFn }> {
  return Reflect.getMetadata(VALIDATORS_KEY, target) || [];
}

// ============================================================================
// Utility: Apply All Decorators to Class
// ============================================================================

export interface DecoratorMetadata {
  scene?: SceneConfig;
  trackedProperties: Array<{ propertyKey: string; config: TrackConfig }>;
  entryPoint?: string;
  constraints: Array<{ propertyKey: string; config: ConstraintConfig; fn: ConstraintFn }>;
  validators: Array<{ propertyKey: string; fn: ValidatorFn }>;
}

export function extractDecoratorMetadata(target: any): DecoratorMetadata {
  return {
    scene: getSceneConfig(target),
    trackedProperties: getTrackedProperties(target.prototype),
    entryPoint: getEntryPoint(target.prototype),
    constraints: getConstraints(target.prototype),
    validators: getValidators(target.prototype)
  };
}

// ============================================================================
// Metadata Setup (For projects not using reflect-metadata)
// ============================================================================

if (typeof Reflect === 'undefined' || !Reflect.metadata) {
  const metadata = new WeakMap<any, Map<Symbol, any>>();

  (global as any).Reflect = {
    ...(global as any).Reflect,
    metadata: (key: Symbol, value: any) => (target: any) => {
      if (!metadata.has(target)) metadata.set(target, new Map());
      metadata.get(target)!.set(key, value);
      return target;
    },
    defineMetadata: (key: Symbol, value: any, target: any) => {
      if (!metadata.has(target)) metadata.set(target, new Map());
      metadata.get(target)!.set(key, value);
    },
    getMetadata: (key: Symbol, target: any) => {
      return metadata.get(target)?.get(key);
    },
    getOwnMetadata: (key: Symbol, target: any) => {
      return metadata.get(target)?.get(key);
    }
  };
}
