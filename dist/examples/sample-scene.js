// examples/sample-scene.ts
import { Scene, Circle, Rect, Text, Create, Move, FadeOut, Transform, Easing } from '../index.js';
// Create a 1920x1080 scene at 60fps
const scene = new Scene({
    width: 1920,
    height: 1080,
    fps: 60,
    backgroundColor: '#1a1a2e'
});
// Create shapes
const circle = new Circle({
    radius: 80,
    fill: '#e94560',
    stroke: '#fff',
    strokeWidth: 4,
    x: 200,
    y: 540
});
const rect = new Rect({
    width: 150,
    height: 150,
    fill: '#0f3460',
    stroke: '#e94560',
    strokeWidth: 3,
    x: 1720,
    y: 540,
    cornerRadius: 10
});
const title = new Text({
    text: 'TypeScript Animation Framework',
    fontSize: 48,
    fill: '#fff',
    x: 960,
    y: 150,
    fontFamily: 'Arial'
});
const subtitle = new Text({
    text: 'Powered by Skia + FFmpeg',
    fontSize: 24,
    fill: '#aaa',
    x: 960,
    y: 200
});
// Add to scene
scene.add(circle);
scene.add(rect);
scene.add(title);
scene.add(subtitle);
// Animate
// 1. Create animations (scale up from 0)
scene.play(new Create(circle), { duration: 0.8, easing: Easing.easeOutBounce });
scene.play(new Create(rect), { duration: 0.8, easing: Easing.easeOutBounce });
scene.wait(0.5);
// 2. Move shapes to center
scene.play(new Move(circle, { x: 700, y: 540 }), { duration: 1.5 });
scene.play(new Move(rect, { x: 1220, y: 540 }), { duration: 1.5 });
scene.wait(0.5);
// 3. Transform (rotate and scale)
scene.play(new Transform(circle, {
    rotation: Math.PI * 2,
    scale: 1.2
}), { duration: 2 });
scene.play(new Transform(rect, {
    rotation: -Math.PI * 2,
    scale: 0.8
}), { duration: 2 });
scene.wait(0.5);
// 4. Fade out
scene.play(new FadeOut(circle), { duration: 0.5 });
scene.play(new FadeOut(rect), { duration: 0.5 });
scene.play(new FadeOut(title), { duration: 0.5 });
scene.play(new FadeOut(subtitle), { duration: 0.5 });
// Export for CLI
export default scene;
// Or: export { scene };
