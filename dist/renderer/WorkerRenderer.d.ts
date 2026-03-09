import { Scene } from '../core/Scene.js';
import { RenderConfig } from './SkiaRenderer.js';
export declare class WorkerRenderer {
    private workers;
    private numWorkers;
    constructor(numWorkers?: number);
    renderScene(scene: Scene, config: RenderConfig, onProgress?: (completed: number, total: number) => void): Promise<string[]>;
    private createWorkerTask;
    private serializeScene;
    terminate(): void;
}
//# sourceMappingURL=WorkerRenderer.d.ts.map