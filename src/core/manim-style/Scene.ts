// src/manim-style/Scene.ts
/**
 * Manim-style simple animation scene
 * High-level API for creating animations with minimal boilerplate
 */

import { Scene as CoreScene } from '../Scene.js';
import { Node } from '../Node.js';
import { Timeline } from '../Timeline.js';
import { Circle as CircleShape, CircleConfig } from '../shapes/Circle.js';
import { Rect as RectShape, RectConfig } from '../shapes/Rect.js';
import { Text as TextShape, TextConfig } from '../shapes/Text.js';

/**
 * Animation options
 */
export interface SimpleAnimationOptions {
  duration?: number;
  delay?: number;
  easing?: string;
}

/**
 * Manim-style scene wrapper
 */
export class ManimScene {
  private scene: CoreScene;
  private timeline: Timeline;
  private currentTime: number = 0;
  private objects: Map<string, Node> = new Map();
  private objectCounter: number = 0;

  constructor(config?: any) {
    this.scene = new CoreScene(config);
    this.timeline = new Timeline();
  }

  /**
   * Add objects to scene
   */
  add(...objects: Node[]): this {
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
  play(animation: any, options?: SimpleAnimationOptions): this {
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
  wait(duration: number = 1): this {
    this.currentTime += duration;
    return this;
  }

  /**
   * Remove objects
   */
  remove(...objects: Node[]): this {
    for (const obj of objects) {
      this.scene.remove(obj);
    }
    return this;
  }

  /**
   * Get scene
   */
  getScene(): CoreScene {
    return this.scene;
  }

  /**
   * Get timeline
   */
  getTimeline(): Timeline {
    return this.timeline;
  }

  /**
   * Get current time
   */
  getCurrentTime(): number {
    return this.currentTime;
  }

  /**
   * Set time
   */
  setTime(time: number): this {
    this.currentTime = time;
    return this;
  }

  /**
   * Get objects
   */
  getObjects(): Node[] {
    return Array.from(this.objects.values());
  }

  /**
   * Clear scene
   */
  clear(): this {
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
export function Circle(config?: any): CircleShape {
  const config_: CircleConfig = {
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
export function Rect(config?: any): RectShape {
  const config_: RectConfig = {
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
export function SimpleText(
  content: string,
  config?: any
): TextShape {
  const config_: TextConfig = {
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
export function FadeInAnim(config?: any): any {
  return { type: 'fadeIn', duration: config?.duration ?? 1 };
}

export function FadeOutAnim(config?: any): any {
  return { type: 'fadeOut', duration: config?.duration ?? 1 };
}

export function RotateAnim(config: any): any {
  return { type: 'rotate', angle: config.angle, duration: config.duration ?? 1 };
}

export function ScaleAnim(config: any): any {
  return { type: 'scale', scale: config.scale, duration: config.duration ?? 1 };
}

export function MoveAnim(config: any): any {
  return {
    type: 'move',
    from: config.from,
    to: config.to,
    duration: config.duration ?? 1
  };
}
