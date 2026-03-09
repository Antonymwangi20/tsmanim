// examples/manim-quick-start.ts
/**
 * Quick start examples - ts-manim manim-style API
 * 
 * These examples show how to create animations easily,
 * without needing to understand the complex enterprise features.
 */

import {
  ManimScene,
  SimpleCircle,
  SimpleRect,
  SimpleText,
  MoveAnim,
  FadeInAnim,
  FadeOutAnim,
  RotateAnim,
  ScaleAnim
} from '../dist/index.js';

// ============================================
// Example 1: Simple Circle Animation
// ============================================
export async function example1_simpleCircle() {
  console.log('📘 Example 1: Simple Circle Animation\n');

  const scene = new ManimScene({ duration: 5 });

  // Create and add a blue circle
  const circle = SimpleCircle({
    center: [0, 0],
    radius: 1,
    color: 'blue'
  });

  scene.add(circle);
  console.log('✅ Added blue circle to scene');

  // Fade in the circle
  scene.play(FadeInAnim({ duration: 1 }));
  console.log('✅ Fading in circle (1 second)');

  // Move the circle to the right
  scene.play(MoveAnim({ to: [2, 0], duration: 1.5 }));
  console.log('✅ Moving circle to the right (1.5 seconds)');

  // Wait a bit
  scene.wait(0.5);
  console.log('✅ Waiting (0.5 seconds)');

  // Fade out
  scene.play(FadeOutAnim({ duration: 1 }));
  console.log('✅ Fading out circle (1 second)');

  // Total time: 1 + 1.5 + 0.5 + 1 = 4 seconds
  console.log(`\n✨ Animation complete! Duration: ${scene.getCurrentTime()}s\n`);
}

// ============================================
// Example 2: Multiple Shapes
// ============================================
export async function example2_multipleShapes() {
  console.log('📗 Example 2: Multiple Shapes\n');

  const scene = new ManimScene({ duration: 10 });

  // Create shapes
  const circle = SimpleCircle({
    center: [-2, 0],
    radius: 0.8,
    color: 'red'
  });

  const rect = SimpleRect({
    center: [0, 0],
    width: 1.5,
    height: 1,
    color: 'green'
  });

  const text = SimpleText('Hello!', {
    center: [2, 0],
    fontSize: 40,
    color: 'yellow'
  });

  // Add all at once
  scene.add(circle, rect, text);
  console.log('✅ Added 3 shapes: circle, rectangle, text');

  // Fade in all
  scene.play(FadeInAnim({ duration: 1 }));
  console.log('✅ Fading in all shapes');

  // Move them around
  scene.play(MoveAnim({ from: [-2, 0], to: [-2, 2], duration: 1.5 }));
  console.log('✅ Moving circle up');

  scene.play(MoveAnim({ from: [0, 0], to: [0, -2], duration: 1.5 }));
  console.log('✅ Moving rectangle down');

  scene.play(MoveAnim({ from: [2, 0], to: [2, 1], duration: 1.5 }));
  console.log('✅ Moving text up');

  scene.wait(0.5);

  // Fade out
  scene.play(FadeOutAnim({ duration: 1 }));
  console.log('✅ Fading out all shapes');

  console.log(`\n✨ Animation complete! Duration: ${scene.getCurrentTime()}s\n`);
}

// ============================================
// Example 3: Transformations
// ============================================
export async function example3_transformations() {
  console.log('📙 Example 3: Transformations (Rotate & Scale)\n');

  const scene = new ManimScene({ duration: 8 });

  // Create a rectangle
  const rect = SimpleRect({
    center: [0, 0],
    width: 2,
    height: 1,
    color: 'cyan'
  });

  scene.add(rect);
  console.log('✅ Added rectangle');

  // Fade in
  scene.play(FadeInAnim());
  console.log('✅ Fading in');

  // Rotate 90 degrees
  scene.play(RotateAnim({ angle: Math.PI / 2, duration: 1.5 }));
  console.log('✅ Rotating 90 degrees');

  // Scale up 2x
  scene.play(ScaleAnim({ scale: 2, duration: 1 }));
  console.log('✅ Scaling up 2x');

  // Move while scaled
  scene.play(MoveAnim({ to: [2, 0], duration: 1 }));
  console.log('✅ Moving while scaled');

  scene.wait(0.5);

  // Fade out
  scene.play(FadeOutAnim());
  console.log('✅ Fading out');

  console.log(`\n✨ Animation complete! Duration: ${scene.getCurrentTime()}s\n`);
}

// ============================================
// Example 4: Method Chaining (Fluent API)
// ============================================
export async function example4_methodChaining() {
  console.log('📕 Example 4: Method Chaining\n');

  const scene = new ManimScene();

  // Create and animate using method chaining
  const circle = SimpleCircle({ center: [-1, 0], radius: 0.5, color: 'magenta' });
  const rect = SimpleRect({ center: [1, 0], width: 1, height: 1, color: 'cyan' });

  scene
    .add(circle, rect)
    .play(FadeInAnim())
    .wait(0.5)
    .play(MoveAnim({ to: [0, 1], duration: 1 }))
    .play(RotateAnim({ angle: Math.PI, duration: 1 }))
    .wait(0.5)
    .play(FadeOutAnim());

  console.log(`✅ Animation created with method chaining!`);
  console.log(`\n✨ Total duration: ${scene.getCurrentTime()}s\n`);
}

// ============================================
// Example 5: Simple Drawing
// ============================================
export async function example5_simpleDrawing() {
  console.log('📓 Example 5: Draw a Simple Face\n');

  const scene = new ManimScene();

  // Create face
  const head = SimpleCircle({ center: [0, 0], radius: 1, color: 'white', fill: true });

  // Eyes
  const leftEye = SimpleCircle({ center: [-0.3, 0.3], radius: 0.15, color: 'black' });
  const rightEye = SimpleCircle({ center: [0.3, 0.3], radius: 0.15, color: 'black' });

  // Smile (text)
  const smile = SimpleText('︵', { center: [0, -0.2], fontSize: 50, color: 'black' });

  scene
    .add(head, leftEye, rightEye, smile)
    .play(FadeInAnim({ duration: 0.5 }))
    .wait(2)
    .play(FadeOutAnim({ duration: 0.5 }));

  console.log(`✅ Drawn a simple happy face!`);
  console.log(`\n✨ Duration: ${scene.getCurrentTime()}s\n`);
}

// ============================================
// Run all examples
// ============================================
async function runAll() {
  console.log('\n' + '='.repeat(60));
  console.log('   TS-MANIM QUICK START EXAMPLES');
  console.log('='.repeat(60) + '\n');

  await example1_simpleCircle();
  await example2_multipleShapes();
  await example3_transformations();
  await example4_methodChaining();
  await example5_simpleDrawing();

  console.log('='.repeat(60));
  console.log('✨ All examples completed!');
  console.log('='.repeat(60) + '\n');
}

// Export for testing
export { runAll };

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAll();
}
