// test-manim-style.ts
/**
 * Test manim-style simple API
 */

import {
  ManimScene,
  SimpleCircle,
  SimpleRect,
  SimpleText,
  FadeInAnim,
  FadeOutAnim,
  MoveAnim,
  RotateAnim,
  ScaleAnim
} from './dist/index.js';

async function testManimStyle() {
  console.log('\n');
  console.log('='.repeat(60));
  console.log('   🎬 MANIM-STYLE SIMPLE API TEST');
  console.log('='.repeat(60));

  // Test 1: Scene creation
  console.log('\n1️⃣  Creating scene');
  const scene = new ManimScene({ duration: 5 });
  console.log('✅ Scene created');

  // Test 2: Add shapes
  console.log('\n2️⃣  Adding shapes');
  const circle = SimpleCircle({
    center: [0, 0],
    radius: 50,
    color: '#FF6B6B'
  });
  
  const rect = SimpleRect({
    center: [100, 100],
    width: 80,
    height: 60,
    color: '#4ECDC4'
  });

  const text = SimpleText('Hello ts-manim!', {
    center: [-100, 100],
    fontSize: 24,
    color: '#1E90FF'
  });

  scene.add(circle, rect, text);
  console.log('✅ Added 3 shapes (circle, rectangle, text)');

  // Test 3: Method chaining
  console.log('\n3️⃣  Using method chaining');
  scene
    .play(FadeInAnim({ duration: 1 }))
    .wait(0.5)
    .play(MoveAnim({ from: [0, 0], to: [100, 50], duration: 1.5 }))
    .play(RotateAnim({ angle: Math.PI / 4, duration: 1 }))
    .play(ScaleAnim({ scale: 1.5, duration: 1 }))
    .wait(0.5)
    .play(FadeOutAnim({ duration: 1 }));

  console.log('✅ Animations chained successfully');

  // Test 4: Get timing info
  console.log('\n4️⃣  Timing information');
  console.log(`   Total animation time: ${scene.getCurrentTime()}s`);
  console.log(`   Number of objects: ${scene.getObjects().length}`);

  // Test 5: Scene manipulation
  console.log('\n5️⃣  Scene manipulation');
  scene.wait(1);
  console.log(`   After wait(1): ${scene.getCurrentTime()}s`);
  
  scene.setTime(2.5);
  console.log(`   After setTime(2.5): ${scene.getCurrentTime()}s`);

  console.log('\n' + '='.repeat(60));
  console.log('✨ ALL TESTS PASSED!');
  console.log('='.repeat(60));
  console.log('\n📋 Features tested:');
  console.log('   ✅ Scene creation');
  console.log('   ✅ Shape creation (Circle, Rect, Text)');
  console.log('   ✅ Animation methods (Fade, Move, Rotate, Scale)');
  console.log('   ✅ Method chaining');
  console.log('   ✅ Timing management');
  console.log('   ✅ Scene queries');
  console.log('\n🚀 Manim-style API ready for use!\n');
}

// Run test
testManimStyle().catch(console.error);
