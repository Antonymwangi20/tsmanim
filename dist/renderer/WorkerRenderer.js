// src/renderer/WorkerRenderer.ts
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';
import * as path from 'path';
import * as os from 'os';
import { SkiaRenderer } from './SkiaRenderer.js';
export class WorkerRenderer {
    workers = [];
    numWorkers;
    constructor(numWorkers) {
        this.numWorkers = numWorkers ?? os.cpus().length;
    }
    async renderScene(scene, config, onProgress) {
        const totalFrames = scene.getTotalFrames();
        const framesPerWorker = Math.ceil(totalFrames / this.numWorkers);
        const tasks = [];
        let completedFrames = 0;
        for (let i = 0; i < this.numWorkers; i++) {
            const startFrame = i * framesPerWorker;
            const endFrame = Math.min(startFrame + framesPerWorker, totalFrames);
            if (startFrame >= totalFrames)
                break;
            tasks.push(this.createWorkerTask(i, {
                startFrame,
                endFrame,
                sceneData: this.serializeScene(scene),
                config
            }, () => {
                completedFrames++;
                onProgress?.(completedFrames, totalFrames);
            }));
        }
        const results = await Promise.all(tasks);
        const allFrames = [];
        for (const result of results) {
            if (result.error) {
                throw new Error(`Worker ${result.workerId} failed: ${result.error}`);
            }
            allFrames.push(...result.frames);
        }
        // Sort frames by index
        allFrames.sort((a, b) => {
            const numA = parseInt(path.basename(a).match(/\d+/)?.[0] ?? '0');
            const numB = parseInt(path.basename(b).match(/\d+/)?.[0] ?? '0');
            return numA - numB;
        });
        return allFrames;
    }
    createWorkerTask(workerId, task, onFrameComplete) {
        return new Promise((resolve, reject) => {
            const worker = new Worker(new URL(import.meta.url), {
                workerData: { ...task, workerId }
            });
            worker.on('message', (message) => {
                if (message.type === 'frame') {
                    onFrameComplete();
                }
                else if (message.type === 'complete') {
                    resolve(message.result);
                }
                else if (message.type === 'error') {
                    reject(new Error(message.error));
                }
            });
            worker.on('error', reject);
            worker.on('exit', (code) => {
                if (code !== 0) {
                    reject(new Error(`Worker stopped with exit code ${code}`));
                }
            });
        });
    }
    serializeScene(scene) {
        // Serialize scene configuration
        return {
            width: scene.width,
            height: scene.height,
            fps: scene.fps,
            backgroundColor: scene.backgroundColor,
            duration: scene.duration
        };
    }
    terminate() {
        for (const worker of this.workers) {
            worker.terminate();
        }
    }
}
// Worker thread execution
if (!isMainThread && workerData) {
    const { startFrame, endFrame, sceneData, config, workerId } = workerData;
    async function runWorker() {
        try {
            // Dynamically import scene module
            const { Scene } = await import('../core/Scene.js');
            // Recreate scene from serialized data
            const scene = new Scene({
                width: sceneData.width,
                height: sceneData.height,
                fps: sceneData.fps,
                backgroundColor: sceneData.backgroundColor
            });
            // Note: In a real implementation, we'd need to serialize/deserialize
            // the entire scene graph. For now, this is a simplified version.
            const renderer = new SkiaRenderer();
            const frames = [];
            for (let i = startFrame; i < endFrame; i++) {
                const framePath = await renderer.renderFrame(scene, i, config);
                frames.push(framePath);
                parentPort?.postMessage({ type: 'frame', frameIndex: i });
            }
            parentPort?.postMessage({
                type: 'complete',
                result: { workerId, frames }
            });
        }
        catch (error) {
            parentPort?.postMessage({
                type: 'error',
                error: error.message
            });
        }
    }
    runWorker();
}
//# sourceMappingURL=WorkerRenderer.js.map