import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { unauthorized } from "@/lib/server/http";

const schema = z.object({
  goal: z.string().max(80).optional(),
  trainerCode: z.string().trim().toUpperCase().max(40).optional(),
});

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user) return unauthorized();

  const body = schema.safeParse(await req.json().catch(() => null));
  if (!body.success) return NextResponse.json({ error: body.error.flatten() }, { status: 400 });

  const data: { goal?: string; trainerId?: string } = {};
  if (body.data.goal !== undefined) data.goal = body.data.goal;

  if (body.data.trainerCode && session.user.role === "USER" && !session.user.trainerId) {
    const trainer = await prisma.user.findUnique({ where: { trainerCode: body.data.trainerCode } });
    if (!trainer || trainer.role !== "TRAINER") {
      return NextResponse.json({ error: "Codice trainer non valido." }, { status: 400 });
    }
    data.trainerId = trainer.id;
  }

  const user = await prisma.user.update({ where: { id: session.user.id }, data });
  return NextResponse.json({ goal: user.goal, trainerId: user.trainerId });
}
