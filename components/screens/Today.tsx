"use client";

import { useBruno } from "@/lib/BrunoContext";
import { Blueprint } from "@/components/ui/Blueprint";
import { RigTap } from "@/components/ui/RigTap";

const TARGET_KCAL = 2600;
const TARGET_PROTEIN = 180;
const TARGET_CARBS = 280;
const TARGET_FAT = 70;

export function Today() {
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
  const pct = (v: number, target: number) => Math.min(100, Math.round((v / target) * 100));

  return (
    <div className="flex flex-col gap-3.5 px-4 pb-[22px] pt-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="font-heading text-[10px] font-semibold leading-none tracking-[.14em] text-accent-700">
            {d.today_date}
          </div>
          <div className="mt-[5px] font-heading text-[34px] font-semibold leading-none">
            {d.today_h}
          </div>
        </div>
        <div className="text-right font-heading text-[10px] font-semibold leading-none tracking-[.12em] text-neutral-700">
          {d.streak}
          <div className="mt-0.5 text-[30px] leading-none tracking-normal text-ink">{s.streak}</div>
        </div>
      </div>

      <RigTap
        onClick={() => go("momentum")}
        className="flex items-center gap-3 border border-accent px-3.5 py-[11px] text-left"
      >
        <div className="font-heading text-[26px] font-semibold leading-none text-accent-700">
          {s.streak}
        </div>
        <div className="flex-1">
          <div className="font-heading text-[12px] font-semibold leading-none tracking-[.1em] text-accent-700">
            {d.nudge}
          </div>
          <div className="mt-[3px] text-[12px] text-neutral-700">{d.nudge_sub}</div>
        </div>
        <div className="font-heading text-[16px] font-semibold leading-none text-accent-700">
          →
        </div>
      </RigTap>

      <Blueprint className="bg-accent-900 p-3.5 text-paper">
        <div className="font-heading text-[10px] font-semibold leading-none tracking-[.14em] text-accent-400">
          {d.sess_kicker}
        </div>
        <div className="mb-1 mt-[9px] font-heading text-[28px] font-semibold leading-none">
          {s.plan ? s.plan.dayLabel : d.sess_name}
        </div>
        <div className="text-[12px] text-paper/72">
          {s.plan
            ? `${s.plan.exercises.length} ${s.plan.exercises.length === 1 ? "esercizio" : "esercizi"}`
            : d.sess_meta}
        </div>
        <RigTap
          onClick={() => go("session")}
          className="mt-3.5 flex min-h-[54px] w-full items-center justify-center bg-accent font-heading text-[18px] font-semibold leading-none tracking-[.12em] text-paper"
        >
          {d.start}
        </RigTap>
      </Blueprint>

      <Blueprint className="p-3.5">
        <div className="flex items-baseline justify-between">
          <div className="font-heading text-[10px] font-semibold leading-none tracking-[.14em] text-accent-700">
            {d.fuel}
          </div>
          <div className="text-[11px] text-neutral-700">
            {totals.kcal} / {TARGET_KCAL} kcal
          </div>
        </div>
        <div className="my-2.5 h-2 bg-ink/10">
          <div className="h-full bg-accent" style={{ width: `${pct(totals.kcal, TARGET_KCAL)}%` }} />
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          <div>
            <div className="font-heading text-[10px] font-semibold leading-none tracking-[.1em] text-neutral-700">
              {d.protein}
            </div>
            <div className="font-heading text-[21px] font-semibold leading-[1.2]">
              {totals.protein}
              <span className="text-[12px] text-neutral-700">/{TARGET_PROTEIN}g</span>
            </div>
            <div className="mt-[5px] h-1 bg-ink/10">
              <div className="h-full bg-accent" style={{ width: `${pct(totals.protein, TARGET_PROTEIN)}%` }} />
            </div>
          </div>
          <div>
            <div className="font-heading text-[10px] font-semibold leading-none tracking-[.1em] text-neutral-700">
              {d.carbs}
            </div>
            <div className="font-heading text-[21px] font-semibold leading-[1.2]">
              {totals.carbs}
              <span className="text-[12px] text-neutral-700">/{TARGET_CARBS}g</span>
            </div>
            <div className="mt-[5px] h-1 bg-ink/10">
              <div className="h-full bg-accent-500" style={{ width: `${pct(totals.carbs, TARGET_CARBS)}%` }} />
            </div>
          </div>
          <div>
            <div className="font-heading text-[10px] font-semibold leading-none tracking-[.1em] text-neutral-700">
              {d.fat}
            </div>
            <div className="font-heading text-[21px] font-semibold leading-[1.2]">
              {totals.fat}
              <span className="text-[12px] text-neutral-700">/{TARGET_FAT}g</span>
            </div>
            <div className="mt-[5px] h-1 bg-ink/10">
              <div className="h-full bg-accent-400" style={{ width: `${pct(totals.fat, TARGET_FAT)}%` }} />
            </div>
          </div>
        </div>
        <RigTap
          onClick={() => go("capture")}
          className="mt-3.5 flex min-h-[48px] w-full items-center justify-center border border-ink/16 font-heading text-[15px] font-semibold leading-none tracking-[.1em]"
        >
          {d.snap}
        </RigTap>
      </Blueprint>

      <Blueprint className="p-3.5">
        <div className="font-heading text-[10px] font-semibold leading-none tracking-[.14em] text-accent-700">
          {d.coach_kicker}
        </div>
        <p className="my-[9px] text-[13px]" style={{ textWrap: "pretty" }}>
          {s.lastCoachMessage
            ? s.lastCoachMessage.text
            : s.lang === "it"
              ? "Il tuo coach non ti ha ancora scritto."
              : "Your coach hasn't messaged you yet."}
        </p>
        <RigTap
          onClick={() => go("chat")}
          className="font-heading text-[13px] font-semibold leading-none tracking-[.1em] text-accent-700"
        >
          {d.reply}
        </RigTap>
      </Blueprint>
    </div>
  );
}
