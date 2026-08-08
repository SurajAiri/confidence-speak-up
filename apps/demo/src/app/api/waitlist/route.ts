import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { waitlist } from "@/db/schema";

const bodySchema = z.object({
  email: z.string().trim().toLowerCase().email(),
});

export async function POST(req: NextRequest) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const { email } = parsed.data;

  try {
    await db.insert(waitlist).values({ email });
  } catch (err: unknown) {
    // Postgres unique_violation - treat as a friendly success, not an error.
    // drizzle wraps the underlying postgres.js error under `cause`.
    const pgError = err as { code?: string; cause?: { code?: string } };
    const code = pgError?.code ?? pgError?.cause?.code;
    if (code === "23505") {
      return NextResponse.json({ message: "You're already on the list!" }, { status: 200 });
    }

    console.error("Failed to insert waitlist entry:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "You're on the list!" }, { status: 201 });
}
