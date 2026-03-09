/**
 * Camera controls for scene
 */
export class Camera {
    position = [0, 0];
    zoom = 1;
    rotation = 0;
    constructor(config) {
        if (config?.x !== undefined)
            this.position[0] = config.x;
        if (config?.y !== undefined)
            this.position[1] = config.y;
        if (config?.zoom !== undefined)
            this.zoom = config.zoom;
        if (config?.rotation !== undefined)
            this.rotation = config.rotation;
    }
    /**
     * Pan camera
     */
    pan(offset, duration = 1) {
        return {
            type: 'cameraPan',
            offset,
            duration
        };
    }
    /**
     * Zoom camera
     */
    zoom_in(factor = 1.5, duration = 1) {
        return {
            type: 'cameraZoom',
            factor,
            duration
        };
    }
    /**
     * Zoom out
     */
    zoom_out(factor = 1.5, duration = 1) {
        return {
            type: 'cameraZoom',
            factor: 1 / factor,
            duration
        };
    }
    /**
     * Focus on point
     */
    focus(point, duration = 1) {
        return {
            type: 'cameraFocus',
            point,
            duration
        };
    }
    /**
     * Rotate camera
     */
    rotate(angle, duration = 1) {
        return {
            type: 'cameraRotate',
            angle,
            duration
        };
    }
    /**
     * Get position
     */
    getPosition() {
        return [...this.position];
    }
    /**
     * Set position
     */
    setPosition(pos) {
        this.position = [...pos];
    }
    /**
     * Get zoom
     */
    getZoom() {
        return this.zoom;
    }
    /**
     * Set zoom
     */
    setZoom(z) {
        this.zoom = z;
    }
    /**
     * Get rotation
     */
    getRotation() {
        return this.rotation;
    }
    /**
     * Set rotation
     */
    setRotation(r) {
        this.rotation = r;
    }
}
//# sourceMappingURL=Camera.js.map