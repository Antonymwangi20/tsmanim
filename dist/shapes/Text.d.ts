import { Node } from '../core/Node.js';
export interface TextConfig {
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    x?: number;
    y?: number;
    align?: 'left' | 'center' | 'right';
    baseline?: 'top' | 'middle' | 'bottom';
}
export declare class Text extends Node {
    text: string;
    fontSize: number;
    fontFamily: string;
    fill: string;
    stroke: string;
    strokeWidth: number;
    align: CanvasTextAlign;
    baseline: CanvasTextBaseline;
    constructor(config?: TextConfig);
    render(ctx: any): void;
    getBounds(): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}
//# sourceMappingURL=Text.d.ts.map