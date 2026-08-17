"use client";

import { motion } from "framer-motion";
import { easePremium } from "./motion-primitives";

/**
 * ─────────────────────────────────────────────────────────────────────────
 * THOUGHT TRAIL
 * ─────────────────────────────────────────────────────────────────────────
 * A trail of small circles that arcs from a starting point ("origin") up to
 * a quote card ("end"), like a comic-strip thought bubble trail. The last
 * circle is NOT the quote itself — the quote card is the implied final
 * bubble — so we only render up to (but not including) the `end` point.
 *
 * Geometry
 * --------
 * The trail follows a single quadratic Bézier curve:
 *
 *      B(t) = (1-t)² · origin + 2(1-t)t · control + t² · end
 *
 * `control` is a normal offset from the origin→end midpoint (not an
 * absolute point) so trails stay well-behaved under resizing/reflow:
 *   - control.bend   → how far the curve bows off the straight line,
 *                       as a fraction of the origin→end distance
 *                       (0 = straight line, positive bows one way,
 *                       negative bows the other)
 *   - control.skew    → where along the line the bow is centered
 *                       (0.5 = middle, <0.5 toward origin, >0.5 toward end)
 *
 * Circle placement
 * -----------------
 * Circles are placed at *equal arc-length* intervals (not equal `t`
 * intervals — those bunch up on the tighter part of a curved arc). `gap`
 * is the target on-screen distance (px) between circle *centers*, so it
 * doubles as the thing you tune to get more/fewer circles: smaller gap =
 * more circles, larger gap = fewer.
 *
 * The FIRST rendered circle sits at `minRadius`/`minOpacity`, the LAST
 * rendered circle (i.e. the one just before the quote bubble) sits at
 * `maxRadius`/`maxOpacity`, and every circle between grows uniformly.
 * The circle *after* the last rendered one, at t=1, would be the quote
 * card itself — so it's never drawn, but it IS included in the equidistant
 * spacing math, which is why the last visible circle sits one `gap` short
 * of the quote rather than landing right on top of it.
 * ─────────────────────────────────────────────────────────────────────────
 */

export type Point = { x: number; y: number };

export type ThoughtTrailConfig = {
  /** Where the trail begins, in the same coordinate space as the stage
   *  (percent-of-stage 0–100 on both axes — see `ThoughtTrailStage`). */
  origin: Point;
  /** Where the trail ends — this should be the quote card's anchor point
   *  (its near corner/edge), NOT its center. Not rendered as a circle. */
  end: Point;
  /** Curvature: how much the arc bows off the straight origin→end line. */
  control: {
    /** Bow amount as a fraction of the origin→end distance. 0 = straight.
     *  Typical range: -0.6 .. 0.6 */
    bend: number;
    /** Where along the line the bow peaks, 0 (at origin) .. 1 (at end).
     *  Default 0.5 (centered). */
    skew?: number;
  };
  /** Target distance between circle centers, in px AT `referenceWidth`.
   *  Smaller = more circles. This is the primary knob for circle *count*.
   *  Scaled at render time by (actual stage width / referenceWidth) so
   *  the trail's density and circle sizes stay visually consistent across
   *  breakpoints instead of thinning out as the stage shrinks. */
  gap: number;
  /** Radius (px at `referenceWidth`) of the first circle. Default 3. */
  minRadius?: number;
  /** Radius (px at `referenceWidth`) of the last rendered circle. Default 9. */
  maxRadius?: number;
  /** Opacity of the first circle. Default 0.25. */
  minOpacity?: number;
  /** Opacity of the last rendered circle. Default 0.9. */
  maxOpacity?: number;
  /** Circle fill. Defaults to currentColor so it inherits `text-*` classes. */
  color?: string;
  /** Stagger delay (s) before the first circle starts animating in. */
  delay?: number;
  /** Per-circle reveal stagger (s). Default 0.06. */
  circleStagger?: number;
};

/** The stage width (px) that `gap`/`minRadius`/`maxRadius` are authored
 *  against — i.e. the width you were calibrating at. All three scale
 *  proportionally to the actual stage width at render time so a trail
 *  keeps the same circle COUNT and the same RELATIVE size at any
 *  breakpoint, instead of drifting sparse/dense as the layout resizes.
 *  Matches the calibrator's desktop stage width. */
export const TRAIL_REFERENCE_WIDTH = 1400;

const DEFAULTS = {
  minRadius: 3,
  maxRadius: 9,
  minOpacity: 0.25,
  maxOpacity: 0.9,
  circleStagger: 0.06,
} as const;

function bezierPoint(
  origin: Point,
  control: Point,
  end: Point,
  t: number,
): Point {
  const mt = 1 - t;
  return {
    x: mt * mt * origin.x + 2 * mt * t * control.x + t * t * end.x,
    y: mt * mt * origin.y + 2 * mt * t * control.y + t * t * end.y,
  };
}

/** Derive the absolute control point from the origin/end/bend/skew shorthand.
 *  Bows perpendicular to the origin→end line. */
function resolveControlPoint(
  origin: Point,
  end: Point,
  bend: number,
  skew: number,
): Point {
  const dx = end.x - origin.x;
  const dy = end.y - origin.y;
  const dist = Math.hypot(dx, dy) || 1;
  // Unit normal (perpendicular) to the origin->end line.
  const nx = -dy / dist;
  const ny = dx / dist;
  const base = { x: origin.x + dx * skew, y: origin.y + dy * skew };
  const bow = bend * dist;
  return { x: base.x + nx * bow, y: base.y + ny * bow };
}

/** Inverse of resolveControlPoint: given an absolute control point the user
 *  dragged, recover the {bend, skew} that reproduce it, so a draggable
 *  curvature handle can round-trip through the same config shape that gets
 *  exported (no separate "raw control point" field to keep in sync). */
export function controlPointToBendSkew(
  origin: Point,
  end: Point,
  controlPoint: Point,
): { bend: number; skew: number } {
  const dx = end.x - origin.x;
  const dy = end.y - origin.y;
  const dist = Math.hypot(dx, dy) || 1;
  const nx = -dy / dist;
  const ny = dx / dist;
  // Project (controlPoint - origin) onto the line direction to get skew,
  // and onto the normal to get bow distance.
  const vx = controlPoint.x - origin.x;
  const vy = controlPoint.y - origin.y;
  const alongLine = (vx * dx + vy * dy) / (dist * dist); // 0..1 fraction along origin->end
  const alongNormal = vx * nx + vy * ny; // signed distance off the line
  const bend = alongNormal / dist;
  return { bend, skew: Math.max(0, Math.min(1, alongLine)) };
}

/** Public helper so callers (e.g. the calibrator) can get the absolute
 *  control point for a config without duplicating the bend/skew math. */
export function getAbsoluteControlPoint(config: ThoughtTrailConfig): Point {
  return resolveControlPoint(
    config.origin,
    config.end,
    config.control.bend,
    config.control.skew ?? 0.5,
  );
}

/** Sample the curve finely and build a cumulative arc-length lookup table,
 *  so we can place points at equal *distance* rather than equal `t`. */
function buildArcLengthTable(
  origin: Point,
  control: Point,
  end: Point,
  samples = 200,
) {
  const pts: Point[] = [];
  const cumulative: number[] = [0];
  let prev = bezierPoint(origin, control, end, 0);
  pts.push(prev);
  for (let i = 1; i <= samples; i++) {
    const t = i / samples;
    const p = bezierPoint(origin, control, end, t);
    cumulative.push(cumulative[i - 1] + Math.hypot(p.x - prev.x, p.y - prev.y));
    pts.push(p);
    prev = p;
  }
  return { pts, cumulative, totalLength: cumulative[cumulative.length - 1] };
}

/** Given a target distance along the curve, find the point + t there via
 *  the arc-length table (linear interpolation between samples). */
function pointAtDistance(
  table: ReturnType<typeof buildArcLengthTable>,
  distance: number,
): Point {
  const { pts, cumulative, totalLength } = table;
  const d = Math.max(0, Math.min(distance, totalLength));
  // Binary search the cumulative-length table.
  let lo = 0;
  let hi = cumulative.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (cumulative[mid] < d) lo = mid + 1;
    else hi = mid;
  }
  const i = Math.max(1, lo);
  const segStart = cumulative[i - 1];
  const segEnd = cumulative[i];
  const segT = segEnd > segStart ? (d - segStart) / (segEnd - segStart) : 0;
  const a = pts[i - 1];
  const b = pts[i];
  return { x: a.x + (b.x - a.x) * segT, y: a.y + (b.y - a.y) * segT };
}

export type TrailCircle = Point & {
  radius: number;
  opacity: number;
  index: number;
};

/** Pure geometry function — also used directly by the calibrator so the
 *  preview matches the real render exactly, and reusable if you ever want
 *  to render trails to canvas/SVG instead of DOM circles.
 *
 *  `origin`/`end` must already be in PX in the actual (current) stage —
 *  convert from percent before calling this. `scale` is
 *  (actual stage width / TRAIL_REFERENCE_WIDTH); it scales `gap` and the
 *  radii so density and circle size stay consistent across breakpoints.
 *  Pass scale=1 to use gap/radii as literal px (e.g. in a fixed-size
 *  preview). */
export function computeTrailCircles(
  config: ThoughtTrailConfig,
  scale = 1,
): TrailCircle[] {
  const { origin, end, control } = config;
  const gap = config.gap * scale;
  const minRadius = (config.minRadius ?? DEFAULTS.minRadius) * scale;
  const maxRadius = (config.maxRadius ?? DEFAULTS.maxRadius) * scale;
  const minOpacity = config.minOpacity ?? DEFAULTS.minOpacity;
  const maxOpacity = config.maxOpacity ?? DEFAULTS.maxOpacity;

  const controlPoint = resolveControlPoint(
    origin,
    end,
    control.bend,
    control.skew ?? 0.5,
  );
  const table = buildArcLengthTable(origin, controlPoint, end);

  if (table.totalLength <= 0 || gap <= 0) return [];

  // How many equidistant steps of `gap` fit between origin and end,
  // INCLUDING the final step that would land on the quote card itself.
  // We render every step except that last one.
  const totalSteps = Math.max(1, Math.round(table.totalLength / gap));
  const renderedSteps = Math.max(1, totalSteps - 1) + 1; // +1 to include t=0 (origin)
  // renderedSteps = number of circles we actually draw (origin ... one gap short of end)

  const circles: TrailCircle[] = [];
  for (let i = 0; i < renderedSteps; i++) {
    const distance = i * gap;
    const { x, y } = pointAtDistance(table, distance);
    const growth = renderedSteps > 1 ? i / (renderedSteps - 1) : 0;
    circles.push({
      x,
      y,
      radius: minRadius + (maxRadius - minRadius) * growth,
      opacity: minOpacity + (maxOpacity - minOpacity) * growth,
      index: i,
    });
  }
  return circles;
}

/**
 * Renders one trail. Positions are expressed as PERCENT of the stage
 * (0–100), matching how `origin`/`end` are authored, then converted to
 * absolute px circles at render time using the stage's measured size —
 * this is what makes a trail authored in % stay visually correct across
 * breakpoints, same as the existing `clamp()`-based QuoteCards positions.
 */
export function ThoughtTrail({
  config,
  stageWidth,
  stageHeight,
  className,
}: {
  config: ThoughtTrailConfig;
  stageWidth: number;
  stageHeight: number;
  className?: string;
}) {
  if (!stageWidth || !stageHeight) return null;

  const toPx = (p: Point): Point => ({
    x: (p.x / 100) * stageWidth,
    y: (p.y / 100) * stageHeight,
  });

  const pxConfig: ThoughtTrailConfig = {
    ...config,
    origin: toPx(config.origin),
    end: toPx(config.end),
  };

  // Scale gap + radii against the width the trail was calibrated at, so
  // the trail keeps the same circle count and relative size at any
  // breakpoint instead of thinning out as the stage shrinks.
  const scale = stageWidth / TRAIL_REFERENCE_WIDTH;
  const circles = computeTrailCircles(pxConfig, scale);
  const color = config.color ?? "currentColor";
  const delay = config.delay ?? 0;
  const circleStagger = config.circleStagger ?? DEFAULTS.circleStagger;

  return (
    <svg
      className={[
        "absolute inset-0 pointer-events-none overflow-visible",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      width={stageWidth}
      height={stageHeight}
      style={{ color }}
    >
      {circles.map((c) => (
        <motion.circle
          key={c.index}
          cx={c.x}
          cy={c.y}
          r={c.radius}
          fill="currentColor"
          initial={{ opacity: 0, scale: 0.4 }}
          whileInView={{ opacity: c.opacity, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          style={{ transformOrigin: `${c.x}px ${c.y}px` }}
          transition={{
            duration: 0.5,
            ease: easePremium,
            delay: delay + c.index * circleStagger,
          }}
        />
      ))}
    </svg>
  );
}
