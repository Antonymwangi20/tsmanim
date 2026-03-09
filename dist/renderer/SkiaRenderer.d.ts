import { Scene } from '../core/Scene.js';
export interface RenderConfig {
    outputDir: string;
    frameFormat?: 'png' | 'jpg';
    quality?: number;
}
export declare class SkiaRenderer {
    renderFrame(scene: Scene, frameIndex: number, config: RenderConfig): Promise<string>;
    renderFrames(scene: Scene, startFrame: number, endFrame: number, config: RenderConfig, onProgress?: (frame: number) => void): Promise<string[]>;
}
//# sourceMappingURL=SkiaRenderer.d.ts.map