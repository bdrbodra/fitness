import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { unauthorized } from "@/lib/server/http";
import { todayDate } from "@/lib/server/date";
import { computeStreak } from "@/lib/server/streak";
import { mealMacros, itemMacros } from "@/lib/server/food";

export async function GET() {
  const session = await auth();
  if (!session?.user) return unauthorized();
  const userId = session.user.id;
  const date = todayDate();

  const [user, dailyLog, plan, workoutSession, meals] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: { trainer: { select: { id: true, name: true } } },
    }),
    prisma.dailyLog.upsert({
      where: { userId_date: { userId, date } },
      update: {},
      create: { userId, date, habits: [false, false, false, false], mood: null, freeze: false },
    }),
    prisma.workoutPlan.findFirst({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: { exercises: { orderBy: { order: "asc" } } },
    }),
    prisma.workoutSession.findFirst({
      where: { userId, startedAt: { gte: date } },
      orderBy: { startedAt: "desc" },
      include: { sets: { orderBy: { createdAt: "asc" } } },
    }),
    prisma.meal.findMany({
      where: { userId, loggedAt: { gte: date } },
      orderBy: { loggedAt: "asc" },
      include: { items: { include: { food: true } } },
    }),
  ]);

  if (!user) return unauthorized();

  const streak = await computeStreak(userId);

  let lastCoachMessage: { text: string; createdAt: Date } | null = null;
  if (user.role === "USER" && user.trainerId) {
    const msg = await prisma.chatMessage.findFirst({
      where: { senderId: user.trainerId, recipientId: userId },
      orderBy: { createdAt: "desc" },
    });
    lastCoachMessage = msg ? { text: msg.text, createdAt: msg.createdAt } : null;
  }

  let clients: { id: string; name: string; streak: number }[] | null = null;
  if (user.role === "TRAINER") {
    const linked = await prisma.user.findMany({
      where: { trainerId: userId },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
    clients = await Promise.all(
      linked.map(async (c) => ({ id: c.id, name: c.name, streak: await computeStreak(c.id) }))
    );
  }

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      lang: user.lang,
      goal: user.goal,
      trainerCode: user.trainerCode,
      trainerId: user.trainerId,
      trainerName: user.trainer?.name ?? null,
    },
    lastCoachMessage,
    dailyLog: {
      habits: dailyLog.habits as unknown as boolean[],
      mood: dailyLog.mood,
      freeze: dailyLog.freeze,
    },
    streak,
    plan: plan
      ? {
          id: plan.id,
          dayLabel: plan.dayLabel,
          managedBy: plan.managedBy,
          exercises: plan.exercises.map((e) => ({ id: e.id, name: e.name, scheme: e.scheme })),
        }
      : null,
    session: workoutSession
      ? {
          id: workoutSession.id,
          sets: workoutSession.sets.map((s) => ({
            id: s.id,
            exercise: s.exercise,
            weightKg: s.weightKg,
            reps: s.reps,
            rpe: s.rpe,
          })),
        }
      : null,
    meals: meals.map((m) => ({
      id: m.id,
      slot: m.slot,
      photoUrl: m.photoUrl,
      macros: mealMacros(m.items),
      items: m.items.map((it) => ({
        id: it.id,
        name: it.food.nameIt,
        nameEn: it.food.nameEn,
        grams: it.grams,
        ...itemMacros(it),
      })),
    })),
    clients,
  });
}
