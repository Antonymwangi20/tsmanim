// src/core/Scene.ts
import { Node } from './Node.js';
import { Timeline } from './Timeline.js';
export class Scene {
    root;
    timeline;
    width;
    height;
    fps;
    backgroundColor;
    duration = 0;
    constructor(config = {}) {
        this.width = config.width ?? 1920;
        this.height = config.height ?? 1080;
        this.fps = config.fps ?? 60;
        this.backgroundColor = config.backgroundColor ?? '#000000';
        this.root = new Group(); // Root container
        this.timeline = new Timeline();
    }
    add(node) {
        this.root.add(node);
    }
    remove(node) {
        this.root.remove(node);
    }
    play(animation, config) {
        if (config?.duration) {
            animation.duration = config.duration;
        }
        if (config?.easing) {
            animation.easing = config.easing;
        }
        this.timeline.add(animation);
        this.updateDuration();
    }
    playConcurrent(animation, config) {
        if (config?.duration) {
            animation.duration = config.duration;
        }
        this.timeline.addConcurrent(animation);
        this.updateDuration();
    }
    wait(duration) {
        this.timeline.wait(duration);
        this.updateDuration();
    }
    updateDuration() {
        this.duration = this.timeline.getTotalDuration();
    }
    update(time) {
        this.timeline.update(time);
        this.root.update(time);
    }
    render(ctx) {
        // Clear canvas
        ctx.save();
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.restore();
        // Render scene graph
        this.renderNode(ctx, this.root);
    }
    renderNode(ctx, node) {
        if (!node.visible || node.opacity <= 0)
            return;
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
    getTotalFrames() {
        return Math.ceil(this.duration * this.fps);
    }
    getFrameTime(frameIndex) {
        return frameIndex / this.fps;
    }
}
// Simple Group node for root container
class Group extends Node {
    render(_ctx) {
        // Group doesn't render itself, only children
    }
    getBounds() {
        return { x: 0, y: 0, width: 0, height: 0 };
    }
}
//# sourceMappingURL=Scene.js.map