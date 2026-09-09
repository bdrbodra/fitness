"use client";

import { useMemo } from "react";
import { useBruno } from "@/lib/BrunoContext";
import { Blueprint } from "@/components/ui/Blueprint";
import { RigTap } from "@/components/ui/RigTap";
import { PX_PER_STEP, STEP, WMAX, WMIN } from "@/lib/constants";

export function Session() {
  const {
    s,
    d,
    fmt,
    go,
    logSet,
    skipRest,
    repsUp,
    repsDown,
    dialDown,
    dialMove,
    dragUp,
  } = useBruno();

  const tickCount = (WMAX - WMIN) / STEP;
  const ticks = useMemo(
    () =>
      Array.from({ length: tickCount + 1 }, (_, i) => ({
        major: i % 4 === 0,
      })),
    [tickCount]
  );
  const offset = ((s.weight - WMIN) / STEP) * PX_PER_STEP;
  const barWidth = Math.min(100, (s.logged.length / 24) * 100);

  return (
    <div className="flex flex-col gap-3 px-4 pb-[26px] pt-3.5">
      <div className="flex items-center justify-between">
        <RigTap
          onClick={() => go("today")}
          className="font-heading text-[12px] font-semibold leading-none tracking-[.1em] text-neutral-700"
        >
          {d.end}
        </RigTap>
        <div className="font-heading text-[12px] font-semibold leading-none tracking-[.1em]">
          {s.logged.length} / 24 {d.set_word}
        </div>
      </div>
      <div className="h-[3px] bg-ink/12">
        <div className="h-full bg-accent" style={{ width: `${barWidth}%` }} />
      </div>

      <div>
        <div className="font-heading text-[10px] font-semibold leading-none tracking-[.14em] text-accent-700">
          {d.ex_of}
        </div>
        <div className="mt-[5px] font-heading text-[30px] font-semibold leading-[1.05]">
          {d.bench}
        </div>
        <div className="mt-0.5 text-[12px] text-neutral-700">{d.bench_meta}</div>
      </div>

      <Blueprint className="p-3.5">
        <div className="flex items-baseline justify-between gap-2.5">
          <div className="font-heading text-[10px] font-semibold leading-none tracking-[.14em] text-accent-700">
            {d.set_word} {s.logged.length + 1} / 5
          </div>
          <div className="text-[11px] text-neutral-700">{d.drag_hint}</div>
        </div>
        <div className="my-1 text-center font-heading text-[62px] font-semibold leading-none tracking-[-.02em]">
          {fmt(s.weight)}
        </div>
        <div
          onPointerDown={dialDown}
          onPointerMove={dialMove}
          onPointerUp={dragUp}
          onPointerCancel={dragUp}
          className="relative h-[46px] cursor-ew-resize overflow-hidden border-y border-ink/12"
          style={{ touchAction: "none" }}
        >
          <div
            className="absolute left-1/2 top-0 flex bottom-0"
            style={{ transform: `translateX(-${offset + PX_PER_STEP / 2}px)` }}
          >
            {ticks.map((tk, i) => (
              <div
                key={i}
                className={`flex-none self-center border-l ${tk.major ? "border-ink/45" : "border-ink/18"}`}
                style={{ width: PX_PER_STEP, height: tk.major ? 26 : 13 }}
              />
            ))}
          </div>
          <div className="absolute bottom-0 left-1/2 top-0 w-0.5 bg-accent" />
        </div>
        <div className="mt-3.5 flex items-center gap-2.5">
          <RigTap
            onClick={repsDown}
            className="flex h-[54px] w-[54px] items-center justify-center border border-ink/16 font-heading text-[26px] font-semibold leading-none"
          >
            –
          </RigTap>
          <div className="flex-1 text-center">
            <div className="font-heading text-[10px] font-semibold leading-none tracking-[.14em] text-neutral-700">
              {d.reps}
            </div>
            <div className="mt-[3px] font-heading text-[34px] font-semibold leading-none">
              {s.reps}
            </div>
          </div>
          <RigTap
            onClick={repsUp}
            className="flex h-[54px] w-[54px] items-center justify-center border border-ink/16 font-heading text-[26px] font-semibold leading-none"
          >
            +
          </RigTap>
        </div>
      </Blueprint>

      <RigTap
        onClick={logSet}
        className="flex min-h-[64px] w-full items-center justify-center border border-accent bg-accent font-heading text-[21px] font-semibold leading-none tracking-[.14em] text-paper"
      >
        {d.log_btn}
      </RigTap>

      {s.rest > 0 && (
        <div className="flex items-center justify-between border border-accent px-3.5 py-2.5">
          <div>
            <div className="font-heading text-[10px] font-semibold leading-none tracking-[.14em] text-accent-700">
              {d.rest}
            </div>
            <div className="mt-0.5 font-heading text-[28px] font-semibold leading-none">
              {Math.floor(s.rest / 60)}:{String(s.rest % 60).padStart(2, "0")}
            </div>
          </div>
          <RigTap
            onClick={skipRest}
            className="font-heading text-[13px] font-semibold leading-none tracking-[.1em] text-accent-700"
          >
            {d.skip}
          </RigTap>
        </div>
      )}

      <div>
        <div className="font-heading text-[10px] font-semibold leading-none tracking-[.14em] text-neutral-700">
          {d.logged}
        </div>
        {s.logged.map((row, i) => (
          <div key={i} className="flex items-baseline gap-3 border-b border-ink/8 py-[9px]">
            <span className="w-12 font-heading text-[11px] font-semibold leading-none text-neutral-700">
              {row.n}
            </span>
            <span className="flex-1 text-[14px]">{row.label}</span>
            <span className="text-[11px] text-accent-700">{row.note}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
