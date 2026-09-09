import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { unauthorized } from "@/lib/server/http";
import { todayDate } from "@/lib/server/date";
import { itemMacros, mealMacros } from "@/lib/server/food";

export async function GET() {
  const session = await auth();
  if (!session?.user) return unauthorized();

  const meals = await prisma.meal.findMany({
    where: { userId: session.user.id, loggedAt: { gte: todayDate() } },
    orderBy: { loggedAt: "asc" },
    include: { items: { include: { food: true } } },
  });

  return NextResponse.json({
    meals: meals.map((m) => ({
      id: m.id,
      slot: m.slot,
      photoUrl: m.photoUrl,
      macros: mealMacros(m.items),
      items: m.items.map((it) => ({ id: it.id, name: it.food.nameIt, grams: it.grams, ...itemMacros(it) })),
    })),
  });
}

const schema = z.object({
  slot: z.string().min(1).max(40),
  photoUrl: z.string().max(500).optional(),
  items: z
    .array(z.object({ foodId: z.string().min(1), grams: z.number().min(1).max(5000) }))
    .min(1),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return unauthorized();

  const body = schema.safeParse(await req.json().catch(() => null));
  if (!body.success) return NextResponse.json({ error: body.error.flatten() }, { status: 400 });

  const meal = await prisma.meal.create({
    data: {
      userId: session.user.id,
      slot: body.data.slot,
      photoUrl: body.data.photoUrl ?? null,
      items: { create: body.data.items.map((it) => ({ foodId: it.foodId, grams: it.grams })) },
    },
    include: { items: { include: { food: true } } },
  });

  return NextResponse.json({
    meal: {
      id: meal.id,
      slot: meal.slot,
      photoUrl: meal.photoUrl,
      macros: mealMacros(meal.items),
      items: meal.items.map((it) => ({ id: it.id, name: it.food.nameIt, grams: it.grams, ...itemMacros(it) })),
    },
  });
}
