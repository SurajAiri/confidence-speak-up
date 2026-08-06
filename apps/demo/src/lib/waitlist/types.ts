export type WaitlistEntry = {
  email: string;
  createdAt: string;
};

export type WaitlistProvider = {
  /**
   * Persist an email. Should throw a WaitlistError for expected failures
   * (e.g. duplicate email) so the caller can show a friendly message.
   */
  add(email: string): Promise<void>;
};

export class WaitlistError extends Error {
  code: "duplicate" | "unknown";

  constructor(code: "duplicate" | "unknown", message: string) {
    super(message);
    this.code = code;
    this.name = "WaitlistError";
  }
}
