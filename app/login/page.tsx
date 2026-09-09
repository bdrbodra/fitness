"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { RigTap } from "@/components/ui/RigTap";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Email o password non corretti.");
      return;
    }
    router.push(searchParams.get("callbackUrl") || "/");
    router.refresh();
  }

  return (
    <AuthShell title="ACCEDI" subtitle="Entra nel tuo account per continuare.">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-[5px]">
          <label className="text-[12px] text-ink/70">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="min-h-[46px] border border-ink/16 bg-surface px-2.5 text-base text-ink outline-none focus-visible:border-accent"
          />
        </div>
        <div className="flex flex-col gap-[5px]">
          <label className="text-[12px] text-ink/70">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="min-h-[46px] border border-ink/16 bg-surface px-2.5 text-base text-ink outline-none focus-visible:border-accent"
          />
        </div>
        {error && <div className="text-[13px] text-accent-700">{error}</div>}
        <RigTap
          type="submit"
          disabled={loading}
          className="flex min-h-[54px] w-full items-center justify-center bg-accent font-heading text-[16px] font-semibold leading-none tracking-[.1em] text-paper disabled:opacity-60"
        >
          {loading ? "…" : "ACCEDI"}
        </RigTap>
      </form>
      <div className="text-[13px] text-neutral-700">
        Non hai un account?{" "}
        <Link href="/signup" className="font-semibold text-accent-700">
          Registrati
        </Link>
      </div>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
