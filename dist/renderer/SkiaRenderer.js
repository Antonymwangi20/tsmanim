// src/renderer/SkiaRenderer.ts
import { Canvas } from 'skia-canvas';
import * as fs from 'fs';
import * as path from 'path';
export class SkiaRenderer {
    async renderFrame(scene, frameIndex, config) {
        const canvas = new Canvas(scene.width, scene.height);
        const ctx = canvas.getContext('2d');
        const time = scene.getFrameTime(frameIndex);
        scene.update(time);
        scene.render(ctx);
        const frameNumber = frameIndex.toString().padStart(5, '0');
        const filename = `frame${frameNumber}.${config.frameFormat ?? 'png'}`;
        const filepath = path.join(config.outputDir, filename);
        const quality = config.quality === undefined
            ? 1
            : config.quality > 1
                ? config.quality / 100
                : config.quality;
        const buffer = await canvas.toBuffer(config.frameFormat ?? 'png', { quality });
        fs.writeFileSync(filepath, buffer);
        return filepath;
    }
    async renderFrames(scene, startFrame, endFrame, config, onProgress) {
        const frames = [];
        for (let i = startFrame; i < endFrame; i++) {
            const framePath = await this.renderFrame(scene, i, config);
            frames.push(framePath);
            onProgress?.(i);
        }
        return frames;
    }
}
//# sourceMappingURL=SkiaRenderer.js.map