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

export class Camera {
  private position: Vector2 = [0, 0];
  private zoom: number = 1;
  private rotation: number = 0;

  constructor(config?: CameraConfig) {
    if (config?.x !== undefined) this.position[0] = config.x;
    if (config?.y !== undefined) this.position[1] = config.y;
    if (config?.zoom !== undefined) this.zoom = config.zoom;
    if (config?.rotation !== undefined) this.rotation = config.rotation;
  }

  /**
   * Pan camera
   */
  pan(offset: Vector2, duration: number = 1): any {
    return {
      type: 'cameraPan',
      offset,
      duration
    };
  }

  /**
   * Zoom camera
   */
  zoom_in(factor: number = 1.5, duration: number = 1): any {
    return {
      type: 'cameraZoom',
      factor,
      duration
    };
  }

  /**
   * Zoom out
   */
  zoom_out(factor: number = 1.5, duration: number = 1): any {
    return {
      type: 'cameraZoom',
      factor: 1 / factor,
      duration
    };
  }

  /**
   * Focus on point
   */
  focus(point: Vector2, duration: number = 1): any {
    return {
      type: 'cameraFocus',
      point,
      duration
    };
  }

  /**
   * Rotate camera
   */
  rotate(angle: number, duration: number = 1): any {
    return {
      type: 'cameraRotate',
      angle,
      duration
    };
  }

  /**
   * Get position
   */
  getPosition(): Vector2 {
    return [...this.position];
  }

  /**
   * Set position
   */
  setPosition(pos: Vector2): void {
    this.position = [...pos];
  }

  /**
   * Get zoom
   */
  getZoom(): number {
    return this.zoom;
  }

  /**
   * Set zoom
   */
  setZoom(z: number): void {
    this.zoom = z;
  }

  /**
   * Get rotation
   */
  getRotation(): number {
    return this.rotation;
  }

  /**
   * Set rotation
   */
  setRotation(r: number): void {
    this.rotation = r;
  }
}
