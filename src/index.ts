/**
 * ts-manim - TypeScript Animation Framework
 * 
 * Export the complete API organized by layer:
 * 1. Core framework (core/)
 * 2. Modern TypeScript API (v2/)
 * 3. Optional plugins (plugins/)  
 * 4. CLI tools (cli/)
 */

// ============================================================================
// Core Framework (Always available)
// ============================================================================

// Core classes
export { Scene, SceneConfig } from './core/Scene.js';
export { Animation, AnimationConfig } from './core/Animation.js';
export { Timeline, TimelineConfig } from './core/Timeline.js';
export { Node, NodeConfig } from './core/Node.js';

// Animations
export { Create } from './core/animations/Create.js';
export { FadeIn } from './core/animations/FadeIn.js';
export { FadeOut } from './core/animations/FadeOut.js';
export { Move, MoveConfig } from './core/animations/Move.js';
export { Transform, TransformConfig } from './core/animations/Transform.js';
export { AdvancedMove } from './core/animations/AdvancedMove.js';
export { Keyframe, KeyframeTrack, cubicBezier, catmullRom, hermite } from './core/animations/Keyframe.js';
export { SpringAnimation, SpringPhysics, SpringPresets, SpringConfig } from './core/animations/physics/Spring.js';

// Shapes
export { Circle, CircleConfig } from './core/shapes/Circle.js';
export { Rect, RectConfig } from './core/shapes/Rect.js';
export { Text, TextConfig } from './core/shapes/Text.js';
export { SVGPath, SVGPathConfig } from './core/shapes/SVGPath.js';

// Renderers
export { SkiaRenderer } from './core/renderer/SkiaRenderer.js';
export { FFmpegRenderer } from './core/renderer/FFmpegRenderer.js';
export { WorkerRenderer } from './core/renderer/WorkerRenderer.js';
export { SmartRenderer } from './core/renderer/SmartRenderer.js';
export { PostProcessStack, BloomConfig, MotionBlurConfig, ColorGradingConfig } from './core/renderer/PostProcess.js';

// Effects
export { ParticleSystem, EmitterConfig, ForceField } from './core/effects/ParticleSystem.js';

// Utilities
export { Vector2 } from './core/utils/Vector2.js';
export { Easing, EasingFunction } from './core/utils/Easing.js';
export { FFmpeg } from './core/utils/FFmpeg.js';

// Export formats
export { WebExporter, webExporter } from './core/export/WebExporter.js';

// Manim-style API (Compatibility layer)
export * from './core/manim-style/index.js';

// ============================================================================
// V2 Modern TypeScript API (Type-safe, optional)
// ============================================================================

export {
  // Types & dimensionality
  Dimension, Point2D, Point3D, Point4D,
  Vec2D, Vec3D, Vec4D,
  MobjectConfig, Mobject, Mobject2D, Mobject3D, Mobject4D,
  MobjectGroup, TrackedValue, ValueChangeListener,
  is2D, is3D, is4D, validateHierarchy,
  
  // Decorators
  Scene as SceneDecorator, SceneConfig as DecoratorSceneConfig,
  Track, TrackConfig, EntryPoint, Cached, CacheConfig,
  Property, PropertyConfig, Constraint as ConstraintDecorator,
  ConstraintConfig, Validator, extractDecoratorMetadata,
  
  // Constraints
  ConstraintInterface, ConstraintValue,
  EqualityConstraint, IncidenceConstraint, TangencyConstraint, DistanceConstraint,
  ConstraintSolver, ConstraintBuilder
} from './v2/index.js';

// ============================================================================
// Plugins (Optional, tree-shakeable)
// ============================================================================

// GPU Plugin
export { 
  SkiaGPUPlugin, GPUCompute, ComputeConfig,
  ShaderBuilder, ShaderPresets 
} from './plugins/gpu/index.js';

// AI Plugin
export { 
  AIPlugin, AnimationAI, MotionPattern, animationAI 
} from './plugins/ai/index.js';

// Cloud Plugin
export {
  CloudPlugin, CloudInfrastructure, createCloudInfrastructure,
  RenderOrchestrator, RenderJob, RenderTask,
  AWSRenderBackend, AWSConfig,
  GCPRenderBackend, GCPConfig,
  CloudJobRequest, CloudJobMetrics,
  CloudProvider, CloudInfrastructureConfig
} from './plugins/cloud/index.js';

// Collaborative Plugin
export {
  CollaborativeServer, setupCollaborativeServer,
  ClientConnection, BroadcastMessage,
  CollaborativeSession, createCollaborativeSession,
  RemoteUser, CollaborationEvent, UndoStackEntry
} from './plugins/collab/index.js';

// UI Plugin (Node Graph)
export {
  NodeGraph, GraphNode, Port, PortType,
  NodeGraphUI
} from './plugins/ui/index.js';

// Plugin Manager
export { PluginManager, Plugin, PluginAPI, pluginManager } from './plugins/PluginManager.js';

// ============================================================================
// Version Info
// ============================================================================

export const VERSION = '2.0.0';
export const FRAMEWORK_NAME = 'ts-manim';

/**
 * API Layers:
 * 
 * 1. CORE (./core/)
 *    - Scene, Animation, Timeline, Node
 *    - Shapes: Circle, Rect, Text, SVGPath
 *    - Animations: Move, Fade, Transform, etc.
 *    - Renderers: Skia, FFmpeg, Worker
 *    - Manim-compatible API
 * 
 * 2. V2 (./v2/)
 *    - Generic Mobject<T> with dimensional types
 *    - Decorator-based configuration
 *    - Constraint solver for mechanical animation
 *    - Best for: Type-safe, compile-time validation
 * 
 * 3. PLUGINS (./plugins/)
 *    - GPU acceleration (WebGPU compute shaders)
 *    - AI-powered generation
 *    - Cloud rendering infrastructure
 *    - Collaborative editing
 *    - Node-based UI editor
 * 
 * 4. CLI (./cli/)
 *    - tsm: Professional video generation
 *    - mathviz: Scientific visualization
 *    - render: Video encoding
 * 
 * Import only what you need - everything is tree-shakeable!
 */
