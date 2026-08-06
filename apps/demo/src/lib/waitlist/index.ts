import { fileProvider } from "./providers/file";
import { googleSheetsProvider } from "./providers/google-sheets";
import type { WaitlistProvider } from "./types";

// Change providers with a single env var — no code changes needed.
//   WAITLIST_PROVIDER=file            (default) local JSON file, zero setup
//   WAITLIST_PROVIDER=google-sheets   free, see providers/google-sheets.ts
const providers: Record<string, WaitlistProvider> = {
  file: fileProvider,
  "google-sheets": googleSheetsProvider,
};

export function getWaitlistProvider(): WaitlistProvider {
  const key = process.env.WAITLIST_PROVIDER?.trim() || "file";
  return providers[key] ?? fileProvider;
}

export { WaitlistError } from "./types";
