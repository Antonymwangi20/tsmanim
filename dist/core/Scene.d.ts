import { Node } from './Node.js';
import { Timeline } from './Timeline.js';
import { Animation } from './Animation.js';
export interface SceneConfig {
    width?: number;
    height?: number;
    fps?: number;
    backgroundColor?: string;
}
export declare class Scene {
    root: Node;
    timeline: Timeline;
    width: number;
    height: number;
    fps: number;
    backgroundColor: string;
    duration: number;
    constructor(config?: SceneConfig);
    add(node: Node): void;
    remove(node: Node): void;
    play(animation: Animation, config?: {
        duration?: number;
        easing?: any;
    }): void;
    playConcurrent(animation: Animation, config?: {
        duration?: number;
    }): void;
    wait(duration: number): void;
    private updateDuration;
    update(time: number): void;
    render(ctx: any): void;
    private renderNode;
    getTotalFrames(): number;
    getFrameTime(frameIndex: number): number;
}
//# sourceMappingURL=Scene.d.ts.map