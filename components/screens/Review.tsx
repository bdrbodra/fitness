"use client";

import { useBruno } from "@/lib/BrunoContext";
import { Blueprint } from "@/components/ui/Blueprint";
import { RigTap } from "@/components/ui/RigTap";
import { WEEK_REVIEW_MARKS } from "@/lib/constants";

export function Review() {
  const { d, go } = useBruno();

  return (
    <div className="flex flex-col gap-3.5 px-4 pb-[22px] pt-4">
      <div>
        <div className="font-heading text-[10px] font-semibold leading-none tracking-[.14em] text-accent-700">
          {d.review_kicker}
        </div>
        <div className="mt-[5px] font-heading text-[30px] font-semibold leading-none">MARCO BELLI</div>
        <div className="mt-[3px] text-[12px] text-neutral-700">{d.review_meta}</div>
      </div>

      <div className="grid grid-cols-7 gap-[5px]">
        {d.week.map((day, i) => {
          const active = i === 2;
          return (
            <div
              key={day}
              className={`border py-2 text-center text-[11px] ${
                active ? "border-accent text-accent-700" : "border-ink/16 text-ink"
              }`}
            >
              <div className="font-heading text-[10px] font-semibold leading-none">{day}</div>
              <div className="mt-[5px] font-heading text-[14px] font-semibold leading-none">
                {WEEK_REVIEW_MARKS[i]}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Blueprint className="p-[11px]">
          <div className="font-heading text-[11px] font-semibold leading-none tracking-[.1em] text-accent-700">
            {d.sessions_short}
          </div>
          <div className="mt-[5px] font-heading text-[24px] font-semibold leading-none">4/5</div>
        </Blueprint>
        <Blueprint className="p-[11px]">
          <div className="font-heading text-[11px] font-semibold leading-none tracking-[.1em] text-accent-700">
            {d.protein}
          </div>
          <div className="mt-[5px] font-heading text-[24px] font-semibold leading-none">91%</div>
        </Blueprint>
        <Blueprint className="p-[11px]">
          <div className="font-heading text-[11px] font-semibold leading-none tracking-[.1em] text-accent-700">
            {d.volume_short}
          </div>
          <div className="mt-[5px] font-heading text-[24px] font-semibold leading-none">+8%</div>
        </Blueprint>
      </div>

      <div>
        <div className="mb-0.5 font-heading text-[10px] font-semibold leading-none tracking-[.14em] text-neutral-700">
          {d.flags}
        </div>
        {d.flags_list.map(([text, tag]) => (
          <div key={text} className="flex items-baseline gap-2.5 border-b border-ink/8 py-2.5">
            <span className="flex-1 text-[13px]" style={{ textWrap: "pretty" }}>
              {text}
            </span>
            <span className="font-heading text-[11px] font-semibold leading-none tracking-[.06em] text-accent-700">
              {tag}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <RigTap
          onClick={() => go("chat")}
          className="flex min-h-[52px] flex-1 items-center justify-center bg-accent font-heading text-[16px] font-semibold leading-none tracking-[.1em] text-paper"
        >
          {d.send_note}
        </RigTap>
        <RigTap
          onClick={() => go("build")}
          className="flex min-h-[52px] flex-1 items-center justify-center border border-ink/16 font-heading text-[16px] font-semibold leading-none tracking-[.1em]"
        >
          {d.edit_plan}
        </RigTap>
      </div>
    </div>
  );
}
