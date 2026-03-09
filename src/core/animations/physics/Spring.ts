// src/animations/physics/Spring.ts
import { Animation, AnimationConfig } from '../../Animation.js';
import { Node } from '../../Node.js';
import { Vector2 } from '../../utils/Vector2.js';

export interface SpringConfig {
  mass?: number;
  stiffness?: number;
  damping?: number;
  initialVelocity?: number;
}

export class SpringPhysics {
  private mass: number;
  private stiffness: number;
  private damping: number;
  private velocity: number;
  private position: number;

  constructor(config: SpringConfig = {}) {
    this.mass = config.mass ?? 1;
    this.stiffness = config.stiffness ?? 100;
    this.damping = config.damping ?? 10;
    this.velocity = config.initialVelocity ?? 0;
    this.position = 0;
  }

  update(deltaTime: number, target: number): number {
    const displacement = this.position - target;
    const springForce = -this.stiffness * displacement;
    const dampingForce = -this.damping * this.velocity;
    const acceleration = (springForce + dampingForce) / this.mass;

    this.velocity += acceleration * deltaTime;
    this.position += this.velocity * deltaTime;

    return this.position;
  }

  isAtRest(threshold: number = 0.01): boolean {
    return Math.abs(this.velocity) < threshold && Math.abs(this.position) < threshold;
  }

  estimateDuration(): number {
    const dampingRatio = this.damping / (2 * Math.sqrt(this.stiffness * this.mass));
    if (dampingRatio >= 1) return 1;
    return 3 / (dampingRatio * Math.sqrt(this.stiffness / this.mass));
  }

  getState() {
    return { position: this.position, velocity: this.velocity };
  }

  reset(): void {
    this.position = 0;
    this.velocity = 0;
  }
}

export class SpringAnimation extends Animation {
  private spring: SpringPhysics;
  private startValue: number = 0;
  private targetValue: number;
  private property: 'scale' | 'rotation' | 'opacity';
  private lastFrameTime: number = 0;

  constructor(
    target: Node,
    property: 'scale' | 'rotation' | 'opacity',
    targetValue: number,
    springConfig?: SpringConfig
  ) {
    super(target, { duration: 0 });
    this.spring = new SpringPhysics(springConfig);
    this.property = property;
    this.targetValue = targetValue;
    this.duration = this.spring.estimateDuration();
  }

  setStartTime(time: number): void {
    super.setStartTime(time);
    this.startValue = this.getCurrentValue();
    this.lastFrameTime = time;
    this.spring.reset();
  }

  private getCurrentValue(): number {
    switch (this.property) {
      case 'scale': return this.target.scale.x;
      case 'rotation': return this.target.rotation;
      case 'opacity': return this.target.opacity;
    }
  }

  update(time: number): void {
    const deltaTime = (time - this.lastFrameTime) / 1000;
    this.lastFrameTime = time;
    const dt = Math.min(deltaTime, 0.05);

    const value = this.startValue + this.spring.update(dt, this.targetValue - this.startValue);

    switch (this.property) {
      case 'scale':
        this.target.scale = new Vector2(value, value);
        break;
      case 'rotation':
        this.target.rotation = value;
        break;
      case 'opacity':
        this.target.opacity = Math.max(0, Math.min(1, value));
        break;
    }

    if (this.spring.isAtRest()) {
      this.isComplete = true;
    }
  }

  reverse(): Animation {
    return new SpringAnimation(this.target, this.property, this.startValue, {
      mass: (this.spring.getState() as any).mass || 1
    });
  }
}

export const SpringPresets = {
  bouncy: { mass: 0.5, stiffness: 200, damping: 12 },
  smooth: { mass: 1, stiffness: 100, damping: 10 },
  gentle: { mass: 2, stiffness: 50, damping: 15 },
  crisp: { mass: 1, stiffness: 300, damping: 30 }
};
