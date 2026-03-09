/**
 * Manim-style simple API - complete export
 */
export { ManimScene } from './Scene.js';
export { VGroup, createGroup } from './VGroup.js';
export { Camera } from './Camera.js';
export { MovingCameraScene, ThreeDScene, ZoomedScene, LinearTransformationScene, VectorScene } from './SceneTypes.js';
export { Circle as SimpleCircle, Rect as SimpleRect, SimpleText } from './Scene.js';
export { createLine, createPolygon, createTriangle, createRegularPolygon, createStar, createArc, createCircleArc, createAnnulus, createGrid, createBezierCurve, createWave } from './Shapes.js';
export { createEllipse, createSector, createDashedLine, createArrow, createDoubleArrow, createDot, createCross, createRoundedRectangle, createAngle, createRightAngle, createAxes, createNumberLine } from './AdvancedShapes.js';
export { FadeInAnim, FadeOutAnim, MoveAnim, RotateAnim, ScaleAnim, GrowFromCenterAnim, ShrinkToCenterAnim, SpinAnim, FlipAnim, ShineAnim, ColorChangeAnim, IndicateAnim, FlashAnim, PulseAnim, WiggleAnim, ShakeAnim, SwingAnim, BounceAnim, WaveAnim, FollowPathAnim, Rotate3DAnim, SequenceAnim, LaggedStartAnim, SimultaneousAnim, CustomAnim, withDelay, reverseAnim, repeatAnim } from './Animations.js';
export { WriteAnim, UnwriteAnim, DrawBorderThenFillAnim, CreateAnim, SpinInFromNothingAnim, CreateThenFadeOutAnim, TransformAnim, ReplacementTransformAnim, TransformMatchingShapesAnim, ClockwiseTransformAnim, CounterClockwiseTransformAnim, CircumscribeAnim, UnderlineAnim, OverlineAnim, CrossOutAnim, ShowPassingFlashAnim, ShowCreationThenDestructionAnim, BroadcastAnim, CycleReplaceAnim, ApplyToEachAnim, ApplyMethodAnim, ApplyFunctionAnim, ApplyMatrixAnim, ComplexMapAnim, MoveToTargetAnim, ShiftAnim, StretchAnim, ApplyPointwiseFunctionAnim, ApplyComplexFunctionAnim } from './AdvancedAnimations.js';
export { ValueTracker, ComplexValueTracker, UpdaterManager, Succession, Simultaneous, AnimationGroup, LaggedStart, LaggedEnd, createAnimationComposition, chainAnimations, parallelAnimations } from './Updaters.js';
export type { UpdateFunction } from './Updaters.js';
export type { AnimationConfig } from './Animations.js';
export { ORIGIN, UP, DOWN, LEFT, RIGHT, UL, UR, DL, DR, DEFAULT_STROKE_WIDTH, DEFAULT_FONT_SIZE, DEFAULT_ANIMATION_DURATION, EasingType, smooth, linear, ease_in_sine, ease_out_sine, ease_in_out_sine, ease_in_cubic, ease_out_cubic, ease_in_out_cubic, DEG, PI, TAU, interpolate, lerp, alignPoint, findCenter, vectorAdd, vectorSub, vectorMult, vectorDist, vectorNorm, vectorNormalize, vectorAngle } from './Utilities.js';
export type { Vector2 } from './Utilities.js';
export { COLORS, interpolateColor, hexToRgb, rgbToHex, getColor, colorGradient, lighten, darken, invert } from './Colors.js';
export type { SimpleAnimationOptions } from './Scene.js';
export type { CameraConfig } from './Camera.js';
//# sourceMappingURL=index.d.ts.map