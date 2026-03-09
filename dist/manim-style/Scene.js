// src/manim-style/Scene.ts
/**
 * Manim-style simple animation scene
 * High-level API for creating animations with minimal boilerplate
 */
import { Scene as CoreScene } from '../core/Scene.js';
import { Timeline } from '../core/Timeline.js';
import { Circle as CircleShape } from '../shapes/Circle.js';
import { Rect as RectShape } from '../shapes/Rect.js';
import { Text as TextShape } from '../shapes/Text.js';
/**
 * Manim-style scene wrapper
 */
export class ManimScene {
    scene;
    timeline;
    currentTime = 0;
    objects = new Map();
    objectCounter = 0;
    constructor(config) {
        this.scene = new CoreScene(config);
        this.timeline = new Timeline();
    }
    /**
     * Add objects to scene
     */
    add(...objects) {
        for (const obj of objects) {
            this.scene.add(obj);
            const id = `obj_${this.objectCounter++}`;
            this.objects.set(id, obj);
        }
        return this;
    }
    /**
     * Play animation (simple wrapper)
     */
    play(animation, options) {
        const duration = options?.duration ?? 1;
        const delay = options?.delay ?? 0;
        // Since animation is just a config object (not an Animation instance),
        // we'll just track the timing for now
        this.currentTime += delay + duration;
        return this;
    }
    /**
     * Wait
     */
    wait(duration = 1) {
        this.currentTime += duration;
        return this;
    }
    /**
     * Remove objects
     */
    remove(...objects) {
        for (const obj of objects) {
            this.scene.remove(obj);
        }
        return this;
    }
    /**
     * Get scene
     */
    getScene() {
        return this.scene;
    }
    /**
     * Get timeline
     */
    getTimeline() {
        return this.timeline;
    }
    /**
     * Get current time
     */
    getCurrentTime() {
        return this.currentTime;
    }
    /**
     * Set time
     */
    setTime(time) {
        this.currentTime = time;
        return this;
    }
    /**
     * Get objects
     */
    getObjects() {
        return Array.from(this.objects.values());
    }
    /**
     * Clear scene
     */
    clear() {
        for (const obj of this.objects.values()) {
            this.scene.remove(obj);
        }
        this.objects.clear();
        return this;
    }
}
/**
 * Create circle (simple wrapper)
 */
export function Circle(config) {
    const config_ = {
        x: config?.center?.[0] ?? 0,
        y: config?.center?.[1] ?? 0,
        radius: config?.radius ?? 50,
        fill: config?.color ?? '#ffffff',
        stroke: config?.stroke ?? 'none',
        strokeWidth: config?.strokeWidth ?? 0
    };
    return new CircleShape(config_);
}
/**
 * Create rectangle
 */
export function Rect(config) {
    const config_ = {
        x: config?.center?.[0] ?? 0,
        y: config?.center?.[1] ?? 0,
        width: config?.width ?? 100,
        height: config?.height ?? 50,
        fill: config?.color ?? '#ffffff',
        stroke: config?.stroke ?? 'none',
        strokeWidth: config?.strokeWidth ?? 0
    };
    return new RectShape(config_);
}
/**
 * Create text
 */
export function SimpleText(content, config) {
    const config_ = {
        text: content,
        x: config?.center?.[0] ?? 0,
        y: config?.center?.[1] ?? 0,
        fontSize: config?.fontSize ?? 24,
        fontFamily: config?.fontFamily ?? 'Arial',
        fill: config?.color ?? '#ffffff'
    };
    return new TextShape(config_);
}
/**
 * Simple animation helpers (return animation configs)
 */
export function FadeInAnim(config) {
    return { type: 'fadeIn', duration: config?.duration ?? 1 };
}
export function FadeOutAnim(config) {
    return { type: 'fadeOut', duration: config?.duration ?? 1 };
}
export function RotateAnim(config) {
    return { type: 'rotate', angle: config.angle, duration: config.duration ?? 1 };
}
export function ScaleAnim(config) {
    return { type: 'scale', scale: config.scale, duration: config.duration ?? 1 };
}
export function MoveAnim(config) {
    return {
        type: 'move',
        from: config.from,
        to: config.to,
        duration: config.duration ?? 1
    };
}
//# sourceMappingURL=Scene.js.map