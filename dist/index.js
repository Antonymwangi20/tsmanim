// src/index.ts
// Core
export { Scene } from './core/Scene.js';
export { Node } from './core/Node.js';
export { Timeline } from './core/Timeline.js';
export { Animation } from './core/Animation.js';
// Shapes
export { Circle } from './shapes/Circle.js';
export { Rect } from './shapes/Rect.js';
export { Text } from './shapes/Text.js';
export { SVGPath } from './shapes/SVGPath.js';
// Animations
export { Create } from './animations/Create.js';
export { Move } from './animations/Move.js';
export { FadeIn } from './animations/FadeIn.js';
export { FadeOut } from './animations/FadeOut.js';
export { Transform } from './animations/Transform.js';
// Advanced Animations
export { AdvancedMove } from './animations/AdvancedMove.js';
export { KeyframeTrack, cubicBezier, catmullRom, hermite } from './animations/Keyframe.js';
export { SpringAnimation, SpringPhysics, SpringPresets } from './animations/physics/Spring.js';
// Utils
export { Vector2 } from './utils/Vector2.js';
export { Easing } from './utils/Easing.js';
// Renderer
export { SkiaRenderer } from './renderer/SkiaRenderer.js';
export { WorkerRenderer } from './renderer/WorkerRenderer.js';
export { SmartRenderer } from './renderer/SmartRenderer.js';
export { PostProcessStack } from './renderer/PostProcess.js';
// Plugins
export { PluginManager, pluginManager } from './plugin/PluginManager.js';
// AI & Automation
export { AnimationAI, animationAI } from './ai/AnimationAI.js';
// Graph Editor (Visual Scripting)
export { NodeGraph } from './graph/NodeGraph.js';
// Effects
export { ParticleSystem } from './effects/ParticleSystem.js';
// Export
export { WebExporter, webExporter } from './export/WebExporter.js';
// Shaders
export { ShaderBuilder, ShaderPresets } from './shaders/ShaderBuilder.js';
// Collaboration
export { CollaborativeSession, createCollaborativeSession } from './collab/CollaborativeSession.js';
export { CollaborativeServer, setupCollaborativeServer } from './collab/CollaborativeServer.js';
// GPU Computing
export { GPUCompute } from './gpu/GPUCompute.js';
// Node Graph UI
export { NodeGraphUI } from './graph/NodeGraphUI.js';
// Cloud Infrastructure
export { CloudInfrastructure, createCloudInfrastructure, RenderOrchestrator, AWSRenderBackend, GCPRenderBackend } from './cloud/index.js';
// ============================================
// MANIM-STYLE SIMPLE API (Complete)
// ============================================
// Core Scenes
export { ManimScene, Circle as SimpleCircle, Rect as SimpleRect, SimpleText } from './manim-style/Scene.js';
export { MovingCameraScene, ThreeDScene, ZoomedScene, LinearTransformationScene, VectorScene } from './manim-style/SceneTypes.js';
export { VGroup, createGroup } from './manim-style/VGroup.js';
export { Camera } from './manim-style/Camera.js';
// Basic Shapes
export { createLine, createPolygon, createTriangle, createRegularPolygon, createStar, createArc, createCircleArc, createAnnulus, createGrid, createBezierCurve, createWave } from './manim-style/Shapes.js';
// Advanced Shapes
export { createEllipse, createSector, createDashedLine, createArrow, createDoubleArrow, createDot, createCross, createRoundedRectangle, createAngle, createRightAngle, createAxes, createNumberLine } from './manim-style/AdvancedShapes.js';
// Basic Animations
export { FadeInAnim, FadeOutAnim, MoveAnim, RotateAnim, ScaleAnim, GrowFromCenterAnim, ShrinkToCenterAnim, SpinAnim, FlipAnim, ShineAnim, ColorChangeAnim, IndicateAnim, FlashAnim, PulseAnim, WiggleAnim, ShakeAnim, SwingAnim, BounceAnim, WaveAnim, FollowPathAnim, Rotate3DAnim, SequenceAnim, LaggedStartAnim, SimultaneousAnim, CustomAnim, withDelay, reverseAnim, repeatAnim } from './manim-style/Animations.js';
// Advanced Animations
export { WriteAnim, UnwriteAnim, DrawBorderThenFillAnim, CreateAnim, SpinInFromNothingAnim, CreateThenFadeOutAnim, TransformAnim, ReplacementTransformAnim, TransformMatchingShapesAnim, ClockwiseTransformAnim, CounterClockwiseTransformAnim, CircumscribeAnim, UnderlineAnim, OverlineAnim, CrossOutAnim, ShowPassingFlashAnim, ShowCreationThenDestructionAnim, BroadcastAnim, CycleReplaceAnim, ApplyToEachAnim, ApplyMethodAnim, ApplyFunctionAnim, ApplyMatrixAnim, ComplexMapAnim, MoveToTargetAnim, ShiftAnim, StretchAnim, ApplyPointwiseFunctionAnim, ApplyComplexFunctionAnim } from './manim-style/AdvancedAnimations.js';
// Updaters & Animation Groups
export { ValueTracker, ComplexValueTracker, UpdaterManager, Succession, Simultaneous, AnimationGroup, LaggedStart, LaggedEnd, createAnimationComposition, chainAnimations, parallelAnimations } from './manim-style/Updaters.js';
// Utilities & Constants
export { ORIGIN, UP, DOWN, LEFT, RIGHT, UL, UR, DL, DR, DEFAULT_STROKE_WIDTH, DEFAULT_FONT_SIZE, DEFAULT_ANIMATION_DURATION, EasingType, smooth, linear, ease_in_sine, ease_out_sine, ease_in_out_sine, ease_in_cubic, ease_out_cubic, ease_in_out_cubic, DEG, PI, TAU, interpolate, lerp, alignPoint, findCenter, vectorAdd, vectorSub, vectorMult, vectorDist, vectorNorm, vectorNormalize, vectorAngle } from './manim-style/Utilities.js';
// Colors
export { COLORS, interpolateColor, hexToRgb, rgbToHex, getColor, colorGradient, lighten, darken, invert } from './manim-style/Colors.js';
//# sourceMappingURL=index.js.map