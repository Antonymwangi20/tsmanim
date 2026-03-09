// src/renderer/PostProcess.ts
import { Canvas } from 'skia-canvas';

export interface BloomConfig {
  threshold?: number;   // 0-1, values above this glow
  intensity?: number;   // 0-1, glow strength
  radius?: number;      // pixels, blur radius
}

export interface MotionBlurConfig {
  samples?: number;     // Number of blur samples
  shutterAngle?: number; // 0-1, where 1 = 360°
}

export interface ColorGradingConfig {
  brightness?: number;  // -1 to 1
  contrast?: number;    // -1 to 1
  saturation?: number;  // -1 to 1
  hueShift?: number;    // -180 to 180
}

/**
 * Post-processing effects stack for professional visual quality
 */
export class PostProcessStack {
  private effects: Array<(input: Canvas) => Canvas> = [];

  /**
   * Add bloom/glow effect that emits light from bright areas
   */
  addBloom(config: BloomConfig = {}): this {
    const { threshold = 0.8, intensity = 0.5, radius = 10 } = config;
    
    this.effects.push((input) => {
      const canvas = new Canvas(input.width, input.height);
      const ctx = canvas.getContext('2d');

      // Extract bright areas with high contrast
      ctx.filter = `brightness(${threshold * 100}%) contrast(200%)`;
      ctx.drawImage(input, 0, 0);
      
      // Blur for glow effect
      const blurred = new Canvas(input.width, input.height);
      const blurCtx = blurred.getContext('2d');
      blurCtx.filter = `blur(${radius}px)`;
      blurCtx.drawImage(canvas, 0, 0);
      
      // Screen blend onto original
      const result = new Canvas(input.width, input.height);
      const resultCtx = result.getContext('2d');
      resultCtx.drawImage(input, 0, 0);
      resultCtx.globalCompositeOperation = 'screen';
      resultCtx.globalAlpha = intensity;
      resultCtx.drawImage(blurred, 0, 0);
      resultCtx.globalCompositeOperation = 'source-over';
      resultCtx.globalAlpha = 1;
      
      return result;
    });
    
    return this;
  }

  /**
   * Add motion blur for fast-moving objects
   */
  addMotionBlur(config: MotionBlurConfig = {}): this {
    const { samples = 8, shutterAngle = 0.5 } = config;
    
    this.effects.push((input) => {
      const output = new Canvas(input.width, input.height);
      const ctx = output.getContext('2d');

      ctx.globalAlpha = 1 / samples;
      
      for (let i = 0; i < samples; i++) {
        const offset = (i - samples / 2) * shutterAngle * 2;
        ctx.drawImage(input, offset, 0);
      }

      ctx.globalAlpha = 1;
      return output;
    });
    
    return this;
  }

  /**
   * Add color grading adjustments
   */
  addColorGrading(config: ColorGradingConfig = {}): this {
    const { 
      brightness = 0, 
      contrast = 0, 
      saturation = 0, 
      hueShift = 0 
    } = config;
    
    this.effects.push((input) => {
      const output = new Canvas(input.width, input.height);
      const ctx = output.getContext('2d');

      // Apply CSS filters for color grading
      const filters: string[] = [];

      if (brightness !== 0) {
        filters.push(`brightness(${100 + brightness * 50}%)`);
      }
      if (contrast !== 0) {
        filters.push(`contrast(${100 + contrast * 50}%)`);
      }
      if (saturation !== 0) {
        filters.push(`saturate(${100 + saturation * 50}%)`);
      }
      if (hueShift !== 0) {
        filters.push(`hue-rotate(${hueShift}deg)`);
      }

      if (filters.length > 0) {
        ctx.filter = filters.join(' ');
      }

      ctx.drawImage(input, 0, 0);
      return output;
    });
    
    return this;
  }

  /**
   * Apply all effects in sequence
   */
  process(input: Canvas): Canvas {
    let result = input;
    
    for (const effect of this.effects) {
      result = effect(result);
    }
    
    return result;
  }

  /**
   * Clear the effect stack
   */
  clear(): this {
    this.effects = [];
    return this;
  }

  /**
   * Get number of active effects
   */
  getEffectCount(): number {
    return this.effects.length;
  }
}