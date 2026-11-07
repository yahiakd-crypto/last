export interface Point {
  x: number;
  y: number;
}

export interface BezierCurveData {
  path: string;
  source: Point;
  target: Point;
  cp1: Point;
  cp2: Point;
  midpoint: Point;
  angleAtMidpoint: number;
}

/**
 * Computes a smooth cubic Bézier curve between two points matching the screenshot visual style.
 */
export function calculateCubicBezier(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  sourcePos: 'left' | 'right' | 'top' | 'bottom' = 'right',
  targetPos: 'left' | 'right' | 'top' | 'bottom' = 'left',
  curvature: number = 0.5
): BezierCurveData {
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);

  let cp1x = x1;
  let cp1y = y1;
  let cp2x = x2;
  let cp2y = y2;

  // Horizontal primary flow (standard in screenshots)
  if (sourcePos === 'right' && targetPos === 'left') {
    const offset = Math.max(dx * curvature, 40);
    cp1x = x1 + offset;
    cp1y = y1;
    cp2x = x2 - offset;
    cp2y = y2;
  } else if (sourcePos === 'bottom' && targetPos === 'top') {
    const offset = Math.max(dy * curvature, 40);
    cp1x = x1;
    cp1y = y1 + offset;
    cp2x = x2;
    cp2y = y2 - offset;
  } else {
    // General fallback
    const offset = Math.max(Math.sqrt(dx * dx + dy * dy) * 0.35, 40);
    cp1x = x1 + (sourcePos === 'right' ? offset : sourcePos === 'left' ? -offset : 0);
    cp1y = y1 + (sourcePos === 'bottom' ? offset : sourcePos === 'top' ? -offset : 0);
    cp2x = x2 + (targetPos === 'right' ? offset : targetPos === 'left' ? -offset : 0);
    cp2y = y2 + (targetPos === 'bottom' ? offset : targetPos === 'top' ? -offset : 0);
  }

  const path = `M ${x1.toFixed(1)} ${y1.toFixed(1)} C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${x2.toFixed(1)} ${y2.toFixed(1)}`;

  // Midpoint at t = 0.5
  const mid = getPointOnCubicBezier(x1, y1, cp1x, cp1y, cp2x, cp2y, x2, y2, 0.5);
  const tangent = getTangentOnCubicBezier(x1, y1, cp1x, cp1y, cp2x, cp2y, x2, y2, 0.5);
  const angle = Math.atan2(tangent.y, tangent.x) * (180 / Math.PI);

  return {
    path,
    source: { x: x1, y: y1 },
    target: { x: x2, y: y2 },
    cp1: { x: cp1x, y: cp1y },
    cp2: { x: cp2x, y: cp2y },
    midpoint: mid,
    angleAtMidpoint: angle,
  };
}

/**
 * Returns coordinate along the cubic Bézier curve at parameter t in [0, 1]
 */
export function getPointOnCubicBezier(
  x1: number,
  y1: number,
  cp1x: number,
  cp1y: number,
  cp2x: number,
  cp2y: number,
  x2: number,
  y2: number,
  t: number
): Point {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;

  const x = uuu * x1 + 3 * uu * t * cp1x + 3 * u * tt * cp2x + ttt * x2;
  const y = uuu * y1 + 3 * uu * t * cp1y + 3 * u * tt * cp2y + ttt * y2;

  return { x, y };
}

/**
 * First derivative vector of cubic Bézier curve at parameter t
 */
export function getTangentOnCubicBezier(
  x1: number,
  y1: number,
  cp1x: number,
  cp1y: number,
  cp2x: number,
  cp2y: number,
  x2: number,
  y2: number,
  t: number
): Point {
  const u = 1 - t;
  const dx = 3 * u * u * (cp1x - x1) + 6 * u * t * (cp2x - cp1x) + 3 * t * t * (x2 - cp2x);
  const dy = 3 * u * u * (cp1y - y1) + 6 * u * t * (cp2y - cp1y) + 3 * t * t * (y2 - cp2y);
  return { x: dx, y: dy };
}
