// src/shapes/SVGPath.ts
import { Node } from '../Node.js';
import { Vector2 } from '../utils/Vector2.js';

export interface SVGPathConfig {
  path?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  x?: number;
  y?: number;
}

export class SVGPath extends Node {
  path: string;
  fill: string;
  stroke: string;
  strokeWidth: number;
  private path2D: any;

  constructor(config: SVGPathConfig = {}) {
    super();
    this.path = config.path ?? '';
    this.fill = config.fill ?? '#ffffff';
    this.stroke = config.stroke ?? 'none';
    this.strokeWidth = config.strokeWidth ?? 1;
    this.position = new Vector2(config.x ?? 0, config.y ?? 0);
  }

  render(ctx: any): void {
    if (!this.path2D && this.path) {
      this.path2D = new ctx.constructor.Path2D(this.path);
    }

    if (this.path2D) {
      if (this.fill !== 'none') {
        ctx.fillStyle = this.fill;
        ctx.fill(this.path2D);
      }
      
      if (this.stroke !== 'none' && this.strokeWidth > 0) {
        ctx.strokeStyle = this.stroke;
        ctx.lineWidth = this.strokeWidth;
        ctx.stroke(this.path2D);
      }
    }
  }

  getBounds() {
    // Simplified bounds calculation
    return {
      x: this.position.x - 50,
      y: this.position.y - 50,
      width: 100,
      height: 100
    };
  }
}