/**
 * GPU compute shader system using WebGPU for high-performance particle
 * and animation calculations. Provides 10-100x speedup over CPU.
 *
 * Note: This is a polyfill/abstraction layer. In browser, uses actual WebGPU.
 * In Node.js environment, provides fallback documentation/interfaces.
 */
export interface GPUBuffer {
    buffer: any;
    size: number;
}
export interface ComputeConfig {
    workgroupSize: number;
    particleCount: number;
}
/**
 * GPU compute engine for parallel processing
 * Supports particle simulation, keyframe interpolation,
 * and other parallelizable animation tasks
 */
export declare class GPUCompute {
    private device;
    private queue;
    private adapter;
    private isAvailable;
    private particleBuffer;
    private forceBuffer;
    private computePipeline;
    /**
     * Initialize GPU device
     */
    init(): Promise<boolean>;
    /**
     * Check if GPU is available
     */
    isGPUAvailable(): boolean;
    /**
     * Create compute pipeline for particle simulation
     */
    createParticleSimulationPipeline(particleCount: number): Promise<boolean>;
    /**
     * Upload particle data to GPU
     */
    uploadParticles(particles: any[]): boolean;
    /**
     * Upload forces to GPU
     */
    uploadForces(forces: any[]): boolean;
    /**
     * Run compute shader
     */
    compute(deltaTime: number, forceCount: number): Promise<boolean>;
    /**
     * Read particle data back from GPU
     */
    readParticles(): Promise<Float32Array | null>;
    /**
     * Clean up GPU resources
     */
    dispose(): void;
}
export declare const createGPUCompute: () => Promise<GPUCompute | null>;
//# sourceMappingURL=GPUCompute.d.ts.map