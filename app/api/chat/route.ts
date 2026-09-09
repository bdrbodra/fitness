import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { forbidden, unauthorized } from "@/lib/server/http";

async function resolveCounterpart(
  userId: string,
  role: "USER" | "TRAINER",
  trainerId: string | null,
  requestedClientId: string | null
) {
  if (role === "USER") return trainerId;
  if (!requestedClientId) return null;
  const client = await prisma.user.findFirst({
    where: { id: requestedClientId, trainerId: userId },
  });
  return client ? client.id : "FORBIDDEN";
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return unauthorized();

  const { searchParams } = new URL(req.url);
  const counterpartId = await resolveCounterpart(
    session.user.id,
    session.user.role,
    session.user.trainerId,
    searchParams.get("clientId")
  );
  if (counterpartId === "FORBIDDEN") return forbidden();
  if (!counterpartId) return NextResponse.json({ messages: [], counterpart: null });

  const [messages, counterpart] = await Promise.all([
    prisma.chatMessage.findMany({
      where: {
        OR: [
          { senderId: session.user.id, recipientId: counterpartId },
          { senderId: counterpartId, recipientId: session.user.id },
        ],
      },
      orderBy: { createdAt: "asc" },
      take: 300,
    }),
    prisma.user.findUnique({ where: { id: counterpartId }, select: { id: true, name: true } }),
  ]);

  return NextResponse.json({
    counterpart,
    messages: messages.map((m) => ({
      id: m.id,
      dir: m.senderId === session.user.id ? "out" : "in",
      text: m.text,
      createdAt: m.createdAt,
    })),
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return unauthorized();

  const body = await req.json().catch(() => null);
  const text = String(body?.text ?? "").trim();
  if (!text) return NextResponse.json({ error: "empty message" }, { status: 400 });

  const counterpartId = await resolveCounterpart(
    session.user.id,
    session.user.role,
    session.user.trainerId,
    body?.clientId ?? null
  );
  if (counterpartId === "FORBIDDEN") return forbidden();
  if (!counterpartId) {
    return NextResponse.json({ error: "no linked trainer/client to message" }, { status: 400 });
  }

  const message = await prisma.chatMessage.create({
    data: { senderId: session.user.id, recipientId: counterpartId, text: text.slice(0, 2000) },
  });

  return NextResponse.json({
    message: { id: message.id, dir: "out", text: message.text, createdAt: message.createdAt },
  });
}
