/**
 * Extended shape creation helpers for Manim-style API
 */

import { SVGPath as SVGPathShape } from '../shapes/SVGPath.js';
import { Circle as CircleShape, CircleConfig } from '../shapes/Circle.js';
import { Rect as RectShape, RectConfig } from '../shapes/Rect.js';
import { Text as TextShape, TextConfig } from '../shapes/Text.js';
import { Node } from '../core/Node.js';
import type { Vector2 } from './Utilities.js';

/**
 * Create a line between two points
 */
export function createLine(start: Vector2, end: Vector2, config?: any): SVGPathShape {
  const pathData = `M ${start[0]} ${start[1]} L ${end[0]} ${end[1]}`;
  return new SVGPathShape({
    pathData,
    stroke: config?.color ?? '#FFFFFF',
    fill: 'none',
    strokeWidth: config?.strokeWidth ?? 2,
    ...config
  });
}

/**
 * Create a polygon from vertices
 */
export function createPolygon(vertices: Vector2[], config?: any): SVGPathShape {
  if (vertices.length < 2) throw new Error('Polygon requires at least 2 vertices');
  
  let pathData = `M ${vertices[0][0]} ${vertices[0][1]}`;
  for (let i = 1; i < vertices.length; i++) {
    pathData += ` L ${vertices[i][0]} ${vertices[i][1]}`;
  }
  pathData += ' Z'; // Close path
  
  return new SVGPathShape({
    pathData,
    fill: config?.color ?? '#FFFFFF',
    stroke: config?.stroke ?? 'none',
    strokeWidth: config?.strokeWidth ?? 0,
    ...config
  });
}

/**
 * Create a triangle
 */
export function createTriangle(vertices: [Vector2, Vector2, Vector2], config?: any): SVGPathShape {
  return createPolygon([...vertices], config);
}

/**
 * Create a regular polygon with n sides
 */
export function createRegularPolygon(n: number, center: Vector2, radius: number, config?: any): SVGPathShape {
  const vertices: Vector2[] = [];
  const angleStep = (2 * Math.PI) / n;
  const startAngle = config?.startAngle ?? -Math.PI / 2;
  
  for (let i = 0; i < n; i++) {
    const angle = startAngle + i * angleStep;
    const x = center[0] + radius * Math.cos(angle);
    const y = center[1] + radius * Math.sin(angle);
    vertices.push([x, y]);
  }
  
  return createPolygon(vertices, config);
}

/**
 * Create a star shape
 */
export function createStar(
  center: Vector2,
  outerRadius: number,
  innerRadius: number,
  points: number = 5,
  config?: any
): SVGPathShape {
  const vertices: Vector2[] = [];
  const angleStep = Math.PI / points;
  const startAngle = config?.startAngle ?? -Math.PI / 2;
  
  for (let i = 0; i < points * 2; i++) {
    const angle = startAngle + i * angleStep;
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const x = center[0] + radius * Math.cos(angle);
    const y = center[1] + radius * Math.sin(angle);
    vertices.push([x, y]);
  }
  
  return createPolygon(vertices, config);
}

/**
 * Create an arc
 */
export function createArc(
  center: Vector2,
  radius: number,
  startAngle: number,
  endAngle: number,
  config?: any
): SVGPathShape {
  const start = [
    center[0] + radius * Math.cos(startAngle),
    center[1] + radius * Math.sin(startAngle)
  ] as Vector2;
  
  const end = [
    center[0] + radius * Math.cos(endAngle),
    center[1] + radius * Math.sin(endAngle)
  ] as Vector2;
  
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
  
  const pathData = `M ${start[0]} ${start[1]} A ${radius} ${radius} 0 ${largeArc} 1 ${end[0]} ${end[1]}`;
  
  return new SVGPathShape({
    pathData,
    fill: config?.fill ?? 'none',
    stroke: config?.color ?? '#FFFFFF',
    strokeWidth: config?.strokeWidth ?? 2,
    ...config
  });
}

/**
 * Create a circle (arc version that goes 360 degrees)
 */
export function createCircleArc(center: Vector2, radius: number, config?: any): SVGPathShape {
  const start = [center[0] + radius, center[1]] as Vector2;
  
  const pathData = `
    M ${start[0]} ${start[1]}
    A ${radius} ${radius} 0 1 1 ${start[0] - 2 * radius} ${start[1]}
    A ${radius} ${radius} 0 1 1 ${start[0]} ${start[1]}
  `;
  
  return new SVGPathShape({
    pathData,
    fill: config?.fill ?? 'none',
    stroke: config?.color ?? '#FFFFFF',
    strokeWidth: config?.strokeWidth ?? 2,
    ...config
  });
}

/**
 * Create an annulus (ring shape)
 */
export function createAnnulus(
  center: Vector2,
  innerRadius: number,
  outerRadius: number,
  config?: any
): SVGPathShape {
  // Create ring path by combining two circles
  const pathData = `
    M ${center[0] + outerRadius} ${center[1]}
    A ${outerRadius} ${outerRadius} 0 1 1 ${center[0] - outerRadius} ${center[1]}
    A ${outerRadius} ${outerRadius} 0 1 1 ${center[0] + outerRadius} ${center[1]}
    M ${center[0] + innerRadius} ${center[1]}
    A ${innerRadius} ${innerRadius} 0 1 0 ${center[0] - innerRadius} ${center[1]}
    A ${innerRadius} ${innerRadius} 0 1 0 ${center[0] + innerRadius} ${center[1]}
  `;
  
  return new SVGPathShape({
    pathData,
    fill: config?.color ?? '#FFFFFF',
    stroke: config?.stroke ?? 'none',
    strokeWidth: config?.strokeWidth ?? 0,
    ...config
  });
}

/**
 * Create a grid
 */
export function createGrid(
  center: Vector2,
  width: number,
  height: number,
  cellWidth: number,
  cellHeight: number,
  config?: any
): SVGPathShape {
  let pathData = '';
  const lineColor = config?.color ?? '#CCCCCC';
  const lineWidth = config?.strokeWidth ?? 1;
  
  // Vertical lines
  const colsCount = Math.ceil(width / cellWidth);
  const startX = center[0] - width / 2;
  const startY = center[1] - height / 2;
  
  for (let i = 0; i <= colsCount; i++) {
    const x = startX + i * cellWidth;
    pathData += `M ${x} ${startY} L ${x} ${startY + height} `;
  }
  
  // Horizontal lines
  const rowsCount = Math.ceil(height / cellHeight);
  for (let i = 0; i <= rowsCount; i++) {
    const y = startY + i * cellHeight;
    pathData += `M ${startX} ${y} L ${startX + width} ${y} `;
  }
  
  return new SVGPathShape({
    pathData,
    fill: 'none',
    stroke: lineColor,
    strokeWidth: lineWidth,
    ...config
  });
}

/**
 * Create a bezier curve
 */
export function createBezierCurve(
  controlPoints: Vector2[],
  config?: any
): SVGPathShape {
  if (controlPoints.length < 2) {
    throw new Error('Bezier curve requires at least 2 control points');
  }
  
  let pathData = `M ${controlPoints[0][0]} ${controlPoints[0][1]}`;
  
  if (controlPoints.length === 2) {
    // Linear
    pathData += ` L ${controlPoints[1][0]} ${controlPoints[1][1]}`;
  } else if (controlPoints.length === 3) {
    // Quadratic Bezier
    pathData += ` Q ${controlPoints[1][0]} ${controlPoints[1][1]} ${controlPoints[2][0]} ${controlPoints[2][1]}`;
  } else if (controlPoints.length === 4) {
    // Cubic Bezier
    pathData += ` C ${controlPoints[1][0]} ${controlPoints[1][1]} ${controlPoints[2][0]} ${controlPoints[2][1]} ${controlPoints[3][0]} ${controlPoints[3][1]}`;
  } else {
    // General smooth curve through points
    pathData = `M ${controlPoints[0][0]} ${controlPoints[0][1]}`;
    for (let i = 1; i < controlPoints.length; i++) {
      const prev = controlPoints[i - 1];
      const curr = controlPoints[i];
      const next = controlPoints[i + 1] || curr;
      
      const cpx1 = prev[0] + (curr[0] - prev[0]) / 3;
      const cpy1 = prev[1] + (curr[1] - prev[1]) / 3;
      const cpx2 = curr[0] - (next[0] - curr[0]) / 3;
      const cpy2 = curr[1] - (next[1] - curr[1]) / 3;
      
      pathData += ` C ${cpx1} ${cpy1} ${cpx2} ${cpy2} ${curr[0]} ${curr[1]}`;
    }
  }
  
  return new SVGPathShape({
    pathData,
    fill: config?.fill ?? 'none',
    stroke: config?.color ?? '#FFFFFF',
    strokeWidth: config?.strokeWidth ?? 2,
    ...config
  });
}

/**
 * Create a sine wave
 */
export function createWave(
  center: Vector2,
  width: number,
  amplitude: number,
  frequency: number = 1,
  config?: any
): SVGPathShape {
  const points: Vector2[] = [];
  const step = width / 100;
  
  for (let x = 0; x <= width; x += step) {
    const y = amplitude * Math.sin((x / width) * frequency * 2 * Math.PI);
    points.push([center[0] - width / 2 + x, center[1] + y]);
  }
  
  return createBezierCurve(points, config);
}
