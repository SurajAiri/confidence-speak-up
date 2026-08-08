import { AudioLines } from "lucide-react";

const SIZE_MAP = {
  sm: {
    icon: 18,
    name: "text-xl",
    sub: "text-[9px]",
    gap: "gap-2",
  },
  md: {
    icon: 22,
    name: "text-2xl",
    sub: "text-[10px]",
    gap: "gap-2",
  },
} as const;

export function Logo({ size = "md" }: { size?: keyof typeof SIZE_MAP }) {
  const s = SIZE_MAP[size];

  return (
    <span className={`flex items-center ${s.gap} shrink-0`}>
      <AudioLines className="text-primary" size={s.icon} strokeWidth={2} />
      <span className="flex items-baseline gap-1.5">
        <span className={`font-display ${s.name} text-on-surface leading-none`}>
          SpeakUp
        </span>
        <span
          className={`font-sans ${s.sub} text-on-surface-variant leading-none whitespace-nowrap`}
        >
          by HyeKai.com
        </span>
      </span>
    </span>
  );
}
