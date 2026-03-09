/**
 * ts-manim Core Framework
 * 
 * Standard Manim-inspired animation framework with:
 * - Scene management & animation composition
 * - Core shapes (Circle, Rect, Text, etc.)
 * - Animations (FadeIn, FadeOut, Move, Transform, etc.)
 * - Renderers (Skia, FFmpeg, Worker-based)
 * - Manim-style API for compatibility
 */

// Core classes
export { Scene, SceneConfig } from './Scene.js';
export { Animation, AnimationConfig } from './Animation.js';
export { Timeline, TimelineConfig } from './Timeline.js';
export { Node, NodeConfig } from './Node.js';

// Animations
export { Create } from './animations/Create.js';
export { FadeIn } from './animations/FadeIn.js';
export { FadeOut } from './animations/FadeOut.js';
export { Move } from './animations/Move.js';
export { Transform } from './animations/Transform.js';
export { AdvancedMove } from './animations/AdvancedMove.js';
export { Keyframe } from './animations/Keyframe.js';
export { Spring } from './animations/physics/Spring.js';

// Shapes
export { Circle } from './shapes/Circle.js';
export { Rect } from './shapes/Rect.js';
export { SVGPath } from './shapes/SVGPath.js';
export { Text } from './shapes/Text.js';

// Renderers
export { SkiaRenderer } from './renderer/SkiaRenderer.js';
export { FFmpegRenderer } from './renderer/FFmpegRenderer.js';
export { WorkerRenderer } from './renderer/WorkerRenderer.js';
export { SmartRenderer } from './renderer/SmartRenderer.js';
export { PostProcess } from './renderer/PostProcess.js';

// Manim-style API
export * from './manim-style/index.js';

// Effects
export { ParticleSystem } from './effects/ParticleSystem.js';

// Utilities
export { Easing, EasingFunction } from './utils/Easing.js';
export { Vector2 } from './utils/Vector2.js';
export { FFmpeg } from './utils/FFmpeg.js';

// Export compat
export { WebExporter } from './export/WebExporter.js';
