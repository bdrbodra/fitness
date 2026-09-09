"use client";

import { useBruno } from "@/lib/BrunoContext";
import { RigTap } from "@/components/ui/RigTap";

export function Clients() {
  const { d, go } = useBruno();

  return (
    <div className="flex flex-col gap-3 px-4 pb-[22px] pt-4">
      <div className="flex items-end justify-between">
        <div>
          <div className="font-heading text-[30px] font-semibold leading-none">{d.clients_h}</div>
          <div className="mt-[3px] text-[12px] text-neutral-700">{d.clients_meta}</div>
        </div>
        <div className="text-right">
          <div className="font-heading text-[28px] font-semibold leading-none">3</div>
          <div className="mt-[3px] font-heading text-[11px] font-semibold leading-none tracking-[.1em] text-accent-700">
            {d.need_review}
          </div>
        </div>
      </div>

      {d.clients.map(([name, meta, pct, flag]) => (
        <RigTap
          key={name}
          onClick={() => go("review")}
          className="flex items-center gap-3 border border-ink/16 px-3.5 py-3 text-left"
        >
          <div
            className="h-[38px] w-[38px] flex-none border border-ink/16"
            style={{
              background:
                "repeating-linear-gradient(45deg, var(--color-neutral-300) 0 4px, var(--color-neutral-200) 4px 8px)",
            }}
          />
          <div className="min-w-0 flex-1">
            <div className="font-heading text-[17px] font-semibold leading-none">{name}</div>
            <div className="mt-[3px] text-[11px] text-neutral-700">{meta}</div>
          </div>
          <div className="text-right">
            <div className="font-heading text-[17px] font-semibold leading-none">{pct}</div>
            <div
              className={`mt-1 font-heading text-[11px] font-semibold leading-none tracking-[.1em] ${
                flag === "OK" ? "text-neutral-700" : "text-accent-700"
              }`}
            >
              {flag}
            </div>
          </div>
        </RigTap>
      ))}
    </div>
  );
}
