/**
 * Constraint Solver Foundation
 * 
 * Enables declarative constraint relationships:
 * - Tangency, coincidence, perpendicularity, etc.
 * - Automatic interpolation of free variables
 * - Type-safe constraint composition
 */

import { Mobject, Point2D, Point3D, TrackedValue, Vec2D, Vec3D } from './types';

// ============================================================================
// Constraint Type System
// ============================================================================

export type ConstraintValue = number | Point2D | Point3D | Mobject<any>;

export interface Constraint {
  readonly id: string;
  readonly name: string;
  readonly priority: number; // 0-100, higher = more important
  readonly soft: boolean; // Soft constraints can be violated if needed
  evaluate(): boolean;
  getError(): number; // Return normalized error [0, 1]
  repair(): void; // Solve to satisfy constraint
  getDependencies(): Set<TrackedValue<any>>;
}

// ============================================================================
// Concrete Constraint Types
// ============================================================================

/**
 * Equality constraint: two values must be equal
 * 
 * @example
 * new EqualityConstraint(circle.radius, square.side)
 */
export class EqualityConstraint<T> implements Constraint {
  readonly id = `constraint_${Math.random().toString(36).substr(2, 9)}`;
  readonly name = 'equality';
  readonly priority: number;
  readonly soft: boolean;

  constructor(
    private var1: TrackedValue<T>,
    private var2: TrackedValue<T>,
    private tolerance: number = 0.001,
    { priority = 50, soft = false } = {}
  ) {
    this.priority = priority;
    this.soft = soft;
  }

  evaluate(): boolean {
    const val1 = this.var1.get();
    const val2 = this.var2.get();

    if (typeof val1 === 'number' && typeof val2 === 'number') {
      return Math.abs(val1 - val2) < this.tolerance;
    }

    return JSON.stringify(val1) === JSON.stringify(val2);
  }

  getError(): number {
    const val1 = this.var1.get() as any;
    const val2 = this.var2.get() as any;

    if (typeof val1 === 'number' && typeof val2 === 'number') {
      return Math.min(1, Math.abs(val1 - val2) / Math.max(Math.abs(val1), 1));
    }

    return this.evaluate() ? 0 : 1;
  }

  repair(): void {
    const val1 = this.var1.get();
    const val2 = this.var2.get();

    if (typeof val1 === 'number' && typeof val2 === 'number') {
      const avg = (val1 + val2) / 2;
      this.var1.set(avg as T);
      this.var2.set(avg as T);
    }
  }

  getDependencies(): Set<TrackedValue<any>> {
    return new Set([this.var1, this.var2]);
  }
}

/**
 * Incidence constraint: point lies on curve/line
 */
export class IncidenceConstraint implements Constraint {
  readonly id = `constraint_${Math.random().toString(36).substr(2, 9)}`;
  readonly name = 'incidence';
  readonly priority: number;
  readonly soft: boolean;

  constructor(
    private point: TrackedValue<Point2D>,
    private curve: (t: number) => Point2D, // Parametric curve
    private tolerance: number = 0.01,
    { priority = 75, soft = false } = {}
  ) {
    this.priority = priority;
    this.soft = soft;
  }

  evaluate(): boolean {
    return this.getError() < this.tolerance;
  }

  getError(): number {
    const p = this.point.get();
    // Find closest point on curve
    let bestError = Infinity;
    for (let t = 0; t <= 1; t += 0.01) {
      const onCurve = this.curve(t);
      const dist = Math.sqrt((p.x - onCurve.x) ** 2 + (p.y - onCurve.y) ** 2);
      bestError = Math.min(bestError, dist);
    }
    return bestError;
  }

  repair(): void {
    const p = this.point.get();
    let bestT = 0;
    let bestError = Infinity;

    for (let t = 0; t <= 1; t += 0.01) {
      const onCurve = this.curve(t);
      const dist = Math.sqrt((p.x - onCurve.x) ** 2 + (p.y - onCurve.y) ** 2);
      if (dist < bestError) {
        bestError = dist;
        bestT = t;
      }
    }

    const repaired = this.curve(bestT);
    this.point.set(repaired);
  }

  getDependencies(): Set<TrackedValue<any>> {
    return new Set([this.point]);
  }
}

/**
 * Tangency constraint: two curves tangent at point
 */
export class TangencyConstraint implements Constraint {
  readonly id = `constraint_${Math.random().toString(36).substr(2, 9)}`;
  readonly name = 'tangency';
  readonly priority: number;
  readonly soft: boolean;

  constructor(
    private curve1: (t: number) => Point2D,
    private curve2: (t: number) => Point2D,
    private t1: TrackedValue<number>,
    private t2: TrackedValue<number>,
    private angleTolerance: number = 0.1,
    { priority = 90, soft = false } = {}
  ) {
    this.priority = priority;
    this.soft = soft;
  }

  private derivative(curve: (t: number) => Point2D, t: number, dt: number = 0.001): Point2D {
    const p1 = curve(t - dt);
    const p2 = curve(t + dt);
    return new Vec2D((p2.x - p1.x) / (2 * dt), (p2.y - p1.y) / (2 * dt));
  }

  evaluate(): boolean {
    const t1 = this.t1.get();
    const t2 = this.t2.get();

    const d1 = this.derivative(this.curve1, t1);
    const d2 = this.derivative(this.curve2, t2);

    // Normalize
    const len1 = Math.sqrt(d1.x ** 2 + d1.y ** 2);
    const len2 = Math.sqrt(d2.x ** 2 + d2.y ** 2);

    if (len1 === 0 || len2 === 0) return false;

    const n1 = new Vec2D(d1.x / len1, d1.y / len1);
    const n2 = new Vec2D(d2.x / len2, d2.y / len2);

    // Dot product should be ±1 for parallel
    const dot = Math.abs(n1.x * n2.x + n1.y * n2.y);
    return Math.abs(dot - 1) < this.angleTolerance;
  }

  getError(): number {
    return this.evaluate() ? 0 : 1;
  }

  repair(): void {
    const t1 = this.t1.get();
    const t2 = this.t2.get();

    const d1 = this.derivative(this.curve1, t1);
    const d2 = this.derivative(this.curve2, t2);

    const angle1 = Math.atan2(d1.y, d1.x);
    const angle2 = Math.atan2(d2.y, d2.x);

    // Adjust curve parameters to align tangents
    const diff = angle2 - angle1;
    this.t2.set(t2 + diff / (Math.PI * 2));
  }

  getDependencies(): Set<TrackedValue<any>> {
    return new Set([this.t1, this.t2]);
  }
}

/**
 * Distance constraint: distance between two objects
 */
export class DistanceConstraint implements Constraint {
  readonly id = `constraint_${Math.random().toString(36).substr(2, 9)}`;
  readonly name = 'distance';
  readonly priority: number;
  readonly soft: boolean;

  constructor(
    private obj1: TrackedValue<Point2D>,
    private obj2: TrackedValue<Point2D>,
    private targetDistance: number,
    private tolerance: number = 0.01,
    { priority = 50, soft = false } = {}
  ) {
    this.priority = priority;
    this.soft = soft;
  }

  evaluate(): boolean {
    return Math.abs(this.getCurrentDistance() - this.targetDistance) < this.tolerance;
  }

  private getCurrentDistance(): number {
    const p1 = this.obj1.get();
    const p2 = this.obj2.get();
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
  }

  getError(): number {
    return Math.abs(this.getCurrentDistance() - this.targetDistance) / Math.max(this.targetDistance, 1);
  }

  repair(): void {
    const p1 = this.obj1.get();
    const p2 = this.obj2.get();
    const current = this.getCurrentDistance();

    if (current === 0) return;

    const ratio = this.targetDistance / current;
    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;

    const newP1 = new Vec2D(
      midX - ((p1.x - midX) * ratio),
      midY - ((p1.y - midY) * ratio)
    );

    const newP2 = new Vec2D(
      midX + ((p2.x - midX) * ratio),
      midY + ((p2.y - midY) * ratio)
    );

    this.obj1.set(newP1 as any);
    this.obj2.set(newP2 as any);
  }

  getDependencies(): Set<TrackedValue<any>> {
    return new Set([this.obj1, this.obj2]);
  }
}

// ============================================================================
// Constraint Solver
// ============================================================================

export class ConstraintSolver {
  private constraints: Constraint[] = [];
  private maxIterations = 10;
  private errorThreshold = 0.001;

  addConstraint(constraint: Constraint): void {
    this.constraints.push(constraint);
  }

  removeConstraint(id: string): void {
    this.constraints = this.constraints.filter(c => c.id !== id);
  }

  /**
   * Solve constraints using iterative repair
   * Returns true if all constraints satisfied, false if some soft constraints violated
   */
  solve(): boolean {
    // Sort by priority (higher first)
    const sorted = [...this.constraints].sort((a, b) => b.priority - a.priority);

    for (let iter = 0; iter < this.maxIterations; iter++) {
      let totalError = 0;
      let hardConstraintsFailed = false;

      for (const constraint of sorted) {
        if (!constraint.evaluate()) {
          constraint.repair();
          const error = constraint.getError();
          totalError += error;

          if (!constraint.soft && error > this.errorThreshold) {
            hardConstraintsFailed = true;
          }
        }
      }

      if (totalError < this.errorThreshold) {
        return true;
      }

      if (hardConstraintsFailed && iter > this.maxIterations / 2) {
        break; // Hard constraints can't be satisfied
      }
    }

    return sorted.filter(c => !c.soft && !c.evaluate()).length === 0;
  }

  /**
   * Check all constraints
   */
  validate(): { satisfied: Constraint[]; violated: Constraint[] } {
    const satisfied: Constraint[] = [];
    const violated: Constraint[] = [];

    this.constraints.forEach(c => {
      if (c.evaluate()) {
        satisfied.push(c);
      } else {
        violated.push(c);
      }
    });

    return { satisfied, violated };
  }

  getConstraints(): Constraint[] {
    return [...this.constraints];
  }

  clear(): void {
    this.constraints = [];
  }
}

// ============================================================================
// Constraint Builder (Fluent API)
// ============================================================================

export class ConstraintBuilder {
  private solver: ConstraintSolver;

  constructor(solver?: ConstraintSolver) {
    this.solver = solver || new ConstraintSolver();
  }

  equal<T>(var1: TrackedValue<T>, var2: TrackedValue<T>, { priority = 50, soft = false } = {}): this {
    this.solver.addConstraint(new EqualityConstraint(var1, var2, 0.001, { priority, soft }));
    return this;
  }

  distance(
    obj1: TrackedValue<Point2D>,
    obj2: TrackedValue<Point2D>,
    distance: number,
    { priority = 50, soft = false } = {}
  ): this {
    this.solver.addConstraint(
      new DistanceConstraint(obj1, obj2, distance, 0.01, { priority, soft })
    );
    return this;
  }

  build(): ConstraintSolver {
    return this.solver;
  }
}
