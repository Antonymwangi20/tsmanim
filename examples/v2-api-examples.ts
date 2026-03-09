/**
 * V2 API Example: Type-Safe Constraint-Based Animation
 * 
 * This demonstrates the new production-grade API with:
 * - Full TypeScript type safety
 * - Decorator-based scene composition
 * - Constraint solver for mechanical animation
 * - Async/await for complex sequencing
 */

import {
  Mobject2D,
  Mobject3D,
  Vec2D,
  TrackedValue,
  MobjectGroup,
  Scene,
  Track,
  EntryPoint,
  Constraint,
  Property,
  ConstraintSolver,
  DistanceConstraint,
  TangencyConstraint,
  extractDecoratorMetadata
} from '../v2/types';
import { ConstraintBuilder } from '../v2/constraints';

// ============================================================================
// Example 1: Simple Type-Safe Scene
// ============================================================================

/**
 * A circle that can be animated with full type safety
 */
class Circle2D extends Mobject2D {
  constructor(radius: number = 50) {
    super();
    this.scale = radius / 50;
  }
}

/**
 * Simple animation: circles fading in with constraints
 */
@Scene({ fps: 60, resolution: '1080p', duration: 5 })
class TypeSafeAnimation {
  @Track({ interpolate: true })
  opacity = new TrackedValue(0);

  @Property({ min: 0, max: 1, unit: 'opacity' })
  @Track()
  globalOpacity = new TrackedValue(0);

  @EntryPoint()
  async construct() {
    console.log('🎬 Constructing type-safe animation...');
    console.log('Metadata:', extractDecoratorMetadata(this));
  }
}

// ============================================================================
// Example 2: Constraint-Based Mechanical Linkage
// ============================================================================

/**
 * Represents a line segment with position and angle
 */
class LinkSegment extends Mobject2D {
  constructor(
    public startPoint: TrackedValue<Vec2D>,
    public endPoint: TrackedValue<Vec2D>
  ) {
    super();
  }

  getLength(): number {
    const start = this.startPoint.get();
    const end = this.endPoint.get();
    return Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2);
  }

  getAngle(): number {
    const start = this.startPoint.get();
    const end = this.endPoint.get();
    return Math.atan2(end.y - start.y, end.x - start.x);
  }
}

/**
 * Four-bar linkage mechanism (common in engineering)
 * Demonstrates:
 * - Multiple constraints working together
 * - Type-safe generic mobjects
 * - Constraint solver maintaining relationships
 */
@Scene({ fps: 60, resolution: '2K', duration: 10, cacheable: true })
class FourBarLinkage {
  // Position trackers for the four pivot points
  private pivot1 = new TrackedValue(new Vec2D(0, 0));
  private pivot2 = new TrackedValue(new Vec2D(10, 0));
  private joint = new TrackedValue(new Vec2D(5, 5));
  private follower = new TrackedValue(new Vec2D(10, 5));

  // The four bars (links)
  link1!: LinkSegment; // Crank (driven)
  link2!: LinkSegment; // Coupler
  link3!: LinkSegment; // Rocker
  link4!: LinkSegment; // Ground

  // Animation parameter
  @Track({ from: 0, to: Math.PI * 2 })
  crankAngle = new TrackedValue(0);

  // Constraint solver instance
  private solver = new ConstraintSolver();

  @EntryPoint()
  async construct() {
    console.log('🔧 Constructing four-bar linkage...');

    // Create the linkage
    this.link1 = new LinkSegment(this.pivot1, this.joint);
    this.link2 = new LinkSegment(this.joint, this.joint); // Coupler (moves)
    this.link3 = new LinkSegment(this.joint, this.follower);
    this.link4 = new LinkSegment(this.pivot2, this.follower);

    // Add constraints using fluent API
    new ConstraintBuilder(this.solver)
      // Link lengths are fixed (rigid bars)
      .distance(this.pivot1, this.joint, 3, { priority: 100 })
      .distance(this.joint, this.follower, 4, { priority: 100 })
      .distance(this.pivot2, this.follower, 5, { priority: 100 })
      // Pivots are fixed
      .equal(this.pivot1, new TrackedValue(new Vec2D(0, 0)), { priority: 100 })
      .equal(this.pivot2, new TrackedValue(new Vec2D(10, 0)), { priority: 100 });

    // All constraints registered
    console.log(`✓ ${this.solver.getConstraints().length} constraints registered`);

    // Animation: Rotate the crank through full rotation
    for (let rotation = 0; rotation < 2; rotation++) {
      // Animate crank angle
      await this.animateProperty(
        'crankAngle',
        Math.PI * 2,
        2, // 2 second duration
        'easeInOut'
      );
    }
  }

  /**
   * Placeholder for property animation
   * In real implementation, this would:
   * 1. Interpolate the property value
   * 2. Call solver.solve() each frame
   * 3. Update all dependent positions
   */
  private async animateProperty(
    propName: keyof this,
    targetValue: number,
    duration: number,
    easing: string
  ) {
    console.log(`📈 Animating ${propName} to ${targetValue} over ${duration}s`);
    await new Promise(resolve => setTimeout(resolve, duration * 1000));
  }

  @Constraint({ name: 'joint_stability', priority: 90 })
  jointStable() {
    // The joint point must maintain its relationship
    return this.solver.validate().violated.length === 0;
  }
}

// ============================================================================
// Example 3: 3D Type Safety
// ============================================================================

/**
 * 3D sphere - tracked at compile-time as 3-dimensional
 */
class Sphere3D extends Mobject3D {
  constructor(radius: number = 1) {
    super();
    this.scale = radius;
  }
}

/**
 * 3D scene with type-safe hierarchy
 * This won't compile: const sphere = new Sphere3D(); scene2D.add(sphere);
 */
@Scene({ fps: 60, resolution: '1080p' })
class ThreeDimensionalScene {
  @Track()
  rotation3D = new TrackedValue(0);

  @EntryPoint()
  async construct() {
    const sphere = new Sphere3D(2);

    // Type system knows this is 3D
    console.log(`✓ Sphere dimensionality: ${sphere.dimensionality}D`);

    // Can only add other 3D mobjects
    // sphere.add(circle2D); // ❌ Compile error!
  }
}

// ============================================================================
// Example 4: Generic Collections
// ============================================================================

/**
 * Collections with generic type safety
 */
@Scene({ fps: 60 })
class GenericCollectionsExample {
  @EntryPoint()
  async construct() {
    // 2D group - only accepts 2D mobjects
    const circles: Circle2D[] = [
      new Circle2D(50),
      new Circle2D(75),
      new Circle2D(100)
    ];

    const group2D = MobjectGroup.create2D(...circles);

    // Type-safe: can only add to 2D groups
    console.log(`✓ Created group with ${group2D.getChildren().length} circles`);

    // This would fail at compile-time:
    // const sphere = new Sphere3D();
    // group2D.add(sphere); // ❌ Type error!
  }
}

// ============================================================================
// Example 5: Decorator Metadata Inspection
// ============================================================================

/**
 * Scene with rich metadata for optimization
 */
@Scene({ fps: 60, resolution: '4K', cacheable: true })
class MetadataDemo {
  @Track({ interpolate: true })
  parameter1 = new TrackedValue(0);

  @Track({ interpolate: true })
  parameter2 = new TrackedValue(1);

  @Constraint({ name: 'relationship', priority: 80 })
  maintainRelationship() {
    // Parameters should stay in sync
    return Math.abs(this.parameter1.get() - this.parameter2.get()) < 0.1;
  }

  @EntryPoint()
  async construct() {
    // Extract metadata for optimization
    const meta = extractDecoratorMetadata(MetadataDemo);

    console.log('📋 Scene Metadata:');
    console.log(`  Config: ${JSON.stringify(meta.scene)}`);
    console.log(`  Track properties: ${meta.trackedProperties.length}`);
    console.log(`  Constraints: ${meta.constraints.length}`);

    // Renderer uses this to:
    // - Pre-allocate GPU buffers for tracked properties
    // - Pre-compile constraint solver
    // - Optimize caching strategy
  }
}

// ============================================================================
// Export Examples for Demo
// ============================================================================

export {
  TypeSafeAnimation,
  FourBarLinkage,
  ThreeDimensionalScene,
  GenericCollectionsExample,
  MetadataDemo
};

// Run demo
if (require.main === module) {
  console.log(`
╔════════════════════════════════════════════╗
║    ts-manim V2 API Examples                ║
│    Type-Safe, Constraint-Based Animation   │
╚════════════════════════════════════════════╝
  `);

  console.log('\n📚 Examples:');
  console.log('  1. TypeSafeAnimation - Basic type safety');
  console.log('  2. FourBarLinkage - Constraints in action');
  console.log('  3. ThreeDimensionalScene - 3D type checking');
  console.log('  4. GenericCollectionsExample - Generic mobjects');
  console.log('  5. MetadataDemo - Decorator metadata inspection');

  console.log('\n🚀 To render:');
  console.log('  mathviz render v2-api-examples.ts');
  console.log('\n📺 To preview:');
  console.log('  mathviz watch v2-api-examples.ts');
}
