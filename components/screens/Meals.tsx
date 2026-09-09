"use client";

import { useBruno } from "@/lib/BrunoContext";
import { Blueprint } from "@/components/ui/Blueprint";
import { RigTap } from "@/components/ui/RigTap";

const TARGET_KCAL = 2600;

export function Meals() {
  const { s, d, go } = useBruno();

  const totals = s.meals.reduce(
    (acc, m) => ({
      kcal: acc.kcal + m.macros.kcal,
      protein: acc.protein + m.macros.protein,
      carbs: acc.carbs + m.macros.carbs,
      fat: acc.fat + m.macros.fat,
    }),
    { kcal: 0, protein: 0, carbs: 0, fat: 0 }
  );
  const left = Math.max(0, TARGET_KCAL - totals.kcal);
  const it = s.lang === "it";

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
          <span className="font-heading text-[40px] font-semibold leading-none">{totals.kcal}</span>
          <span className="text-[12px] text-neutral-700">
            {it ? `di ${TARGET_KCAL} kcal · ${left} rimanenti` : `of ${TARGET_KCAL} kcal · ${left} left`}
          </span>
        </div>
        <div className="mt-3 flex gap-1">
          <div className="h-[22px] bg-accent" style={{ flex: totals.protein || 0.001 }} />
          <div className="h-[22px] bg-accent-500" style={{ flex: totals.carbs || 0.001 }} />
          <div className="h-[22px] bg-accent-400" style={{ flex: totals.fat || 0.001 }} />
        </div>
        <div className="mt-[9px] flex gap-4 font-heading text-[10px] font-semibold leading-none tracking-[.1em] text-neutral-700">
          <span>P {totals.protein} G</span>
          <span>C {totals.carbs} G</span>
          <span>F {totals.fat} G</span>
        </div>
      </Blueprint>

      {s.meals.length === 0 && (
        <p className="text-[13px] text-neutral-700">
          {it ? "Nessun pasto registrato oggi." : "No meals logged yet today."}
        </p>
      )}

      {s.meals.map((m) => (
        <div key={m.id} className="flex items-center gap-3 border border-ink/16 px-3.5 py-[11px]">
          {m.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={m.photoUrl} alt="" className="h-[46px] w-[46px] flex-none border border-ink/16 object-cover" />
          ) : (
            <div
              className="h-[46px] w-[46px] flex-none border border-ink/16"
              style={{
                background:
                  "repeating-linear-gradient(45deg, var(--color-neutral-300) 0 4px, var(--color-neutral-200) 4px 8px)",
              }}
            />
          )}
          <div className="min-w-0 flex-1">
            <div className="font-heading text-[10px] font-semibold leading-none tracking-[.12em] text-accent-700">
              {m.slot}
            </div>
            <div className="mt-[3px] truncate text-[14px]">
              {m.items.map((it) => it.name).join(", ")}
            </div>
            <div className="text-[11px] text-neutral-700">
              P {m.macros.protein} · C {m.macros.carbs} · F {m.macros.fat}
            </div>
          </div>
          <div className="font-heading text-[19px] font-semibold leading-none">{m.macros.kcal}</div>
        </div>
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
