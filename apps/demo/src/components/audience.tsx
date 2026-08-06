import { Briefcase, GraduationCap, Lightbulb, Target, TrendingUp } from "lucide-react";

const AUDIENCE = [
  { icon: GraduationCap, label: "Students" },
  { icon: Briefcase, label: "Professionals" },
  { icon: Target, label: "Job Seekers" },
  { icon: Lightbulb, label: "Creators" },
  { icon: TrendingUp, label: "Leaders" },
];

export function Audience() {
  return (
    <div className="border-t border-ink-line/60">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-y-8 px-6 py-9 sm:grid-cols-3 lg:grid-cols-5 lg:px-10">
        {AUDIENCE.map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-3 text-center">
            <Icon className="size-6 text-text-dim" strokeWidth={1.5} />
            <span className="text-sm text-text-muted">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
