import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { forbidden, unauthorized } from "@/lib/server/http";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return unauthorized();

  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get("clientId");

  let targetUserId = session.user.id;
  if (session.user.role === "TRAINER") {
    if (!clientId) return NextResponse.json({ error: "clientId required" }, { status: 400 });
    const client = await prisma.user.findFirst({ where: { id: clientId, trainerId: session.user.id } });
    if (!client) return forbidden();
    targetUserId = clientId;
  }

  const plan = await prisma.workoutPlan.findFirst({
    where: { userId: targetUserId },
    orderBy: { updatedAt: "desc" },
    include: { exercises: { orderBy: { order: "asc" } } },
  });

  return NextResponse.json({
    plan: plan
      ? {
          id: plan.id,
          dayLabel: plan.dayLabel,
          exercises: plan.exercises.map((e) => ({ id: e.id, name: e.name, scheme: e.scheme })),
        }
      : null,
  });
}

const schema = z.object({
  clientId: z.string().min(1),
  dayLabel: z.string().min(1).max(80),
  exercises: z.array(z.object({ name: z.string().min(1).max(120), scheme: z.string().min(1).max(40) })),
});

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "TRAINER") return forbidden();

  const body = schema.safeParse(await req.json().catch(() => null));
  if (!body.success) return NextResponse.json({ error: body.error.flatten() }, { status: 400 });

  const client = await prisma.user.findFirst({
    where: { id: body.data.clientId, trainerId: session.user.id },
  });
  if (!client) return forbidden();

  let plan = await prisma.workoutPlan.findFirst({ where: { userId: body.data.clientId } });
  if (!plan) {
    plan = await prisma.workoutPlan.create({
      data: { userId: body.data.clientId, dayLabel: body.data.dayLabel },
    });
  } else {
    await prisma.workoutPlan.update({ where: { id: plan.id }, data: { dayLabel: body.data.dayLabel } });
  }

  await prisma.$transaction([
    prisma.planExercise.deleteMany({ where: { planId: plan.id } }),
    prisma.planExercise.createMany({
      data: body.data.exercises.map((e, i) => ({ planId: plan!.id, order: i, name: e.name, scheme: e.scheme })),
    }),
  ]);

  const updated = await prisma.workoutPlan.findUnique({
    where: { id: plan.id },
    include: { exercises: { orderBy: { order: "asc" } } },
  });

  return NextResponse.json({
    plan: {
      id: updated!.id,
      dayLabel: updated!.dayLabel,
      exercises: updated!.exercises.map((e) => ({ id: e.id, name: e.name, scheme: e.scheme })),
    },
  });
}
