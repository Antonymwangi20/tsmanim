/**
 * ts-manim V2 - Production-Grade Animation Framework
 * 
 * TypeScript-first with:
 * - Generic type-safe mobjects (Mobject<T>)
 * - Decorator-based scene composition
 * - Constraint solver for mechanical animation
 * - Modern CLI pipeline (mathviz)
 * - GPU acceleration (WebGPU ready)
 */

// ============================================================================
// Types & Dimensionality
// ============================================================================

export {
  // Dimension types
  Dimension,
  Point2D,
  Point3D,
  Point4D,
  Vec2D,
  Vec3D,
  Vec4D,

  // Core mobject types
  MobjectConfig,
  Mobject,
  Mobject2D,
  Mobject3D,
  Mobject4D,
  MobjectGroup,

  // Type guards
  is2D,
  is3D,
  is4D,
  validateHierarchy,

  // Value tracking
  TrackedValue,
  ValueChangeListener
} from './types.js';

// ============================================================================
// Decorators & Metadata
// ============================================================================

export {
  // Scene configuration
  Scene,
  SceneConfig,
  getSceneConfig,

  // Property tracking
  Track,
  TrackConfig,
  getTrackedProperties,

  // Entry point
  EntryPoint,
  getEntryPoint,

  // Caching
  Cached,
  CacheConfig,

  // Property metadata
  Property,
  PropertyConfig,
  getPropertyConfig,

  // Constraints
  Constraint,
  ConstraintConfig,
  getConstraints,

  // Validation
  Validator,
  getValidators,

  // Metadata extraction
  DecoratorMetadata,
  extractDecoratorMetadata
} from './decorators.js';

// ============================================================================
// Constraints & Solver
// ============================================================================

export {
  // Constraint types
  Constraint as ConstraintInterface,
  ConstraintValue,

  // Concrete constraints
  EqualityConstraint,
  IncidenceConstraint,
  TangencyConstraint,
  DistanceConstraint,

  // Solver
  ConstraintSolver,
  ConstraintBuilder
} from './constraints.js';

// ============================================================================
// Version & Metadata
// ============================================================================

export const VERSION = '2.0.0-dev';
export const FRAMEWORK = 'ts-manim V2';

export const FEATURES = {
  typeSafety: true,
  decorators: true,
  constraintSolver: true,
  gpu: false, // Coming in Phase 2
  symbolicMath: false, // Coming in Phase 3
  hotReload: false, // Coming in Phase 4
  distributedRendering: false // Coming in Phase 5
};

// ============================================================================
// Quick Start Guide
// ============================================================================

/**
 * Quick start with V2 API:
 * 
 * 1. Define a scene with decorators:
 * 
 *    @Scene({ fps: 60, resolution: '1080p' })
 *    class MyAnimation {
 *      @Track()
 *      parameter = new TrackedValue(0);
 * 
 *      @EntryPoint()
 *      async construct() {
 *        // Your animation code
 *      }
 *    }
 * 
 * 2. Create type-safe mobjects:
 * 
 *    class Circle extends Mobject2D {
 *      constructor(radius: number) {
 *        super();
 *        this.scale = radius / 50;
 *      }
 *    }
 * 
 * 3. Use constraint solver:
 * 
 *    const solver = new ConstraintSolver();
 *    solver.addConstraint(
 *      new DistanceConstraint(pointA, pointB, 5)
 *    );
 * 
 * 4. Render with modern CLI:
 * 
 *    mathviz watch scene.ts          # Development
 *    mathviz render scene.ts -o animation.mp4  # Production
 * 
 * Learn more: See V2_ARCHITECTURE.md and examples/v2-api-examples.ts
 */

/**
 * Example: Type-safe animation with constraints
 * 
 * ```typescript
 * import {
 *   Scene,
 *   Track,
 *   EntryPoint,
 *   Mobject2D,
 *   TrackedValue,
 *   ConstraintSolver,
 *   DistanceConstraint
 * } from 'ts-manim/v2';
 * 
 * @Scene({ fps: 60 })
 * class MechanicalAnimation {
 *   @Track()
 *   angle = new TrackedValue(0);
 * 
 *   @EntryPoint()
 *   async construct() {
 *     // Type-safe, IDE support, compile-time checking
 *   }
 * }
 * ```
 */
