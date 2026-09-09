import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { unauthorized } from "@/lib/server/http";
import { todayDate } from "@/lib/server/date";

const schema = z.object({
  exercise: z.string().min(1).max(120),
  weightKg: z.number().min(0).max(500),
  reps: z.number().int().min(1).max(100),
  rpe: z.string().max(20),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return unauthorized();

  const body = schema.safeParse(await req.json().catch(() => null));
  if (!body.success) return NextResponse.json({ error: body.error.flatten() }, { status: 400 });

  const userId = session.user.id;
  const date = todayDate();

  let workoutSession = await prisma.workoutSession.findFirst({
    where: { userId, startedAt: { gte: date } },
    orderBy: { startedAt: "desc" },
  });
  if (!workoutSession) {
    workoutSession = await prisma.workoutSession.create({ data: { userId } });
  }

  const set = await prisma.loggedSet.create({
    data: { sessionId: workoutSession.id, ...body.data },
  });

  return NextResponse.json({
    set: { id: set.id, exercise: set.exercise, weightKg: set.weightKg, reps: set.reps, rpe: set.rpe },
  });
}
