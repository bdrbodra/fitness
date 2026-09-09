"use client";

import { useBruno } from "@/lib/BrunoContext";
import { Blueprint } from "@/components/ui/Blueprint";
import { RigTap } from "@/components/ui/RigTap";

export function Momentum() {
  const { s, d, go, toggleHabit, setMood, useFreeze } = useBruno();
  const it = s.lang === "it";

  return (
    <div className="flex flex-col gap-4 px-4 pb-[22px] pt-4">
      <div className="font-heading text-[30px] font-semibold leading-none">{d.mom_h}</div>

      <Blueprint className="bg-accent-900 p-3.5 text-paper">
        <div className="font-heading text-[11px] font-semibold leading-none tracking-[.14em] text-accent-400">
          {d.streak_card}
        </div>
        <div className="mt-1.5 flex items-end gap-2.5">
          <span className="font-heading text-[62px] font-semibold leading-none">{s.streak}</span>
          <span className="pb-2 text-[12px] text-paper/72">
            {it ? "Tieni tre abitudini su quattro ogni giorno." : "Keep three of four habits every day."}
          </span>
        </div>
        <div className="mt-3 flex gap-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 ${i < Math.min(7, s.streak) ? "bg-accent" : "bg-paper/20"}`} />
          ))}
        </div>
        <RigTap
          onClick={useFreeze}
          disabled={s.freeze}
          className="mt-3.5 flex min-h-[48px] w-full items-center justify-center px-2.5 text-center font-heading text-[13px] font-semibold leading-[1.2] tracking-[.1em] text-paper border border-accent-400 disabled:opacity-70"
        >
          {s.freeze
            ? it
              ? "SALVAGENTE ATTIVO OGGI"
              : "SAVER ACTIVE TODAY"
            : it
              ? "USA UN SALVAGENTE OGGI"
              : "USE A SAVER TODAY"}
        </RigTap>
      </Blueprint>

      <Blueprint className="p-3.5">
        <div className="flex items-baseline justify-between">
          <div className="font-heading text-[11px] font-semibold leading-none tracking-[.14em] text-accent-700">
            {d.habits}
          </div>
          <div className="font-heading text-[15px] font-semibold leading-none">
            {s.habits.filter(Boolean).length} / 4
          </div>
        </div>
        <div className="mt-[5px] text-[12px] text-neutral-700">{d.habits_sub}</div>
        <div className="mt-[11px] flex flex-col gap-[7px]">
          {d.habit_list.map(([label, target], i) => {
            const on = s.habits[i];
            return (
              <RigTap
                key={label}
                onClick={() => toggleHabit(i)}
                className={`flex min-h-[52px] items-center gap-3 border px-3 ${
                  on ? "border-accent bg-accent/12" : "border-ink/16 bg-transparent"
                }`}
              >
                <div
                  className={`flex h-[26px] w-[26px] flex-none items-center justify-center border font-heading text-[15px] font-semibold leading-none text-paper ${
                    on ? "border-accent bg-accent" : "border-ink/16 bg-transparent"
                  }`}
                >
                  {on ? "✓" : ""}
                </div>
                <span className="flex-1 text-left text-[14px] text-ink">{label}</span>
                <span className="font-heading text-[13px] font-semibold leading-none tracking-[.06em] text-neutral-700">
                  {target}
                </span>
              </RigTap>
            );
          })}
        </div>
      </Blueprint>

      <Blueprint className="p-3.5">
        <div className="font-heading text-[11px] font-semibold leading-none tracking-[.14em] text-accent-700">
          {d.mood_q}
        </div>
        <div className="mt-2.5 flex gap-[7px]">
          {d.moods.map((label, i) => {
            const on = s.mood === i;
            return (
              <RigTap
                key={label}
                onClick={() => setMood(i)}
                className={`flex min-h-[52px] flex-1 items-center justify-center font-heading text-[13px] font-semibold leading-none tracking-[.08em] border ${
                  on ? "border-accent bg-accent text-paper" : "border-ink/16 bg-transparent text-ink"
                }`}
              >
                {label}
              </RigTap>
            );
          })}
        </div>
        <div className="mt-2.5 text-[12.5px] text-accent-700">{d.mood_hints[s.mood]}</div>
      </Blueprint>

      <div>
        <div className="mb-[9px] font-heading text-[11px] font-semibold leading-none tracking-[.14em] text-neutral-700">
          {d.badges}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {d.badge_list.map((label, i) => {
            // Only badges we can honestly compute from real account data are
            // ever shown as earned — the rest need more history to unlock
            // (session totals, lifetime PRs) and stay locked for now.
            const earned = i === 2 && s.streak >= 7;
            return (
              <div
                key={label}
                className={`flex min-h-[76px] flex-col justify-between p-2.5 border ${
                  earned ? "border-accent border-solid text-ink" : "border-ink/30 border-dashed text-neutral-700"
                }`}
              >
                <div className={`font-heading text-[18px] font-semibold leading-none ${earned ? "text-accent" : "text-ink/30"}`}>
                  {earned ? "✓" : "—"}
                </div>
                <div className="font-heading text-[11px] font-semibold leading-[1.15] tracking-[.06em]">
                  {earned ? label : d.locked}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Blueprint className="p-3.5">
        <div className="font-heading text-[11px] font-semibold leading-none tracking-[.14em] text-accent-700">
          {d.comeback}
        </div>
        <p className="mb-3 mt-2 text-[13px]" style={{ textWrap: "pretty" }}>
          {d.comeback_sub}
        </p>
        <RigTap
          onClick={() => go("session")}
          className="flex min-h-[54px] w-full items-center justify-center bg-accent font-heading text-[16px] font-semibold leading-none tracking-[.1em] text-paper"
        >
          {d.comeback_cta}
        </RigTap>
      </Blueprint>
    </div>
  );
}
