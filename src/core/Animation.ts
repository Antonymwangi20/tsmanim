// src/core/Animation.ts
import { Node } from './Node.js';
import { EasingFunction, Easing } from './utils/Easing.js';

export interface AnimationConfig {
  duration?: number;
  easing?: EasingFunction;
  delay?: number;
}

export abstract class Animation {
  target: Node;
  duration: number;
  easing: EasingFunction;
  delay: number;
  startTime: number = 0;
  isComplete: boolean = false;

  constructor(target: Node, config: AnimationConfig = {}) {
    this.target = target;
    this.duration = config.duration ?? 1;
    this.easing = config.easing ?? Easing.easeInOutQuad;
    this.delay = config.delay ?? 0;
  }

  setStartTime(time: number): void {
    this.startTime = time + this.delay;
  }

  getProgress(time: number): number {
    if (time < this.startTime) return 0;
    
    const elapsed = time - this.startTime;
    if (elapsed >= this.duration) {
      this.isComplete = true;
      return 1;
    }
    
    const t = elapsed / this.duration;
    return this.easing(t);
  }

  abstract update(time: number): void;
  abstract reverse(): Animation;
}