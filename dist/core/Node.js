// src/core/Node.ts
import { Vector2 } from '../utils/Vector2.js';
export class Node {
    position = new Vector2(0, 0);
    scale = new Vector2(1, 1);
    rotation = 0;
    opacity = 1;
    visible = true;
    children = [];
    parent = null;
    // Animation state tracking
    animationState = new Map();
    add(child) {
        child.parent = this;
        this.children.push(child);
    }
    remove(child) {
        const index = this.children.indexOf(child);
        if (index > -1) {
            child.parent = null;
            this.children.splice(index, 1);
        }
    }
    update(time) {
        if (!this.visible)
            return;
        for (const child of this.children) {
            child.update(time);
        }
    }
    getGlobalPosition() {
        if (this.parent) {
            return this.parent.getGlobalPosition().add(this.position);
        }
        return this.position.clone();
    }
    setAnimationState(key, value) {
        this.animationState.set(key, value);
    }
    getAnimationState(key) {
        return this.animationState.get(key);
    }
}
//# sourceMappingURL=Node.js.map