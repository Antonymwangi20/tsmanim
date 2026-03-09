/**
 * VGroup - Vector Group for grouping multiple objects
 */

import { Node } from '../Node.js';
import type { Vector2 } from './Utilities.js';
import { findCenter, vectorAdd, vectorMult } from './Utilities.js';

/**
 * Group of objects that can be manipulated as a single unit
 */
export class VGroup {
  private objects: Node[] = [];
  private center: Vector2 = [0, 0];

  constructor(...objects: Node[]) {
    this.objects = objects;
    this.updateCenter();
  }

  /**
   * Add objects to group
   */
  add(...objects: Node[]): this {
    this.objects.push(...objects);
    this.updateCenter();
    return this;
  }

  /**
   * Remove objects from group
   */
  remove(...objects: Node[]): this {
    for (const obj of objects) {
      const index = this.objects.indexOf(obj);
      if (index > -1) {
        this.objects.splice(index, 1);
      }
    }
    this.updateCenter();
    return this;
  }

  /**
   * Get all objects in group
   */
  getObjects(): Node[] {
    return this.objects;
  }

  /**
   * Get number of objects
   */
  length(): number {
    return this.objects.length;
  }

  /**
   * Get object by index
   */
  at(index: number): Node | undefined {
    return this.objects[index];
  }

  /**
   * Update center position
   */
  private updateCenter(): void {
    if (this.objects.length === 0) {
      this.center = [0, 0];
      return;
    }

    // Calculate center from all objects (simplified - assumes objects have position property)
    let sumX = 0;
    let sumY = 0;
    for (const obj of this.objects) {
      // This is a simplified calculation - actual implementation would need proper position handling
      sumX += (obj as any).x ?? 0;
      sumY += (obj as any).y ?? 0;
    }
    this.center = [sumX / this.objects.length, sumY / this.objects.length];
  }

  /**
   * Get center
   */
  getCenter(): Vector2 {
    return this.center;
  }

  /**
   * Arrange objects in a line horizontally
   */
  arrangeHorizontal(spacing: number = 1): this {
    const totalWidth = (this.objects.length - 1) * spacing;
    const startX = this.center[0] - totalWidth / 2;

    for (let i = 0; i < this.objects.length; i++) {
      const obj = this.objects[i] as any;
      obj.x = startX + i * spacing;
      obj.y = this.center[1];
    }
    return this;
  }

  /**
   * Arrange objects in a line vertically
   */
  arrangeVertical(spacing: number = 1): this {
    const totalHeight = (this.objects.length - 1) * spacing;
    const startY = this.center[1] - totalHeight / 2;

    for (let i = 0; i < this.objects.length; i++) {
      const obj = this.objects[i] as any;
      obj.x = this.center[0];
      obj.y = startY + i * spacing;
    }
    return this;
  }

  /**
   * Arrange objects in a circle
   */
  arrangeInCircle(radius: number = 2): this {
    const angleStep = (2 * Math.PI) / this.objects.length;

    for (let i = 0; i < this.objects.length; i++) {
      const angle = i * angleStep;
      const obj = this.objects[i] as any;
      obj.x = this.center[0] + radius * Math.cos(angle);
      obj.y = this.center[1] + radius * Math.sin(angle);
    }
    return this;
  }

  /**
   * Arrange objects in a grid
   */
  arrangeInGrid(cols: number, spacing: number = 1): this {
    const rows = Math.ceil(this.objects.length / cols);
    const totalWidth = (cols - 1) * spacing;
    const totalHeight = (rows - 1) * spacing;
    const startX = this.center[0] - totalWidth / 2;
    const startY = this.center[1] - totalHeight / 2;

    for (let i = 0; i < this.objects.length; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const obj = this.objects[i] as any;
      obj.x = startX + col * spacing;
      obj.y = startY + row * spacing;
    }
    return this;
  }

  /**
   * Scale all objects
   */
  scale(factor: number): this {
    for (const obj of this.objects) {
      (obj as any).scale = ((obj as any).scale ?? 1) * factor;
    }
    return this;
  }

  /**
   * Rotate all objects around group center
   */
  rotate(angle: number): this {
    for (const obj of this.objects) {
      (obj as any).rotation = ((obj as any).rotation ?? 0) + angle;
    }
    return this;
  }

  /**
   * Move all objects
   */
  move(offset: Vector2): this {
    for (const obj of this.objects) {
      (obj as any).x = ((obj as any).x ?? 0) + offset[0];
      (obj as any).y = ((obj as any).y ?? 0) + offset[1];
    }
    this.center = vectorAdd(this.center, offset);
    return this;
  }

  /**
   * Set opacity for all objects
   */
  setOpacity(opacity: number): this {
    for (const obj of this.objects) {
      (obj as any).opacity = opacity;
    }
    return this;
  }

  /**
   * Set color for all objects
   */
  setColor(color: string): this {
    for (const obj of this.objects) {
      (obj as any).fill = color;
    }
    return this;
  }

  /**
   * Get bounding box
   */
  getBoundingBox(): {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    width: number;
    height: number;
  } {
    if (this.objects.length === 0) {
      return { minX: 0, maxX: 0, minY: 0, maxY: 0, width: 0, height: 0 };
    }

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    for (const obj of this.objects) {
      const x = (obj as any).x ?? 0;
      const y = (obj as any).y ?? 0;
      const radius = (obj as any).radius ?? 0;

      minX = Math.min(minX, x - radius);
      maxX = Math.max(maxX, x + radius);
      minY = Math.min(minY, y - radius);
      maxY = Math.max(maxY, y + radius);
    }

    return {
      minX,
      maxX,
      minY,
      maxY,
      width: maxX - minX,
      height: maxY - minY
    };
  }
}

/**
 * Create a group from multiple objects
 */
export function createGroup(...objects: Node[]): VGroup {
  return new VGroup(...objects);
}
