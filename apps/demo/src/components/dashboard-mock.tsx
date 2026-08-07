"use client";

import { motion } from "framer-motion";
import { AudioLines, Play, Maximize2, Rewind } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const TABS = ["Overview", "Voice", "Language", "Structure", "Delivery"];

const RADAR_LABELS = [
  { key: "Confidence", value: 8.8, angle: -90 },
  { key: "Clarity", value: 8.3, angle: -30 },
  { key: "Structure", value: 7.9, angle: 30 },
  { key: "Engagement", value: 8.1, angle: 90 },
  { key: "Fluency", value: 8.5, angle: 150 },
  { key: "Stability", value: 8.5, angle: 210 },
];

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const a = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function RadarChart() {
  const cx = 130;
  const cy = 120;
  const maxR = 78;

  const points = RADAR_LABELS.map((l) => {
    const r = (l.value / 10) * maxR;
    return polar(cx, cy, r, l.angle);
  });
  const pointsStr = points.map((p) => `${p.x},${p.y}`).join(" ");

  const gridLevels = [0.25, 0.5, 0.75, 1];

  return (
    <svg viewBox="0 0 260 240" className="w-full h-full">
      {gridLevels.map((lvl) => {
        const gridPts = RADAR_LABELS.map((l) =>
          polar(cx, cy, maxR * lvl, l.angle)
        );
        return (
          <polygon
            key={lvl}
            points={gridPts.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={1}
          />
        );
      })}
      {RADAR_LABELS.map((l) => {
        const p = polar(cx, cy, maxR, l.angle);
        return (
          <line
            key={l.key}
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={1}
          />
        );
      })}
      <motion.polygon
        points={pointsStr}
        fill="rgba(242,202,80,0.18)"
        stroke="#f2ca50"
        strokeWidth={1.5}
        strokeLinejoin="round"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={2.5} fill="#f2ca50" />
      ))}
      {RADAR_LABELS.map((l) => {
        const labelR = maxR + 30;
        const p = polar(cx, cy, labelR, l.angle);
        return (
          <text
            key={l.key}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            className="fill-on-surface-variant"
            style={{ fontSize: "9px", fontFamily: "var(--font-sans)" }}
          >
            <tspan x={p.x} dy="-2">{l.key}</tspan>
            <tspan x={p.x} dy="11" className="fill-on-surface" style={{fontWeight: 600}}>{l.value}</tspan>
          </text>
        );
      })}
    </svg>
  );
}

function Waveform() {
  const barsRef = useRef<number[]>([]);
  if (barsRef.current.length === 0) {
    barsRef.current = Array.from({ length: 90 }, () => 0.15 + Math.random() * 0.85);
  }
  const bars = barsRef.current;

  const markers = [
    { pos: 0.14, color: "#e0a63a" },
    { pos: 0.5, color: "#7fb98a" },
    { pos: 0.78, color: "#d9705f" },
  ];

  return (
    <div className="relative h-14 w-full flex items-center gap-[2px]">
      {bars.map((h, i) => {
        const pos = i / bars.length;
        let color = "rgba(255,255,255,0.25)";
        markers.forEach((m) => {
          if (Math.abs(pos - m.pos) < 0.03) color = m.color;
        });
        return (
          <motion.div
            key={i}
            className="flex-1 rounded-full"
            style={{ backgroundColor: color, minWidth: 2 }}
            initial={{ height: "10%" }}
            whileInView={{ height: `${h * 100}%` }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{
              duration: 0.5,
              delay: i * 0.006,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        );
      })}
    </div>
  );
}

export function DashboardMock() {
  const [activeTab, setActiveTab] = useState(0);
  const [progress, setProgress] = useState(0.8);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => (p >= 0.95 ? 0.6 : p + 0.01));
    }, 400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="w-full h-full bg-[#131313] rounded-[10px] overflow-hidden flex text-on-surface select-none">
      {/* Sidebar */}
      <div className="hidden md:flex w-[150px] shrink-0 flex-col border-r border-white/5 py-5 px-4">
        <div className="flex items-center gap-2 mb-8 px-1">
          <AudioLines size={16} className="text-primary" />
          <span className="font-sans font-bold text-sm">Voxem</span>
        </div>
        <div className="flex flex-col gap-1">
          {["Overview", "Sessions", "Analytics", "Practice", "Goals", "Settings"].map(
            (item, i) => (
              <div
                key={item}
                className={`text-xs px-3 py-2 rounded-lg font-sans ${
                  i === 0
                    ? "bg-primary/15 text-primary font-semibold"
                    : "text-on-surface-variant"
                }`}
              >
                {item}
              </div>
            )
          )}
        </div>
        <div className="mt-auto">
          <div className="rounded-lg bg-white/5 p-3 mb-3">
            <p className="text-[10px] text-on-surface-variant">Session Streak</p>
            <p className="text-sm font-bold text-primary">🔥 12 days</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 md:p-5 overflow-hidden flex flex-col min-w-0">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <div>
            <h3 className="font-sans font-bold text-sm md:text-base">
              Welcome back, Alex 👋
            </h3>
            <p className="text-[10px] md:text-xs text-on-surface-variant">
              Here&apos;s your latest feedback
            </p>
          </div>
          <div className="hidden md:flex items-center gap-1.5 bg-primary text-on-primary text-xs font-bold rounded-full px-4 py-2">
            + New Session
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-3 md:gap-4 flex-1 min-h-0">
          {/* Video / tabs card */}
          <div className="rounded-xl border border-white/8 bg-white/[0.02] p-3 md:p-4 flex flex-col min-h-0">
            <div className="flex gap-3 md:gap-4 mb-3 text-[10px] md:text-xs font-sans shrink-0 overflow-x-auto hide-scrollbar">
              {TABS.map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(i)}
                  className={`pb-1.5 whitespace-nowrap relative font-semibold transition-colors ${
                    activeTab === i
                      ? "text-on-surface"
                      : "text-on-surface-variant/70"
                  }`}
                >
                  {tab}
                  {activeTab === i && (
                    <motion.div
                      layoutId="dash-tab-underline"
                      className="absolute left-0 right-0 -bottom-0 h-[2px] bg-primary"
                    />
                  )}
                </button>
              ))}
            </div>
            <div className="relative flex-1 rounded-lg overflow-hidden bg-black/40 min-h-[120px]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#2a2420] via-[#1a1714] to-black" />
              <div className="absolute inset-0 flex items-end justify-center">
                <div className="w-3/4 h-4/5 rounded-t-full bg-gradient-to-t from-[#3a2f22]/60 to-transparent" />
              </div>
              <motion.div
                className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/50 rounded-full px-2 py-1"
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-alert" />
                <span className="text-[9px] font-bold">REC</span>
              </motion.div>

              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                <div className="w-full h-1 bg-white/20 rounded-full mb-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${progress * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-on-surface-variant">
                  <div className="flex items-center gap-2">
                    <Play size={12} className="text-on-surface" fill="currentColor" />
                    <span>
                      {(progress * 3).toFixed(2).replace(".", ":")} / 3:00
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>1x</span>
                    <Rewind size={12} />
                    <Maximize2 size={11} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Score card */}
          <div className="rounded-xl border border-white/8 bg-white/[0.02] p-3 md:p-4 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-1 shrink-0">
              <span className="text-xs md:text-sm font-sans font-bold">
                Overall Score
              </span>
              <span className="text-xl md:text-2xl font-display text-primary">
                8.4<span className="text-[10px] text-on-surface-variant font-sans">/10</span>
              </span>
            </div>
            <div className="flex-1 min-h-0">
              <RadarChart />
            </div>
          </div>
        </div>

        {/* Bottom feedback strip */}
        <div className="hidden md:grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/5 shrink-0">
          {[
            { time: "0:42", label: "Long pause", desc: "Try using a transition phrase.", color: "#e0a63a" },
            { time: "1:36", label: "Great emphasis", desc: "Strong, confident tone.", color: "#7fb98a" },
            { time: "2:05", label: "Too many fillers", desc: "\u201cum\u201d used in 10 seconds.", color: "#d9705f" },
          ].map((item) => (
            <div key={item.time}>
              <p className="text-[10px] font-bold" style={{ color: item.color }}>
                {item.time} — {item.label}
              </p>
              <p className="text-[10px] text-on-surface-variant">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="hidden md:block mt-2 shrink-0">
          <Waveform />
        </div>
      </div>
    </div>
  );
}
