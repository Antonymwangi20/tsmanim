// src/animations/Transform.ts
import { Animation, AnimationConfig } from '../Animation.js';
import { Node } from '../Node.js';
import { Vector2 } from '../utils/Vector2.js';

export interface TransformConfig extends AnimationConfig {
  scale?: number;
  rotation?: number;
  opacity?: number;
}

export class Transform extends Animation {
  private startScale: number = 1;
  private startRotation: number = 0;
  private startOpacity: number = 1;
  private targetScale: number = 1;
  private targetRotation: number = 0;
  private targetOpacity: number = 1;

  constructor(target: Node, config: TransformConfig = {}) {
    super(target, config);
    this.targetScale = config.scale ?? 1;
    this.targetRotation = config.rotation ?? 0;
    this.targetOpacity = config.opacity ?? 1;
  }

  setStartTime(time: number): void {
    super.setStartTime(time);
    this.startScale = this.target.scale.x;
    this.startRotation = this.target.rotation;
    this.startOpacity = this.target.opacity;
  }

  update(time: number): void {
    const progress = this.getProgress(time);
    
    const scale = this.startScale + (this.targetScale - this.startScale) * progress;
    this.target.scale = new Vector2(scale, scale);
    
    this.target.rotation = this.startRotation + (this.targetRotation - this.startRotation) * progress;
    this.target.opacity = this.startOpacity + (this.targetOpacity - this.startOpacity) * progress;
  }

  reverse(): Animation {
    return new Transform(this.target, {
      scale: this.startScale,
      rotation: this.startRotation,
      opacity: this.startOpacity,
      duration: this.duration,
      easing: this.easing
    });
  }
}