import { prisma } from "@/lib/prisma";
import { addDays, dateKey, todayDate } from "./date";

/**
 * Consecutive days (walking back from today) where at least 3 of the 4
 * habits were checked, or a streak-freeze was used that day.
 */
export async function computeStreak(userId: string): Promise<number> {
  const logs = await prisma.dailyLog.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 60,
  });
  const byDate = new Map(logs.map((l) => [dateKey(l.date), l]));

  let streak = 0;
  let cursor = todayDate();
  for (let i = 0; i < 60; i++) {
    const log = byDate.get(dateKey(cursor));
    const habits = Array.isArray(log?.habits) ? (log!.habits as unknown as boolean[]) : [];
    const metThreshold = habits.filter(Boolean).length >= 3;
    if (metThreshold || log?.freeze) {
      streak++;
      cursor = addDays(cursor, -1);
    } else {
      break;
    }
  }
  return streak;
}
