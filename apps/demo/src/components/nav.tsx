import { AudioLines, UserPlus } from "lucide-react";

const LINKS = [
  { label: "Home", href: "#top" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Practice", href: "#practice" },
  { label: "Pricing", href: "#pricing" },
  { label: "Blog", href: "#blog" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink-line/60 bg-ink/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <a href="#top" className="flex items-center gap-2">
          <AudioLines className="size-5 text-amber" strokeWidth={2.25} />
          <span className="font-display text-lg tracking-tight text-cream">Voxem</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-text-muted transition-colors hover:text-cream"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#waitlist"
            className="hidden rounded-full border border-ink-line px-4 py-2 text-sm text-cream transition-colors hover:border-text-muted sm:inline-block"
          >
            Waitlist
          </a>
          <a
            href="#waitlist"
            className="inline-flex items-center gap-1.5 rounded-full bg-amber px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-amber-soft"
          >
            <UserPlus className="size-4" strokeWidth={2.25} />
            Early Adapter
          </a>
        </div>
      </div>
    </header>
  );
}
