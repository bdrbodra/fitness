import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { unauthorized } from "@/lib/server/http";
import { todayDate } from "@/lib/server/date";
import { computeStreak } from "@/lib/server/streak";

const schema = z.object({
  habits: z.array(z.boolean()).length(4).optional(),
  mood: z.number().int().min(0).max(2).optional(),
  freeze: z.boolean().optional(),
});

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user) return unauthorized();

  const body = schema.safeParse(await req.json().catch(() => null));
  if (!body.success) return NextResponse.json({ error: body.error.flatten() }, { status: 400 });

  const userId = session.user.id;
  const date = todayDate();
  const { habits, mood, freeze } = body.data;

  const log = await prisma.dailyLog.upsert({
    where: { userId_date: { userId, date } },
    update: {
      ...(habits ? { habits } : {}),
      ...(mood !== undefined ? { mood } : {}),
      ...(freeze !== undefined ? { freeze } : {}),
    },
    create: {
      userId,
      date,
      habits: habits ?? [false, false, false, false],
      mood: mood ?? null,
      freeze: freeze ?? false,
    },
  });

  const streak = await computeStreak(userId);

  return NextResponse.json({
    dailyLog: { habits: log.habits, mood: log.mood, freeze: log.freeze },
    streak,
  });
}
