"use client";

import { useState } from "react";
import { useBruno } from "@/lib/BrunoContext";
import { Blueprint } from "@/components/ui/Blueprint";
import { RigTap } from "@/components/ui/RigTap";

export function Profile() {
  const { s, d, go, profile, logout, saveProfile } = useBruno();
  const it = s.lang === "it";
  const [trainerCode, setTrainerCode] = useState("");
  const [linking, setLinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!profile) return null;

  async function linkTrainer() {
    setError(null);
    setLinking(true);
    const res = await saveProfile({ trainerCode });
    setLinking(false);
    if (!res.ok) setError(res.error ?? "Errore");
  }

  return (
    <div className="flex flex-col gap-3.5 px-4 pb-[22px] pt-4">
      <div className="font-heading text-[30px] font-semibold leading-none">{d.profile_h}</div>

      <Blueprint className="flex items-center gap-3 p-3.5">
        <div
          className="flex h-[54px] w-[54px] flex-none items-center justify-center border border-ink/16 bg-accent font-heading text-[20px] font-semibold text-paper"
        >
          {profile.name.trim().charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="font-heading text-[21px] font-semibold leading-none">{profile.name}</div>
          <div className="mt-[3px] text-[12px] text-neutral-700">{profile.email}</div>
        </div>
      </Blueprint>

      {profile.role === "TRAINER" ? (
        <div className="flex items-center gap-2.5 border-b border-ink/8 py-3">
          <span className="flex-1 text-[14px]">{it ? "Il tuo codice trainer" : "Your trainer code"}</span>
          <span className="font-heading text-[15px] font-semibold leading-none tracking-[.1em] text-accent-700">
            {profile.trainerCode}
          </span>
        </div>
      ) : profile.trainerName ? (
        <div className="flex items-center gap-2.5 border-b border-ink/8 py-3">
          <span className="flex-1 text-[14px]">{it ? "Trainer" : "Trainer"}</span>
          <span className="font-heading text-[13px] font-semibold leading-none tracking-[.06em] text-accent-700">
            {profile.trainerName.toUpperCase()}
          </span>
        </div>
      ) : (
        <Blueprint className="p-3.5">
          <div className="font-heading text-[10px] font-semibold leading-none tracking-[.14em] text-accent-700">
            {it ? "COLLEGATI A UN TRAINER" : "LINK A TRAINER"}
          </div>
          <div className="mt-2 flex gap-2">
            <input
              value={trainerCode}
              onChange={(e) => setTrainerCode(e.target.value)}
              placeholder="es. DANA-4417"
              className="min-h-[44px] flex-1 border border-ink/16 bg-surface px-2.5 font-heading text-[15px] font-semibold leading-none tracking-[.08em] text-ink outline-none focus-visible:border-accent"
            />
            <RigTap
              onClick={linkTrainer}
              disabled={linking || !trainerCode}
              className="min-h-[44px] bg-accent px-4 font-heading text-[13px] font-semibold leading-none tracking-[.06em] text-paper disabled:opacity-40"
            >
              {linking ? "…" : it ? "COLLEGA" : "LINK"}
            </RigTap>
          </div>
          {error && <div className="mt-2 text-[12px] text-accent-700">{error}</div>}
        </Blueprint>
      )}

      {profile.role === "USER" && (
        <div className="flex items-center gap-2.5 border-b border-ink/8 py-3">
          <span className="flex-1 text-[14px]">{it ? "Obiettivo" : "Goal"}</span>
          <span className="font-heading text-[13px] font-semibold leading-none tracking-[.06em] text-accent-700">
            {profile.goal ?? (it ? "NON IMPOSTATO" : "NOT SET")}
          </span>
        </div>
      )}

      {profile.role === "USER" && (
        <RigTap
          onClick={() => go("onboard")}
          className="flex min-h-[48px] w-full items-center justify-center border border-ink/16 font-heading text-[14px] font-semibold leading-none tracking-[.1em]"
        >
          {d.replay_onboard}
        </RigTap>
      )}

      <RigTap
        onClick={logout}
        className="flex min-h-[48px] w-full items-center justify-center border border-ink/16 font-heading text-[14px] font-semibold leading-none tracking-[.1em] text-accent-700"
      >
        {it ? "ESCI" : "LOG OUT"}
      </RigTap>
    </div>
  );
}
