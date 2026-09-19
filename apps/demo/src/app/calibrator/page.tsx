"use client";

/**
 * /calibrator  — drag the trail points, copy the result back into quote-cards.tsx
 *
 * Put this at:  app/calibrator/page.tsx   (pages router: pages/calibrator.tsx)
 * Adjust the ThoughtTrail import below to wherever your component lives.
 *
 * What it does
 *  - Renders the SAME 9:4 stage as problem-section.tsx (same photo, same
 *    gradients, same cqw sizing for bubbles, same trail scaling `k`).
 *  - For the selected quote you get three handles on the stage:
 *        O = origin   (where the trail leaves the man)
 *        C = control  (the curve's pull point, stored as { bend, skew })
 *        E = end      (where the trail meets the bubble)
 *  - You can also drag a bubble to move it, and drag its right edge to resize.
 *  - Arrow keys nudge the active handle (Shift = 1% instead of 0.1%).
 *  - Everything autosaves to localStorage; the "Code" box is a ready-to-paste
 *    replacement for the QUOTES array.
 *
 * ASSUMPTION about `control` (I couldn't see thought-trail.tsx):
 *   control point = origin + skew * (end - origin) + bend * |end - origin| * n
 *   where n is the unit vector perpendicular to origin→end, computed in stage
 *   pixels. If the dashed guide curve does not sit on the real dots, tick
 *   "Flip bend sign" first. If it's still off, edit controlPoint()/solveControl()
 *   below — they are the only two places that encode this assumption.
 *
 * This is a dev tool: it 404s in production builds. Remove the guard at the
 * bottom if you want it on a deployed preview.
 */

import Image from "next/image";
import { notFound } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ThoughtTrail,
  type ThoughtTrailConfig,
} from "@/components/thought-trail"; // <-- adjust path

/* -------------------------------------------------------------------------- */
/*  Data (copied from quote-cards.tsx)                                        */
/* -------------------------------------------------------------------------- */

const REF_STAGE_WIDTH = 1440;
const STORAGE_KEY = "calibrator:quotes:v1";

type Pt = { x: number; y: number };
type Quote = {
  text: string;
  box: { left: number; top: number; width: number };
  emphasis?: boolean;
  delay: number;
  trail: ThoughtTrailConfig;
};
type Handle = "origin" | "control" | "end";
type Active = Handle | "box";

const DEFAULTS: Quote[] = [
  {
    text: "My ideas are good, but I freeze when I speak.",
    box: { left: 52.2, top: 4.3, width: 24.9 },
    emphasis: true,
    delay: 0.1,
    trail: {
      origin: { x: 64.68, y: 44 },
      end: { x: 69.89, y: 23.71 },
      control: { bend: 0.3, skew: 0.97 },
      gap: 26,
      minRadius: 3,
      maxRadius: 8,
      minOpacity: 0.2,
      maxOpacity: 0.85,
      delay: 0.05,
    },
  },
  {
    text: "I stumble, use 'umm...' too often.",
    box: { left: 74.4, top: 21.9, width: 22.2 },
    delay: 0.25,
    trail: {
      origin: { x: 69.21, y: 41.17 },
      end: { x: 74.27, y: 36.16 },
      control: { bend: 0.119, skew: 0.96 },
      gap: 24,
      minRadius: 3,
      maxRadius: 7,
      minOpacity: 0.2,
      maxOpacity: 0.85,
      delay: 0.2,
    },
  },
  {
    text: "I don't sound as confident as others.",
    box: { left: 71.4, top: 44.1, width: 21.4 },
    delay: 0.4,
    trail: {
      origin: { x: 65.5, y: 54.67 },
      end: { x: 71.9, y: 55.04 },
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
    text: "I know the topic, but I can't explain it well.",
    box: { left: 66.4, top: 65.3, width: 24.9 },
    emphasis: true,
    delay: 0.55,
    trail: {
      origin: { x: 58.43, y: 71.79 },
      end: { x: 66.53, y: 77.64 },
      control: { bend: 0.287, skew: 0.82 },
      gap: 26,
      minRadius: 3,
      maxRadius: 8,
      minOpacity: 0.2,
      maxOpacity: 0.85,
      delay: 0.5,
    },
  },
];

/* -------------------------------------------------------------------------- */
/*  Small helpers                                                             */
/* -------------------------------------------------------------------------- */

const clamp = (n: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, n));
const round = (n: number, d = 2) => Math.round(n * 10 ** d) / 10 ** d;
const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v)) as T;

/**
 * control (bend, skew)  ->  point, in stage %.
 * All maths is done in PIXELS so "perpendicular" is really perpendicular on a
 * 9:4 stage, then converted back to %.
 */
function controlPoint(
  o: Pt,
  e: Pt,
  bend: number,
  skew: number = 0.5,
  w: number,
  h: number,
  sign: 1 | -1,
): Pt {
  if (!w || !h) return o;
  const ox = (o.x / 100) * w;
  const oy = (o.y / 100) * h;
  const dx = (e.x / 100) * w - ox;
  const dy = (e.y / 100) * h - oy;
  const len = Math.hypot(dx, dy);
  if (len < 1e-6) return o;
  const nx = -dy / len;
  const ny = dx / len;
  const px = ox + skew * dx + sign * bend * len * nx;
  const py = oy + skew * dy + sign * bend * len * ny;
  return { x: (px / w) * 100, y: (py / h) * 100 };
}

/** point (stage %)  ->  control { bend, skew }. Exact inverse of the above. */
function solveControl(
  o: Pt,
  e: Pt,
  p: Pt,
  w: number,
  h: number,
  sign: 1 | -1,
): { bend: number; skew: number } {
  const ox = (o.x / 100) * w;
  const oy = (o.y / 100) * h;
  const dx = (e.x / 100) * w - ox;
  const dy = (e.y / 100) * h - oy;
  const len = Math.hypot(dx, dy);
  if (len < 1e-6) return { bend: 0, skew: 0 };
  const rx = (p.x / 100) * w - ox;
  const ry = (p.y / 100) * h - oy;
  const skew = (rx * dx + ry * dy) / (len * len);
  const bend = (sign * (rx * -dy + ry * dx)) / (len * len);
  return { bend, skew };
}

function toSource(items: Quote[]): string {
  const p = (n: number | undefined = 0, d = 2) => String(round(n ?? 0, d));
  const body = items
    .map((q) => {
      const t = q.trail;
      return [
        `  {`,
        `    text: ${JSON.stringify(q.text)},`,
        `    box: { left: ${p(q.box.left, 1)}, top: ${p(q.box.top, 1)}, width: ${p(q.box.width, 1)} },`,
        q.emphasis ? `    emphasis: true,` : null,
        `    delay: ${p(q.delay)},`,
        `    trail: {`,
        `      origin: { x: ${p(t.origin.x)}, y: ${p(t.origin.y)} },`,
        `      end: { x: ${p(t.end.x)}, y: ${p(t.end.y)} },`,
        `      control: { bend: ${p(t.control.bend, 3)}, skew: ${p(t.control.skew ?? 0.5, 3)} },`,
        `      gap: ${p(t.gap)},`,
        `      minRadius: ${p(t.minRadius ?? 3)},`,
        `      maxRadius: ${p(t.maxRadius ?? 9)},`,
        `      minOpacity: ${p(t.minOpacity ?? 0.25)},`,
        `      maxOpacity: ${p(t.maxOpacity ?? 0.9)},`,
        `      delay: ${p(t.delay ?? 0)},`,
        `    },`,
        `  },`,
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");
  return `const QUOTES: Quote[] = [\n${body}\n];\n`;
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

const HANDLE_STYLE: Record<
  Handle,
  { label: string; bg: string; title: string }
> = {
  origin: { label: "O", bg: "#38bdf8", title: "Origin" },
  control: { label: "C", bg: "#fbbf24", title: "Control" },
  end: { label: "E", bg: "#f472b6", title: "End" },
};

function Calibrator() {
  const [items, setItems] = useState<Quote[]>(() => clone(DEFAULTS));
  const [loaded, setLoaded] = useState(false);
  const [sel, setSel] = useState(0);
  const [active, setActive] = useState<Active>("control");

  const [showGrid, setShowGrid] = useState(false);
  const [showShade, setShowShade] = useState(true);
  const [showGuide, setShowGuide] = useState(true);
  const [solo, setSolo] = useState(false);
  const [flip, setFlip] = useState(false);
  const [replay, setReplay] = useState(0);
  const [copied, setCopied] = useState(false);

  const sign: 1 | -1 = flip ? -1 : 1;

  const stageRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  const itemsRef = useRef(items);
  itemsRef.current = items;

  const drag = useRef<null | {
    i: number;
    kind: Handle | "box" | "width";
    ox: number;
    oy: number;
  }>(null);

  /* ---------- persistence ---------- */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { items?: Quote[]; flip?: boolean };
        if (
          Array.isArray(parsed.items) &&
          parsed.items.length === DEFAULTS.length
        ) {
          setItems(parsed.items);
          if (typeof parsed.flip === "boolean") setFlip(parsed.flip);
        }
      }
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, flip }));
    } catch {
      /* ignore */
    }
  }, [items, flip, loaded]);

  /* ---------- measure the stage ---------- */
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const r = entry.contentRect;
      setSize({ w: r.width, h: r.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* Same px scaling QuoteCards applies to the trail dots. */
  const k = useMemo(
    () => Math.min(1.25, Math.max(0.6, size.w / REF_STAGE_WIDTH || 1)),
    [size.w],
  );

  const trails = useMemo(
    () =>
      items.map((q) => ({
        ...q.trail,
        gap: q.trail.gap * k,
        minRadius: (q.trail.minRadius ?? 3) * k,
        maxRadius: (q.trail.maxRadius ?? 9) * k,
      })),
    [items, k],
  );

  /* ---------- editing ---------- */
  const patchItem = useCallback(
    (i: number, fn: (q: Quote) => Quote) =>
      setItems((prev) => prev.map((q, j) => (j === i ? fn(q) : q))),
    [],
  );

  const setHandle = useCallback(
    (i: number, kind: Handle, p: Pt) => {
      const pt = { x: clamp(p.x, 0, 100), y: clamp(p.y, 0, 100) };
      patchItem(i, (q) => {
        const t = q.trail;
        if (kind === "origin") return { ...q, trail: { ...t, origin: pt } };
        if (kind === "end") return { ...q, trail: { ...t, end: pt } };
        if (!size.w) return q;
        const c = solveControl(t.origin, t.end, pt, size.w, size.h, sign);
        return { ...q, trail: { ...t, control: { ...t.control, ...c } } };
      });
    },
    [patchItem, size.w, size.h, sign],
  );

  const cur = items[sel];
  const ctrl = useMemo(
    () =>
      controlPoint(
        cur.trail.origin,
        cur.trail.end,
        cur.trail.control.bend,
        cur.trail.control.skew ?? 0.5,
        size.w,
        size.h,
        sign,
      ),
    [cur, size.w, size.h, sign],
  );

  const handlePos: Record<Handle, Pt> = {
    origin: cur.trail.origin,
    control: ctrl,
    end: cur.trail.end,
  };

  /* ---------- pointer plumbing ---------- */
  const pctFromEvent = (e: React.PointerEvent): Pt => {
    const r = stageRef.current!.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    };
  };

  const startHandleDrag = (e: React.PointerEvent, kind: Handle) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { i: sel, kind, ox: 0, oy: 0 };
    setActive(kind);
  };

  const startBoxDrag = (e: React.PointerEvent, i: number) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = pctFromEvent(e);
    const b = itemsRef.current[i].box;
    drag.current = { i, kind: "box", ox: p.x - b.left, oy: p.y - b.top };
    setSel(i);
    setActive("box");
  };

  const startWidthDrag = (e: React.PointerEvent, i: number) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { i, kind: "width", ox: 0, oy: 0 };
  };

  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const p = pctFromEvent(e);
    if (d.kind === "box") {
      patchItem(d.i, (q) => ({
        ...q,
        box: {
          ...q.box,
          left: clamp(p.x - d.ox, 0, 100 - q.box.width),
          top: clamp(p.y - d.oy, 0, 100),
        },
      }));
    } else if (d.kind === "width") {
      patchItem(d.i, (q) => ({
        ...q,
        box: { ...q.box, width: clamp(p.x - q.box.left, 5, 100 - q.box.left) },
      }));
    } else {
      setHandle(d.i, d.kind, p);
    }
  };

  const endDrag = () => {
    drag.current = null;
  };

  /* ---------- keyboard nudge ---------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      const dirs: Record<string, [number, number]> = {
        ArrowLeft: [-1, 0],
        ArrowRight: [1, 0],
        ArrowUp: [0, -1],
        ArrowDown: [0, 1],
      };
      const dir = dirs[e.key];
      if (!dir) return;
      e.preventDefault();
      const step = e.shiftKey ? 1 : 0.1;
      const q = itemsRef.current[sel];
      if (active === "box") {
        patchItem(sel, (it) => ({
          ...it,
          box: {
            ...it.box,
            left: clamp(it.box.left + dir[0] * step, 0, 100 - it.box.width),
            top: clamp(it.box.top + dir[1] * step, 0, 100),
          },
        }));
        return;
      }
      const from: Pt =
        active === "origin"
          ? q.trail.origin
          : active === "end"
            ? q.trail.end
            : controlPoint(
                q.trail.origin,
                q.trail.end,
                q.trail.control.bend,
                q.trail.control.skew ?? 0.5,
                size.w,
                size.h,
                sign,
              );
      setHandle(sel, active, {
        x: from.x + dir[0] * step,
        y: from.y + dir[1] * step,
      });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sel, active, patchItem, setHandle, size.w, size.h, sign]);

  /* ---------- panel field helpers ---------- */
  const upTrail = (patch: Partial<ThoughtTrailConfig>) =>
    patchItem(sel, (q) => ({ ...q, trail: { ...q.trail, ...patch } }));
  const upBox = (patch: Partial<Quote["box"]>) =>
    patchItem(sel, (q) => ({ ...q, box: { ...q.box, ...patch } }));

  const code = useMemo(() => toSource(items), [items]);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked: user can select the textarea manually */
    }
  };

  const resetOne = () => patchItem(sel, () => clone(DEFAULTS[sel]));
  const resetAll = () => setItems(clone(DEFAULTS));

  const visibleTrails = solo ? [sel] : items.map((_, i) => i);

  /* ---------------------------------------------------------------------- */

  return (
    <main className="min-h-screen bg-surface text-on-surface font-sans">
      {/* Toolbar */}
      <div className="sticky top-0 z-50 flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-white/10 bg-black/80 px-4 py-2.5 text-xs backdrop-blur">
        <div className="flex items-center gap-1.5">
          {items.map((q, i) => (
            <button
              key={q.text}
              onClick={() => setSel(i)}
              title={q.text}
              className={[
                "h-7 w-7 rounded-md border text-[13px] font-semibold",
                i === sel
                  ? "border-amber-300 bg-amber-300 text-black"
                  : "border-white/20 text-white/70 hover:border-white/50",
              ].join(" ")}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <Toggle label="Grid (10%)" v={showGrid} set={setShowGrid} />
        <Toggle label="Photo shading" v={showShade} set={setShowShade} />
        <Toggle label="Guide curve" v={showGuide} set={setShowGuide} />
        <Toggle label="Solo trail" v={solo} set={setSolo} />
        <Toggle label="Flip bend sign" v={flip} set={setFlip} />

        <div className="ml-auto flex items-center gap-2">
          <Btn onClick={() => setReplay((n) => n + 1)}>Replay trails</Btn>
          <Btn onClick={resetOne}>Reset #{sel + 1}</Btn>
          <Btn onClick={resetAll}>Reset all</Btn>
          <Btn onClick={copyCode} primary>
            {copied ? "Copied" : "Copy code"}
          </Btn>
        </div>
      </div>

      <p className="px-4 pt-3 text-xs text-white/50">
        Drag <b className="text-sky-300">O</b> (origin),{" "}
        <b className="text-amber-300">C</b> (control) and{" "}
        <b className="text-pink-300">E</b> (end). Drag a bubble to move it, drag
        its right edge to resize. Arrow keys nudge the active handle (Shift =
        1%).
      </p>

      {/* Stage — identical to the poster in problem-section.tsx */}
      <div className="px-4 py-3">
        <div
          ref={stageRef}
          className="relative mx-auto w-full max-w-[1680px] aspect-[9/4] overflow-hidden select-none touch-none"
        >
          <Image
            src="/assets/problem_bg.webp"
            alt=""
            fill
            className="object-cover object-[center_10%]"
            sizes="(min-width: 1680px) 1680px, 100vw"
            priority
          />

          {showShade && (
            <>
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to right, rgba(19,19,19,1) 0%, rgba(19,19,19,0.98) 34%, rgba(19,19,19,0.82) 46%, rgba(19,19,19,0.35) 58%, rgba(19,19,19,0.15) 70%, rgba(19,19,19,0.32) 100%)",
                }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(19,19,19,0.45) 0%, rgba(19,19,19,0) 16%, rgba(19,19,19,0) 80%, rgba(19,19,19,0.55) 100%)",
                }}
              />
            </>
          )}

          {showGrid && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(255,255,255,.14) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.14) 1px, transparent 1px)",
                backgroundSize: "10% 10%",
              }}
            />
          )}

          {/* Same container QuoteCards uses, so cqw resolves against the stage */}
          <div
            className="absolute inset-0"
            style={{ containerType: "inline-size" }}
            onPointerMove={onMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            {/* Real trails, driven by live state */}
            <div className="absolute inset-0 pointer-events-none z-[15]">
              {visibleTrails.map((i) => (
                <ThoughtTrail
                  key={`trail-${i}-${replay}`}
                  config={trails[i]}
                  stageWidth={size.w}
                  stageHeight={size.h}
                  className="text-primary"
                />
              ))}
            </div>

            {/* Bubbles */}
            {items.map((q, i) => {
              const isSel = i === sel;
              return (
                <div
                  key={q.text}
                  onPointerDown={(e) => startBoxDrag(e, i)}
                  style={{
                    left: `${q.box.left}%`,
                    top: `${q.box.top}%`,
                    width: `${q.box.width}%`,
                    padding: "1.15cqw",
                    borderRadius: "1.2cqw",
                    fontSize: "clamp(11px, 1.23cqw, 20px)",
                  }}
                  className={[
                    "absolute box-border glass-panel z-10 cursor-move",
                    q.emphasis ? "glass-panel-glow" : "",
                    isSel
                      ? "outline outline-2 outline-amber-300/80"
                      : "opacity-70",
                  ].join(" ")}
                >
                  <p className="font-sans leading-snug text-on-surface">
                    <span
                      aria-hidden
                      className="text-primary font-display align-top mr-1 leading-none"
                      style={{ fontSize: "1.6em" }}
                    >
                      &ldquo;
                    </span>
                    {q.text}
                    <span
                      aria-hidden
                      className="text-primary font-display align-bottom ml-1 leading-none"
                      style={{ fontSize: "1.6em" }}
                    >
                      &rdquo;
                    </span>
                  </p>
                  {isSel && (
                    <div
                      onPointerDown={(e) => startWidthDrag(e, i)}
                      title="Drag to resize"
                      className="absolute right-0 top-0 h-full w-2 cursor-ew-resize rounded-r bg-amber-300/50 hover:bg-amber-300"
                    />
                  )}
                </div>
              );
            })}

            {/* Guide: dashed control polygon + the quadratic it implies */}
            {showGuide && size.w > 0 && (
              <svg
                className="absolute inset-0 pointer-events-none z-20"
                width={size.w}
                height={size.h}
                viewBox={`0 0 ${size.w} ${size.h}`}
              >
                {(() => {
                  const px = (p: Pt) => ({
                    x: (p.x / 100) * size.w,
                    y: (p.y / 100) * size.h,
                  });
                  const o = px(cur.trail.origin);
                  const c = px(ctrl);
                  const e = px(cur.trail.end);
                  return (
                    <>
                      <path
                        d={`M${o.x},${o.y} L${c.x},${c.y} L${e.x},${e.y}`}
                        fill="none"
                        stroke="rgba(255,255,255,.35)"
                        strokeWidth={1}
                        strokeDasharray="4 4"
                      />
                      <path
                        d={`M${o.x},${o.y} Q${c.x},${c.y} ${e.x},${e.y}`}
                        fill="none"
                        stroke="#fbbf24"
                        strokeWidth={1.5}
                      />
                    </>
                  );
                })()}
              </svg>
            )}

            {/* Handles */}
            {(Object.keys(HANDLE_STYLE) as Handle[]).map((kind) => {
              const s = HANDLE_STYLE[kind];
              const pos = handlePos[kind];
              const isActive = active === kind;
              return (
                <div
                  key={kind}
                  title={`${s.title} (${round(pos.x)}, ${round(pos.y)})`}
                  onPointerDown={(e) => startHandleDrag(e, kind)}
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    background: s.bg,
                  }}
                  className={[
                    "absolute z-30 flex h-[22px] w-[22px] -translate-x-1/2 -translate-y-1/2 cursor-grab items-center justify-center text-[11px] font-bold text-black shadow-[0_0_0_2px_rgba(0,0,0,.6)] active:cursor-grabbing",
                    kind === "control" ? "rounded-[5px]" : "rounded-full",
                    isActive ? "ring-2 ring-white" : "",
                  ].join(" ")}
                >
                  {s.label}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Numbers + output */}
      <div className="mx-auto grid max-w-[1680px] gap-6 px-4 pb-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section className="space-y-5">
          <h2 className="text-sm font-semibold">
            Quote {sel + 1}{" "}
            <span className="font-normal text-white/50">— {cur.text}</span>
          </h2>

          <Group title="Origin (%)">
            <Num
              label="x"
              value={cur.trail.origin.x}
              onChange={(v) =>
                upTrail({ origin: { ...cur.trail.origin, x: v } })
              }
            />
            <Num
              label="y"
              value={cur.trail.origin.y}
              onChange={(v) =>
                upTrail({ origin: { ...cur.trail.origin, y: v } })
              }
            />
          </Group>

          <Group title="End (%)">
            <Num
              label="x"
              value={cur.trail.end.x}
              onChange={(v) => upTrail({ end: { ...cur.trail.end, x: v } })}
            />
            <Num
              label="y"
              value={cur.trail.end.y}
              onChange={(v) => upTrail({ end: { ...cur.trail.end, y: v } })}
            />
          </Group>

          <Group title="Control">
            <Num
              label="bend"
              step={0.01}
              value={cur.trail.control.bend}
              onChange={(v) =>
                upTrail({ control: { ...cur.trail.control, bend: v } })
              }
            />
            <Num
              label="skew"
              step={0.01}
              value={cur.trail.control.skew ?? 0.5}
              onChange={(v) =>
                upTrail({ control: { ...cur.trail.control, skew: v } })
              }
            />
            <p className="col-span-2 text-[11px] text-white/40">
              C handle sits at ({round(ctrl.x)}, {round(ctrl.y)}) % of the
              stage. Moving O or E keeps bend/skew, so the curve keeps its
              shape.
            </p>
          </Group>

          <Group title="Dots (px at 1440-wide stage)">
            <Num
              label="gap"
              step={1}
              value={cur.trail.gap}
              onChange={(v) => upTrail({ gap: v })}
            />
            <Num
              label="delay (s)"
              step={0.05}
              value={cur.trail.delay ?? 0}
              onChange={(v) => upTrail({ delay: v })}
            />
            <Num
              label="min radius"
              step={0.5}
              value={cur.trail.minRadius ?? 3}
              onChange={(v) => upTrail({ minRadius: v })}
            />
            <Num
              label="max radius"
              step={0.5}
              value={cur.trail.maxRadius ?? 9}
              onChange={(v) => upTrail({ maxRadius: v })}
            />
            <Num
              label="min opacity"
              step={0.05}
              value={cur.trail.minOpacity ?? 0.25}
              onChange={(v) => upTrail({ minOpacity: v })}
            />
            <Num
              label="max opacity"
              step={0.05}
              value={cur.trail.maxOpacity ?? 0.9}
              onChange={(v) => upTrail({ maxOpacity: v })}
            />
          </Group>

          <Group title="Bubble (% of stage)">
            <Num
              label="left"
              value={cur.box.left}
              onChange={(v) => upBox({ left: v })}
            />
            <Num
              label="top"
              value={cur.box.top}
              onChange={(v) => upBox({ top: v })}
            />
            <Num
              label="width"
              value={cur.box.width}
              onChange={(v) => upBox({ width: v })}
            />
            <Num
              label="reveal delay (s)"
              step={0.05}
              value={cur.delay}
              onChange={(v) => patchItem(sel, (q) => ({ ...q, delay: v }))}
            />
          </Group>
        </section>

        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Code</h2>
            <span className="text-[11px] text-white/40">
              Replace the QUOTES array in quote-cards.tsx
            </span>
          </div>
          <textarea
            readOnly
            value={code}
            onFocus={(e) => e.currentTarget.select()}
            spellCheck={false}
            className="h-[560px] w-full resize-y rounded-md border border-white/10 bg-black/50 p-3 font-mono text-[12px] leading-relaxed text-white/85 outline-none focus:border-amber-300/60"
          />
        </section>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/*  Tiny UI bits                                                              */
/* -------------------------------------------------------------------------- */

function Toggle({
  label,
  v,
  set,
}: {
  label: string;
  v: boolean;
  set: (b: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-1.5 text-white/70">
      <input
        type="checkbox"
        checked={v}
        onChange={(e) => set(e.target.checked)}
        className="accent-amber-300"
      />
      {label}
    </label>
  );
}

function Btn({
  children,
  onClick,
  primary,
}: {
  children: React.ReactNode;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "rounded-md border px-3 py-1.5 text-xs font-medium",
        primary
          ? "border-amber-300 bg-amber-300 text-black hover:bg-amber-200"
          : "border-white/20 text-white/80 hover:border-white/50",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function Group({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="rounded-md border border-white/10 p-3">
      <legend className="px-1 text-[11px] text-white/50">{title}</legend>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{children}</div>
    </fieldset>
  );
}

const fmt = (n: number) => String(round(n, 3));

/** Number input that lets you type freely and steps with ArrowUp/Down. */
function Num({
  label,
  value = 0,
  onChange,
  step = 0.1,
}: {
  label: string;
  value?: number;
  onChange: (n: number) => void;
  step?: number;
}) {
  const [text, setText] = useState(fmt(value));
  const focused = useRef(false);

  useEffect(() => {
    if (!focused.current) setText(fmt(value));
  }, [value]);

  return (
    <label className="flex flex-col gap-1 text-[11px] text-white/50">
      {label}
      <input
        inputMode="decimal"
        value={text}
        onFocus={() => (focused.current = true)}
        onBlur={() => {
          focused.current = false;
          setText(fmt(value));
        }}
        onChange={(e) => {
          setText(e.target.value);
          const n = parseFloat(e.target.value);
          if (Number.isFinite(n)) onChange(n);
        }}
        onKeyDown={(e) => {
          if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
          e.preventDefault();
          const d =
            (e.key === "ArrowUp" ? 1 : -1) * (e.shiftKey ? step * 10 : step);
          const next = round(value + d, 3);
          setText(fmt(next));
          onChange(next);
        }}
        className="rounded border border-white/15 bg-black/40 px-2 py-1 text-[13px] text-white outline-none focus:border-amber-300/70"
      />
    </label>
  );
}

/* -------------------------------------------------------------------------- */

export default function CalibratorPage() {
  // Dev tool only. Delete these two lines to expose it in production.
  if (process.env.NODE_ENV === "production") notFound();
  return <Calibrator />;
}
