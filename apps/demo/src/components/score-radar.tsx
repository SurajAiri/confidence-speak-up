"use client";

import { motion } from "motion/react";

const METRICS = [
  { label: "Confidence", value: 8.8 },
  { label: "Clarity", value: 8.3 },
  { label: "Structure", value: 7.9 },
  { label: "Engagement", value: 8.1 },
  { label: "Fluency", value: 8.5 },
  { label: "Stability", value: 8.5 },
];

const SIZE = 220;
const CENTER = SIZE / 2;
const MAX_R = 78;

function point(index: number, radius: number) {
  const angle = (Math.PI * 2 * index) / METRICS.length - Math.PI / 2;
  return {
    x: CENTER + radius * Math.cos(angle),
    y: CENTER + radius * Math.sin(angle),
  };
}

function ringPath(radius: number) {
  return METRICS.map((_, i) => point(i, radius))
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`)
    .join(" ") + " Z";
}

function valuePath() {
  return METRICS.map((m, i) => point(i, (m.value / 10) * MAX_R))
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`)
    .join(" ") + " Z";
}

export function ScoreRadar() {
  return (
    <div className="flex flex-col items-center">
      <svg viewBox={`0 0 ${SIZE} ${SIZE + 40}`} className="w-full max-w-[280px]">
        {[0.33, 0.66, 1].map((f) => (
          <path
            key={f}
            d={ringPath(MAX_R * f)}
            fill="none"
            stroke="var(--color-ink-line)"
            strokeWidth={1}
          />
        ))}

        <motion.path
          d={valuePath()}
          fill="var(--color-amber)"
          fillOpacity={0.18}
          stroke="var(--color-amber)"
          strokeWidth={1.5}
          strokeLinejoin="round"
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}
        />

        {METRICS.map((m, i) => {
          const p = point(i, (m.value / 10) * MAX_R);
          const labelPos = point(i, MAX_R + 28);
          return (
            <g key={m.label}>
              <circle cx={p.x} cy={p.y} r={2.5} fill="var(--color-amber)" />
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                className="fill-text-muted text-[9px]"
              >
                {m.label}
              </text>
              <text
                x={labelPos.x}
                y={labelPos.y + 11}
                textAnchor="middle"
                className="fill-cream text-[9px] font-medium"
              >
                {m.value}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
