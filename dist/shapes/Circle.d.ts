import { Node } from '../core/Node.js';
export interface CircleConfig {
    radius?: number;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    x?: number;
    y?: number;
}
export declare class Circle extends Node {
    radius: number;
    fill: string;
    stroke: string;
    strokeWidth: number;
    constructor(config?: CircleConfig);
    render(ctx: any): void;
    getBounds(): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}
//# sourceMappingURL=Circle.d.ts.map