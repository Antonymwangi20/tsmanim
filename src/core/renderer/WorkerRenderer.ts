// src/renderer/WorkerRenderer.ts
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';
import * as path from 'path';
import * as os from 'os';
import { Scene } from '../Scene.js';
import { SkiaRenderer, RenderConfig } from './SkiaRenderer.js';

interface WorkerTask {
  startFrame: number;
  endFrame: number;
  sceneData: any;
  config: RenderConfig;
}

interface WorkerResult {
  workerId: number;
  frames: string[];
  error?: string;
}

export class WorkerRenderer {
  private workers: Worker[] = [];
  private numWorkers: number;

  constructor(numWorkers?: number) {
    this.numWorkers = numWorkers ?? os.cpus().length;
  }

  async renderScene(
    scene: Scene,
    config: RenderConfig,
    onProgress?: (completed: number, total: number) => void
  ): Promise<string[]> {
    const totalFrames = scene.getTotalFrames();
    const framesPerWorker = Math.ceil(totalFrames / this.numWorkers);
    
    const tasks: Promise<WorkerResult>[] = [];
    let completedFrames = 0;

    for (let i = 0; i < this.numWorkers; i++) {
      const startFrame = i * framesPerWorker;
      const endFrame = Math.min(startFrame + framesPerWorker, totalFrames);
      
      if (startFrame >= totalFrames) break;

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
    const allFrames: string[] = [];
    
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

  private createWorkerTask(
    workerId: number,
    task: WorkerTask,
    onFrameComplete: () => void
  ): Promise<WorkerResult> {
    return new Promise((resolve, reject) => {
      const worker = new Worker(new URL(import.meta.url), {
        workerData: { ...task, workerId }
      });

      worker.on('message', (message) => {
        if (message.type === 'frame') {
          onFrameComplete();
        } else if (message.type === 'complete') {
          resolve(message.result);
        } else if (message.type === 'error') {
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

  private serializeScene(scene: Scene): any {
    // Serialize scene configuration
    return {
      width: scene.width,
      height: scene.height,
      fps: scene.fps,
      backgroundColor: scene.backgroundColor,
      duration: scene.duration
    };
  }

  terminate(): void {
    for (const worker of this.workers) {
      worker.terminate();
    }
  }
}

// Worker thread execution
if (!isMainThread && workerData) {
  const { startFrame, endFrame, sceneData, config, workerId } = workerData as WorkerTask & { workerId: number };
  
  async function runWorker() {
    try {
      // Dynamically import scene module
      const { Scene } = await import('../Scene.js');
      
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
      const frames: string[] = [];
      
      for (let i = startFrame; i < endFrame; i++) {
        const framePath = await renderer.renderFrame(scene, i, config);
        frames.push(framePath);
        parentPort?.postMessage({ type: 'frame', frameIndex: i });
      }
      
      parentPort?.postMessage({
        type: 'complete',
        result: { workerId, frames }
      });
    } catch (error) {
      parentPort?.postMessage({
        type: 'error',
        error: (error as Error).message
      });
    }
  }

  runWorker();
}
