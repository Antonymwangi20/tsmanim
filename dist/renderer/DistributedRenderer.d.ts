import { Scene } from '../core/Scene';
export declare class DistributedRenderer {
    private nodes;
    private server;
    startMaster(port: number): Promise<void>;
    renderDistributed(scene: Scene, outputDir: string): Promise<void>;
    private distributeFrames;
    private assignToNode;
    private serializeScene;
}
//# sourceMappingURL=DistributedRenderer.d.ts.map