import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { unauthorized } from "@/lib/server/http";
import { findExerciseVisual } from "@/lib/server/wger";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return unauthorized();

  const { searchParams } = new URL(req.url);
  const name = (searchParams.get("name") || "").trim();
  if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });

  const lang = searchParams.get("lang") === "en" ? "en" : "it";
  const visual = await findExerciseVisual(name, lang);

  return NextResponse.json({ visual }, { headers: { "Cache-Control": "public, max-age=3600" } });
}
