"use client";

import { useMemo } from "react";
import { useBruno } from "@/lib/BrunoContext";
import { Blueprint } from "@/components/ui/Blueprint";
import { RigTap } from "@/components/ui/RigTap";

export function BuildPlan() {
  const { s, d, go, setBuildDay, addExercise, removeBuildRow } = useBruno();

  const rows = useMemo(() => {
    const base = d.build_rows.map((r, i) => ({ id: i, name: r[0], scheme: r[1] }));
    const extras = s.extra.map((exIdx, k) => ({
      id: d.build_rows.length + k,
      name: d.new_ex[exIdx % d.new_ex.length],
      scheme: "3 × 10",
    }));
    return base.concat(extras).filter((r) => !s.removed.includes(r.id));
  }, [d, s.extra, s.removed]);

  return (
    <div className="flex flex-col gap-3 px-4 pb-[22px] pt-4">
      <div>
        <div className="font-heading text-[30px] font-semibold leading-none">{d.build_h}</div>
        <div className="mt-[3px] text-[12px] text-neutral-700">{d.build_meta}</div>
      </div>

      <div className="flex border border-ink/16">
        {d.build_days.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => setBuildDay(i)}
            className={`rig-tap flex min-h-[44px] flex-1 items-center justify-center font-heading text-[12px] font-semibold leading-none tracking-[.08em] ${
              i ? "border-l border-ink/16" : ""
            } ${s.buildDay === i ? "bg-accent text-paper" : "bg-transparent text-ink"}`}
          >
            {label}
          </button>
        ))}
      </div>

      <Blueprint className="p-[13px]">
        <div className="font-heading text-[10px] font-semibold leading-none tracking-[.14em] text-accent-700">
          {d.build_day_label}
        </div>
        <div className="mt-1.5">
          {rows.map((r, i) => (
            <div key={r.id} className="flex items-center gap-2.5 border-b border-ink/8 py-2.5">
              <span className="w-3.5 font-heading text-[11px] font-semibold leading-none text-neutral-700">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex-1 text-[13px]">{r.name}</span>
              <span className="font-heading text-[14px] font-semibold leading-none tracking-[.04em]">
                {r.scheme}
              </span>
              <button
                type="button"
                onClick={() => removeBuildRow(r.id)}
                className="rig-tap flex h-11 w-11 flex-none items-center justify-center border border-ink/16 font-heading text-[18px] font-semibold leading-none text-neutral-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <RigTap
          onClick={addExercise}
          className="mt-3 flex min-h-[46px] w-full items-center justify-center border border-dashed border-ink/30 font-heading text-[14px] font-semibold leading-none tracking-[.1em] text-accent-700"
        >
          {d.add_exercise}
        </RigTap>
      </Blueprint>

      <RigTap
        onClick={() => go("clients")}
        className="flex min-h-[56px] w-full items-center justify-center bg-accent font-heading text-[18px] font-semibold leading-none tracking-[.12em] text-paper"
      >
        {d.assign}
      </RigTap>
    </div>
  );
}
