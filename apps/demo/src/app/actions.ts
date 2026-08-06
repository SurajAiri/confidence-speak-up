"use server";

import { z } from "zod";
import { getWaitlistProvider, WaitlistError } from "@/lib/waitlist";

const emailSchema = z.email("Enter a valid email address.");

export type WaitlistState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function joinWaitlist(
  _prevState: WaitlistState,
  formData: FormData,
): Promise<WaitlistState> {
  const raw = formData.get("email");
  const parsed = emailSchema.safeParse(typeof raw === "string" ? raw.trim() : "");

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Enter a valid email address." };
  }

  try {
    await getWaitlistProvider().add(parsed.data);
  } catch (error) {
    if (error instanceof WaitlistError) {
      return { status: "error", message: error.message };
    }
    return { status: "error", message: "Something went wrong. Please try again." };
  }

  return { status: "success", message: "You're on the list! We'll be in touch soon." };
}
