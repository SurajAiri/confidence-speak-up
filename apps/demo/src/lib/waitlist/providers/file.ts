import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { WaitlistError, type WaitlistEntry, type WaitlistProvider } from "../types";

// Zero-setup default: appends signups to a JSON file on disk. Great for local
// dev and small launches. Swap WAITLIST_PROVIDER to move to a real database
// or spreadsheet once you outgrow this — see lib/waitlist/index.ts.
const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "waitlist.json");

async function readEntries(): Promise<WaitlistEntry[]> {
  try {
    const raw = await readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as WaitlistEntry[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

export const fileProvider: WaitlistProvider = {
  async add(email) {
    await mkdir(DATA_DIR, { recursive: true });
    const entries = await readEntries();

    if (entries.some((entry) => entry.email.toLowerCase() === email.toLowerCase())) {
      throw new WaitlistError("duplicate", "That email is already on the waitlist.");
    }

    entries.push({ email, createdAt: new Date().toISOString() });
    await writeFile(DATA_FILE, JSON.stringify(entries, null, 2), "utf-8");
  },
};
