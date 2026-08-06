import { AudioLines } from "lucide-react";
import { Reveal } from "./reveal";
import { WaitlistForm } from "./waitlist-form";

export function WaitlistCta() {
  return (
    <section id="waitlist" className="bg-ink px-6 pb-20 lg:px-10">
      <Reveal className="mx-auto max-w-5xl">
        <div className="rounded-3xl border border-ink-line/70 bg-gradient-to-br from-ink-soft to-ink px-8 py-12 sm:px-14 sm:py-16">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl leading-[1.15] tracking-tight text-cream sm:text-4xl">
                Small practice today.
                <br />
                Big difference <span className="text-amber italic">tomorrow.</span>
              </h2>
              <p className="mt-4 max-w-sm text-sm text-text-muted">
                Join the waitlist and be the first to know when we go live.
              </p>
            </div>

            <div className="lg:justify-self-end">
              <WaitlistForm />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-ink-line/60 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row lg:px-10">
        <a href="#top" className="flex items-center gap-2">
          <AudioLines className="size-4 text-amber" strokeWidth={2.25} />
          <span className="font-display text-base text-cream">Voxem</span>
        </a>
        <p className="text-xs text-text-dim">
          © {new Date().getFullYear()} Voxem. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
