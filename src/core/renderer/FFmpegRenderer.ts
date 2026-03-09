/**
 * FFmpeg-based video rendering for ts-manim
 * 
 * Responsible for:
 * - Frame capture from renderer
 * - FFmpeg encoding pipeline
 * - Quality presets (low/medium/high/pro/king)
 * - Output format management
 * - Progress tracking
 */

import { execSync, spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { EventEmitter } from 'events';

/**
 * Quality preset configuration
 * low: 360p, 24fps, H.264, bitrate 500k
 * medium: 720p, 30fps, H.264, bitrate 2500k
 * high: 1080p, 60fps, H.264, bitrate 8000k
 * pro: 1440p, 60fps, H.265, bitrate 15000k
 * king: 4K, 60fps, H.265, bitrate 40000k
 */
export type QualityPreset = 'l' | 'm' | 'h' | 'p' | 'k';

export interface FFmpegConfig {
  quality: QualityPreset;
  inputFrames: string; // Pattern like "frame_%04d.png"
  outputPath: string;
  fps: number;
  codec?: 'libx264' | 'libx265'; // AV1 coming in Phase 2
  bitrate?: string;
  crf?: number; // Quality (0-51, lower=better)
  pixelFormat?: string;
  audioInput?: string; // Optional audio file
  verbose?: boolean;
}

export interface QualityConfig {
  resolution: string;
  fps: number;
  codec: 'libx264' | 'libx265';
  bitrate: string;
  crf: number;
}

const QUALITY_PRESETS: Record<QualityPreset, QualityConfig> = {
  l: { // Low: YouTube preview
    resolution: '640x360',
    fps: 24,
    codec: 'libx264',
    bitrate: '500k',
    crf: 28
  },
  m: { // Medium: Standard HD
    resolution: '1280x720',
    fps: 30,
    codec: 'libx264',
    bitrate: '2500k',
    crf: 23
  },
  h: { // High: Full HD
    resolution: '1920x1080',
    fps: 60,
    codec: 'libx264',
    bitrate: '8000k',
    crf: 20
  },
  p: { // Pro: 2K
    resolution: '2560x1440',
    fps: 60,
    codec: 'libx265',
    bitrate: '15000k',
    crf: 22
  },
  k: { // King: 4K
    resolution: '3840x2160',
    fps: 60,
    codec: 'libx265',
    bitrate: '40000k',
    crf: 24
  }
};

/**
 * FFmpeg-based video renderer
 * Handles frame input → FFmpeg encoding → video output
 */
export class FFmpegRenderer extends EventEmitter {
  private config: FFmpegConfig;
  private framesDir: string;
  private tempDir: string;
  private process: any;

  constructor(config: FFmpegConfig) {
    super();
    this.config = config;
    this.framesDir = path.dirname(config.inputFrames);
    this.tempDir = path.join(this.framesDir, '.tsmanim-temp');
  }

  /**
   * Initialize renderer, verify FFmpeg is available
   */
  async initialize(): Promise<void> {
    try {
      execSync('ffmpeg -version', { stdio: 'pipe' });
      this.emit('ready', { message: 'FFmpeg is available' });
    } catch (e) {
      throw new Error('FFmpeg not found. Please install FFmpeg: https://ffmpeg.org/download.html');
    }

    // Create temp directory
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
  }

  /**
   * Render frames to video via FFmpeg
   */
  async render(framesPattern: string): Promise<string> {
    const preset = QUALITY_PRESETS[this.config.quality];
    
    const ffmpegArgs = [
      '-framerate', preset.fps.toString(),
      '-i', framesPattern,
      '-vf', `scale=${preset.resolution}:force_original_aspect_ratio=decrease,pad=${preset.resolution}:(ow-iw)/2:(oh-ih)/2`,
      '-c:v', preset.codec,
      '-crf', preset.crf.toString(),
      '-b:v', preset.bitrate,
      '-pix_fmt', 'yuv420p',
      '-y', // Overwrite output
      this.config.outputPath
    ];

    // Add audio if provided
    if (this.config.audioInput) {
      ffmpegArgs.push('-i', this.config.audioInput);
      ffmpegArgs.push('-c:a', 'aac');
      ffmpegArgs.push('-shortest');
    }

    return new Promise((resolve, reject) => {
      this.process = spawn('ffmpeg', ffmpegArgs, {
        stdio: this.config.verbose ? 'inherit' : ['pipe', 'pipe', 'pipe']
      });

      let stderr = '';

      if (!this.config.verbose) {
        this.process.stderr.on('data', (data: Buffer) => {
          stderr += data.toString();
          this.parseFFmpegProgress(stderr);
        });
      }

      this.process.on('close', (code: number) => {
        if (code === 0) {
          this.emit('complete', { 
            output: this.config.outputPath,
            size: fs.statSync(this.config.outputPath).size,
            quality: this.config.quality
          });
          resolve(this.config.outputPath);
        } else {
          reject(new Error(`FFmpeg encoding failed with code ${code}\n${stderr}`));
        }
      });

      this.process.on('error', reject);
    });
  }

  /**
   * Parse FFmpeg progress output
   */
  private parseFFmpegProgress(stderr: string): void {
    const timeMatch = stderr.match(/time=(\d+):(\d+):(\d+\.\d+)/);
    const frameMatch = stderr.match(/frame=\s*(\d+)/);

    if (timeMatch && frameMatch) {
      const [_, hours, minutes, seconds] = timeMatch;
      const frame = parseInt(frameMatch[1]);
      
      this.emit('progress', {
        frame,
        time: `${hours}:${minutes}:${seconds}`,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Cancel rendering
   */
  cancel(): void {
    if (this.process) {
      this.process.kill();
      this.emit('cancelled');
    }
  }

  /**
   * Clean up temporary files
   */
  async cleanup(): Promise<void> {
    if (fs.existsSync(this.tempDir)) {
      fs.rmSync(this.tempDir, { recursive: true });
    }
  }

  /**
   * Get quality preset description
   */
  static getQualityInfo(quality: QualityPreset): QualityConfig {
    return QUALITY_PRESETS[quality];
  }

  /**
   * List available quality presets
   */
  static listQualities(): Record<QualityPreset, QualityConfig> {
    return QUALITY_PRESETS;
  }
}

/**
 * Frame capture interface for animation rendering
 */
export interface FrameCapture {
  frameNumber: number;
  canvas: HTMLCanvasElement | Buffer; // Browser or Node canvas
  timestamp: number;
  metadata?: Record<string, any>;
}

/**
 * FrameBuffer manages frame sequences for video encoding
 */
export class FrameBuffer {
  private frames: FrameCapture[] = [];
  private outputDir: string;

  constructor(outputDir: string) {
    this.outputDir = outputDir;
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  }

  /**
   * Add frame to buffer
   */
  addFrame(frame: FrameCapture): void {
    this.frames.push(frame);
  }

  /**
   * Save frames as PNG sequence
   */
  async saveFrames(pattern: string = 'frame_%04d.png'): Promise<string> {
    const promises = this.frames.map((frame, index) => {
      const filename = pattern.replace('%04d', index.toString().padStart(4, '0'));
      const filepath = path.join(this.outputDir, filename);
      
      // TODO: Implement canvas-to-PNG conversion (depends on renderer)
      return filepath;
    });

    return path.join(this.outputDir, pattern);
  }

  /**
   * Get frame count
   */
  getFrameCount(): number {
    return this.frames.length;
  }

  /**
   * Clear buffer
   */
  clear(): void {
    this.frames = [];
  }
}

/**
 * Render configuration builder (fluent API)
 */
export class RenderConfig {
  private config: Partial<FFmpegConfig> = {};

  quality(q: QualityPreset): this {
    this.config.quality = q;
    return this;
  }

  input(pattern: string): this {
    this.config.inputFrames = pattern;
    return this;
  }

  output(path: string): this {
    this.config.outputPath = path;
    return this;
  }

  fps(fps: number): this {
    this.config.fps = fps;
    return this;
  }

  audio(audioPath: string): this {
    this.config.audioInput = audioPath;
    return this;
  }

  verbose(v: boolean = true): this {
    this.config.verbose = v;
    return this;
  }

  build(): FFmpegConfig {
    if (!this.config.quality || !this.config.inputFrames || !this.config.outputPath) {
      throw new Error('Missing required config: quality, inputFrames, outputPath');
    }
    return this.config as FFmpegConfig;
  }
}
