"use client";

import { Maximize2, Pause, Play, Repeat, SkipForward } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Reveal } from "./reveal";
import { ScoreRadar } from "./score-radar";

const TABS = ["Overview", "Voice", "Language", "Structure", "Delivery"];

const MARKERS = [
  { time: "0:42", tone: "warn", label: "Long pause", note: "Try using a transition phrase.", position: 14 },
  { time: "1:36", tone: "good", label: "Great emphasis", note: "Strong, confident tone.", position: 52 },
  { time: "2:05", tone: "bad", label: "Too many fillers", note: "3x \u201cumm\u201d in 10 seconds.", position: 78 },
];

const toneColor: Record<string, string> = {
  warn: "text-amber",
  good: "text-emerald-400",
  bad: "text-rose-400",
};

function Waveform() {
  // Deterministic pseudo-random bar heights so server and client render match.
  const bars = Array.from({ length: 90 }, (_, i) => {
    const seed = Math.sin(i * 12.9898) * 43758.5453;
    return 20 + Math.abs(seed - Math.floor(seed)) * 80;
  });

  return (
    <div className="flex h-10 items-center gap-[2px]">
      {bars.map((h, i) => {
        const isMarker = MARKERS.some((m) => Math.abs(m.position - (i / bars.length) * 100) < 1.5);
        return (
          <span
            key={i}
            className={`w-full rounded-full ${isMarker ? "bg-amber" : "bg-ink-line"}`}
            style={{ height: `${h.toFixed(2)}%` }}
          />
        );
      })}
    </div>
  );
}

export function FeedbackPreview() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [playing, setPlaying] = useState(false);

  return (
    <section id="how-it-works" className="bg-ink py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <p className="mb-3 text-sm font-medium text-amber">Coming soon</p>
            <h2 className="font-display text-4xl leading-[1.1] tracking-tight text-cream sm:text-[2.75rem]">
              A sneak peek at your <span className="text-amber italic">future</span> feedback.
            </h2>
            <p className="mt-5 max-w-sm text-text-muted">
              Every session gives you clarity on what to improve and how to
              say it better.
            </p>
            <a
              href="#waitlist"
              className="mt-8 inline-block rounded-full bg-amber px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-amber-soft"
            >
              Coming soon
            </a>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="rounded-2xl border border-ink-line/70 bg-ink-soft p-4 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)] sm:p-5">
              <div className="flex gap-1 border-b border-ink-line/70 pb-3">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                      activeTab === tab
                        ? "bg-ink text-cream"
                        : "text-text-dim hover:text-text-muted"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-[1.2fr_1fr]">
                <div>
                  <div className="relative aspect-video overflow-hidden rounded-xl border border-ink-line/60">
                    <Image
                      src="/background.webp"
                      alt="Practice session recording preview"
                      fill
                      sizes="(min-width: 640px) 320px, 90vw"
                      className="object-cover"
                    />
                    <button
                      onClick={() => setPlaying((p) => !p)}
                      className="absolute inset-0 flex items-center justify-center bg-ink/0 transition-colors hover:bg-ink/20"
                      aria-label={playing ? "Pause" : "Play"}
                    >
                      <span className="flex size-11 items-center justify-center rounded-full bg-cream/90 text-ink">
                        {playing ? (
                          <Pause className="size-4" fill="currentColor" />
                        ) : (
                          <Play className="size-4 translate-x-0.5" fill="currentColor" />
                        )}
                      </span>
                    </button>
                  </div>
                  <div className="mt-2.5 flex items-center gap-2.5 text-text-dim">
                    <button onClick={() => setPlaying((p) => !p)} aria-label="Play">
                      {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
                    </button>
                    <span className="text-[11px] tabular-nums">2:24 / 3:00</span>
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-ink-line">
                      <div className="h-full w-[80%] rounded-full bg-amber" />
                    </div>
                    <SkipForward className="size-3.5" />
                    <Repeat className="size-3.5" />
                    <Maximize2 className="size-3.5" />
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center rounded-xl border border-ink-line/60 py-2">
                  <div className="flex w-full items-center justify-between px-4 pt-2">
                    <span className="text-xs font-medium text-cream">Overall Score</span>
                    <span className="text-lg font-semibold text-cream">
                      8.4<span className="text-xs font-normal text-text-dim">/10</span>
                    </span>
                  </div>
                  <ScoreRadar />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 border-t border-ink-line/70 pt-4 sm:grid-cols-3">
                {MARKERS.map((m) => (
                  <div key={m.time}>
                    <p className="text-xs font-medium">
                      <span className={toneColor[m.tone]}>{m.time} — {m.label}</span>
                    </p>
                    <p className="mt-0.5 text-[11px] text-text-dim">{m.note}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <Waveform />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
