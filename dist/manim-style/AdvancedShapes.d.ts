/**
 * Additional advanced shapes for mathematical animations
 */
import { SVGPath as SVGPathShape } from '../shapes/SVGPath.js';
import type { Vector2 } from './Utilities.js';
/**
 * Create an ellipse
 */
export declare function createEllipse(center: Vector2, width: number, height: number, config?: any): SVGPathShape;
/**
 * Create a sector (pie slice)
 */
export declare function createSector(center: Vector2, radius: number, startAngle: number, endAngle: number, config?: any): SVGPathShape;
/**
 * Create dashed line
 */
export declare function createDashedLine(start: Vector2, end: Vector2, dashLength?: number, gapLength?: number, config?: any): SVGPathShape;
/**
 * Create arrow
 */
export declare function createArrow(start: Vector2, end: Vector2, config?: any): SVGPathShape;
/**
 * Create double arrow (bidirectional)
 */
export declare function createDoubleArrow(start: Vector2, end: Vector2, config?: any): SVGPathShape;
/**
 * Create dot (small circle)
 */
export declare function createDot(center: Vector2, radius?: number, config?: any): SVGPathShape;
/**
 * Create cross/plus sign
 */
export declare function createCross(center: Vector2, size?: number, config?: any): SVGPathShape;
/**
 * Create rounded rectangle
 */
export declare function createRoundedRectangle(center: Vector2, width: number, height: number, radius?: number, config?: any): SVGPathShape;
/**
 * Create angle indicator (arc with markers)
 */
export declare function createAngle(vertex: Vector2, point1: Vector2, point2: Vector2, radius?: number, config?: any): SVGPathShape;
/**
 * Create right angle indicator (small square)
 */
export declare function createRightAngle(vertex: Vector2, point1: Vector2, point2: Vector2, size?: number, config?: any): SVGPathShape;
/**
 * Create coordinate axes
 */
export declare function createAxes(center: Vector2, width: number, height: number, config?: any): SVGPathShape;
/**
 * Create number line
 */
export declare function createNumberLine(center: Vector2, length: number, tickCount?: number, config?: any): SVGPathShape;
//# sourceMappingURL=AdvancedShapes.d.ts.map