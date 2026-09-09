"use client";

import { useBruno } from "@/lib/BrunoContext";
import { Blueprint } from "@/components/ui/Blueprint";
import { VOL } from "@/lib/constants";

export function Progress() {
  const { s, d } = useBruno();
  const maxVol = Math.max(...VOL);
  const it = s.lang === "it";
  const bodyweight = it ? "78,4" : "78.4";
  const bwDelta = it ? "−1,2 kg" : "−1.2 kg";

  return (
    <div className="flex flex-col gap-4 px-4 pb-[22px] pt-4">
      <div className="font-heading text-[30px] font-semibold leading-none">{d.progress_h}</div>

      <Blueprint className="p-3.5">
        <div className="font-heading text-[10px] font-semibold leading-none tracking-[.14em] text-accent-700">
          {d.volume}
        </div>
        <div className="mt-3 flex h-[120px] items-end gap-1.5">
          {VOL.map((v, i) => (
            <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
              <div
                className={i === VOL.length - 1 ? "w-full bg-accent" : "w-full bg-accent/35"}
                style={{ height: Math.round((v / maxVol) * 96) }}
              />
              <div className="font-heading text-[11px] font-semibold leading-none tracking-[.06em] text-neutral-700">
                S{i + 1}
              </div>
            </div>
          ))}
        </div>
      </Blueprint>

      <div className="grid grid-cols-2 gap-2.5">
        <Blueprint className="p-3">
          <div className="font-heading text-[10px] font-semibold leading-none tracking-[.12em] text-accent-700">
            {d.bodyweight}
          </div>
          <div className="mt-1.5 font-heading text-[30px] font-semibold leading-none">
            {bodyweight}
            <span className="text-[13px] text-neutral-700"> kg</span>
          </div>
          <div className="mt-0.5 text-[11px] text-neutral-700">
            {bwDelta} · 6 {d.weeks}
          </div>
        </Blueprint>
        <Blueprint className="p-3">
          <div className="font-heading text-[10px] font-semibold leading-none tracking-[.12em] text-accent-700">
            {d.adherence}
          </div>
          <div className="mt-1.5 font-heading text-[30px] font-semibold leading-none">
            86<span className="text-[13px] text-neutral-700">%</span>
          </div>
          <div className="mt-0.5 text-[11px] text-neutral-700">
            19 / 22 {d.sessions}
          </div>
        </Blueprint>
      </div>

      <div>
        <div className="mb-0.5 font-heading text-[10px] font-semibold leading-none tracking-[.14em] text-neutral-700">
          {d.prs}
        </div>
        {d.prs_list.map(([name, value, delta]) => (
          <div key={name} className="flex items-baseline gap-2.5 border-b border-ink/8 py-2.5">
            <span className="flex-1 text-[13px]">{name}</span>
            <span className="font-heading text-[15px] font-semibold leading-none">{value}</span>
            <span className="w-[52px] text-right text-[11px] text-accent-700">{delta}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
