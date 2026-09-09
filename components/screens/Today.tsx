"use client";

import { useBruno } from "@/lib/BrunoContext";
import { Blueprint } from "@/components/ui/Blueprint";
import { RigTap } from "@/components/ui/RigTap";

export function Today() {
  const { d, go } = useBruno();

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
          <div className="mt-0.5 text-[30px] leading-none tracking-normal text-ink">14</div>
        </div>
      </div>

      <RigTap
        onClick={() => go("momentum")}
        className="flex items-center gap-3 border border-accent px-3.5 py-[11px] text-left"
      >
        <div className="font-heading text-[26px] font-semibold leading-none text-accent-700">
          14
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
          {d.sess_name}
        </div>
        <div className="text-[12px] text-paper/72">{d.sess_meta}</div>
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
          <div className="text-[11px] text-neutral-700">{d.kcal_line}</div>
        </div>
        <div className="my-2.5 h-2 bg-ink/10">
          <div className="h-full w-[82%] bg-accent" />
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          <div>
            <div className="font-heading text-[10px] font-semibold leading-none tracking-[.1em] text-neutral-700">
              {d.protein}
            </div>
            <div className="font-heading text-[21px] font-semibold leading-[1.2]">
              148<span className="text-[12px] text-neutral-700">/180g</span>
            </div>
            <div className="mt-[5px] h-1 bg-ink/10">
              <div className="h-full w-[82%] bg-accent" />
            </div>
          </div>
          <div>
            <div className="font-heading text-[10px] font-semibold leading-none tracking-[.1em] text-neutral-700">
              {d.carbs}
            </div>
            <div className="font-heading text-[21px] font-semibold leading-[1.2]">
              210<span className="text-[12px] text-neutral-700">/280g</span>
            </div>
            <div className="mt-[5px] h-1 bg-ink/10">
              <div className="h-full w-[75%] bg-accent-500" />
            </div>
          </div>
          <div>
            <div className="font-heading text-[10px] font-semibold leading-none tracking-[.1em] text-neutral-700">
              {d.fat}
            </div>
            <div className="font-heading text-[21px] font-semibold leading-[1.2]">
              62<span className="text-[12px] text-neutral-700">/70g</span>
            </div>
            <div className="mt-[5px] h-1 bg-ink/10">
              <div className="h-full w-[88%] bg-accent-400" />
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
          {d.coach_note}
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
