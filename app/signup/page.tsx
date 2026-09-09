"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { RigTap } from "@/components/ui/RigTap";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"USER" | "TRAINER">("USER");
  const [trainerCode, setTrainerCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
        role,
        trainerCode: role === "USER" ? trainerCode || undefined : undefined,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setLoading(false);
      setError(
        typeof data?.error === "string"
          ? data.error
          : "Non è stato possibile creare l'account. Controlla i dati inseriti."
      );
      return;
    }

    const signInRes = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (signInRes?.error) {
      router.push("/login");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <AuthShell title="CREA ACCOUNT" subtitle="Un account, tutto salvato per davvero.">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-[5px]">
          <label className="text-[12px] text-ink/70">Nome</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="min-h-[46px] border border-ink/16 bg-surface px-2.5 text-base text-ink outline-none focus-visible:border-accent"
          />
        </div>
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
          <label className="text-[12px] text-ink/70">Password (min. 8 caratteri)</label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="min-h-[46px] border border-ink/16 bg-surface px-2.5 text-base text-ink outline-none focus-visible:border-accent"
          />
        </div>

        <div className="flex flex-col gap-[5px]">
          <label className="text-[12px] text-ink/70">Sei un utente o un trainer?</label>
          <div className="flex border border-ink/16">
            <button
              type="button"
              onClick={() => setRole("USER")}
              className={`rig-tap flex-1 py-2.5 font-heading text-[13px] font-semibold leading-none tracking-[.06em] ${
                role === "USER" ? "bg-accent text-paper" : "bg-transparent text-ink"
              }`}
            >
              UTENTE
            </button>
            <button
              type="button"
              onClick={() => setRole("TRAINER")}
              className={`rig-tap flex-1 border-l border-ink/16 py-2.5 font-heading text-[13px] font-semibold leading-none tracking-[.06em] ${
                role === "TRAINER" ? "bg-accent text-paper" : "bg-transparent text-ink"
              }`}
            >
              TRAINER
            </button>
          </div>
        </div>

        {role === "USER" && (
          <div className="flex flex-col gap-[5px]">
            <label className="text-[12px] text-ink/70">Codice del trainer (opzionale)</label>
            <input
              value={trainerCode}
              onChange={(e) => setTrainerCode(e.target.value)}
              placeholder="es. DANA-4417"
              className="min-h-[46px] border border-ink/16 bg-surface px-2.5 font-heading text-[16px] font-semibold leading-none tracking-[.1em] text-ink outline-none focus-visible:border-accent"
            />
          </div>
        )}

        {error && <div className="text-[13px] text-accent-700">{error}</div>}

        <RigTap
          type="submit"
          disabled={loading}
          className="flex min-h-[54px] w-full items-center justify-center bg-accent font-heading text-[16px] font-semibold leading-none tracking-[.1em] text-paper disabled:opacity-60"
        >
          {loading ? "…" : "CREA ACCOUNT"}
        </RigTap>
      </form>
      <div className="text-[13px] text-neutral-700">
        Hai già un account?{" "}
        <Link href="/login" className="font-semibold text-accent-700">
          Accedi
        </Link>
      </div>
    </AuthShell>
  );
}
