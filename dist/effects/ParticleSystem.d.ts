import { Node } from '../core/Node.js';
import { Vector2 } from '../utils/Vector2.js';
export interface Particle {
    position: Vector2;
    velocity: Vector2;
    acceleration: Vector2;
    life: number;
    maxLife: number;
    size: number;
    color: string;
    opacity: number;
    rotation: number;
}
export interface EmitterConfig {
    position: Vector2;
    rate: number;
    burst?: number;
    direction?: Vector2;
    spread?: number;
    speed?: number;
    speedVariance?: number;
    size?: number;
    sizeVariance?: number;
    color?: string;
    lifespan?: number;
    rotation?: number;
}
export interface ForceField {
    type: 'gravity' | 'wind' | 'attraction' | 'vortex' | 'turbulence';
    strength: number;
    position?: Vector2;
    radius?: number;
}
/**
 * High-performance particle system with CPU simulation
 * Ready for GPU acceleration via WebGPU in future versions
 * Supports multiple emitters, force fields, and collision detection
 */
export declare class ParticleSystem extends Node {
    private particles;
    private emitters;
    private forces;
    private maxParticles;
    private time;
    private particlePool;
    constructor(maxParticles?: number);
    private initializePool;
    /**
     * Add particle emitter
     */
    addEmitter(config: EmitterConfig): void;
    /**
     * Add force field affecting particles
     */
    addForce(force: ForceField): void;
    /**
     * Clear all particles
     */
    clear(): void;
    /**
     * Get current particle count
     */
    getParticleCount(): number;
    /**
     * Update particle simulation
     */
    update(deltaTime?: number): void;
    /**
     * Apply force fields to particle
     */
    private applyForces;
    /**
     * Spawn particle from emitter
     */
    private spawnParticle;
    /**
     * Rotate vector by angle (radians)
     */
    private rotateVector;
    /**
     * Render particles to canvas
     */
    render(ctx: any): void;
    /**
     * Get bounding box for culling
     */
    getBounds(): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    /**
     * Get statistics about particle system
     */
    getStats(): {
        particleCount: number;
        emitterCount: number;
        forceCount: number;
        memoryUsage: number;
    };
    /**
     * Serialize particle system state
     */
    serialize(): object;
}
//# sourceMappingURL=ParticleSystem.d.ts.map