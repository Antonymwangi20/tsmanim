/**
 * VGroup - Vector Group for grouping multiple objects
 */
import { vectorAdd } from './Utilities.js';
/**
 * Group of objects that can be manipulated as a single unit
 */
export class VGroup {
    objects = [];
    center = [0, 0];
    constructor(...objects) {
        this.objects = objects;
        this.updateCenter();
    }
    /**
     * Add objects to group
     */
    add(...objects) {
        this.objects.push(...objects);
        this.updateCenter();
        return this;
    }
    /**
     * Remove objects from group
     */
    remove(...objects) {
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
    getObjects() {
        return this.objects;
    }
    /**
     * Get number of objects
     */
    length() {
        return this.objects.length;
    }
    /**
     * Get object by index
     */
    at(index) {
        return this.objects[index];
    }
    /**
     * Update center position
     */
    updateCenter() {
        if (this.objects.length === 0) {
            this.center = [0, 0];
            return;
        }
        // Calculate center from all objects (simplified - assumes objects have position property)
        let sumX = 0;
        let sumY = 0;
        for (const obj of this.objects) {
            // This is a simplified calculation - actual implementation would need proper position handling
            sumX += obj.x ?? 0;
            sumY += obj.y ?? 0;
        }
        this.center = [sumX / this.objects.length, sumY / this.objects.length];
    }
    /**
     * Get center
     */
    getCenter() {
        return this.center;
    }
    /**
     * Arrange objects in a line horizontally
     */
    arrangeHorizontal(spacing = 1) {
        const totalWidth = (this.objects.length - 1) * spacing;
        const startX = this.center[0] - totalWidth / 2;
        for (let i = 0; i < this.objects.length; i++) {
            const obj = this.objects[i];
            obj.x = startX + i * spacing;
            obj.y = this.center[1];
        }
        return this;
    }
    /**
     * Arrange objects in a line vertically
     */
    arrangeVertical(spacing = 1) {
        const totalHeight = (this.objects.length - 1) * spacing;
        const startY = this.center[1] - totalHeight / 2;
        for (let i = 0; i < this.objects.length; i++) {
            const obj = this.objects[i];
            obj.x = this.center[0];
            obj.y = startY + i * spacing;
        }
        return this;
    }
    /**
     * Arrange objects in a circle
     */
    arrangeInCircle(radius = 2) {
        const angleStep = (2 * Math.PI) / this.objects.length;
        for (let i = 0; i < this.objects.length; i++) {
            const angle = i * angleStep;
            const obj = this.objects[i];
            obj.x = this.center[0] + radius * Math.cos(angle);
            obj.y = this.center[1] + radius * Math.sin(angle);
        }
        return this;
    }
    /**
     * Arrange objects in a grid
     */
    arrangeInGrid(cols, spacing = 1) {
        const rows = Math.ceil(this.objects.length / cols);
        const totalWidth = (cols - 1) * spacing;
        const totalHeight = (rows - 1) * spacing;
        const startX = this.center[0] - totalWidth / 2;
        const startY = this.center[1] - totalHeight / 2;
        for (let i = 0; i < this.objects.length; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const obj = this.objects[i];
            obj.x = startX + col * spacing;
            obj.y = startY + row * spacing;
        }
        return this;
    }
    /**
     * Scale all objects
     */
    scale(factor) {
        for (const obj of this.objects) {
            obj.scale = (obj.scale ?? 1) * factor;
        }
        return this;
    }
    /**
     * Rotate all objects around group center
     */
    rotate(angle) {
        for (const obj of this.objects) {
            obj.rotation = (obj.rotation ?? 0) + angle;
        }
        return this;
    }
    /**
     * Move all objects
     */
    move(offset) {
        for (const obj of this.objects) {
            obj.x = (obj.x ?? 0) + offset[0];
            obj.y = (obj.y ?? 0) + offset[1];
        }
        this.center = vectorAdd(this.center, offset);
        return this;
    }
    /**
     * Set opacity for all objects
     */
    setOpacity(opacity) {
        for (const obj of this.objects) {
            obj.opacity = opacity;
        }
        return this;
    }
    /**
     * Set color for all objects
     */
    setColor(color) {
        for (const obj of this.objects) {
            obj.fill = color;
        }
        return this;
    }
    /**
     * Get bounding box
     */
    getBoundingBox() {
        if (this.objects.length === 0) {
            return { minX: 0, maxX: 0, minY: 0, maxY: 0, width: 0, height: 0 };
        }
        let minX = Infinity;
        let maxX = -Infinity;
        let minY = Infinity;
        let maxY = -Infinity;
        for (const obj of this.objects) {
            const x = obj.x ?? 0;
            const y = obj.y ?? 0;
            const radius = obj.radius ?? 0;
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
export function createGroup(...objects) {
    return new VGroup(...objects);
}
//# sourceMappingURL=VGroup.js.map