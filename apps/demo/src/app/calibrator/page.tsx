"use client";

/**
 * ─────────────────────────────────────────────────────────────────────────
 * THOUGHT TRAIL CALIBRATOR
 * ─────────────────────────────────────────────────────────────────────────
 * Route: /calibrator  (drop this file at app/calibrator/page.tsx)
 *
 * The stage here is pixel-identical to production — same image, same crop,
 * same gradient, same ThoughtTrail/bubble components, full width, nothing
 * squeezed by a side panel. All controls live in the bottom bar so the
 * thing you're calibrating against is never distorted by the calibrator's
 * own UI.
 *
 * Three drag handles per active quote, all directly on the photo:
 *   ● green   origin      — where the trail starts
 *   ◆ orange  end         — the bubble's near corner (implied final bubble)
 *   ▲ blue    curvature   — drag to bend the arc; this IS the curvature
 *                           control, not an abstract slider. It round-trips
 *                           exactly through {bend, skew} in the exported
 *                           config, so what you drag is what gets saved.
 *
 * Gap / radius / opacity — density and size, not shape — stay as sliders
 * in the bottom bar, since those aren't naturally "a point you drag."
 *
 * Trails are calibrated at TRAIL_REFERENCE_WIDTH (1400px, this stage's
 * desktop width) and scale proportionally at any other stage width, so
 * circle count and relative size stay consistent instead of drifting.
 * ─────────────────────────────────────────────────────────────────────────
 */

import Image from "next/image";
import { useMemo, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import {
  ThoughtTrail,
  getAbsoluteControlPoint,
  controlPointToBendSkew,
  type ThoughtTrailConfig,
  type Point,
} from "@/components/thought-trail";
import { useStageSize } from "@/components/use-stage-size";

type QuoteEntry = {
  id: string;
  text: string;
  position: { left: string; top: string; width: string };
  emphasis?: boolean;
  delay: number;
  trail: ThoughtTrailConfig;
};

const INITIAL_QUOTES: QuoteEntry[] = [
  {
    id: "q1",
    text: "My ideas are good, but I freeze when I speak.",
    position: {
      left: "clamp(48%, 52vw, 52%)",
      top: "clamp(7%, 8vh, 10%)",
      width: "clamp(240px, 25vw, 360px)",
    },
    emphasis: true,
    delay: 0.1,
    trail: {
      origin: { x: 40, y: 2 },
      end: { x: 51, y: 9 },
      control: { bend: 0.25, skew: 0.5 },
      gap: 26,
      minRadius: 3,
      maxRadius: 8,
      minOpacity: 0.2,
      maxOpacity: 0.85,
      delay: 0.05,
    },
  },
  {
    id: "q2",
    text: "I stumble, use 'umm...' too often.",
    position: {
      left: "clamp(66%, 74vw, 74%)",
      top: "clamp(21%, 24vh, 26%)",
      width: "clamp(220px, 22vw, 320px)",
    },
    delay: 0.25,
    trail: {
      origin: { x: 52, y: 16 },
      end: { x: 73, y: 23 },
      control: { bend: -0.2, skew: 0.5 },
      gap: 24,
      minRadius: 3,
      maxRadius: 7,
      minOpacity: 0.2,
      maxOpacity: 0.85,
      delay: 0.2,
    },
  },
  {
    id: "q3",
    text: "I don't sound as confident as others.",
    position: {
      left: "clamp(64%, 71vw, 71%)",
      top: "clamp(40%, 44vh, 47%)",
      width: "clamp(220px, 21vw, 310px)",
    },
    delay: 0.4,
    trail: {
      origin: { x: 52, y: 34 },
      end: { x: 70, y: 41 },
      control: { bend: 0.22, skew: 0.5 },
      gap: 24,
      minRadius: 3,
      maxRadius: 7,
      minOpacity: 0.2,
      maxOpacity: 0.85,
      delay: 0.35,
    },
  },
  {
    id: "q4",
    text: "I know the topic, but I can't explain it well.",
    position: {
      left: "clamp(58%, 66vw, 66%)",
      top: "clamp(59%, 64vh, 67%)",
      width: "clamp(240px, 25vw, 360px)",
    },
    emphasis: true,
    delay: 0.55,
    trail: {
      origin: { x: 44, y: 52 },
      end: { x: 65, y: 60 },
      control: { bend: -0.25, skew: 0.5 },
      gap: 26,
      minRadius: 3,
      maxRadius: 8,
      minOpacity: 0.2,
      maxOpacity: 0.85,
      delay: 0.5,
    },
  },
];

// ── formatting helpers ─────────────────────────────────────────────────

function round(n: number, dp = 1) {
  const f = 10 ** dp;
  return Math.round(n * f) / f;
}

/** Emits the QUOTES array in EXACTLY the shape quote-cards.tsx expects —
 *  copy this and paste it directly over the existing `const QUOTES = ...`. */
function serializeQuotes(quotes: QuoteEntry[]) {
  const body = quotes
    .map((q) => {
      const t = q.trail;
      return `  {
    text: ${JSON.stringify(q.text)},
    position: {
      left: ${JSON.stringify(q.position.left)},
      top: ${JSON.stringify(q.position.top)},
      width: ${JSON.stringify(q.position.width)},
    },${q.emphasis ? "\n    emphasis: true," : ""}
    delay: ${q.delay},
    trail: {
      origin: { x: ${round(t.origin.x, 2)}, y: ${round(t.origin.y, 2)} },
      end: { x: ${round(t.end.x, 2)}, y: ${round(t.end.y, 2)} },
      control: { bend: ${round(t.control.bend, 3)}, skew: ${round(t.control.skew ?? 0.5, 2)} },
      gap: ${round(t.gap, 0)},
      minRadius: ${round(t.minRadius ?? 3, 1)},
      maxRadius: ${round(t.maxRadius ?? 8, 1)},
      minOpacity: ${round(t.minOpacity ?? 0.2, 2)},
      maxOpacity: ${round(t.maxOpacity ?? 0.85, 2)},
      delay: ${round(t.delay ?? 0, 2)},
    },
  }`;
    })
    .join(",\n");

  return `const QUOTES = [\n${body},\n];`;
}

// ── draggable handle (works in stage-percent coords) ────────────────────

function DragHandle({
  pointPct,
  stageWidth,
  stageHeight,
  color,
  shape,
  label,
  onChangePct,
}: {
  pointPct: Point;
  stageWidth: number;
  stageHeight: number;
  color: string;
  shape: "circle" | "diamond" | "triangle";
  label: string;
  onChangePct: (p: Point) => void;
}) {
  const draggingRef = useRef(false);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) return;
      const stage = (
        e.currentTarget.parentElement as HTMLElement
      ).getBoundingClientRect();
      const x = ((e.clientX - stage.left) / stage.width) * 100;
      const y = ((e.clientY - stage.top) / stage.height) * 100;
      onChangePct({
        x: Math.max(-20, Math.min(120, round(x, 2))),
        y: Math.max(-20, Math.min(120, round(y, 2))),
      });
    },
    [onChangePct],
  );

  const px = (pointPct.x / 100) * stageWidth;
  const py = (pointPct.y / 100) * stageHeight;

  const shapeStyle: React.CSSProperties =
    shape === "diamond"
      ? { borderRadius: "3px", transform: "rotate(45deg) scale(0.72)" }
      : shape === "triangle"
        ? {
            width: 0,
            height: 0,
            background: "transparent",
            borderLeft: "9px solid transparent",
            borderRight: "9px solid transparent",
            borderBottom: `16px solid ${color}`,
            boxShadow: "none",
          }
        : { borderRadius: "9999px" };

  return (
    <div
      role="button"
      aria-label={label}
      onPointerDown={(e) => {
        draggingRef.current = true;
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
      }}
      onPointerUp={(e) => {
        draggingRef.current = false;
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      }}
      onPointerMove={handlePointerMove}
      style={{
        position: "absolute",
        left: px,
        top: py,
        transform: "translate(-50%, -50%)",
        width: 20,
        height: 20,
        cursor: "grab",
        touchAction: "none",
        zIndex: 30,
      }}
      className="group"
    >
      <div
        style={{
          width: shape === "triangle" ? 0 : "100%",
          height: shape === "triangle" ? 0 : "100%",
          background: shape === "triangle" ? undefined : color,
          boxShadow:
            shape === "triangle"
              ? undefined
              : "0 0 0 2px rgba(255,255,255,0.95), 0 2px 6px rgba(0,0,0,0.5)",
          ...shapeStyle,
        }}
      />
      <span
        style={{
          position: "absolute",
          top: -22,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: 10,
          fontFamily: "monospace",
          color: "#fff",
          background: "rgba(0,0,0,0.75)",
          padding: "1px 5px",
          borderRadius: 4,
          whiteSpace: "nowrap",
          pointerEvents: "none",
          opacity: 0,
        }}
        className="group-hover:opacity-100"
      >
        {label}
      </span>
    </div>
  );
}

// ── compact bottom-bar slider ────────────────────────────────────────────

function BarSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <label
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        minWidth: 108,
      }}
    >
      <span
        style={{
          fontSize: 10,
          fontFamily: "monospace",
          color: "#999",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>{label}</span>
        <span style={{ color: "#d97757" }}>{value}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: "100%", accentColor: "#d97757" }}
      />
    </label>
  );
}

// ── main page ───────────────────────────────────────────────────────────

export default function CalibratorPage() {
  const [quotes, setQuotes] = useState<QuoteEntry[]>(INITIAL_QUOTES);
  const [activeId, setActiveId] = useState(quotes[0].id);
  const [copied, setCopied] = useState(false);
  const { ref: stageRef, size } = useStageSize<HTMLDivElement>();

  const active = quotes.find((q) => q.id === activeId)!;

  const updateActiveTrail = useCallback(
    (patch: Partial<ThoughtTrailConfig>) => {
      setQuotes((prev) =>
        prev.map((q) =>
          q.id === activeId ? { ...q, trail: { ...q.trail, ...patch } } : q,
        ),
      );
    },
    [activeId],
  );

  // The curvature handle drags an ABSOLUTE control point in stage-percent
  // space; we immediately convert it back to {bend, skew} so the stored
  // config never carries a redundant raw point — dragging IS editing
  // bend/skew, just via direct manipulation instead of two sliders.
  const updateControlPointPct = useCallback(
    (p: Point) => {
      setQuotes((prev) =>
        prev.map((q) => {
          if (q.id !== activeId) return q;
          const { bend, skew } = controlPointToBendSkew(
            q.trail.origin,
            q.trail.end,
            p,
          );
          return { ...q, trail: { ...q.trail, control: { bend, skew } } };
        }),
      );
    },
    [activeId],
  );

  const exportText = useMemo(() => serializeQuotes(quotes), [quotes]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(exportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const controlPointPct = getAbsoluteControlPoint(active.trail);

  // quick readout of how many circles the current gap produces, using the
  // same reference-width scaling the real ThoughtTrail uses, so the number
  // shown here matches what's actually on screen.
  const circleCount = useMemo(() => {
    if (!size.width) return 0;
    const scale = size.width / 1400;
    const origin = {
      x: (active.trail.origin.x / 100) * size.width,
      y: (active.trail.origin.y / 100) * size.height,
    };
    const end = {
      x: (active.trail.end.x / 100) * size.width,
      y: (active.trail.end.y / 100) * size.height,
    };
    const dist = Math.hypot(end.x - origin.x, end.y - origin.y);
    const gapPx = active.trail.gap * scale;
    const steps = Math.max(1, Math.round(dist / gapPx));
    return Math.max(1, steps - 1) + 1;
  }, [active.trail, size.width, size.height]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "#0d0d0d",
        color: "#fff",
      }}
    >
      {/* ── Stage: full width, exactly production's markup ── */}
      <div style={{ flex: 1, overflow: "auto", padding: "20px 20px 0" }}>
        <div
          ref={stageRef}
          style={{
            position: "relative",
            width: "100%",
            height: "82vh",
            minHeight: 560,
            maxHeight: 860,
            margin: "0 auto",
            overflow: "hidden",
          }}
        >
          <Image
            src="/assets/problem_bg.webp"
            alt=""
            fill
            className="object-cover object-[center_10%]"
            sizes="100vw"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(19,19,19,1) 0%, rgba(19,19,19,0.98) 34%, rgba(19,19,19,0.82) 46%, rgba(19,19,19,0.35) 58%, rgba(19,19,19,0.15) 70%, rgba(19,19,19,0.32) 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(19,19,19,0.45) 0%, rgba(19,19,19,0) 16%, rgba(19,19,19,0) 80%, rgba(19,19,19,0.55) 100%)",
            }}
          />

          {/* trails + bubbles — exactly the production components */}
          {quotes.map((q) => (
            <ThoughtTrail
              key={`trail-${q.id}`}
              config={q.trail}
              stageWidth={size.width}
              stageHeight={size.height}
              className="text-primary"
            />
          ))}

          {quotes.map((q, i) => (
            <motion.div
              key={q.id}
              initial={false}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              onClick={() => setActiveId(q.id)}
              style={{
                ...q.position,
                outline:
                  q.id === activeId
                    ? "1.5px dashed #d97757"
                    : "1.5px dashed transparent",
                outlineOffset: 4,
                cursor: "pointer",
              }}
              className={[
                "absolute box-border p-4 lg:p-5 xl:p-6 rounded-2xl glass-panel",
                q.emphasis ? "glass-panel-glow" : "",
              ].join(" ")}
            >
              <span
                style={{
                  position: "absolute",
                  top: -9,
                  left: -9,
                  width: 18,
                  height: 18,
                  borderRadius: "9999px",
                  background: q.id === activeId ? "#d97757" : "#333",
                  color: "#fff",
                  fontSize: 10,
                  fontFamily: "monospace",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {i + 1}
              </span>
              <p className="font-sans text-[14px] lg:text-[15px] xl:text-[17px] leading-snug text-on-surface">
                <span className="text-primary font-display text-2xl align-top mr-1 leading-none">
                  &ldquo;
                </span>
                {q.text}
                <span className="text-primary font-display text-2xl align-bottom ml-1 leading-none">
                  &rdquo;
                </span>
              </p>
            </motion.div>
          ))}

          {/* Curve preview line (very faint) so the arc shape is visible
              even between/beyond the rendered circles. */}
          {size.width > 0 && (
            <svg
              className="absolute inset-0 pointer-events-none overflow-visible"
              width={size.width}
              height={size.height}
            >
              <path
                d={(() => {
                  const o = {
                    x: (active.trail.origin.x / 100) * size.width,
                    y: (active.trail.origin.y / 100) * size.height,
                  };
                  const e = {
                    x: (active.trail.end.x / 100) * size.width,
                    y: (active.trail.end.y / 100) * size.height,
                  };
                  const c = {
                    x: (controlPointPct.x / 100) * size.width,
                    y: (controlPointPct.y / 100) * size.height,
                  };
                  return `M ${o.x} ${o.y} Q ${c.x} ${c.y} ${e.x} ${e.y}`;
                })()}
                fill="none"
                stroke="#d97757"
                strokeOpacity={0.35}
                strokeWidth={1.5}
                strokeDasharray="4 4"
              />
            </svg>
          )}

          {/* drag handles for the active quote only */}
          {size.width > 0 && (
            <>
              <DragHandle
                pointPct={active.trail.origin}
                stageWidth={size.width}
                stageHeight={size.height}
                color="#4ade80"
                shape="circle"
                label="origin"
                onChangePct={(p) => updateActiveTrail({ origin: p })}
              />
              <DragHandle
                pointPct={controlPointPct}
                stageWidth={size.width}
                stageHeight={size.height}
                color="#60a5fa"
                shape="triangle"
                label="curvature"
                onChangePct={updateControlPointPct}
              />
              <DragHandle
                pointPct={active.trail.end}
                stageWidth={size.width}
                stageHeight={size.height}
                color="#d97757"
                shape="diamond"
                label="end"
                onChangePct={(p) => updateActiveTrail({ end: p })}
              />
            </>
          )}
        </div>
      </div>

      {/* ── Bottom bar: quote switcher, density/size controls, export ── */}
      <div
        style={{
          flexShrink: 0,
          borderTop: "1px solid #2a2a2a",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        {/* quote switcher */}
        <div style={{ display: "flex", gap: 6 }}>
          {quotes.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setActiveId(q.id)}
              title={q.text}
              style={{
                width: 26,
                height: 26,
                borderRadius: "9999px",
                border:
                  q.id === activeId
                    ? "1.5px solid #d97757"
                    : "1.5px solid #333",
                background:
                  q.id === activeId ? "rgba(217,119,87,0.15)" : "transparent",
                color: "#fff",
                fontSize: 11,
                fontFamily: "monospace",
                cursor: "pointer",
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <div style={{ width: 1, height: 32, background: "#2a2a2a" }} />

        {/* legend for the three handle types — the actual curvature
            control is the drag handle on the stage above; these sliders
            are only for density/size, which aren't naturally "a point" */}
        <div
          style={{
            display: "flex",
            gap: 6,
            fontSize: 10,
            fontFamily: "monospace",
            color: "#888",
          }}
        >
          <span style={{ color: "#4ade80" }}>&#9679; origin</span>
          <span style={{ color: "#60a5fa" }}>&#9650; curvature</span>
          <span style={{ color: "#d97757" }}>&#9670; end</span>
        </div>

        <div style={{ width: 1, height: 32, background: "#2a2a2a" }} />

        <BarSlider
          label="gap (px @1400)"
          value={active.trail.gap}
          min={8}
          max={60}
          step={1}
          onChange={(v) => updateActiveTrail({ gap: v })}
        />
        <BarSlider
          label="min radius"
          value={active.trail.minRadius ?? 3}
          min={1}
          max={12}
          step={0.5}
          onChange={(v) => updateActiveTrail({ minRadius: v })}
        />
        <BarSlider
          label="max radius"
          value={active.trail.maxRadius ?? 8}
          min={1}
          max={16}
          step={0.5}
          onChange={(v) => updateActiveTrail({ maxRadius: v })}
        />
        <BarSlider
          label="min opacity"
          value={active.trail.minOpacity ?? 0.2}
          min={0}
          max={1}
          step={0.02}
          onChange={(v) => updateActiveTrail({ minOpacity: v })}
        />
        <BarSlider
          label="max opacity"
          value={active.trail.maxOpacity ?? 0.85}
          min={0}
          max={1}
          step={0.02}
          onChange={(v) => updateActiveTrail({ maxOpacity: v })}
        />

        <div style={{ fontSize: 10, fontFamily: "monospace", color: "#666" }}>
          {circleCount} circles
        </div>

        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <button
            onClick={handleCopy}
            style={{
              fontSize: 11,
              padding: "8px 14px",
              borderRadius: 6,
              border: "1px solid #d97757",
              background: copied ? "#d97757" : "transparent",
              color: "#fff",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {copied ? "Copied!" : "Copy QUOTES array"}
          </button>
        </div>
      </div>
    </div>
  );
}
