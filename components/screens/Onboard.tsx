"use client";

import { useState } from "react";
import { useBruno } from "@/lib/BrunoContext";
import { RigTap } from "@/components/ui/RigTap";

export function Onboard() {
  const { d, go, profile, saveProfile } = useBruno();
  const [goalIndex, setGoalIndex] = useState<number | null>(
    profile?.goal ? d.goals_list.indexOf(profile.goal) : null
  );
  const [trainerCode, setTrainerCode] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function finish() {
    setError(null);
    setSaving(true);
    const res = await saveProfile({
      goal: goalIndex !== null ? d.goals_list[goalIndex] : undefined,
      trainerCode: trainerCode || undefined,
    });
    setSaving(false);
    if (!res.ok) {
      setError(res.error ?? "Errore");
      return;
    }
    go("today");
  }

  return (
    <div className="flex min-h-full flex-col gap-4 px-4 pb-[26px] pt-[18px]">
      <div className="flex gap-[5px]">
        <div className="h-[3px] flex-1 bg-accent" />
        <div className="h-[3px] flex-1 bg-accent" />
        <div className="h-[3px] flex-1 bg-ink/14" />
      </div>

      <div>
        <div className="font-heading text-[10px] font-semibold leading-none tracking-[.14em] text-accent-700">
          {d.step2}
        </div>
        <div className="mt-1.5 font-heading text-[34px] font-semibold leading-[1.02]">{d.onboard_h}</div>
        <div className="mt-1.5 text-[13px] text-neutral-700" style={{ textWrap: "pretty" }}>
          {d.onboard_sub}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {d.goals_list.map((label, i) => {
          const on = goalIndex === i;
          return (
            <RigTap
              key={label}
              onClick={() => setGoalIndex(i)}
              className={`px-3.5 py-2.5 font-heading text-[13px] font-semibold leading-none tracking-[.06em] border ${
                on ? "border-accent bg-accent text-paper" : "border-ink/16 bg-transparent text-ink"
              }`}
            >
              {label}
            </RigTap>
          );
        })}
      </div>

      {!profile?.trainerId && (
        <div className="flex flex-col gap-[5px]">
          <label className="text-[12px] text-ink/70">{d.invite}</label>
          <input
            value={trainerCode}
            onChange={(e) => setTrainerCode(e.target.value)}
            className="min-h-[46px] border border-ink/16 bg-surface px-2.5 font-heading text-[18px] font-semibold leading-none tracking-[.2em] text-ink outline-none focus-visible:border-accent"
          />
        </div>
      )}

      {error && <div className="text-[13px] text-accent-700">{error}</div>}

      <div className="flex-1" />

      <RigTap
        onClick={finish}
        disabled={saving}
        className="flex min-h-[58px] w-full items-center justify-center bg-accent font-heading text-[19px] font-semibold leading-none tracking-[.12em] text-paper disabled:opacity-60"
      >
        {saving ? "…" : d.onboard_cta}
      </RigTap>
    </div>
  );
}
