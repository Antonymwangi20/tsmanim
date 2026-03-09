// src/shapes/Text.ts
import { Node } from '../core/Node.js';
import { Vector2 } from '../utils/Vector2.js';
export class Text extends Node {
    text;
    fontSize;
    fontFamily;
    fill;
    stroke;
    strokeWidth;
    align;
    baseline;
    constructor(config = {}) {
        super();
        this.text = config.text ?? '';
        this.fontSize = config.fontSize ?? 24;
        this.fontFamily = config.fontFamily ?? 'Arial';
        this.fill = config.fill ?? '#ffffff';
        this.stroke = config.stroke ?? 'none';
        this.strokeWidth = config.strokeWidth ?? 0;
        this.align = config.align ?? 'center';
        this.baseline = config.baseline ?? 'middle';
        this.position = new Vector2(config.x ?? 0, config.y ?? 0);
    }
    render(ctx) {
        ctx.font = `${this.fontSize}px ${this.fontFamily}`;
        ctx.textAlign = this.align;
        ctx.textBaseline = this.baseline;
        if (this.stroke !== 'none' && this.strokeWidth > 0) {
            ctx.strokeStyle = this.stroke;
            ctx.lineWidth = this.strokeWidth;
            ctx.strokeText(this.text, 0, 0);
        }
        if (this.fill !== 'none') {
            ctx.fillStyle = this.fill;
            ctx.fillText(this.text, 0, 0);
        }
    }
    getBounds() {
        // Approximate bounds - in production, measure text
        return {
            x: this.position.x - this.text.length * this.fontSize * 0.3,
            y: this.position.y - this.fontSize / 2,
            width: this.text.length * this.fontSize * 0.6,
            height: this.fontSize
        };
    }
}
//# sourceMappingURL=Text.js.map