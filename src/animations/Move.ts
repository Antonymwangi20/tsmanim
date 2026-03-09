// src/animations/Move.ts
import { Animation, AnimationConfig } from '../core/Animation.js';
import { Node } from '../core/Node.js';
import { Vector2 } from '../utils/Vector2.js';

export interface MoveConfig extends AnimationConfig {
  x?: number;
  y?: number;
}

export class Move extends Animation {
  private startPos: Vector2 = new Vector2(0, 0);
  private targetPos: Vector2 = new Vector2(0, 0);

  constructor(target: Node, config: MoveConfig = {}) {
    super(target, config);
    this.targetPos = new Vector2(config.x ?? 0, config.y ?? 0);
  }

  setStartTime(time: number): void {
    super.setStartTime(time);
    this.startPos = this.target.position.clone();
  }

  update(time: number): void {
    const progress = this.getProgress(time);
    this.target.position = this.startPos.lerp(this.targetPos, progress);
  }

  reverse(): Animation {
    return new Move(this.target, {
      x: this.startPos.x,
      y: this.startPos.y,
      duration: this.duration,
      easing: this.easing
    });
  }
}