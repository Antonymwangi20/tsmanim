/**
 * ts-manim - TypeScript Animation Framework
 *
 * Export the complete API organized by layer:
 * 1. Core framework (core/)
 * 2. Modern TypeScript API (v2/)
 * 3. Optional plugins (plugins/)
 * 4. CLI tools (cli/)
 */
export { Scene, SceneConfig } from './core/Scene.js';
export { Animation, AnimationConfig } from './core/Animation.js';
export { Timeline, TimelineConfig } from './core/Timeline.js';
export { Node, NodeConfig } from './core/Node.js';
export { Create } from './core/animations/Create.js';
export { FadeIn } from './core/animations/FadeIn.js';
export { FadeOut } from './core/animations/FadeOut.js';
export { Move, MoveConfig } from './core/animations/Move.js';
export { Transform, TransformConfig } from './core/animations/Transform.js';
export { AdvancedMove } from './core/animations/AdvancedMove.js';
export { Keyframe, KeyframeTrack, cubicBezier, catmullRom, hermite } from './core/animations/Keyframe.js';
export { SpringAnimation, SpringPhysics, SpringPresets, SpringConfig } from './core/animations/physics/Spring.js';
export { Circle, CircleConfig } from './core/shapes/Circle.js';
export { Rect, RectConfig } from './core/shapes/Rect.js';
export { Text, TextConfig } from './core/shapes/Text.js';
export { SVGPath, SVGPathConfig } from './core/shapes/SVGPath.js';
export { SkiaRenderer } from './core/renderer/SkiaRenderer.js';
export { FFmpegRenderer } from './core/renderer/FFmpegRenderer.js';
export { WorkerRenderer } from './core/renderer/WorkerRenderer.js';
export { SmartRenderer } from './core/renderer/SmartRenderer.js';
export { PostProcessStack, BloomConfig, MotionBlurConfig, ColorGradingConfig } from './core/renderer/PostProcess.js';
export { ParticleSystem, EmitterConfig, ForceField } from './core/effects/ParticleSystem.js';
export { Vector2 } from './core/utils/Vector2.js';
export { Easing, EasingFunction } from './core/utils/Easing.js';
export { FFmpeg } from './core/utils/FFmpeg.js';
export { WebExporter, webExporter } from './core/export/WebExporter.js';
export * from './core/manim-style/index.js';
export { Dimension, Point2D, Point3D, Point4D, Vec2D, Vec3D, Vec4D, MobjectConfig, Mobject, Mobject2D, Mobject3D, Mobject4D, MobjectGroup, TrackedValue, ValueChangeListener, is2D, is3D, is4D, validateHierarchy, Scene as SceneDecorator, SceneConfig as DecoratorSceneConfig, Track, TrackConfig, EntryPoint, Cached, CacheConfig, Property, PropertyConfig, Constraint as ConstraintDecorator, ConstraintConfig, Validator, extractDecoratorMetadata, ConstraintInterface, ConstraintValue, EqualityConstraint, IncidenceConstraint, TangencyConstraint, DistanceConstraint, ConstraintSolver, ConstraintBuilder } from './v2/index.js';
export { SkiaGPUPlugin, GPUCompute, ComputeConfig, ShaderBuilder, ShaderPresets } from './plugins/gpu/index.js';
export { AIPlugin, AnimationAI, MotionPattern, animationAI } from './plugins/ai/index.js';
export { CloudPlugin, CloudInfrastructure, createCloudInfrastructure, RenderOrchestrator, RenderJob, RenderTask, AWSRenderBackend, AWSConfig, GCPRenderBackend, GCPConfig, CloudJobRequest, CloudJobMetrics, CloudProvider, CloudInfrastructureConfig } from './plugins/cloud/index.js';
export { CollaborativeServer, setupCollaborativeServer, ClientConnection, BroadcastMessage, CollaborativeSession, createCollaborativeSession, RemoteUser, CollaborationEvent, UndoStackEntry } from './plugins/collab/index.js';
export { NodeGraph, GraphNode, Port, PortType, NodeGraphUI } from './plugins/ui/index.js';
export { PluginManager, Plugin, PluginAPI, pluginManager } from './plugins/PluginManager.js';
export declare const VERSION = "2.0.0";
export declare const FRAMEWORK_NAME = "ts-manim";
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
//# sourceMappingURL=index.d.ts.map