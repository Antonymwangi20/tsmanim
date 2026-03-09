/**
 * Camera controls for scene
 */
import type { Vector2 } from './Utilities.js';
export interface CameraConfig {
    x?: number;
    y?: number;
    zoom?: number;
    rotation?: number;
}
export declare class Camera {
    private position;
    private zoom;
    private rotation;
    constructor(config?: CameraConfig);
    /**
     * Pan camera
     */
    pan(offset: Vector2, duration?: number): any;
    /**
     * Zoom camera
     */
    zoom_in(factor?: number, duration?: number): any;
    /**
     * Zoom out
     */
    zoom_out(factor?: number, duration?: number): any;
    /**
     * Focus on point
     */
    focus(point: Vector2, duration?: number): any;
    /**
     * Rotate camera
     */
    rotate(angle: number, duration?: number): any;
    /**
     * Get position
     */
    getPosition(): Vector2;
    /**
     * Set position
     */
    setPosition(pos: Vector2): void;
    /**
     * Get zoom
     */
    getZoom(): number;
    /**
     * Set zoom
     */
    setZoom(z: number): void;
    /**
     * Get rotation
     */
    getRotation(): number;
    /**
     * Set rotation
     */
    setRotation(r: number): void;
}
//# sourceMappingURL=Camera.d.ts.map