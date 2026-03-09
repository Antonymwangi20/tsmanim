/**
 * Enhanced Manim-Style API Examples
 * Showcasing all the new features
 */

import {
  ManimScene,
  SimpleCircle,
  SimpleRect,
  SimpleText,
  VGroup,
  Camera,
  createTriangle,
  createRegularPolygon,
  createStar,
  createLine,
  createPolygon,
  createArc,
  createAnnulus,
  createGrid,
  FadeInAnim,
  FadeOutAnim,
  MoveAnim,
  RotateAnim,
  ScaleAnim,
  GrowFromCenterAnim,
  ShrinkToCenterAnim,
  SpinAnim,
  IndicateAnim,
  PulseAnim,
  WiggleAnim,
  ShakeAnim,
  BounceAnim,
  ColorChangeAnim,
  SimultaneousAnim,
  LaggedStartAnim,
  UP,
  DOWN,
  LEFT,
  RIGHT,
  ORIGIN,
  PI,
  DEG,
  COLORS,
  colorGradient,
  lighten,
  darken
} from '../dist/index.js';

console.log('\n' + '='.repeat(70));
console.log('   ENHANCED MANIM-STYLE API SHOWCASE');
console.log('='.repeat(70) + '\n');

// ============================================
// EXAMPLE 1: Geometry & Shapes
// ============================================
async function exampleShapes() {
  console.log('📐 Example 1: Geometry & Shapes\n');

  const scene = new ManimScene();
  
  // Create various shapes  
  const triangle = createTriangle(
    [[0, 0], [50, 50], [-50, 50]],
    { color: COLORS.LIGHT_BLUE, strokeWidth: 2 }
  );

  const star = createStar(
    [100, 0],
    40,
    20,
    5,
    { color: COLORS.GOLD, fill: true }
  );

  const polygon = createRegularPolygon(
    6,
    [-100, 0],
    40,
    { color: COLORS.LIGHT_PURPLE, strokeWidth: 2 }
  );

  scene.add(triangle, star, polygon);
  console.log('✅ Created triangle, star, and hexagon');

  scene.play(FadeInAnim({ duration: 1 }));
  console.log('✅ Fading in shapes');

  console.log(`⏱️  Total time: ${scene.getCurrentTime()}s\n`);
}

// ============================================
// EXAMPLE 2: VGroup (Object Grouping)
// ============================================
async function exampleGrouping() {
  console.log('👥 Example 2: Object Grouping with VGroup\n');

  const scene = new ManimScene();

  // Create multiple circles
  const circles = [
    SimpleCircle({ center: [-40, 0], radius: 20, color: COLORS.RED }),
    SimpleCircle({ center: [0, 0], radius: 20, color: COLORS.GREEN }),
    SimpleCircle({ center: [40, 0], radius: 20, color: COLORS.BLUE })
  ];

  // Group them
  const group = new VGroup(...circles);
  scene.add(...circles);

  console.log('✅ Created group of 3 circles');

  scene.play(FadeInAnim({ duration: 0.5 }));

  // Arrange the group
  group.arrangeHorizontal(30);
  console.log('✅ Arranged horizontally');

  scene.play(ScaleAnim({ scale: 1.5, duration: 1 }));
  console.log('✅ Scaled group');

  console.log(`⏱️  Total time: ${scene.getCurrentTime()}s\n`);
}

// ============================================
// EXAMPLE 3: Enhanced Animations
// ============================================
async function exampleAnimations() {
  console.log('✨ Example 3: Enhanced Animation Effects\n');

  const scene = new ManimScene();

  // Create a rectangle
  const rect = SimpleRect({
    center: [0, 0],
    width: 80,
    height: 60,
    color: COLORS.CYAN
  });

  scene.add(rect);
  console.log('✅ Added rectangle');

  // Apply various animations
  scene.play(GrowFromCenterAnim({ duration: 1 }));
  console.log('✅ Growing from center');

  scene.play(SpinAnim({ angle: 4 * PI, duration: 2 }));
  console.log('✅ Spinning 2 rotations');

  scene.play(PulseAnim({ duration: 1 }));
  console.log('✅ Pulsing');

  scene.play(ShakeAnim({ duration: 0.5 }));
  console.log('✅ Shaking');

  scene.play(ShrinkToCenterAnim({ duration: 1 }));
  console.log('✅ Shrinking to center');

  console.log(`⏱️  Total time: ${scene.getCurrentTime()}s\n`);
}

// ============================================
// EXAMPLE 4: Color Utilities & Gradients
// ============================================
async function exampleColors() {
  console.log('🎨 Example 4: Color Utilities & Gradients\n');

  const scene = new ManimScene();

  // Create color gradient
  const gradient = colorGradient(COLORS.RED, COLORS.BLUE, 5);
  console.log('✅ Created color gradient:', gradient.slice(0, 3).join(', '), '...');

  // Create circles with gradient colors
  const startX = -80;
  const spacing = 40;
  
  for (let i = 0; i < gradient.length; i++) {
    const circle = SimpleCircle({
      center: [startX + i * spacing, 0],
      radius: 15,
      color: gradient[i]
    });
    scene.add(circle);
  }

  scene.play(FadeInAnim({ duration: 1 }));
  console.log('✅ Fading in gradient circles');

  // Test color manipulation
  const lightRed = lighten(COLORS.RED, 0.3);
  const darkRed = darken(COLORS.RED, 0.3);
  console.log('✅ Lightened and darkened colors');
  console.log(`   Original: ${COLORS.RED}`);
  console.log(`   Lightened: ${lightRed}`);
  console.log(`   Darkened: ${darkRed}`);

  console.log(`⏱️  Total time: ${scene.getCurrentTime()}s\n`);
}

// ============================================
// EXAMPLE 5: Complex Shapes
// ============================================
async function exampleComplexShapes() {
  console.log('🔷 Example 5: Complex Shapes\n');

  const scene = new ManimScene();

  // Create arc
  const arc = createArc(
    [-50, 0],
    40,
    0,
    PI,
    { color: COLORS.LIGHT_GREEN, strokeWidth: 3 }
  );

  // Create annulus (ring)
  const ring = createAnnulus(
    [50, 0],
    20,
    35,
    { color: COLORS.LIGHT_ORANGE }
  );

  // Create polygon
  const poly = createPolygon(
    [[0, -50], [30, -30], [35, 0], [30, 30], [0, 50], [-30, 30], [-35, 0], [-30, -30]],
    { color: COLORS.LIGHT_PINK, strokeWidth: 2 }
  );

  scene.add(arc, ring, poly);
  console.log('✅ Created arc, ring, and polygon');

  scene.play(FadeInAnim({ duration: 0.8 }));
  console.log('✅ Fading in');

  scene.play(RotateAnim({ angle: PI / 2, duration: 1.5 }));
  console.log('✅ Rotating 90 degrees');

  console.log(`⏱️  Total time: ${scene.getCurrentTime()}s\n`);
}

// ============================================
// EXAMPLE 6: Simultaneous & Lagged Animations
// ============================================
async function exampleCompositeAnimations() {
  console.log('🎬 Example 6: Composite Animations\n');

  const scene = new ManimScene();

  // Create three circles
  const circles = [
    SimpleCircle({ center: [-50, 0], radius: 20, color: COLORS.RED }),
    SimpleCircle({ center: [0, 30], radius: 20, color: COLORS.GREEN }),
    SimpleCircle({ center: [50, 0], radius: 20, color: COLORS.BLUE })
  ];

  scene.add(...circles);
  console.log('✅ Added 3 circles');

  scene.play(FadeInAnim({ duration: 0.5 }));

  // Lagged start animation
  const laggedAnims = circles.map((c, i) => 
    RotateAnim({ angle: 2 * PI, duration: 1 })
  );

  scene.play(LaggedStartAnim(laggedAnims, 0.2));
  console.log('✅ Lagged start rotation (0.2s between each)');

  console.log(`⏱️  Total time: ${scene.getCurrentTime()}s\n`);
}

// ============================================
// EXAMPLE 7: Camera Controls
// ============================================
async function exampleCamera() {
  console.log('📹 Example 7: Camera Controls\n');

  const scene = new ManimScene();
  const camera = new Camera();

  // Create some objects
  const circle = SimpleCircle({ center: [0, 0], radius: 30, color: COLORS.CYAN });
  scene.add(circle);
  console.log('✅ Created circle');

  scene.play(FadeInAnim({ duration: 0.5 }));

  // Camera animations
  const panAnim = camera.pan([100, 0], 1);
  console.log('✅ Panning camera animation created');

  const zoomAnim = camera.zoom_in(1.5, 1);
  console.log('✅ Zoom-in animation created');

  const focusAnim = camera.focus([0, 0], 1);
  console.log('✅ Focus animation created');

  console.log(`⏱️  Total time: ${scene.getCurrentTime()}s\n`);
}

// ============================================
// EXAMPLE 8: Coordinate System & Utilities
// ============================================
async function exampleUtilities() {
  console.log('📍 Example 8: Coordinate System & Utilities\n');

  const scene = new ManimScene();

  // Using direction constants
  const centerCircle = SimpleCircle({
    center: ORIGIN,
    radius: 15,
    color: COLORS.WHITE
  });

  // Create circles at cardinal directions
  const upCircle = SimpleCircle({
    center: UP,
    radius: 12,
    color: COLORS.RED
  });

  const rightCircle = SimpleCircle({
    center: RIGHT,
    radius: 12,
    color: COLORS.GREEN
  });

  const downCircle = SimpleCircle({
    center: DOWN,
    radius: 12,
    color: COLORS.BLUE
  });

  const leftCircle = SimpleCircle({
    center: LEFT,
    radius: 12,
    color: COLORS.YELLOW
  });

  scene.add(centerCircle, upCircle, rightCircle, downCircle, leftCircle);
  console.log('✅ Created circles at cardinal directions');

  scene.play(FadeInAnim({ duration: 0.5 }));
  console.log('✅ Using coordinate constants: ORIGIN, UP, DOWN, LEFT, RIGHT');

  // Demonstrate angle constants
  console.log(`✅ PI = ${PI}, DEG = ${DEG.toFixed(4)} radians`);

  console.log(`⏱️  Total time: ${scene.getCurrentTime()}s\n`);
}

// ============================================
// Run all examples
// ============================================
async function runAll() {
  try {
    await exampleShapes();
    await exampleGrouping();
    await exampleAnimations();
    await exampleColors();
    await exampleComplexShapes();
    await exampleCompositeAnimations();
    await exampleCamera();
    await exampleUtilities();

    console.log('='.repeat(70));
    console.log('✨ All enhancement examples completed!');
    console.log('='.repeat(70) + '\n');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAll();
}

export { runAll };
