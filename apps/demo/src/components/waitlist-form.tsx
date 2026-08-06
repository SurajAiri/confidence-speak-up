"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { joinWaitlist, type WaitlistState } from "@/app/actions";

const initialState: WaitlistState = { status: "idle", message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="shrink-0 rounded-full bg-amber px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-amber-soft disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Joining…" : "Join Waitlist →"}
    </button>
  );
}

export function WaitlistForm() {
  const [state, formAction] = useActionState(joinWaitlist, initialState);

  return (
    <div>
      <form
        action={formAction}
        className="flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <input
          type="email"
          name="email"
          required
          placeholder="Enter your email"
          className="w-full rounded-full border border-ink-line bg-ink px-5 py-3 text-sm text-cream placeholder:text-text-dim focus:border-amber focus:outline-none sm:w-72"
        />
        <SubmitButton />
      </form>

      <div className="mt-3 min-h-[1.25rem]" aria-live="polite">
        <AnimatePresence mode="wait">
          {state.message ? (
            <motion.p
              key={state.message}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`text-xs ${
                state.status === "success" ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {state.message}
            </motion.p>
          ) : (
            <p className="text-xs text-text-dim">No spam. Just updates about our launch.</p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
