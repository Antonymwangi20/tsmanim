// src/effects/ParticleSystem.ts
import { Node } from '../core/Node.js';
import { Vector2 } from '../utils/Vector2.js';
/**
 * High-performance particle system with CPU simulation
 * Ready for GPU acceleration via WebGPU in future versions
 * Supports multiple emitters, force fields, and collision detection
 */
export class ParticleSystem extends Node {
    particles = [];
    emitters = [];
    forces = [];
    maxParticles;
    time = 0;
    // Pre-allocated for performance
    particlePool = [];
    constructor(maxParticles = 10000) {
        super();
        this.maxParticles = maxParticles;
        this.initializePool();
    }
    initializePool() {
        for (let i = 0; i < this.maxParticles; i++) {
            this.particlePool.push({
                position: new Vector2(0, 0),
                velocity: new Vector2(0, 0),
                acceleration: new Vector2(0, 0),
                life: 1,
                maxLife: 1,
                size: 5,
                color: '#ffffff',
                opacity: 1,
                rotation: 0
            });
        }
    }
    /**
     * Add particle emitter
     */
    addEmitter(config) {
        this.emitters.push({
            position: config.position,
            rate: config.rate,
            burst: config.burst ?? 0,
            direction: config.direction ?? new Vector2(0, -1),
            spread: config.spread ?? 0.5,
            speed: config.speed ?? 100,
            speedVariance: config.speedVariance ?? 0,
            size: config.size ?? 5,
            sizeVariance: config.sizeVariance ?? 0,
            color: config.color ?? '#ffffff',
            lifespan: config.lifespan ?? 2,
            rotation: config.rotation ?? 0
        });
    }
    /**
     * Add force field affecting particles
     */
    addForce(force) {
        this.forces.push(force);
    }
    /**
     * Clear all particles
     */
    clear() {
        this.particles = [];
    }
    /**
     * Get current particle count
     */
    getParticleCount() {
        return this.particles.length;
    }
    /**
     * Update particle simulation
     */
    update(deltaTime = 1 / 60) {
        this.time += deltaTime;
        // Cap delta time to prevent simulation spikes
        deltaTime = Math.min(deltaTime, 0.05);
        // Emit new particles
        for (const emitter of this.emitters) {
            const count = Math.floor(emitter.rate * deltaTime) + (emitter.burst ?? 0);
            for (let i = 0; i < count && this.particles.length < this.maxParticles; i++) {
                this.spawnParticle(emitter);
            }
            if (emitter.burst)
                emitter.burst = 0;
        }
        // Update existing particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            // Apply forces
            this.applyForces(p, deltaTime);
            // Update physics
            p.velocity = p.velocity.add(p.acceleration.mul(deltaTime));
            p.position = p.position.add(p.velocity.mul(deltaTime));
            // Life decay
            p.life -= deltaTime;
            p.opacity = Math.max(0, Math.min(1, p.life / p.maxLife));
            // Remove dead particles
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
    /**
     * Apply force fields to particle
     */
    applyForces(particle, deltaTime) {
        for (const force of this.forces) {
            switch (force.type) {
                case 'gravity':
                    particle.acceleration.y += force.strength * deltaTime;
                    break;
                case 'wind':
                    particle.acceleration.x += force.strength * deltaTime;
                    break;
                case 'attraction':
                    if (force.position) {
                        const dir = force.position.sub(particle.position);
                        const distSq = dir.x * dir.x + dir.y * dir.y;
                        const dist = Math.sqrt(distSq);
                        if (dist > 1) {
                            const forceMagnitude = force.strength / Math.max(1, distSq);
                            const forceVec = dir.mul(forceMagnitude / dist);
                            particle.acceleration = particle.acceleration.add(forceVec);
                        }
                    }
                    break;
                case 'vortex':
                    if (force.position) {
                        const toParticle = particle.position.sub(force.position);
                        const dist = Math.sqrt(toParticle.x * toParticle.x + toParticle.y * toParticle.y);
                        if (dist > 1 && dist < (force.radius ?? 200)) {
                            // Tangential force (perpendicular to direction)
                            const tangent = new Vector2(-toParticle.y, toParticle.x).mul(1 / dist);
                            const forceMagnitude = force.strength / Math.max(1, dist);
                            particle.acceleration = particle.acceleration.add(tangent.mul(forceMagnitude));
                        }
                    }
                    break;
                case 'turbulence':
                    // Simple Perlin-like noise using sine waves
                    const noiseX = Math.sin(particle.position.x * 0.01 + this.time) * force.strength;
                    const noiseY = Math.cos(particle.position.y * 0.01 + this.time) * force.strength;
                    particle.acceleration = particle.acceleration.add(new Vector2(noiseX, noiseY));
                    break;
            }
        }
    }
    /**
     * Spawn particle from emitter
     */
    spawnParticle(emitter) {
        // Calculate random direction with spread
        const angle = (Math.random() - 0.5) * (emitter.spread ?? 0.5);
        const dirVector = this.rotateVector(emitter.direction ?? new Vector2(0, -1), angle);
        // Apply speed with variance
        const speed = (emitter.speed ?? 100) * (1 + (Math.random() - 0.5) * (emitter.speedVariance ?? 0));
        const velocity = dirVector.mul(speed);
        // Create particle
        const particle = {
            position: emitter.position.clone(),
            velocity,
            acceleration: new Vector2(0, 0),
            life: emitter.lifespan ?? 2,
            maxLife: emitter.lifespan ?? 2,
            size: (emitter.size ?? 5) * (1 + (Math.random() - 0.5) * (emitter.sizeVariance ?? 0)),
            color: emitter.color ?? '#ffffff',
            opacity: 1,
            rotation: (emitter.rotation ?? 0) + (Math.random() - 0.5) * Math.PI
        };
        this.particles.push(particle);
    }
    /**
     * Rotate vector by angle (radians)
     */
    rotateVector(v, angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return new Vector2(v.x * cos - v.y * sin, v.x * sin + v.y * cos);
    }
    /**
     * Render particles to canvas
     */
    render(ctx) {
        if (this.particles.length === 0)
            return;
        ctx.save();
        // Sort particles by color for batch rendering efficiency
        const sorted = [...this.particles].sort((a, b) => a.color.localeCompare(b.color));
        // Render particles
        for (const p of sorted) {
            ctx.save();
            ctx.globalAlpha = p.opacity;
            ctx.fillStyle = p.color;
            ctx.strokeStyle = p.color;
            // Transform by rotation
            if (p.rotation !== 0) {
                ctx.translate(p.position.x, p.position.y);
                ctx.rotate(p.rotation);
                ctx.translate(-p.position.x, -p.position.y);
            }
            // Draw particle
            if (p.size < 2) {
                // Point for very small particles
                ctx.beginPath();
                ctx.arc(p.position.x, p.position.y, Math.max(0.5, p.size), 0, Math.PI * 2);
                ctx.fill();
            }
            else {
                // Circle with outline for visibility
                ctx.beginPath();
                ctx.arc(p.position.x, p.position.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            }
            ctx.restore();
        }
        ctx.restore();
    }
    /**
     * Get bounding box for culling
     */
    getBounds() {
        if (this.particles.length === 0) {
            return { x: 0, y: 0, width: 0, height: 0 };
        }
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (const p of this.particles) {
            minX = Math.min(minX, p.position.x - p.size);
            minY = Math.min(minY, p.position.y - p.size);
            maxX = Math.max(maxX, p.position.x + p.size);
            maxY = Math.max(maxY, p.position.y + p.size);
        }
        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY
        };
    }
    /**
     * Get statistics about particle system
     */
    getStats() {
        return {
            particleCount: this.particles.length,
            emitterCount: this.emitters.length,
            forceCount: this.forces.length,
            memoryUsage: this.particles.length * 96 // Approximate bytes per particle
        };
    }
    /**
     * Serialize particle system state
     */
    serialize() {
        return {
            particles: this.particles.map(p => ({
                position: { x: p.position.x, y: p.position.y },
                velocity: { x: p.velocity.x, y: p.velocity.y },
                life: p.life,
                maxLife: p.maxLife,
                size: p.size,
                color: p.color,
                opacity: p.opacity
            })),
            emitters: this.emitters,
            forces: this.forces
        };
    }
}
//# sourceMappingURL=ParticleSystem.js.map