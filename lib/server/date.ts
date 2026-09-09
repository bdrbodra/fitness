/** Midnight UTC for "today" — used as the DailyLog/session day boundary. */
export function todayDate(): Date {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

export function dateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}
