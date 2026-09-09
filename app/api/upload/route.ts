import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { auth } from "@/auth";
import { unauthorized } from "@/lib/server/http";

const MAX_BYTES = 8 * 1024 * 1024;

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return unauthorized();

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "no file provided" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "only image uploads are allowed" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "file too large" }, { status: 400 });
  }

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const filename = `meals/${session.user.id}-${randomUUID()}.${ext || "jpg"}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put(filename, file, { access: "public" });
    return NextResponse.json({ url: blob.url });
  }

  // Local/dev fallback so photo upload works without a Vercel Blob store
  // configured yet — writes under public/uploads instead. This only works
  // on a writable filesystem (local dev); Vercel's serverless functions are
  // read-only outside /tmp, so production deploys need Blob storage.
  try {
    const localName = `${session.user.id}-${randomUUID()}.${ext || "jpg"}`;
    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    const bytes = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(dir, localName), bytes);
    return NextResponse.json({ url: `/uploads/${localName}` });
  } catch {
    return NextResponse.json(
      {
        error:
          "Photo storage isn't configured yet. Create a Blob store in the Vercel dashboard and connect it to this project.",
      },
      { status: 500 }
    );
  }
}
