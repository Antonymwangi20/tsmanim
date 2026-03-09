/**
 * Extended scene types for advanced animations
 */
import { ManimScene } from './Scene.js';
/**
 * Scene with movable camera
 */
export class MovingCameraScene extends ManimScene {
    cameraX = 0;
    cameraY = 0;
    cameraZoom = 1;
    /**
     * Pan camera to point
     */
    panToPoint(point, duration = 1) {
        this.play({
            type: 'cameraPan',
            point,
            duration
        });
        this.cameraX = point[0];
        this.cameraY = point[1];
        return this;
    }
    /**
     * Zoom camera
     */
    zoomCamera(factor, duration = 1) {
        this.play({
            type: 'cameraZoom',
            factor,
            duration
        });
        this.cameraZoom *= factor;
        return this;
    }
    /**
     * Follow object
     */
    followObject(objectId, duration = 1) {
        this.play({
            type: 'cameraFollow',
            objectId,
            duration
        });
        return this;
    }
    getCameraPosition() {
        return [this.cameraX, this.cameraY];
    }
    getCameraZoom() {
        return this.cameraZoom;
    }
}
/**
 * Scene with 3D support
 */
export class ThreeDScene extends ManimScene {
    theta = 0;
    phi = 0;
    distance = 12;
    /**
     * Set 3D rotation angles
     */
    setTheta(theta) {
        this.theta = theta;
        return this;
    }
    /**
     * Set 3D phi angle
     */
    setPhi(phi) {
        this.phi = phi;
        return this;
    }
    /**
     * Set camera distance
     */
    setCameraDistance(distance) {
        this.distance = distance;
        return this;
    }
    getTheta() {
        return this.theta;
    }
    getPhi() {
        return this.phi;
    }
    getDistance() {
        return this.distance;
    }
    /**
     * Rotate camera in 3D space
     */
    rotateCameraTheta(angle, duration = 1) {
        this.play({
            type: 'rotate3D',
            axis: 'theta',
            angle,
            duration
        });
        this.theta += angle;
        return this;
    }
    /**
     * Rotate camera phi angle
     */
    rotateCameraPhi(angle, duration = 1) {
        this.play({
            type: 'rotate3D',
            axis: 'phi',
            angle,
            duration
        });
        this.phi += angle;
        return this;
    }
}
/**
 * Scene with zoom capability (magnifying glass effect)
 */
export class ZoomedScene extends ManimScene {
    zoomLevel = 1;
    zoomCenter = [0, 0];
    /**
     * Apply zoom effect
     */
    setZoom(level, center = [0, 0]) {
        this.zoomLevel = level;
        this.zoomCenter = center;
        return this;
    }
    /**
     * Zoom into point
     */
    zoomIntoPoint(point, factor = 2, duration = 1) {
        this.play({
            type: 'zoomInto',
            point,
            factor,
            duration
        });
        this.zoomLevel *= factor;
        this.zoomCenter = point;
        return this;
    }
    getZoomLevel() {
        return this.zoomLevel;
    }
    getZoomCenter() {
        return this.zoomCenter;
    }
}
/**
 * Scene specialized for vector transformations
 */
export class LinearTransformationScene extends ManimScene {
    transformMatrix = [
        [1, 0],
        [0, 1]
    ];
    /**
     * Apply linear transformation
     */
    applyMatrix(matrix, duration = 1) {
        this.play({
            type: 'applyMatrix',
            matrix,
            duration
        });
        this.transformMatrix = matrix;
        return this;
    }
    /**
     * Show basis vectors
     */
    showBasisVectors() {
        return this;
    }
    getTransformMatrix() {
        return this.transformMatrix;
    }
}
/**
 * Scene for vector math demonstrations
 */
export class VectorScene extends ManimScene {
    /**
     * Show vector addition
     */
    showVectorAddition(v1, v2, duration = 1) {
        this.play({
            type: 'vectorAdd',
            v1,
            v2,
            duration
        });
        return this;
    }
    /**
     * Show dot product
     */
    showDotProduct(v1, v2, duration = 1) {
        this.play({
            type: 'dotProduct',
            v1,
            v2,
            duration
        });
        return this;
    }
    /**
     * Show cross product (2D equivalent)
     */
    showCrossProduct(v1, v2, duration = 1) {
        this.play({
            type: 'crossProduct',
            v1,
            v2,
            duration
        });
        return this;
    }
}
//# sourceMappingURL=SceneTypes.js.map