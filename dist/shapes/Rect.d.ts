import { Node } from '../core/Node.js';
export interface RectConfig {
    width?: number;
    height?: number;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    x?: number;
    y?: number;
    cornerRadius?: number;
}
export declare class Rect extends Node {
    width: number;
    height: number;
    fill: string;
    stroke: string;
    strokeWidth: number;
    cornerRadius: number;
    constructor(config?: RectConfig);
    render(ctx: any): void;
    getBounds(): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}
//# sourceMappingURL=Rect.d.ts.map