// src/core/Node.ts
import { Vector2 } from './utils/Vector2.js';

export interface NodeConfig {
  position?: Vector2;
  scale?: Vector2;
  rotation?: number;
  opacity?: number;
  visible?: boolean;
}

export abstract class Node {
  position: Vector2 = new Vector2(0, 0);
  scale: Vector2 = new Vector2(1, 1);
  rotation: number = 0;
  opacity: number = 1;
  visible: boolean = true;
  children: Node[] = [];
  parent: Node | null = null;

  // Animation state tracking
  private animationState: Map<string, any> = new Map();

  add(child: Node): void {
    child.parent = this;
    this.children.push(child);
  }

  remove(child: Node): void {
    const index = this.children.indexOf(child);
    if (index > -1) {
      child.parent = null;
      this.children.splice(index, 1);
    }
  }

  update(time: number): void {
    if (!this.visible) return;
    
    for (const child of this.children) {
      child.update(time);
    }
  }

  abstract render(ctx: any): void;

  getGlobalPosition(): Vector2 {
    if (this.parent) {
      return this.parent.getGlobalPosition().add(this.position);
    }
    return this.position.clone();
  }

  setAnimationState(key: string, value: any): void {
    this.animationState.set(key, value);
  }

  getAnimationState(key: string): any {
    return this.animationState.get(key);
  }

  // Get bounding box for the node (used for camera calculations)
  abstract getBounds(): { x: number; y: number; width: number; height: number };
}