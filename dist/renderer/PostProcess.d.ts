import { Canvas } from 'skia-canvas';
export interface BloomConfig {
    threshold?: number;
    intensity?: number;
    radius?: number;
}
export interface MotionBlurConfig {
    samples?: number;
    shutterAngle?: number;
}
export interface ColorGradingConfig {
    brightness?: number;
    contrast?: number;
    saturation?: number;
    hueShift?: number;
}
/**
 * Post-processing effects stack for professional visual quality
 */
export declare class PostProcessStack {
    private effects;
    /**
     * Add bloom/glow effect that emits light from bright areas
     */
    addBloom(config?: BloomConfig): this;
    /**
     * Add motion blur for fast-moving objects
     */
    addMotionBlur(config?: MotionBlurConfig): this;
    /**
     * Add color grading adjustments
     */
    addColorGrading(config?: ColorGradingConfig): this;
    /**
     * Apply all effects in sequence
     */
    process(input: Canvas): Canvas;
    /**
     * Clear the effect stack
     */
    clear(): this;
    /**
     * Get number of active effects
     */
    getEffectCount(): number;
}
//# sourceMappingURL=PostProcess.d.ts.map