/**
 * Extended scene types for advanced animations
 */

import { ManimScene } from './Scene.js';
import type { Vector2 } from './Utilities.js';

/**
 * Scene with movable camera
 */
export class MovingCameraScene extends ManimScene {
  private cameraX: number = 0;
  private cameraY: number = 0;
  private cameraZoom: number = 1;

  /**
   * Pan camera to point
   */
  panToPoint(point: Vector2, duration: number = 1): this {
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
  zoomCamera(factor: number, duration: number = 1): this {
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
  followObject(objectId: string, duration: number = 1): this {
    this.play({
      type: 'cameraFollow',
      objectId,
      duration
    });
    return this;
  }

  getCameraPosition(): Vector2 {
    return [this.cameraX, this.cameraY];
  }

  getCameraZoom(): number {
    return this.cameraZoom;
  }
}

/**
 * Scene with 3D support
 */
export class ThreeDScene extends ManimScene {
  private theta: number = 0;
  private phi: number = 0;
  private distance: number = 12;

  /**
   * Set 3D rotation angles
   */
  setTheta(theta: number): this {
    this.theta = theta;
    return this;
  }

  /**
   * Set 3D phi angle
   */
  setPhi(phi: number): this {
    this.phi = phi;
    return this;
  }

  /**
   * Set camera distance
   */
  setCameraDistance(distance: number): this {
    this.distance = distance;
    return this;
  }

  getTheta(): number {
    return this.theta;
  }

  getPhi(): number {
    return this.phi;
  }

  getDistance(): number {
    return this.distance;
  }

  /**
   * Rotate camera in 3D space
   */
  rotateCameraTheta(angle: number, duration: number = 1): this {
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
  rotateCameraPhi(angle: number, duration: number = 1): this {
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
  private zoomLevel: number = 1;
  private zoomCenter: Vector2 = [0, 0];

  /**
   * Apply zoom effect
   */
  setZoom(level: number, center: Vector2 = [0, 0]): this {
    this.zoomLevel = level;
    this.zoomCenter = center;
    return this;
  }

  /**
   * Zoom into point
   */
  zoomIntoPoint(point: Vector2, factor: number = 2, duration: number = 1): this {
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

  getZoomLevel(): number {
    return this.zoomLevel;
  }

  getZoomCenter(): Vector2 {
    return this.zoomCenter;
  }
}

/**
 * Scene specialized for vector transformations
 */
export class LinearTransformationScene extends ManimScene {
  private transformMatrix: number[][] = [
    [1, 0],
    [0, 1]
  ];

  /**
   * Apply linear transformation
   */
  applyMatrix(matrix: number[][], duration: number = 1): this {
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
  showBasisVectors(): this {
    return this;
  }

  getTransformMatrix(): number[][] {
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
  showVectorAddition(v1: Vector2, v2: Vector2, duration: number = 1): this {
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
  showDotProduct(v1: Vector2, v2: Vector2, duration: number = 1): this {
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
  showCrossProduct(v1: Vector2, v2: Vector2, duration: number = 1): this {
    this.play({
      type: 'crossProduct',
      v1,
      v2,
      duration
    });
    return this;
  }
}
