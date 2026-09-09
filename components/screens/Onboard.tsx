"use client";

import { useBruno } from "@/lib/BrunoContext";
import { RigTap } from "@/components/ui/RigTap";

export function Onboard() {
  const { s, d, go, setGoal, setInvite } = useBruno();

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
          const on = s.goal === i;
          return (
            <RigTap
              key={label}
              onClick={() => setGoal(i)}
              className={`px-3.5 py-2.5 font-heading text-[13px] font-semibold leading-none tracking-[.06em] border ${
                on ? "border-accent bg-accent text-paper" : "border-ink/16 bg-transparent text-ink"
              }`}
            >
              {label}
            </RigTap>
          );
        })}
      </div>

      <div className="flex flex-col gap-[5px]">
        <label className="text-[12px] text-ink/70">{d.invite}</label>
        <input
          value={s.invite}
          onChange={(e) => setInvite(e.target.value)}
          className="min-h-[46px] border border-ink/16 bg-surface px-2.5 font-heading text-[18px] font-semibold leading-none tracking-[.2em] text-ink outline-none focus-visible:border-accent"
        />
      </div>

      <div className="flex-1" />

      <RigTap
        onClick={() => go("today")}
        className="flex min-h-[58px] w-full items-center justify-center bg-accent font-heading text-[19px] font-semibold leading-none tracking-[.12em] text-paper"
      >
        {d.onboard_cta}
      </RigTap>
    </div>
  );
}
