// src/animations/physics/Spring.ts
import { Animation } from '../../core/Animation.js';
import { Vector2 } from '../../utils/Vector2.js';
export class SpringPhysics {
    mass;
    stiffness;
    damping;
    velocity;
    position;
    constructor(config = {}) {
        this.mass = config.mass ?? 1;
        this.stiffness = config.stiffness ?? 100;
        this.damping = config.damping ?? 10;
        this.velocity = config.initialVelocity ?? 0;
        this.position = 0;
    }
    update(deltaTime, target) {
        const displacement = this.position - target;
        const springForce = -this.stiffness * displacement;
        const dampingForce = -this.damping * this.velocity;
        const acceleration = (springForce + dampingForce) / this.mass;
        this.velocity += acceleration * deltaTime;
        this.position += this.velocity * deltaTime;
        return this.position;
    }
    isAtRest(threshold = 0.01) {
        return Math.abs(this.velocity) < threshold && Math.abs(this.position) < threshold;
    }
    estimateDuration() {
        const dampingRatio = this.damping / (2 * Math.sqrt(this.stiffness * this.mass));
        if (dampingRatio >= 1)
            return 1;
        return 3 / (dampingRatio * Math.sqrt(this.stiffness / this.mass));
    }
    getState() {
        return { position: this.position, velocity: this.velocity };
    }
    reset() {
        this.position = 0;
        this.velocity = 0;
    }
}
export class SpringAnimation extends Animation {
    spring;
    startValue = 0;
    targetValue;
    property;
    lastFrameTime = 0;
    constructor(target, property, targetValue, springConfig) {
        super(target, { duration: 0 });
        this.spring = new SpringPhysics(springConfig);
        this.property = property;
        this.targetValue = targetValue;
        this.duration = this.spring.estimateDuration();
    }
    setStartTime(time) {
        super.setStartTime(time);
        this.startValue = this.getCurrentValue();
        this.lastFrameTime = time;
        this.spring.reset();
    }
    getCurrentValue() {
        switch (this.property) {
            case 'scale': return this.target.scale.x;
            case 'rotation': return this.target.rotation;
            case 'opacity': return this.target.opacity;
        }
    }
    update(time) {
        const deltaTime = (time - this.lastFrameTime) / 1000;
        this.lastFrameTime = time;
        const dt = Math.min(deltaTime, 0.05);
        const value = this.startValue + this.spring.update(dt, this.targetValue - this.startValue);
        switch (this.property) {
            case 'scale':
                this.target.scale = new Vector2(value, value);
                break;
            case 'rotation':
                this.target.rotation = value;
                break;
            case 'opacity':
                this.target.opacity = Math.max(0, Math.min(1, value));
                break;
        }
        if (this.spring.isAtRest()) {
            this.isComplete = true;
        }
    }
    reverse() {
        return new SpringAnimation(this.target, this.property, this.startValue, {
            mass: this.spring.getState().mass || 1
        });
    }
}
export const SpringPresets = {
    bouncy: { mass: 0.5, stiffness: 200, damping: 12 },
    smooth: { mass: 1, stiffness: 100, damping: 10 },
    gentle: { mass: 2, stiffness: 50, damping: 15 },
    crisp: { mass: 1, stiffness: 300, damping: 30 }
};
//# sourceMappingURL=Spring.js.map