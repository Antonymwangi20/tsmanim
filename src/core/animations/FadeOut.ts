// src/animations/FadeOut.ts
import { Animation, AnimationConfig } from '../core/Animation.js';
import { Node } from '../core/Node.js';
import { FadeIn } from './FadeIn.js';

export class FadeOut extends Animation {
  private startOpacity: number = 1;

  constructor(target: Node, config: AnimationConfig = {}) {
    super(target, { ...config, duration: config.duration ?? 0.5 });
  }

  setStartTime(time: number): void {
    super.setStartTime(time);
    this.startOpacity = this.target.opacity;
  }

  update(time: number): void {
    const progress = this.getProgress(time);
    this.target.opacity = this.startOpacity * (1 - progress);
    
    if (progress >= 1) {
      this.target.visible = false;
    }
  }

  reverse(): Animation {
    return new FadeIn(this.target, {
      duration: this.duration,
      easing: this.easing
    });
  }
}