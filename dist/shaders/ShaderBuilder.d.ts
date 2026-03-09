/**
 * GPU Shader graph builder for custom visual effects
 * Generates GLSL fragment shaders from a simple DSL
 */
export declare class ShaderBuilder {
    private uniforms;
    private functions;
    private mainBody;
    private varyings;
    /**
     * Add uniform variable
     */
    addUniform(name: string, type: 'float' | 'vec2' | 'vec3' | 'vec4' | 'sampler2D', value: any): this;
    /**
     * Add Perlin/Simplex noise (built-in)
     */
    addNoise(scale?: number, speed?: number): this;
    /**
     * Add fractal Brownian motion (fBm)
     */
    addFractalNoise(octaves?: number, persistence?: number): this;
    /**
     * Add color gradient
     */
    addGradient(colors: string[], useNoise?: boolean): this;
    /**
     * Add glow/bloom effect
     */
    addGlow(intensity?: number, radius?: number): this;
    /**
     * Add wave distortion
     */
    addWaves(frequency?: number, amplitude?: number, speed?: number): this;
    /**
     * Add Voronoi pattern
     */
    addVoronoi(scale?: number): this;
    /**
     * Add radial gradient
     */
    addRadialGradient(innerColor: string, outerColor: string): this;
    /**
     * Add time-based animation
     */
    addAnimation(pattern: 'spin' | 'pulse' | 'wave' | 'bounce', speed?: number): this;
    /**
     * Add color adjustment
     */
    addColorCorrection(brightness?: number, saturation?: number, contrast?: number): this;
    /**
     * Build complete shader
     */
    build(): {
        vertex: string;
        fragment: string;
        uniforms: Record<string, any>;
    };
    /**
     * Get GLSL code as string
     */
    toString(): string;
}
/**
 * Pre-built shader presets
 */
export declare const ShaderPresets: {
    /**
     * Animated noise field
     */
    noiseField: () => ShaderBuilder;
    /**
     * Plasma effect
     */
    plasma: () => ShaderBuilder;
    /**
     * Radio wave
     */
    radioWave: () => ShaderBuilder;
    /**
     * Voronoi cells
     */
    voronoi: () => ShaderBuilder;
    /**
     * Spinning galaxy
     */
    galaxy: () => ShaderBuilder;
    /**
     * Retro sunset
     */
    sunset: () => ShaderBuilder;
};
//# sourceMappingURL=ShaderBuilder.d.ts.map