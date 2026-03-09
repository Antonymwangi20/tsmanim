# Manim-Style Simple API Guide

**ts-manim** now includes a **simple, intuitive API** inspired by Manim (Python animation library) that hides enterprise complexity while keeping power under the hood.

## Quick Start

### 1. Create a Scene

```typescript
import { ManimScene, Circle, Move, FadeInAnim } from 'ts-manim';

const scene = new ManimScene({ duration: 5 });
```

### 2. Add Objects

```typescript
// Create shapes easily
const circle = Circle({
  center: [0, 0],
  radius: 1,
  color: 'blue'
});

scene.add(circle);
```

### 3. Animate

```typescript
// Fade in
scene.play(FadeInAnim({ duration: 1 }));

// Move
scene.play(Move({ to: [2, 0], duration: 1.5 }));

// Wait
scene.wait(0.5);

// Fade out
scene.play(FadeOutAnim({ duration: 1 }));
```

## Available Functions

### Shapes

- `Circle(config)` - Create a circle
- `Rect(config)` - Create a rectangle  
- `Text(content, config)` - Create text

### Animations

- `Move(config)` - Move to position
- `FadeInAnim(config)` - Fade in
- `FadeOutAnim(config)` - Fade out
- `Rotate(config)` - Rotate by angle
- `Scale(config)` - Scale up/down

### Scene Methods

- `add(...objects)` - Add objects to scene
- `play(animation)` - Play animation
- `wait(duration)` - Wait for duration
- `remove(...objects)` - Remove objects
- `clear()` - Clear all objects

## Shape Configuration

```typescript
Circle({
  center: [x, y],           // Position
  radius: 1,                // Size
  color: 'blue',            // Color
  opacity: 0.8,             // 0-1
  strokeWidth: 2,           // Outline width
  fill: true                // Filled or outline
})
```

## Animation Configuration

```typescript
Move({
  from: [0, 0],             // Starting position (optional)
  to: [2, 0],               // Ending position
  duration: 1.5             // Animation duration
})
```

## Method Chaining

```typescript
scene
  .add(circle, rect)
  .play(FadeInAnim())
  .wait(0.5)
  .play(Move({ to: [1, 1], duration: 1 }))
  .play(FadeOutAnim());

console.log(`Total time: ${scene.getCurrentTime()}s`);
```

## Examples

See `examples/manim-quick-start.ts` for complete examples:

1. **Simple Circle** - Basic animation
2. **Multiple Shapes** - Working with multiple objects
3. **Transformations** - Rotate and scale
4. **Method Chaining** - Fluent API
5. **Simple Drawing** - Create a smiley face

## Running Examples

```bash
# Run quick start examples
npm run build
npx ts-node examples/manim-quick-start.ts
```

## What's Hidden

The simple API hides advanced features that are still available:

- ✨ AI animation suggestions (AnimationAI)
- 🎨 Advanced post-processing (Bloom, motion blur)
- 📊 Node-based visual scripting (NodeGraph)
- 🌐 Real-time collaboration (CollaborativeSession)
- ☁️ Cloud rendering (CloudInfrastructure)
- 🎬 Web exports (React, Vue, Three.js)
- 📐 GPU acceleration (GPUCompute)

When you need advanced features, you can access the underlying framework:

```typescript
const scene = new ManimScene();
const core = scene.getScene();       // Access core Scene
const timeline = scene.getTimeline(); // Access Timeline
```

## Design Philosophy

**"Simple things should be simple, complex things should be possible."**

The manim-style API provides:
- ✅ Easy to learn for beginners
- ✅ Quick to write animations
- ✅ Clear, readable code
- ✅ Access to advanced features when needed
- ✅ Full type safety (TypeScript)

## Next Steps

- Create your first animation
- Explore the quick start examples
- Check out advanced features when ready
- Use method chaining for clean code

Happy animating! 🎬✨
