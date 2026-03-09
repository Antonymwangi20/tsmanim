// src/ai/AnimationAI.ts
import { Node } from '../../core/Node.js';
import { Animation } from '../../core/Animation.js';
import { Vector2 } from '../../core/utils/Vector2.js';
import { AdvancedMove } from '../../core/animations/AdvancedMove.js';

export interface MotionPattern {
  name: string;
  velocityProfile: number[];
  anticipation: number;
  overshoot: number;
}

/**
 * AI-powered animation assistant for motion prediction,
 * intelligent keyframe optimization, and animation suggestions
 */
export class AnimationAI {
  private patternLibrary: Map<string, MotionPattern> = new Map();

  constructor() {
    this.loadDefaultPatterns();
  }

  private loadDefaultPatterns(): void {
    this.patternLibrary.set('bounce', {
      name: 'bounce',
      velocityProfile: [0, 0.5, 1, 0.8, 0.9, 1],
      anticipation: 0.1,
      overshoot: 0.15
    });
    this.patternLibrary.set('mechanical', {
      name: 'mechanical',
      velocityProfile: [0, 0.2, 0.4, 0.6, 0.8, 1],
      anticipation: 0,
      overshoot: 0
    });
    this.patternLibrary.set('organic', {
      name: 'organic',
      velocityProfile: [0, 0.1, 0.3, 0.6, 0.85, 1],
      anticipation: 0.05,
      overshoot: 0.05
    });
    this.patternLibrary.set('ease-in-out', {
      name: 'ease-in-out',
      velocityProfile: [0, 0.1, 0.5, 0.9, 1],
      anticipation: 0,
      overshoot: 0
    });
  }

  /**
   * Auto-complete animation based on start/end states with motion prediction
   */
  suggestAnimation(
    node: Node,
    targetState: { position?: Vector2; rotation?: number; scale?: number },
    style: 'bounce' | 'mechanical' | 'organic' | 'ease-in-out' = 'organic'
  ): Animation[] {
    const pattern = this.patternLibrary.get(style)!;
    const animations: Animation[] = [];

    // Position animation with Catmull-Rom path
    if (targetState.position) {
      const pathAnim = new AdvancedMove(node, { duration: 1 });
      
      // Calculate intermediate waypoints using Catmull-Rom
      const waypoints = this.calculateSmoothedPath(node.position, targetState.position, 5);
      
      for (let i = 0; i < waypoints.length; i++) {
        const t = i / (waypoints.length - 1);
        pathAnim.keyframe(t, waypoints[i]);
      }
      
      animations.push(pathAnim);
    }

    // Anticipation animation (wind-up before main movement)
    if (pattern.anticipation > 0 && targetState.position) {
      const anticipationAnim = new AdvancedMove(node, { duration: 0.15 });
      const anticipationDir = targetState.position.sub(node.position).mul(-pattern.anticipation);
      anticipationAnim.keyframe(0, node.position);
      anticipationAnim.keyframe(1, node.position.add(anticipationDir));
      animations.unshift(anticipationAnim);
    }

    // Overshoot animation (bounce/settle after main movement)
    if (pattern.overshoot > 0 && targetState.position) {
      const overshootAnim = new AdvancedMove(node, { duration: 0.2 });
      const overshootPos = targetState.position.add(
        targetState.position.sub(node.position).mul(pattern.overshoot)
      );
      overshootAnim.keyframe(0, targetState.position);
      overshootAnim.keyframe(0.5, overshootPos);
      overshootAnim.keyframe(1, targetState.position);
      animations.push(overshootAnim);
    }

    return animations;
  }

  /**
   * Smart keyframe reduction using Ramer-Douglas-Peucker algorithm
   * Simplifies animation curves while preserving visual quality
   */
  optimizeKeyframes(
    keyframes: Array<{ time: number; value: number }>,
    tolerance: number = 0.01
  ): Array<{ time: number; value: number }> {
    if (keyframes.length <= 2) return keyframes;

    const simplified = this.rdpSimplify(keyframes, tolerance);
    return simplified;
  }

  /**
   * Ramer-Douglas-Peucker simplification algorithm
   */
  private rdpSimplify(
    points: Array<{ time: number; value: number }>,
    epsilon: number
  ): Array<{ time: number; value: number }> {
    if (points.length <= 2) return points;

    let maxDist = 0;
    let index = 0;
    const first = points[0];
    const last = points[points.length - 1];

    for (let i = 1; i < points.length - 1; i++) {
      const dist = this.pointLineDistance(points[i], first, last);
      if (dist > maxDist) {
        maxDist = dist;
        index = i;
      }
    }

    if (maxDist > epsilon) {
      const left = this.rdpSimplify(points.slice(0, index + 1), epsilon);
      const right = this.rdpSimplify(points.slice(index), epsilon);
      return left.slice(0, -1).concat(right);
    }

    return [first, last];
  }

  /**
   * Calculate perpendicular distance from point to line
   */
  private pointLineDistance(
    point: { time: number; value: number },
    lineStart: { time: number; value: number },
    lineEnd: { time: number; value: number }
  ): number {
    const dx = lineEnd.time - lineStart.time;
    const dy = lineEnd.value - lineStart.value;
    if (dx === 0 && dy === 0) return 0;

    const num = Math.abs(
      dy * point.time -
      dx * point.value +
      lineEnd.time * lineStart.value -
      lineEnd.value * lineStart.time
    );
    const den = Math.sqrt(dy * dy + dx * dx);
    return num / den;
  }

  /**
   * Calculate smoothed path between two points
   */
  private calculateSmoothedPath(start: Vector2, end: Vector2, segments: number): Vector2[] {
    const path: Vector2[] = [];
    
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      // Ease-in-out for natural motion
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      path.push(start.lerp(end, eased));
    }
    
    return path;
  }

  /**
   * Analyze animation curve for motion characteristics
   */
  analyzeMotion(keyframes: Array<{ time: number; value: number }>): {
    avgVelocity: number;
    peakVelocity: number;
    acceleration: number;
    isLinear: boolean;
  } {
    if (keyframes.length < 2) return { avgVelocity: 0, peakVelocity: 0, acceleration: 0, isLinear: true };

    let totalDistance = 0;
    let peakVel = 0;

    for (let i = 1; i < keyframes.length; i++) {
      const dt = keyframes[i].time - keyframes[i - 1].time;
      const dv = keyframes[i].value - keyframes[i - 1].value;
      const velocity = Math.abs(dv / (dt || 1));
      
      totalDistance += Math.abs(dv);
      peakVel = Math.max(peakVel, velocity);
    }

    const avgVelocity = totalDistance / (keyframes[keyframes.length - 1].time - keyframes[0].time);

    // Check linearity
    let isLinear = true;
    if (keyframes.length > 2) {
      const startVel = Math.abs((keyframes[1].value - keyframes[0].value) / (keyframes[1].time - keyframes[0].time));
      const endVel = Math.abs((keyframes[keyframes.length - 1].value - keyframes[keyframes.length - 2].value) / (keyframes[keyframes.length - 1].time - keyframes[keyframes.length - 2].time));
      isLinear = Math.abs(startVel - endVel) < 0.1;
    }

    return {
      avgVelocity,
      peakVelocity: peakVel,
      acceleration: peakVel - avgVelocity,
      isLinear
    };
  }

  /**
   * Suggest optimal easing function based on motion analysis
   */
  suggestEasing(keyframes: Array<{ time: number; value: number }>): string {
    const motion = this.analyzeMotion(keyframes);

    if (motion.isLinear) return 'linear';
    if (motion.acceleration > 0.5) return 'ease-out';
    if (motion.acceleration < -0.3) return 'ease-in';
    return 'ease-in-out';
  }
}

export const animationAI = new AnimationAI();
