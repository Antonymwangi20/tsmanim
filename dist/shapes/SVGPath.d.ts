import { Node } from '../core/Node.js';
export interface SVGPathConfig {
    path?: string;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    x?: number;
    y?: number;
}
export declare class SVGPath extends Node {
    path: string;
    fill: string;
    stroke: string;
    strokeWidth: number;
    private path2D;
    constructor(config?: SVGPathConfig);
    render(ctx: any): void;
    getBounds(): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}
//# sourceMappingURL=SVGPath.d.ts.map