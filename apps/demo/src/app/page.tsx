"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/* ─── Scroll reveal hook ─── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(
      ".reveal, .reveal-left, .reveal-right",
    );
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("visible");
          }
        });
      },
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ─── Animated score ring ─── */
function ScoreRing({
  value,
  label,
  size = 56,
}: {
  value: number;
  label: string;
  size?: number;
}) {
  const r = size / 2 - 5;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 10) * circ;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(201,168,76,0.12)"
          strokeWidth="3"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#c9a84c"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy="0.35em"
          fontSize={size * 0.26}
          fill="#c9a84c"
          fontWeight="600"
        >
          {value}
        </text>
      </svg>
      <span
        style={{ color: "var(--text-muted)", fontSize: 10 }}
        className="text-center"
      >
        {label}
      </span>
    </div>
  );
}

/* ─── Hex Radar SVG ─── */
function HexRadar() {
  const scores = [8.8, 8.3, 8.5, 7.9, 8.5, 8.1];
  const labels = [
    "Confidence",
    "Clarity",
    "Stability",
    "Structure",
    "Fluency",
    "Engagement",
  ];
  const cx = 80;
  const cy = 80;
  const maxR = 60;
  const angles = scores.map((_, i) => (i * 60 - 90) * (Math.PI / 180));

  const points = scores
    .map((s, i) => {
      const r = (s / 10) * maxR;
      return `${cx + r * Math.cos(angles[i])},${cy + r * Math.sin(angles[i])}`;
    })
    .join(" ");

  const gridPoints = (factor: number) =>
    Array.from({ length: 6 }, (_, i) => {
      const a = (i * 60 - 90) * (Math.PI / 180);
      return `${cx + factor * maxR * Math.cos(a)},${cy + factor * maxR * Math.sin(a)}`;
    }).join(" ");

  return (
    <svg viewBox="0 0 160 160" className="w-full max-w-[160px] mx-auto">
      {[0.33, 0.66, 1].map((f) => (
        <polygon
          key={f}
          points={gridPoints(f)}
          fill="none"
          stroke="rgba(201,168,76,0.15)"
          strokeWidth="1"
        />
      ))}
      {angles.map((a, i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={cx + maxR * Math.cos(a)}
          y2={cy + maxR * Math.sin(a)}
          stroke="rgba(201,168,76,0.1)"
          strokeWidth="1"
        />
      ))}
      <polygon
        points={points}
        fill="rgba(201,168,76,0.15)"
        stroke="#c9a84c"
        strokeWidth="1.5"
      />
      {scores.map((s, i) => {
        const r = (s / 10) * maxR;
        return (
          <circle
            key={i}
            cx={cx + r * Math.cos(angles[i])}
            cy={cy + r * Math.sin(angles[i])}
            r={3}
            fill="#c9a84c"
          />
        );
      })}
      {labels.map((l, i) => {
        const r = maxR + 14;
        const x = cx + r * Math.cos(angles[i]);
        const y = cy + r * Math.sin(angles[i]);
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            dy="0.35em"
            fontSize="6.5"
            fill="rgba(201,168,76,0.7)"
          >
            {l}
          </text>
        );
      })}
    </svg>
  );
}

/* ─── Live Demo Section ─── */
function LiveDemoSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(35);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const tabs = ["Overview", "Voice", "Language", "Structure", "Delivery"];

  const feedbackItems = [
    {
      time: "0:42",
      color: "#ef6c6c",
      label: "Long pause",
      hint: "Try using a transition phrase.",
    },
    {
      time: "1:36",
      color: "#6bc47a",
      label: "Great emphasis",
      hint: "Strong, confident tone.",
    },
    {
      time: "2:09",
      color: "#c9a84c",
      label: "Too many fillers",
      hint: '3x "umm" in 10 seconds.',
    },
  ];

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setProgress((p) => (p >= 100 ? 0 : p + 0.4));
      }, 80);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing]);

  const currentTime = `${Math.floor((progress / 100) * 3)}:${String(
    Math.floor(((progress / 100) * 180) % 60),
  ).padStart(2, "0")}`;

  return (
    <section className="py-24 px-6" style={{ background: "var(--background)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 reveal">
          <p
            className="text-xs font-semibold tracking-[0.2em] uppercase mb-3"
            style={{ color: "var(--gold)" }}
          >
            Feedback Preview
          </p>
          <h2
            className="text-4xl md:text-5xl font-semibold mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            A sneak peek at your{" "}
            <em style={{ color: "var(--gold)" }}>future</em> feedback.
          </h2>
          <p
            className="text-lg max-w-xl mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            Every session gives you clarity on what to improve and how to say it
            better.
          </p>
        </div>

        <div
          className="reveal rounded-2xl overflow-hidden"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          {/* Tab bar */}
          <div
            className="flex items-center gap-1 px-6 pt-5 pb-0 border-b"
            style={{ borderColor: "var(--border)" }}
          >
            {tabs.map((t, i) => (
              <button
                key={t}
                onClick={() => setActiveTab(i)}
                className="px-4 py-2 text-sm rounded-t-md transition-colors relative"
                style={{
                  color: activeTab === i ? "var(--gold)" : "var(--text-muted)",
                  background:
                    activeTab === i ? "rgba(201,168,76,0.08)" : "transparent",
                  borderBottom:
                    activeTab === i
                      ? "2px solid var(--gold)"
                      : "2px solid transparent",
                  fontWeight: activeTab === i ? 500 : 400,
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-0">
            {/* Left: video + waveform */}
            <div className="p-6">
              {/* Fake video */}
              <div
                className="relative rounded-xl overflow-hidden mb-4"
                style={{
                  background: "#0a0906",
                  border: "1px solid rgba(201,168,76,0.1)",
                  aspectRatio: "16/9",
                }}
              >
                <Image
                  src="/demo.webp"
                  alt="Practice session"
                  fill
                  className="object-cover opacity-80"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={() => setPlaying(!playing)}
                    className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
                    style={{
                      background: "rgba(201,168,76,0.9)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    {playing ? (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="#0c0b09"
                      >
                        <rect x="3" y="2" width="4" height="12" rx="1" />
                        <rect x="9" y="2" width="4" height="12" rx="1" />
                      </svg>
                    ) : (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="#0c0b09"
                      >
                        <path d="M4 2l10 6-10 6V2z" />
                      </svg>
                    )}
                  </button>
                </div>
                {/* Session badge */}
                <div
                  className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{
                    background: "rgba(12,11,9,0.8)",
                    color: "var(--gold)",
                    border: "1px solid rgba(201,168,76,0.2)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: playing ? "#6bc47a" : "#ef6c6c",
                      animation: playing
                        ? "pulse-glow 1.5s ease-in-out infinite"
                        : "none",
                    }}
                  />
                  {playing ? "Recording" : "Paused"}
                </div>
              </div>

              {/* Controls + progress */}
              <div className="flex items-center gap-3 mb-3">
                <button onClick={() => setPlaying(!playing)}>
                  {playing ? (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="var(--gold)"
                    >
                      <rect x="3" y="2" width="4.5" height="14" rx="1.2" />
                      <rect x="10.5" y="2" width="4.5" height="14" rx="1.2" />
                    </svg>
                  ) : (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="var(--gold)"
                    >
                      <path d="M4 2l12 7-12 7V2z" />
                    </svg>
                  )}
                </button>
                <span
                  className="text-xs font-mono"
                  style={{ color: "var(--text-muted)" }}
                >
                  {currentTime} / 3:00
                </span>
                <div
                  className="flex-1 h-1 rounded-full cursor-pointer relative"
                  style={{ background: "rgba(201,168,76,0.15)" }}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setProgress(((e.clientX - rect.left) / rect.width) * 100);
                  }}
                >
                  <div
                    className="h-full rounded-full transition-none"
                    style={{
                      width: `${progress}%`,
                      background:
                        "linear-gradient(90deg, var(--gold-dim), var(--gold))",
                    }}
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full"
                    style={{
                      left: `${progress}%`,
                      transform: "translate(-50%, -50%)",
                      background: "var(--gold)",
                      boxShadow: "0 0 0 3px rgba(201,168,76,0.2)",
                    }}
                  />
                </div>
              </div>

              {/* Waveform */}
              <div
                className="rounded-lg p-3 flex flex-col gap-2"
                style={{ background: "var(--surface-2)" }}
              >
                <div className="flex items-end gap-0.5 h-8">
                  {Array.from({ length: 40 }, (_, i) => {
                    const h = Math.sin(i * 0.6) * 8 + Math.random() * 4 + 4;
                    const isActive = (i / 40) * 100 < progress;
                    return (
                      <div
                        key={i}
                        style={{
                          width: 3,
                          height: `${h}px`,
                          borderRadius: 2,
                          background: isActive
                            ? "var(--gold)"
                            : "rgba(201,168,76,0.15)",
                          transition: "background 0.1s",
                          flexShrink: 0,
                        }}
                      />
                    );
                  })}
                </div>
                {/* Feedback markers */}
                <div className="flex gap-2 flex-wrap">
                  {feedbackItems.map((item) => (
                    <div
                      key={item.time}
                      className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-md"
                      style={{
                        background: `${item.color}18`,
                        border: `1px solid ${item.color}40`,
                        color: item.color,
                      }}
                    >
                      <span className="font-mono font-semibold">
                        {item.time}
                      </span>
                      <span style={{ color: "var(--text-secondary)" }}>—</span>
                      <span>{item.label}</span>
                      <span
                        className="hidden sm:inline"
                        style={{ color: "var(--text-muted)" }}
                      >
                        · {item.hint}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: scores */}
            <div
              className="p-6 border-t md:border-t-0 md:border-l"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p
                    className="text-xs uppercase tracking-widest mb-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Overall Score
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span
                      className="text-5xl font-bold"
                      style={{ color: "var(--gold)" }}
                    >
                      8.4
                    </span>
                    <span
                      className="text-xl"
                      style={{ color: "var(--text-muted)" }}
                    >
                      /10
                    </span>
                  </div>
                </div>
                <HexRadar />
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: "Confidence", val: 8.8 },
                  { label: "Clarity", val: 8.3 },
                  { label: "Stability", val: 8.5 },
                  { label: "Structure", val: 7.9 },
                  { label: "Fluency", val: 8.5 },
                  { label: "Engagement", val: 8.1 },
                ].map(({ label, val }) => (
                  <div key={label} className="text-center">
                    <div
                      className="text-2xl font-semibold"
                      style={{ color: "var(--foreground)" }}
                    >
                      {val}
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {label}
                    </div>
                    <div
                      className="mt-1.5 h-0.5 rounded-full mx-auto"
                      style={{
                        background: `linear-gradient(90deg, var(--gold), transparent)`,
                        width: `${(val / 10) * 100}%`,
                        maxWidth: "100%",
                      }}
                    />
                  </div>
                ))}
              </div>

              <div
                className="rounded-xl p-4"
                style={{ background: "var(--surface-2)" }}
              >
                <p
                  className="text-xs uppercase tracking-widest mb-3"
                  style={{ color: "var(--text-muted)" }}
                >
                  Key Improvements
                </p>
                {[
                  {
                    icon: "⏸",
                    text: "Reduce pause length — aim for smoother transitions",
                  },
                  {
                    icon: "🔁",
                    text: 'Replace filler "umm" with a deliberate breath',
                  },
                  {
                    icon: "✓",
                    text: "Keep the confident tone in your emphasis moments",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex gap-3 text-sm py-2 border-b last:border-b-0"
                    style={{
                      borderColor: "var(--border)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <span>{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>

              <div
                className="mt-4 flex items-center gap-2 text-xs px-3 py-2 rounded-lg"
                style={{
                  background: "rgba(201,168,76,0.08)",
                  border: "1px solid var(--border)",
                  color: "var(--gold-dim)",
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="var(--gold)"
                  strokeWidth="1.5"
                >
                  <circle cx="7" cy="7" r="6" />
                  <path d="M7 4v3l2 2" />
                </svg>
                <span style={{ color: "var(--text-muted)" }}>
                  Full breakdown available after launch
                </span>
                <span
                  className="ml-auto font-medium"
                  style={{ color: "var(--gold)" }}
                >
                  ✦ Coming soon
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Main Page ─── */
export default function Home() {
  useReveal();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const modes = [
    {
      img: "/prompt.webp",
      icon: "💬",
      title: "Quick Prompt",
      desc: "Answer a question and speak naturally.",
    },
    {
      img: "/read.webp",
      icon: "📖",
      title: "Read & Explain",
      desc: "Read, absorb, and speak your take.",
    },
    {
      img: "/interview.webp",
      icon: "🎯",
      title: "Interview Simulator",
      desc: "Practice interviews with confidence.",
    },
    {
      img: "/debate.webp",
      icon: "⚔️",
      title: "Debate Arena",
      desc: "Argue, defend, and think on your feet.",
    },
  ];

  const personas = [
    { icon: "🎓", label: "Students" },
    { icon: "💼", label: "Professionals" },
    { icon: "🔍", label: "Job Seekers" },
    { icon: "🎙️", label: "Creators" },
    { icon: "🏛️", label: "Leaders" },
  ];

  const benefits = [
    {
      icon: (
        <svg
          width="22"
          height="22"
          fill="none"
          viewBox="0 0 22 22"
          stroke="var(--gold)"
          strokeWidth="1.6"
        >
          <circle cx="11" cy="11" r="9" />
          <path d="M11 7v4l3 3" strokeLinecap="round" />
        </svg>
      ),
      title: "Be the first",
      desc: "Get early access when we launch.",
    },
    {
      icon: (
        <svg
          width="22"
          height="22"
          fill="none"
          viewBox="0 0 22 22"
          stroke="var(--gold)"
          strokeWidth="1.6"
        >
          <path d="M11 2l2.4 6.8H21l-5.8 4.2 2.2 6.8L11 15.6 4.6 19.8l2.2-6.8L1 8.8h7.6L11 2z" />
        </svg>
      ),
      title: "Exclusive perks",
      desc: "Early adopters get special benefits.",
    },
    {
      icon: (
        <svg
          width="22"
          height="22"
          fill="none"
          viewBox="0 0 22 22"
          stroke="var(--gold)"
          strokeWidth="1.6"
        >
          <circle cx="8" cy="8" r="4" />
          <circle cx="14" cy="8" r="4" />
          <path d="M4 18c0-3 2-5 4-5h6c2 0 4 2 4 5" />
        </svg>
      ),
      title: "Shape the product",
      desc: "Your feedback helps us build it better.",
    },
    {
      icon: (
        <svg
          width="22"
          height="22"
          fill="none"
          viewBox="0 0 22 22"
          stroke="var(--gold)"
          strokeWidth="1.6"
        >
          <rect x="3" y="5" width="16" height="14" rx="2" />
          <path d="M8 5V3M14 5V3M3 10h16" />
          <path d="M8 15l2 2 4-4" />
        </svg>
      ),
      title: "Invite-only launch",
      desc: "Limited spots for our first users.",
    },
  ];

  return (
    <main className="min-h-screen" style={{ background: "var(--background)" }}>
      {/* ── NAV ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 nav-blur"
        style={{
          background: "rgba(12,11,9,0.85)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <div className="flex items-end gap-0.5" style={{ height: 20 }}>
              {[5, 10, 16, 20, 14, 8, 4].map((h, i) => (
                <div
                  key={i}
                  className="wave-bar"
                  style={{ height: h, animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
            <span
              className="text-lg font-semibold tracking-tight"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Voxem
            </span>
          </div>
          <div
            className="hidden md:flex items-center gap-8 text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            {["Home", "How it works", "Practice", "Pricing", "Blog"].map(
              (l) => (
                <a
                  key={l}
                  href="#"
                  className="hover:text-white transition-colors"
                >
                  {l}
                </a>
              ),
            )}
          </div>
          <div className="flex items-center gap-3">
            <button className="btn-outline hidden md:inline-flex px-4 py-2 rounded-full text-sm">
              Waitlist
            </button>
            <button className="btn-primary px-4 py-2 rounded-full text-sm flex items-center gap-2">
              <span>Early Adopter</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/background.webp"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 hero-gradient" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(12,11,9,1) 0%, transparent 40%)",
            }}
          />
        </div>

        {/* Floating feedback chips */}
        <div className="absolute right-8 md:right-16 top-1/3 flex flex-col gap-3 z-10">
          {[
            { icon: "⭐", text: "Great energy!", delay: "chip-float-1" },
            { icon: "🔉", text: "Speak a bit slower", delay: "chip-float-2" },
            { icon: "📋", text: "Clear structure", delay: "chip-float-3" },
          ].map((chip) => (
            <div
              key={chip.text}
              className={`${chip.delay} flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium`}
              style={{
                background: "rgba(20,18,16,0.85)",
                border: "1px solid rgba(201,168,76,0.25)",
                backdropFilter: "blur(12px)",
                color: "var(--foreground)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              }}
            >
              <span>{chip.icon}</span>
              <span>{chip.text}</span>
            </div>
          ))}
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
          <div className="max-w-2xl">
            <div
              className="animate-fade-up inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
              style={{
                background: "rgba(201,168,76,0.1)",
                border: "1px solid rgba(201,168,76,0.25)",
                color: "var(--gold)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: "var(--gold)",
                  boxShadow: "0 0 6px var(--gold)",
                }}
              />
              Now in early access
            </div>

            <h1
              className="animate-fade-up text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.08] mb-6"
              style={{
                fontFamily: "var(--font-playfair)",
                animationDelay: "0.1s",
                opacity: 0,
              }}
            >
              Speak Confidently,
              <br />
              <em style={{ color: "var(--gold)" }}>In any</em>{" "}
              <span
                style={{
                  textDecoration: "underline",
                  textDecorationColor: "var(--gold-dim)",
                  textUnderlineOffset: 6,
                }}
              >
                moment.
              </span>
            </h1>

            <p
              className="animate-fade-up text-lg md:text-xl mb-10 max-w-lg leading-relaxed"
              style={{
                color: "var(--text-secondary)",
                animationDelay: "0.2s",
                opacity: 0,
              }}
            >
              AI-powered feedback that helps you speak clearly, confidently and
              with impact in any situation.
            </p>

            <div
              className="animate-fade-up flex flex-wrap gap-4"
              style={{ animationDelay: "0.3s", opacity: 0 }}
            >
              <button className="btn-primary px-6 py-3.5 rounded-full text-base flex items-center gap-2">
                <span>Early Adopters</span>
                <span>→</span>
              </button>
              <button className="btn-outline px-6 py-3.5 rounded-full text-base">
                Join Waitlist
              </button>
            </div>
          </div>
        </div>

        {/* Bottom quote */}
        <div
          className="absolute bottom-12 left-0 right-0 text-center animate-fade-in"
          style={{ animationDelay: "0.8s", opacity: 0 }}
        >
          <p
            className="text-sm tracking-widest uppercase"
            style={{ color: "var(--gold-dim)" }}
          >
            Communication opens doors. Confidence keeps them open.
          </p>
          <div className="flex justify-center gap-1.5 mt-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="rounded-full"
                style={{
                  width: i === 1 ? 20 : 6,
                  height: 4,
                  background: i === 1 ? "var(--gold)" : "rgba(201,168,76,0.3)",
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── PERSONAS STRIP ── */}
      <section
        className="py-14 border-y"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <div className="max-w-4xl mx-auto px-6 flex flex-wrap justify-center gap-12 md:gap-16">
          {personas.map(({ icon, label }) => (
            <div
              key={label}
              className="persona-item flex flex-col items-center gap-2"
              style={{ color: "var(--text-secondary)" }}
            >
              <span className="text-3xl">{icon}</span>
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROBLEM SECTION (dark, matching theme) ── */}
      <section
        className="py-24 px-6"
        style={{ background: "var(--surface-2)" }}
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="reveal-left">
            <p
              className="text-xs font-semibold tracking-[0.2em] uppercase mb-4"
              style={{ color: "var(--gold)" }}
            >
              The real problem
            </p>
            <h2
              className="text-4xl md:text-5xl font-semibold leading-[1.15] mb-6"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              You don&apos;t just need better English. You need better{" "}
              <em style={{ color: "var(--gold)" }}>communication.</em>
            </h2>
            <p
              className="text-lg leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              Grammar won&apos;t help you in interviews, client calls or on
              stage. We do more — we help you sound confident, clear and
              influential.
            </p>
          </div>

          {/* Sticky notes grid — dark themed */}
          <div className="reveal-right">
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  text: "My ideas are good, but I freeze when I speak.",
                  bg: "#1e2a1e",
                  border: "#2d4a2d",
                  color: "#8ed89c",
                  rotate: "-1deg",
                },
                {
                  text: 'I stumble, use "umm..." too often.',
                  bg: "#2a1e1e",
                  border: "#4a2d2d",
                  color: "#e8948e",
                  rotate: "1.5deg",
                  top: true,
                },
                {
                  text: "I know the topic, but I can't explain it well.",
                  bg: "#2a2410",
                  border: "#4a3f1a",
                  color: "#d4b86a",
                  rotate: "0.5deg",
                  top: true,
                },
                {
                  text: "I don't sound as confident as others.",
                  bg: "#1a1e2a",
                  border: "#2d3a4a",
                  color: "#8ea8d8",
                  rotate: "-0.8deg",
                },
              ].map((note, i) => (
                <div
                  key={i}
                  className="sticky-note p-5 rounded-xl text-sm font-medium leading-relaxed"
                  style={{
                    background: note.bg,
                    border: `1px solid ${note.border}`,
                    color: note.color,
                    transform: `rotate(${note.rotate})`,
                    marginTop: note.top ? "-12px" : "0",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
                  }}
                >
                  {note.text}
                </div>
              ))}
            </div>
            <div
              className="mt-5 text-right text-sm italic"
              style={{ color: "var(--text-muted)" }}
            >
              Sound familiar?{" "}
              <span style={{ color: "var(--gold)" }}>We fix that.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRACTICE MODES ── */}
      <section
        className="py-24 px-6"
        style={{ background: "var(--background)" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 reveal">
            <p
              className="text-xs font-semibold tracking-[0.2em] uppercase mb-3"
              style={{ color: "var(--gold)" }}
            >
              Practice Modes
            </p>
            <h2
              className="text-4xl md:text-5xl font-semibold"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Practice like <em style={{ color: "var(--gold)" }}>real life.</em>
            </h2>
            <p
              className="mt-4 text-lg"
              style={{ color: "var(--text-secondary)" }}
            >
              Choose a mode and start a conversation.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {modes.map((m, i) => (
              <div
                key={m.title}
                className={`mode-card reveal rounded-2xl overflow-hidden cursor-pointer`}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  transitionDelay: `${i * 0.08}s`,
                }}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={m.img}
                    alt={m.title}
                    fill
                    className="object-cover"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(12,11,9,0.9) 0%, rgba(12,11,9,0.2) 60%)",
                    }}
                  />
                  <div
                    className="absolute bottom-3 left-3 w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      background: "rgba(201,168,76,0.15)",
                      border: "1px solid rgba(201,168,76,0.3)",
                      fontSize: 16,
                    }}
                  >
                    {m.icon}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-1">{m.title}</h3>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE DEMO ── */}
      <LiveDemoSection />

      {/* ── WAITLIST BENEFITS ── */}
      <section className="py-24 px-6" style={{ background: "var(--surface)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 reveal">
            <h2
              className="text-4xl md:text-5xl font-semibold"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Why join the <em style={{ color: "var(--gold)" }}>waitlist?</em>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, i) => (
              <div
                key={b.title}
                className={`reveal rounded-2xl p-6`}
                style={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  transitionDelay: `${i * 0.1}s`,
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background: "rgba(201,168,76,0.1)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {b.icon}
                </div>
                <h3
                  className="font-semibold mb-2 text-sm"
                  style={{ color: "var(--gold)" }}
                >
                  {b.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-muted)" }}
                >
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FOOTER ── */}
      <section
        className="py-24 px-6 relative overflow-hidden"
        style={{ background: "var(--background)" }}
      >
        {/* Subtle glow */}
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2 w-96 h-64 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(201,168,76,0.08) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div className="max-w-5xl mx-auto">
          <div className="glow-line mb-16" />
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="reveal-left">
              <h2
                className="text-4xl md:text-5xl font-semibold leading-tight mb-4"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Small practice today.
                <br />
                Big difference{" "}
                <em style={{ color: "var(--gold)" }}>tomorrow.</em>
              </h2>
              <p
                className="text-lg leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                Join the waitlist and be the first to know when we go live.
              </p>
            </div>

            <div className="reveal-right">
              {submitted ? (
                <div
                  className="text-center py-10 px-8 rounded-2xl"
                  style={{
                    background: "var(--surface)",
                    border: "1px solid rgba(201,168,76,0.3)",
                  }}
                >
                  <div className="text-4xl mb-4">✓</div>
                  <p
                    className="text-lg font-semibold mb-2"
                    style={{ color: "var(--gold)" }}
                  >
                    You&apos;re on the list!
                  </p>
                  <p style={{ color: "var(--text-muted)" }}>
                    We&apos;ll reach out when we launch.
                  </p>
                </div>
              ) : (
                <div
                  className="p-8 rounded-2xl"
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <p
                    className="text-sm mb-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Join <span style={{ color: "var(--gold)" }}>2,400+</span>{" "}
                    people on the waitlist
                  </p>
                  <div className="flex gap-3 mt-4">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={{
                        background: "var(--surface-2)",
                        border: "1px solid var(--border)",
                        color: "var(--foreground)",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor =
                          "rgba(201,168,76,0.5)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "var(--border)";
                      }}
                    />
                    <button
                      className="btn-primary px-5 py-3 rounded-xl text-sm whitespace-nowrap"
                      onClick={() => {
                        if (email.includes("@")) setSubmitted(true);
                      }}
                    >
                      Join Waitlist →
                    </button>
                  </div>
                  <p
                    className="mt-3 text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    No spam. Just updates about our launch.
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="glow-line mt-16" />
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="py-8 px-6 text-center text-sm"
        style={{ color: "var(--text-muted)", background: "var(--surface)" }}
      >
        <p>© 2025 Voxem. Built for people who want to be heard.</p>
      </footer>
    </main>
  );
}
