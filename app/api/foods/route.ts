import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { unauthorized } from "@/lib/server/http";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return unauthorized();

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();

  const foods = await prisma.food.findMany({
    where: q
      ? {
          OR: [
            { nameIt: { contains: q, mode: "insensitive" } },
            { nameEn: { contains: q, mode: "insensitive" } },
          ],
        }
      : {},
    orderBy: session.user.lang === "en" ? { nameEn: "asc" } : { nameIt: "asc" },
    take: 25,
  });

  return NextResponse.json({ foods });
}
