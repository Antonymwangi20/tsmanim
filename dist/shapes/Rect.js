// src/shapes/Rect.ts
import { Node } from '../core/Node.js';
import { Vector2 } from '../utils/Vector2.js';
export class Rect extends Node {
    width;
    height;
    fill;
    stroke;
    strokeWidth;
    cornerRadius;
    constructor(config = {}) {
        super();
        this.width = config.width ?? 100;
        this.height = config.height ?? 100;
        this.fill = config.fill ?? '#ffffff';
        this.stroke = config.stroke ?? 'none';
        this.strokeWidth = config.strokeWidth ?? 0;
        this.cornerRadius = config.cornerRadius ?? 0;
        this.position = new Vector2(config.x ?? 0, config.y ?? 0);
    }
    render(ctx) {
        const x = -this.width / 2;
        const y = -this.height / 2;
        ctx.beginPath();
        if (this.cornerRadius > 0) {
            // Rounded rectangle
            const r = this.cornerRadius;
            ctx.moveTo(x + r, y);
            ctx.lineTo(x + this.width - r, y);
            ctx.quadraticCurveTo(x + this.width, y, x + this.width, y + r);
            ctx.lineTo(x + this.width, y + this.height - r);
            ctx.quadraticCurveTo(x + this.width, y + this.height, x + this.width - r, y + this.height);
            ctx.lineTo(x + r, y + this.height);
            ctx.quadraticCurveTo(x, y + this.height, x, y + this.height - r);
            ctx.lineTo(x, y + r);
            ctx.quadraticCurveTo(x, y, x + r, y);
        }
        else {
            ctx.rect(x, y, this.width, this.height);
        }
        ctx.closePath();
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
            x: this.position.x - this.width / 2,
            y: this.position.y - this.height / 2,
            width: this.width,
            height: this.height
        };
    }
}
//# sourceMappingURL=Rect.js.map