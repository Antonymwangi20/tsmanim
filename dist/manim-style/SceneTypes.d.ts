/**
 * Extended scene types for advanced animations
 */
import { ManimScene } from './Scene.js';
import type { Vector2 } from './Utilities.js';
/**
 * Scene with movable camera
 */
export declare class MovingCameraScene extends ManimScene {
    private cameraX;
    private cameraY;
    private cameraZoom;
    /**
     * Pan camera to point
     */
    panToPoint(point: Vector2, duration?: number): this;
    /**
     * Zoom camera
     */
    zoomCamera(factor: number, duration?: number): this;
    /**
     * Follow object
     */
    followObject(objectId: string, duration?: number): this;
    getCameraPosition(): Vector2;
    getCameraZoom(): number;
}
/**
 * Scene with 3D support
 */
export declare class ThreeDScene extends ManimScene {
    private theta;
    private phi;
    private distance;
    /**
     * Set 3D rotation angles
     */
    setTheta(theta: number): this;
    /**
     * Set 3D phi angle
     */
    setPhi(phi: number): this;
    /**
     * Set camera distance
     */
    setCameraDistance(distance: number): this;
    getTheta(): number;
    getPhi(): number;
    getDistance(): number;
    /**
     * Rotate camera in 3D space
     */
    rotateCameraTheta(angle: number, duration?: number): this;
    /**
     * Rotate camera phi angle
     */
    rotateCameraPhi(angle: number, duration?: number): this;
}
/**
 * Scene with zoom capability (magnifying glass effect)
 */
export declare class ZoomedScene extends ManimScene {
    private zoomLevel;
    private zoomCenter;
    /**
     * Apply zoom effect
     */
    setZoom(level: number, center?: Vector2): this;
    /**
     * Zoom into point
     */
    zoomIntoPoint(point: Vector2, factor?: number, duration?: number): this;
    getZoomLevel(): number;
    getZoomCenter(): Vector2;
}
/**
 * Scene specialized for vector transformations
 */
export declare class LinearTransformationScene extends ManimScene {
    private transformMatrix;
    /**
     * Apply linear transformation
     */
    applyMatrix(matrix: number[][], duration?: number): this;
    /**
     * Show basis vectors
     */
    showBasisVectors(): this;
    getTransformMatrix(): number[][];
}
/**
 * Scene for vector math demonstrations
 */
export declare class VectorScene extends ManimScene {
    /**
     * Show vector addition
     */
    showVectorAddition(v1: Vector2, v2: Vector2, duration?: number): this;
    /**
     * Show dot product
     */
    showDotProduct(v1: Vector2, v2: Vector2, duration?: number): this;
    /**
     * Show cross product (2D equivalent)
     */
    showCrossProduct(v1: Vector2, v2: Vector2, duration?: number): this;
}
//# sourceMappingURL=SceneTypes.d.ts.map