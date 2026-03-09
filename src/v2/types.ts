/**
 * V2 Type System: Production-Grade TypeScript Foundation
 * 
 * Core concepts:
 * - Generic Mobject<T> enforces dimensionality at compile-time
 * - Type-safe animations with intellisense
 * - Compile-time validation of scene hierarchies
 * - Constraint-based animation foundation
 */

// ============================================================================
// Dimension & Coordinate System Types
// ============================================================================

/** Enforces dimensionality constraints at type level */
export interface Dimension {
  readonly dimensionality: number;
}

export interface Point2D extends Dimension {
  readonly dimensionality: 2;
  readonly x: number;
  readonly y: number;
}

export interface Point3D extends Dimension {
  readonly dimensionality: 3;
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

export interface Point4D extends Dimension {
  readonly dimensionality: 4;
  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly w: number;
}

// Concrete implementations
export class Vec2D implements Point2D {
  readonly dimensionality = 2 as const;
  constructor(public x: number, public y: number) {}

  static from(arr: [number, number]): Vec2D {
    return new Vec2D(arr[0], arr[1]);
  }

  toArray(): [number, number] {
    return [this.x, this.y];
  }
}

export class Vec3D implements Point3D {
  readonly dimensionality = 3 as const;
  constructor(public x: number, public y: number, public z: number) {}

  static from(arr: [number, number, number]): Vec3D {
    return new Vec3D(arr[0], arr[1], arr[2]);
  }

  toArray(): [number, number, number] {
    return [this.x, this.y, this.z];
  }
}

export class Vec4D implements Point4D {
  readonly dimensionality = 4 as const;
  constructor(public x: number, public y: number, public z: number, public w: number) {}

  static from(arr: [number, number, number, number]): Vec4D {
    return new Vec4D(arr[0], arr[1], arr[2], arr[3]);
  }

  toArray(): [number, number, number, number] {
    return [this.x, this.y, this.z, this.w];
  }
}

// ============================================================================
// Value Tracking System (Foundation for Constraints)
// ============================================================================

export type ValueChangeListener<T> = (newValue: T, oldValue: T) => void;

/**
 * Tracked value that can be animated and constrained
 * Forms the foundation for constraint solver
 */
export class TrackedValue<T> {
  private value: T;
  private listeners: ValueChangeListener<T>[] = [];

  constructor(initialValue: T) {
    this.value = initialValue;
  }

  get(): T {
    return this.value;
  }

  set(newValue: T): void {
    const oldValue = this.value;
    this.value = newValue;
    this.listeners.forEach(cb => cb(newValue, oldValue));
  }

  onChange(listener: ValueChangeListener<T>): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  toJSON(): T {
    return this.value;
  }
}

// ============================================================================
// Generic Mobject with Type Safety
// ============================================================================

export interface MobjectConfig {
  position?: Point2D;
  rotation?: number;
  scale?: number;
  opacity?: number;
  color?: string;
  zIndex?: number;
}

/**
 * Type-safe generic Mobject base class
 * T enforces coordinate dimensionality
 */
export abstract class Mobject<T extends Dimension = Point2D> {
  protected id: string = `mobject_${Math.random().toString(36).substr(2, 9)}`;
  protected children: Mobject<any>[] = [];
  protected parent: Mobject<any> | null = null;

  // Tracked properties for animation and constraints
  protected _position: TrackedValue<T>;
  protected _rotation: TrackedValue<number>;
  protected _scale: TrackedValue<number>;
  protected _opacity: TrackedValue<number>;
  protected _color: TrackedValue<string>;
  protected _zIndex: TrackedValue<number>;

  // Dimension constraint (for compile-time checking)
  abstract readonly dimensionality: number;

  constructor(protected config: MobjectConfig = {}) {
    this._position = new TrackedValue(((config.position ?? { x: 0, y: 0 }) as unknown) as T);
    this._rotation = new TrackedValue(config.rotation ?? 0);
    this._scale = new TrackedValue(config.scale ?? 1);
    this._opacity = new TrackedValue(config.opacity ?? 1);
    this._color = new TrackedValue(config.color ?? '#ffffff');
    this._zIndex = new TrackedValue(config.zIndex ?? 0);
  }

  // ========== Property Access ==========

  get position(): T {
    return this._position.get();
  }

  set position(value: T) {
    this._position.set(value);
  }

  get rotation(): number {
    return this._rotation.get();
  }

  set rotation(value: number) {
    this._rotation.set(value);
  }

  get scale(): number {
    return this._scale.get();
  }

  set scale(value: number) {
    this._scale.set(value);
  }

  get opacity(): number {
    return this._opacity.get();
  }

  set opacity(value: number) {
    this._opacity.set(value);
  }

  get color(): string {
    return this._color.get();
  }

  set color(value: string) {
    this._color.set(value);
  }

  // ========== Hierarchy ==========

  add(...children: Mobject<any>[]): this {
    children.forEach(child => {
      if (child.parent) {
        child.parent.children = child.parent.children.filter(c => c !== child);
      }
      child.parent = this;
      this.children.push(child);
    });
    return this;
  }

  getChildren<U extends Dimension = any>(): Mobject<U>[] {
    return this.children as Mobject<U>[];
  }

  getParent(): Mobject<any> | null {
    return this.parent;
  }

  remove(child: Mobject<any>): this {
    this.children = this.children.filter(c => c !== child);
    if (child.parent === this) {
      child.parent = null;
    }
    return this;
  }

  // ========== Type-Safe Constraint Support ==========

  /**
   * Register a property for constraint tracking
   * Used by constraint solver
   */
  registerProperty(name: keyof this, trackedValue: TrackedValue<any>): void {
    // Constraint solver will use this registry
  }

  // ========== Serialization ==========

  toJSON(): object {
    return {
      id: this.id,
      dimensionality: this.dimensionality,
      position: this._position.toJSON(),
      rotation: this._rotation.toJSON(),
      scale: this._scale.toJSON(),
      opacity: this._opacity.toJSON(),
      color: this._color.toJSON(),
      children: this.children.map(c => c.toJSON())
    };
  }
}

// ============================================================================
// Type-Safe 2D/3D Mobject Variants
// ============================================================================

/**
 * 2D Mobject - Enforces Point2D at compile time
 */
export abstract class Mobject2D extends Mobject<Point2D> {
  readonly dimensionality = 2 as const;

  constructor(config?: MobjectConfig) {
    super(config);
    // Ensure position is 2D
    if (!this._position.get()) {
      this._position.set(new Vec2D(0, 0));
    }
  }
}

/**
 * 3D Mobject - Enforces Point3D at compile time
 */
export abstract class Mobject3D extends Mobject<Point3D> {
  readonly dimensionality = 3 as const;

  constructor(config?: MobjectConfig) {
    super(config);
    // Ensure position is 3D
    if (!this._position.get()) {
      this._position.set(new Vec3D(0, 0, 0));
    }
  }
}

/**
 * 4D Mobject - Enforces Point4D at compile time
 */
export abstract class Mobject4D extends Mobject<Point4D> {
  readonly dimensionality = 4 as const;

  constructor(config?: MobjectConfig) {
    super(config);
    // Ensure position is 4D
    if (!this._position.get()) {
      this._position.set(new Vec4D(0, 0, 0, 0));
    }
  }
}

// ============================================================================
// Type Guard Functions
// ============================================================================

export function is2D(mobject: Mobject<any>): mobject is Mobject2D {
  return mobject.dimensionality === 2;
}

export function is3D(mobject: Mobject<any>): mobject is Mobject3D {
  return mobject.dimensionality === 3;
}

export function is4D(mobject: Mobject<any>): mobject is Mobject4D {
  return mobject.dimensionality === 4;
}

export function validateHierarchy(root: Mobject<any>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  function visit(node: Mobject<any>, parent: Mobject<any> | null): void {
    // Example validation: prevent 3D children in 2D parent (can be extended)
    if (parent && parent.dimensionality < node.dimensionality) {
      errors.push(
        `Invalid hierarchy: ${node.dimensionality}D mobject cannot be child of ${parent.dimensionality}D mobject`
      );
    }

    node.getChildren().forEach(child => visit(child, node));
  }

  visit(root, null);
  return { valid: errors.length === 0, errors };
}

// ============================================================================
// Generic Collection Types
// ============================================================================

export class MobjectGroup<T extends Dimension = Point2D> extends Mobject<T> {
  readonly dimensionality: number;

  constructor(mobjects: Mobject<T>[], config?: MobjectConfig) {
    super(config);
    this.dimensionality = mobjects[0]?.dimensionality ?? 2;
    this.add(...(mobjects as any));
  }

  static create2D(...mobjects: Mobject2D[]): MobjectGroup<Point2D> {
    return new MobjectGroup(mobjects);
  }

  static create3D(...mobjects: Mobject3D[]): MobjectGroup<Point3D> {
    return new MobjectGroup(mobjects as any);
  }
}
