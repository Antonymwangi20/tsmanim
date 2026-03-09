/**
 * Additional advanced shapes for mathematical animations
 */

import { SVGPath as SVGPathShape } from '../shapes/SVGPath.js';
import type { Vector2 } from './Utilities.js';

// ============================================
// SPECIAL SHAPES
// ============================================

/**
 * Create an ellipse
 */
export function createEllipse(
  center: Vector2,
  width: number,
  height: number,
  config?: any
): SVGPathShape {
  const a = width / 2;
  const b = height / 2;
  const steps = 100;
  let pathData = '';

  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * 2 * Math.PI;
    const x = center[0] + a * Math.cos(angle);
    const y = center[1] + b * Math.sin(angle);
    pathData += `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }
  pathData += ' Z';

  return new SVGPathShape({
    pathData,
    fill: config?.fill ?? 'none',
    stroke: config?.color ?? '#FFFFFF',
    strokeWidth: config?.strokeWidth ?? 2,
    ...config
  });
}

/**
 * Create a sector (pie slice)
 */
export function createSector(
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

  const pathData = `
    M ${center[0]} ${center[1]}
    L ${start[0]} ${start[1]}
    A ${radius} ${radius} 0 ${largeArc} 1 ${end[0]} ${end[1]}
    Z
  `;

  return new SVGPathShape({
    pathData,
    fill: config?.fill ?? config?.color ?? '#FFFFFF',
    stroke: config?.stroke ?? 'none',
    ...config
  });
}

/**
 * Create dashed line
 */
export function createDashedLine(
  start: Vector2,
  end: Vector2,
  dashLength: number = 5,
  gapLength: number = 5,
  config?: any
): SVGPathShape {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx);

  let pathData = '';
  let distance = 0;
  let drawing = true;

  while (distance < length) {
    const segmentLength = drawing ? dashLength : gapLength;
    const nextDistance = Math.min(distance + segmentLength, length);
    const ratio = distance / length;
    const nextRatio = nextDistance / length;

    const x1 = start[0] + dx * ratio;
    const y1 = start[1] + dy * ratio;
    const x2 = start[0] + dx * nextRatio;
    const y2 = start[1] + dy * nextRatio;

    if (drawing) {
      pathData += `${distance === 0 ? 'M' : 'L'} ${x1} ${y1} L ${x2} ${y2}`;
    }

    distance = nextDistance;
    drawing = !drawing;
  }

  return new SVGPathShape({
    pathData,
    fill: 'none',
    stroke: config?.color ?? '#FFFFFF',
    strokeWidth: config?.strokeWidth ?? 2,
    ...config
  });
}

/**
 * Create arrow
 */
export function createArrow(
  start: Vector2,
  end: Vector2,
  config?: any
): SVGPathShape {
  const headlen = config?.headLength ?? 15;
  const angle = Math.atan2(end[1] - start[1], end[0] - start[0]);

  const pathData = `
    M ${start[0]} ${start[1]}
    L ${end[0]} ${end[1]}
    L ${end[0] - headlen * Math.cos(angle - Math.PI / 6)} ${end[1] - headlen * Math.sin(angle - Math.PI / 6)}
    M ${end[0]} ${end[1]}
    L ${end[0] - headlen * Math.cos(angle + Math.PI / 6)} ${end[1] - headlen * Math.sin(angle + Math.PI / 6)}
  `;

  return new SVGPathShape({
    pathData,
    fill: 'none',
    stroke: config?.color ?? '#FFFFFF',
    strokeWidth: config?.strokeWidth ?? 2,
    ...config
  });
}

/**
 * Create double arrow (bidirectional)
 */
export function createDoubleArrow(
  start: Vector2,
  end: Vector2,
  config?: any
): SVGPathShape {
  const headlen = config?.headLength ?? 15;
  const angle = Math.atan2(end[1] - start[1], end[0] - start[0]);

  const pathData = `
    M ${start[0] + headlen * Math.cos(angle)} ${start[1] + headlen * Math.sin(angle)}
    L ${end[0] - headlen * Math.cos(angle)} ${end[1] - headlen * Math.sin(angle)}
    M ${start[0]} ${start[1]}
    L ${start[0] + headlen * Math.cos(angle - Math.PI / 6)} ${start[1] + headlen * Math.sin(angle - Math.PI / 6)}
    M ${start[0]} ${start[1]}
    L ${start[0] + headlen * Math.cos(angle + Math.PI / 6)} ${start[1] + headlen * Math.sin(angle + Math.PI / 6)}
    M ${end[0]} ${end[1]}
    L ${end[0] - headlen * Math.cos(angle - Math.PI / 6)} ${end[1] - headlen * Math.sin(angle - Math.PI / 6)}
    M ${end[0]} ${end[1]}
    L ${end[0] - headlen * Math.cos(angle + Math.PI / 6)} ${end[1] - headlen * Math.sin(angle + Math.PI / 6)}
  `;

  return new SVGPathShape({
    pathData,
    fill: 'none',
    stroke: config?.color ?? '#FFFFFF',
    strokeWidth: config?.strokeWidth ?? 2,
    ...config
  });
}

/**
 * Create dot (small circle)
 */
export function createDot(
  center: Vector2,
  radius: number = 3,
  config?: any
): SVGPathShape {
  const pathData = `
    M ${center[0] + radius} ${center[1]}
    A ${radius} ${radius} 0 1 1 ${center[0] - radius} ${center[1]}
    A ${radius} ${radius} 0 1 1 ${center[0] + radius} ${center[1]}
  `;

  return new SVGPathShape({
    pathData,
    fill: config?.color ?? '#FFFFFF',
    stroke: config?.stroke ?? 'none',
    ...config
  });
}

/**
 * Create cross/plus sign
 */
export function createCross(
  center: Vector2,
  size: number = 20,
  config?: any
): SVGPathShape {
  const half = size / 2;
  const pathData = `
    M ${center[0]} ${center[1] - half}
    L ${center[0]} ${center[1] + half}
    M ${center[0] - half} ${center[1]}
    L ${center[0] + half} ${center[1]}
  `;

  return new SVGPathShape({
    pathData,
    fill: 'none',
    stroke: config?.color ?? '#FFFFFF',
    strokeWidth: config?.strokeWidth ?? 2,
    ...config
  });
}

/**
 * Create rounded rectangle
 */
export function createRoundedRectangle(
  center: Vector2,
  width: number,
  height: number,
  radius: number = 10,
  config?: any
): SVGPathShape {
  const x = center[0] - width / 2;
  const y = center[1] - height / 2;

  const pathData = `
    M ${x + radius} ${y}
    L ${x + width - radius} ${y}
    Q ${x + width} ${y} ${x + width} ${y + radius}
    L ${x + width} ${y + height - radius}
    Q ${x + width} ${y + height} ${x + width - radius} ${y + height}
    L ${x + radius} ${y + height}
    Q ${x} ${y + height} ${x} ${y + height - radius}
    L ${x} ${y + radius}
    Q ${x} ${y} ${x + radius} ${y}
    Z
  `;

  return new SVGPathShape({
    pathData,
    fill: config?.fill ?? config?.color ?? '#FFFFFF',
    stroke: config?.stroke ?? 'none',
    strokeWidth: config?.strokeWidth ?? 0,
    ...config
  });
}

/**
 * Create angle indicator (arc with markers)
 */
export function createAngle(
  vertex: Vector2,
  point1: Vector2,
  point2: Vector2,
  radius: number = 30,
  config?: any
): SVGPathShape {
  const angle1 = Math.atan2(point1[1] - vertex[1], point1[0] - vertex[0]);
  const angle2 = Math.atan2(point2[1] - vertex[1], point2[0] - vertex[0]);

  const start = [
    vertex[0] + radius * Math.cos(angle1),
    vertex[1] + radius * Math.sin(angle1)
  ] as Vector2;

  const end = [
    vertex[0] + radius * Math.cos(angle2),
    vertex[1] + radius * Math.sin(angle2)
  ] as Vector2;

  const largeArc = Math.abs(angle2 - angle1) > Math.PI ? 1 : 0;

  const pathData = `
    M ${start[0]} ${start[1]}
    A ${radius} ${radius} 0 ${largeArc} 1 ${end[0]} ${end[1]}
  `;

  return new SVGPathShape({
    pathData,
    fill: 'none',
    stroke: config?.color ?? '#FFFFFF',
    strokeWidth: config?.strokeWidth ?? 2,
    ...config
  });
}

/**
 * Create right angle indicator (small square)
 */
export function createRightAngle(
  vertex: Vector2,
  point1: Vector2,
  point2: Vector2,
  size: number = 15,
  config?: any
): SVGPathShape {
  const v1 = [point1[0] - vertex[0], point1[1] - vertex[1]];
  const v2 = [point2[0] - vertex[0], point2[1] - vertex[1]];

  // Normalize
  const len1 = Math.sqrt(v1[0] * v1[0] + v1[1] * v1[1]);
  const len2 = Math.sqrt(v2[0] * v2[0] + v2[1] * v2[1]);
  v1[0] /= len1;
  v1[1] /= len1;
  v2[0] /= len2;
  v2[1] /= len2;

  const corner = [
    vertex[0] + (v1[0] + v2[0]) * size,
    vertex[1] + (v1[1] + v2[1]) * size
  ];

  const point3 = [vertex[0] + v1[0] * size, vertex[1] + v1[1] * size];
  const point4 = [vertex[0] + v2[0] * size, vertex[1] + v2[1] * size];

  const pathData = `
    M ${point3[0]} ${point3[1]}
    L ${corner[0]} ${corner[1]}
    L ${point4[0]} ${point4[1]}
  `;

  return new SVGPathShape({
    pathData,
    fill: 'none',
    stroke: config?.color ?? '#FFFFFF',
    strokeWidth: config?.strokeWidth ?? 2,
    ...config
  });
}

/**
 * Create coordinate axes
 */
export function createAxes(
  center: Vector2,
  width: number,
  height: number,
  config?: any
): SVGPathShape {
  const xStart = [center[0] - width / 2, center[1]];
  const xEnd = [center[0] + width / 2, center[1]];
  const yStart = [center[0], center[1] - height / 2];
  const yEnd = [center[0], center[1] + height / 2];

  const arrowLen = 10;
  const pathData = `
    M ${xStart[0]} ${xStart[1]} L ${xEnd[0]} ${xEnd[1]}
    L ${xEnd[0] - arrowLen} ${xEnd[1] - 3}
    M ${xEnd[0]} ${xEnd[1]}
    L ${xEnd[0] - arrowLen} ${xEnd[1] + 3}
    M ${yStart[0]} ${yStart[1]} L ${yEnd[0]} ${yEnd[1]}
    L ${yEnd[0] - 3} ${yEnd[1] - arrowLen}
    M ${yEnd[0]} ${yEnd[1]}
    L ${yEnd[0] + 3} ${yEnd[1] - arrowLen}
  `;

  return new SVGPathShape({
    pathData,
    fill: 'none',
    stroke: config?.color ?? '#FFFFFF',
    strokeWidth: config?.strokeWidth ?? 2,
    ...config
  });
}

/**
 * Create number line
 */
export function createNumberLine(
  center: Vector2,
  length: number,
  tickCount: number = 10,
  config?: any
): SVGPathShape {
  const spacing = length / (tickCount - 1);
  let pathData = `M ${center[0] - length / 2} ${center[1]} L ${center[0] + length / 2} ${center[1]}`;

  for (let i = 0; i < tickCount; i++) {
    const x = center[0] - length / 2 + i * spacing;
    pathData += ` M ${x} ${center[1] - 5} L ${x} ${center[1] + 5}`;
  }

  return new SVGPathShape({
    pathData,
    fill: 'none',
    stroke: config?.color ?? '#FFFFFF',
    strokeWidth: config?.strokeWidth ?? 2,
    ...config
  });
}
