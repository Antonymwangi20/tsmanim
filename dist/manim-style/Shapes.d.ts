/**
 * Extended shape creation helpers for Manim-style API
 */
import { SVGPath as SVGPathShape } from '../shapes/SVGPath.js';
import type { Vector2 } from './Utilities.js';
/**
 * Create a line between two points
 */
export declare function createLine(start: Vector2, end: Vector2, config?: any): SVGPathShape;
/**
 * Create a polygon from vertices
 */
export declare function createPolygon(vertices: Vector2[], config?: any): SVGPathShape;
/**
 * Create a triangle
 */
export declare function createTriangle(vertices: [Vector2, Vector2, Vector2], config?: any): SVGPathShape;
/**
 * Create a regular polygon with n sides
 */
export declare function createRegularPolygon(n: number, center: Vector2, radius: number, config?: any): SVGPathShape;
/**
 * Create a star shape
 */
export declare function createStar(center: Vector2, outerRadius: number, innerRadius: number, points?: number, config?: any): SVGPathShape;
/**
 * Create an arc
 */
export declare function createArc(center: Vector2, radius: number, startAngle: number, endAngle: number, config?: any): SVGPathShape;
/**
 * Create a circle (arc version that goes 360 degrees)
 */
export declare function createCircleArc(center: Vector2, radius: number, config?: any): SVGPathShape;
/**
 * Create an annulus (ring shape)
 */
export declare function createAnnulus(center: Vector2, innerRadius: number, outerRadius: number, config?: any): SVGPathShape;
/**
 * Create a grid
 */
export declare function createGrid(center: Vector2, width: number, height: number, cellWidth: number, cellHeight: number, config?: any): SVGPathShape;
/**
 * Create a bezier curve
 */
export declare function createBezierCurve(controlPoints: Vector2[], config?: any): SVGPathShape;
/**
 * Create a sine wave
 */
export declare function createWave(center: Vector2, width: number, amplitude: number, frequency?: number, config?: any): SVGPathShape;
//# sourceMappingURL=Shapes.d.ts.map