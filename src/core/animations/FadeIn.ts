// src/animations/FadeIn.ts
import { Animation, AnimationConfig } from '../core/Animation.js';
import { Node } from '../core/Node.js';
import { FadeOut } from './FadeOut.js';

export class FadeIn extends Animation {
  constructor(target: Node, config: AnimationConfig = {}) {
    super(target, { ...config, duration: config.duration ?? 0.5 });
  }

  setStartTime(time: number): void {
    super.setStartTime(time);
    this.target.opacity = 0;
    this.target.visible = true;
  }

  update(time: number): void {
    const progress = this.getProgress(time);
    this.target.opacity = progress;
  }

  reverse(): Animation {
    return new FadeOut(this.target, {
      duration: this.duration,
      easing: this.easing
    });
  }
}