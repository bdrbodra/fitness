import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(200),
  role: z.enum(["USER", "TRAINER"]),
  lang: z.enum(["it", "en"]).default("it"),
  trainerCode: z.string().trim().toUpperCase().optional(),
});

const STARTER_PLAN: [string, string][] = [
  ["Barbell bench press", "5 × 5"],
  ["Overhead press", "4 × 8"],
  ["Cable fly", "3 × 12"],
  ["Parallel bar dip", "3 × 10"],
  ["Lateral raise", "3 × 15"],
  ["Triceps push-down", "3 × 12"],
];

async function generateTrainerCode(name: string) {
  const prefix = (name.replace(/[^a-zA-Z]/g, "").slice(0, 4) || "COACH").toUpperCase();
  for (let attempt = 0; attempt < 10; attempt++) {
    const code = `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
    const existing = await prisma.user.findUnique({ where: { trainerCode: code } });
    if (!existing) return code;
  }
  throw new Error("Could not generate a unique trainer code");
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { name, email, password, role, lang, trainerCode } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Un account con questa email esiste già." }, { status: 409 });
  }

  let trainerId: string | null = null;
  if (role === "USER" && trainerCode) {
    const trainer = await prisma.user.findUnique({ where: { trainerCode } });
    if (!trainer || trainer.role !== "TRAINER") {
      return NextResponse.json({ error: "Codice trainer non valido." }, { status: 400 });
    }
    trainerId = trainer.id;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role,
      lang,
      trainerId,
      trainerCode: role === "TRAINER" ? await generateTrainerCode(name) : null,
    },
  });

  if (role === "USER") {
    await prisma.workoutPlan.create({
      data: {
        userId: user.id,
        dayLabel: lang === "it" ? "MERCOLEDÌ · PUSH" : "WEDNESDAY · PUSH",
        exercises: {
          create: STARTER_PLAN.map((ex, i) => ({ order: i, name: ex[0], scheme: ex[1] })),
        },
      },
    });
  }

  return NextResponse.json({ id: user.id, email: user.email });
}
