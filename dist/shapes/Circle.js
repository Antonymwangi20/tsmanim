// src/shapes/Circle.ts
import { Node } from '../core/Node.js';
import { Vector2 } from '../utils/Vector2.js';
export class Circle extends Node {
    radius;
    fill;
    stroke;
    strokeWidth;
    constructor(config = {}) {
        super();
        this.radius = config.radius ?? 50;
        this.fill = config.fill ?? '#ffffff';
        this.stroke = config.stroke ?? 'none';
        this.strokeWidth = config.strokeWidth ?? 0;
        this.position = new Vector2(config.x ?? 0, config.y ?? 0);
    }
    render(ctx) {
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        if (this.fill !== 'none') {
            ctx.fillStyle = this.fill;
            ctx.fill();
        }
        if (this.stroke !== 'none' && this.strokeWidth > 0) {
            ctx.strokeStyle = this.stroke;
            ctx.lineWidth = this.strokeWidth;
            ctx.stroke();
        }
    }
    getBounds() {
        return {
            x: this.position.x - this.radius,
            y: this.position.y - this.radius,
            width: this.radius * 2,
            height: this.radius * 2
        };
    }
}
//# sourceMappingURL=Circle.js.map