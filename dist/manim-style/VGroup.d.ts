/**
 * VGroup - Vector Group for grouping multiple objects
 */
import { Node } from '../core/Node.js';
import type { Vector2 } from './Utilities.js';
/**
 * Group of objects that can be manipulated as a single unit
 */
export declare class VGroup {
    private objects;
    private center;
    constructor(...objects: Node[]);
    /**
     * Add objects to group
     */
    add(...objects: Node[]): this;
    /**
     * Remove objects from group
     */
    remove(...objects: Node[]): this;
    /**
     * Get all objects in group
     */
    getObjects(): Node[];
    /**
     * Get number of objects
     */
    length(): number;
    /**
     * Get object by index
     */
    at(index: number): Node | undefined;
    /**
     * Update center position
     */
    private updateCenter;
    /**
     * Get center
     */
    getCenter(): Vector2;
    /**
     * Arrange objects in a line horizontally
     */
    arrangeHorizontal(spacing?: number): this;
    /**
     * Arrange objects in a line vertically
     */
    arrangeVertical(spacing?: number): this;
    /**
     * Arrange objects in a circle
     */
    arrangeInCircle(radius?: number): this;
    /**
     * Arrange objects in a grid
     */
    arrangeInGrid(cols: number, spacing?: number): this;
    /**
     * Scale all objects
     */
    scale(factor: number): this;
    /**
     * Rotate all objects around group center
     */
    rotate(angle: number): this;
    /**
     * Move all objects
     */
    move(offset: Vector2): this;
    /**
     * Set opacity for all objects
     */
    setOpacity(opacity: number): this;
    /**
     * Set color for all objects
     */
    setColor(color: string): this;
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
    };
}
/**
 * Create a group from multiple objects
 */
export declare function createGroup(...objects: Node[]): VGroup;
//# sourceMappingURL=VGroup.d.ts.map