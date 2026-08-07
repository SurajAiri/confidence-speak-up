import { AudioLines } from "lucide-react";

function TwitterIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.114 20.452H3.558V9h3.556z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="w-full py-14 md:py-16 bg-surface-container-lowest border-t border-white/5">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6 px-5 md:px-20 max-w-[1280px] mx-auto">
        <div className="md:col-span-1">
          <div className="font-display text-xl text-on-surface mb-4 flex items-center gap-2">
            <AudioLines className="text-primary" size={18} />
            Voxem
          </div>
          <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
            © 2026 Voxem AI. Refined rhetoric for the modern leader.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <a
            href="#"
            className="font-sans text-xs text-on-surface-variant hover:text-primary-fixed transition-colors opacity-80 hover:opacity-100 w-fit"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="font-sans text-xs text-on-surface-variant hover:text-primary-fixed transition-colors opacity-80 hover:opacity-100 w-fit"
          >
            Terms of Service
          </a>
        </div>
        <div className="flex flex-col gap-2">
          <a
            href="#"
            className="font-sans text-xs text-on-surface-variant hover:text-primary-fixed transition-colors opacity-80 hover:opacity-100 w-fit"
          >
            Contact Us
          </a>
        </div>
        <div className="flex flex-col gap-3">
          <a
            href="#"
            className="font-sans text-xs text-on-surface-variant hover:text-primary-fixed transition-colors opacity-80 hover:opacity-100 flex items-center gap-2 w-fit"
          >
            <TwitterIcon /> Twitter
          </a>
          <a
            href="#"
            className="font-sans text-xs text-on-surface-variant hover:text-primary-fixed transition-colors opacity-80 hover:opacity-100 flex items-center gap-2 w-fit"
          >
            <LinkedinIcon /> LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
