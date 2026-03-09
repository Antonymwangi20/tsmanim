// src/core/Scene.ts
import { Node } from './Node.js';
import { Timeline } from './Timeline.js';
import { Animation } from './Animation.js';

export interface SceneConfig {
  width?: number;
  height?: number;
  fps?: number;
  backgroundColor?: string;
}

export class Scene {
  root: Node;
  timeline: Timeline;
  width: number;
  height: number;
  fps: number;
  backgroundColor: string;
  duration: number = 0;

  constructor(config: SceneConfig = {}) {
    this.width = config.width ?? 1920;
    this.height = config.height ?? 1080;
    this.fps = config.fps ?? 60;
    this.backgroundColor = config.backgroundColor ?? '#000000';
    this.root = new Group(); // Root container
    this.timeline = new Timeline();
  }

  add(node: Node): void {
    this.root.add(node);
  }

  remove(node: Node): void {
    this.root.remove(node);
  }

  play(animation: Animation, config?: { duration?: number; easing?: any }): void {
    if (config?.duration) {
      animation.duration = config.duration;
    }
    if (config?.easing) {
      animation.easing = config.easing;
    }
    this.timeline.add(animation);
    this.updateDuration();
  }

  playConcurrent(animation: Animation, config?: { duration?: number }): void {
    if (config?.duration) {
      animation.duration = config.duration;
    }
    this.timeline.addConcurrent(animation);
    this.updateDuration();
  }

  wait(duration: number): void {
    this.timeline.wait(duration);
    this.updateDuration();
  }

  private updateDuration(): void {
    this.duration = this.timeline.getTotalDuration();
  }

  update(time: number): void {
    this.timeline.update(time);
    this.root.update(time);
  }

  render(ctx: any): void {
    // Clear canvas
    ctx.save();
    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.restore();

    // Render scene graph
    this.renderNode(ctx, this.root);
  }

  private renderNode(ctx: any, node: Node): void {
    if (!node.visible || node.opacity <= 0) return;

    ctx.save();
    
    // Apply transforms
    const pos = node.getGlobalPosition();
    ctx.translate(pos.x, pos.y);
    ctx.rotate(node.rotation);
    ctx.scale(node.scale.x, node.scale.y);
    ctx.globalAlpha = node.opacity;

    // Render node
    node.render(ctx);

    // Render children
    for (const child of node.children) {
      this.renderNode(ctx, child);
    }

    ctx.restore();
  }

  getTotalFrames(): number {
    return Math.ceil(this.duration * this.fps);
  }

  getFrameTime(frameIndex: number): number {
    return frameIndex / this.fps;
  }
}

// Simple Group node for root container
class Group extends Node {
  render(_ctx: any): void {
    // Group doesn't render itself, only children
  }

  getBounds() {
    return { x: 0, y: 0, width: 0, height: 0 };
  }
}