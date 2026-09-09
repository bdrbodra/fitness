"use client";

import { useBruno } from "@/lib/BrunoContext";
import { Blueprint } from "@/components/ui/Blueprint";
import { RigTap } from "@/components/ui/RigTap";

export function Meals() {
  const { s, d, go } = useBruno();
  const bigKcal = s.lang === "it" ? "2.140" : "2,140";

  return (
    <div className="flex flex-col gap-3 px-4 pb-[22px] pt-4">
      <div className="flex items-end justify-between">
        <div className="font-heading text-[30px] font-semibold leading-none">{d.meals_h}</div>
        <div className="font-heading text-[11px] font-semibold leading-none tracking-[.08em] text-neutral-700">
          {d.today_date_short}
        </div>
      </div>

      <Blueprint className="p-3.5">
        <div className="flex items-baseline gap-2">
          <span className="font-heading text-[40px] font-semibold leading-none">{bigKcal}</span>
          <span className="text-[12px] text-neutral-700">{d.kcal_left}</span>
        </div>
        <div className="mt-3 flex gap-1">
          <div className="h-[22px] bg-accent" style={{ flex: 148 }} />
          <div className="h-[22px] bg-accent-500" style={{ flex: 210 }} />
          <div className="h-[22px] bg-accent-400" style={{ flex: 62 }} />
          <div className="h-[22px] bg-ink/10" style={{ flex: 70 }} />
        </div>
        <div className="mt-[9px] flex gap-4 font-heading text-[10px] font-semibold leading-none tracking-[.1em] text-neutral-700">
          <span>P 148 G</span>
          <span>C 210 G</span>
          <span>F 62 G</span>
        </div>
      </Blueprint>

      {d.meals.map(([slot, name, macros, kcal]) => (
        <RigTap
          key={slot}
          onClick={() => go("capture")}
          className="flex items-center gap-3 border border-ink/16 px-3.5 py-[11px] text-left"
        >
          <div
            className="h-[46px] w-[46px] flex-none border border-ink/16"
            style={{
              background:
                "repeating-linear-gradient(45deg, var(--color-neutral-300) 0 4px, var(--color-neutral-200) 4px 8px)",
            }}
          />
          <div className="min-w-0 flex-1">
            <div className="font-heading text-[10px] font-semibold leading-none tracking-[.12em] text-accent-700">
              {slot}
            </div>
            <div className="mt-[3px] text-[14px]">{name}</div>
            <div className="text-[11px] text-neutral-700">{macros}</div>
          </div>
          <div className="font-heading text-[19px] font-semibold leading-none">{kcal}</div>
        </RigTap>
      ))}

      <RigTap
        onClick={() => go("capture")}
        className="flex min-h-[58px] w-full items-center justify-center bg-accent font-heading text-[18px] font-semibold leading-none tracking-[.12em] text-paper"
      >
        {d.snap_flow}
      </RigTap>
    </div>
  );
}
