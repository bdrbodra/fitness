"use client";

import { useBruno } from "@/lib/BrunoContext";
import { Blueprint } from "@/components/ui/Blueprint";
import { RigTap } from "@/components/ui/RigTap";
import { WEEK_TODAY_MARKS } from "@/lib/constants";

export function Plan() {
  const { s, d, go } = useBruno();

  return (
    <div className="flex flex-col gap-3.5 px-4 pb-[22px] pt-4">
      <div>
        <div className="font-heading text-[30px] font-semibold leading-none">{d.plan_h}</div>
        <div className="mt-1 text-[12px] text-neutral-700">{d.plan_meta}</div>
      </div>

      <div className="grid grid-cols-7 gap-[5px]">
        {d.week.map((day, i) => {
          const active = i === 2;
          return (
            <div
              key={day}
              className={`border py-2 text-center text-[11px] ${
                active ? "border-accent bg-accent text-paper" : "border-ink/16 bg-transparent text-ink"
              }`}
            >
              <div className="font-heading text-[10px] font-semibold leading-none tracking-[.04em]">{day}</div>
              <div className="mt-[5px] font-heading text-[15px] font-semibold leading-none">
                {WEEK_TODAY_MARKS[i]}
              </div>
            </div>
          );
        })}
      </div>

      <Blueprint className="p-3.5">
        <div className="font-heading text-[10px] font-semibold leading-none tracking-[.14em] text-accent-700">
          {s.plan ? s.plan.dayLabel : d.day_push}
        </div>
        {s.plan && s.plan.exercises.length > 0 ? (
          <div className="mt-2">
            {s.plan.exercises.map((ex, i) => (
              <div key={ex.id} className="flex items-baseline gap-2.5 border-b border-ink/8 py-2.5">
                <span className="w-3.5 font-heading text-[11px] font-semibold leading-none text-neutral-700">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-[13px]">{ex.name}</span>
                <span className="font-heading text-[14px] font-semibold leading-none tracking-[.04em]">
                  {ex.scheme}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-[13px] text-neutral-700">
            Il tuo trainer non ha ancora assegnato una scheda.
          </p>
        )}
        <RigTap
          onClick={() => go("session")}
          disabled={!s.plan || s.plan.exercises.length === 0}
          className="mt-3.5 flex min-h-[52px] w-full items-center justify-center bg-accent font-heading text-[16px] font-semibold leading-none tracking-[.12em] text-paper disabled:opacity-40"
        >
          {d.start_this}
        </RigTap>
      </Blueprint>
    </div>
  );
}
