// src/utils/FFmpeg.ts
import { spawn } from 'child_process';
export class FFmpeg {
    async encode(config) {
        const args = [
            '-y', // Overwrite output
            '-framerate', (config.framerate ?? 60).toString(),
            '-i', config.inputPattern,
            '-c:v', config.codec ?? 'libx264',
            '-pix_fmt', config.pixFmt ?? 'yuv420p',
            '-crf', (config.crf ?? 23).toString(),
            '-preset', config.preset ?? 'medium',
            '-movflags', '+faststart',
            config.outputPath
        ];
        return new Promise((resolve, reject) => {
            const ffmpeg = spawn('ffmpeg', args);
            let stderr = '';
            ffmpeg.stderr.on('data', (data) => {
                stderr += data.toString();
            });
            ffmpeg.on('close', (code) => {
                if (code === 0) {
                    resolve();
                }
                else {
                    reject(new Error(`FFmpeg exited with code ${code}: ${stderr}`));
                }
            });
            ffmpeg.on('error', (err) => {
                reject(new Error(`Failed to start FFmpeg: ${err.message}`));
            });
        });
    }
    async encodeWebM(config) {
        return this.encode({
            ...config,
            codec: 'libvpx-vp9',
            crf: 31
        });
    }
}
//# sourceMappingURL=FFmpeg.js.map