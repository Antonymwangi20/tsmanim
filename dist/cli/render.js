#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import { program } from 'commander';
import { WorkerRenderer } from '../renderer/WorkerRenderer.js';
import { FFmpeg } from '../utils/FFmpeg.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
program
    .name('anim')
    .description('TypeScript animation framework CLI')
    .version('0.1.0');
program
    .command('render <script>')
    .description('Render an animation script to video')
    .option('-o, --output <path>', 'Output video path', 'output/video.mp4')
    .option('-f, --fps <number>', 'Frames per second', '60')
    .option('-w, --width <number>', 'Video width', '1920')
    .option('-h, --height <number>', 'Video height', '1080')
    .option('-c, --codec <codec>', 'Video codec (libx264, libvpx-vp9)', 'libx264')
    .option('--workers <number>', 'Number of worker threads')
    .option('--format <format>', 'Output format (mp4, webm)', 'mp4')
    .action(async (scriptPath, options) => {
    try {
        console.log(`🎬 Rendering ${scriptPath}...`);
        // Resolve script path
        const absoluteScriptPath = path.resolve(scriptPath);
        if (!fs.existsSync(absoluteScriptPath)) {
            console.error(`❌ Script not found: ${absoluteScriptPath}`);
            process.exit(1);
        }
        // Create temp directory for frames
        const tempDir = path.join(process.cwd(), '.anim-temp');
        const framesDir = path.join(tempDir, 'frames');
        fs.mkdirSync(framesDir, { recursive: true });
        // Load and execute user script
        console.log('📜 Loading scene...');
        // Clear require cache for hot reload in development
        delete require.cache[require.resolve(absoluteScriptPath)];
        // Dynamic import for ES modules support
        const scriptModule = await import(absoluteScriptPath);
        const scene = scriptModule.default ?? scriptModule.scene;
        if (!scene) {
            console.error('❌ Scene not exported. Export default or named export "scene"');
            process.exit(1);
        }
        // Override scene config with CLI options
        scene.fps = parseInt(options.fps);
        scene.width = parseInt(options.width);
        scene.height = parseInt(options.height);
        const totalFrames = scene.getTotalFrames();
        console.log(`🎯 Total frames: ${totalFrames} (${scene.duration}s @ ${scene.fps}fps)`);
        // Render frames in parallel
        console.log('🖼️  Rendering frames...');
        const renderer = new WorkerRenderer(options.workers ? parseInt(options.workers) : undefined);
        const startTime = Date.now();
        const frames = await renderer.renderScene(scene, { outputDir: framesDir, frameFormat: 'png' }, (completed, total) => {
            const percent = Math.round((completed / total) * 100);
            const elapsed = (Date.now() - startTime) / 1000;
            const fps = completed / elapsed;
            const eta = (total - completed) / fps;
            process.stdout.write(`\r⏳ ${percent}% (${completed}/${total}) | ${fps.toFixed(1)} fps | ETA: ${eta.toFixed(0)}s`);
        });
        console.log('\n✅ Frames rendered');
        // Encode video
        console.log('🎥 Encoding video...');
        const ffmpeg = new FFmpeg();
        const framePattern = path.join(framesDir, 'frame%05d.png');
        const outputPath = path.resolve(options.output);
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        if (options.format === 'webm' || options.codec === 'libvpx-vp9') {
            await ffmpeg.encodeWebM({
                inputPattern: framePattern,
                outputPath,
                framerate: scene.fps
            });
        }
        else {
            await ffmpeg.encode({
                inputPattern: framePattern,
                outputPath,
                framerate: scene.fps,
                codec: options.codec
            });
        }
        // Cleanup temp files (optional, can be disabled with --keep-frames)
        if (!process.env.KEEP_FRAMES) {
            console.log('🧹 Cleaning up...');
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
        const totalTime = (Date.now() - startTime) / 1000;
        console.log(`\n🎉 Done! Video saved to: ${outputPath}`);
        console.log(`⏱️  Total time: ${totalTime.toFixed(1)}s`);
        console.log(`📊 Average render speed: ${(totalFrames / totalTime).toFixed(1)} fps`);
    }
    catch (error) {
        console.error('\n❌ Error:', error);
        process.exit(1);
    }
});
program.parse();
//# sourceMappingURL=render.js.map