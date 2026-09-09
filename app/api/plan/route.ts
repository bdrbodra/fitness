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
          managedBy: plan.managedBy,
          exercises: plan.exercises.map((e) => ({
            id: e.id,
            name: e.name,
            scheme: e.scheme,
            restSeconds: e.restSeconds,
          })),
        }
      : null,
  });
}

const schema = z.object({
  clientId: z.string().min(1).optional(),
  dayLabel: z.string().min(1).max(80),
  exercises: z.array(
    z.object({
      name: z.string().min(1).max(120),
      scheme: z.string().min(1).max(40),
      restSeconds: z.number().int().min(0).max(900).optional(),
    })
  ),
});

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user) return unauthorized();

  const body = schema.safeParse(await req.json().catch(() => null));
  if (!body.success) return NextResponse.json({ error: body.error.flatten() }, { status: 400 });

  let targetUserId: string;
  let managedBy: "USER" | "TRAINER";

  if (session.user.role === "TRAINER") {
    // A trainer edits a specific client's plan and takes ownership of it —
    // the client can no longer edit it themselves after this.
    if (!body.data.clientId) {
      return NextResponse.json({ error: "clientId required" }, { status: 400 });
    }
    const client = await prisma.user.findFirst({
      where: { id: body.data.clientId, trainerId: session.user.id },
    });
    if (!client) return forbidden();
    targetUserId = body.data.clientId;
    managedBy = "TRAINER";
  } else {
    // A gym member edits their own plan — only allowed while no trainer has
    // taken it over.
    targetUserId = session.user.id;
    managedBy = "USER";
    const existing = await prisma.workoutPlan.findFirst({ where: { userId: targetUserId } });
    if (existing?.managedBy === "TRAINER") {
      return forbidden("Il tuo trainer gestisce questa scheda — chiedigli di modificarla.");
    }
  }

  let plan = await prisma.workoutPlan.findFirst({ where: { userId: targetUserId } });
  if (!plan) {
    plan = await prisma.workoutPlan.create({
      data: { userId: targetUserId, dayLabel: body.data.dayLabel, managedBy },
    });
  } else {
    await prisma.workoutPlan.update({
      where: { id: plan.id },
      data: { dayLabel: body.data.dayLabel, managedBy },
    });
  }

  await prisma.$transaction([
    prisma.planExercise.deleteMany({ where: { planId: plan.id } }),
    prisma.planExercise.createMany({
      data: body.data.exercises.map((e, i) => ({
        planId: plan!.id,
        order: i,
        name: e.name,
        scheme: e.scheme,
        restSeconds: e.restSeconds ?? 90,
      })),
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
      managedBy: updated!.managedBy,
      exercises: updated!.exercises.map((e) => ({
        id: e.id,
        name: e.name,
        scheme: e.scheme,
        restSeconds: e.restSeconds,
      })),
    },
  });
}
