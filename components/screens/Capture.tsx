"use client";

import { useBruno } from "@/lib/BrunoContext";
import { Blueprint } from "@/components/ui/Blueprint";
import { RigTap } from "@/components/ui/RigTap";

export function Capture() {
  const { s, d, go, portionDown, portionMove, dragUp } = useBruno();
  const p = s.portion;
  const it = s.lang === "it";
  const pf = (n: number) => (it ? String(n).replace(".", ",") : String(n));

  return (
    <div className="flex flex-col">
      <div
        className="duotone relative flex h-[280px] items-center justify-center"
        style={{
          background:
            "repeating-linear-gradient(45deg, var(--color-neutral-300) 0 6px, var(--color-neutral-200) 6px 12px)",
        }}
      >
        <span className="text-center text-[11px] leading-[1.5] text-neutral-700" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>
          [ {d.cam} ]
          <br />
          {d.cam_sub}
        </span>
        <RigTap
          onClick={() => go("meals")}
          className="absolute left-3 top-3 bg-paper px-2.5 py-[7px] font-heading text-[11px] font-semibold leading-none tracking-[.1em]"
        >
          {d.cancel}
        </RigTap>
        <div className="absolute bottom-3 right-3 bg-accent-900 px-2.5 py-1.5 font-heading text-[10px] font-semibold leading-none tracking-[.1em] text-paper">
          {d.items_found}
        </div>
      </div>

      <div className="flex flex-col gap-3 px-4 pb-[26px] pt-3.5">
        <div className="font-heading text-[25px] font-semibold leading-[1.05]">{d.cap_title}</div>

        <Blueprint className="p-3.5">
          <div className="flex items-baseline justify-between">
            <div className="font-heading text-[10px] font-semibold leading-none tracking-[.14em] text-accent-700">
              {d.portion}
            </div>
            <div className="font-heading text-[24px] font-semibold leading-none">{pf(p)}×</div>
          </div>
          <div
            onPointerDown={portionDown}
            onPointerMove={portionMove}
            onPointerUp={dragUp}
            onPointerCancel={dragUp}
            className="relative mt-[9px] flex h-[48px] cursor-ew-resize items-center overflow-hidden border border-ink/16"
            style={{ touchAction: "none" }}
          >
            <div
              className="absolute bottom-0 left-0 top-0 bg-accent opacity-[.18]"
              style={{ width: `${(p / 2) * 100}%` }}
            />
            <span className="relative pl-3 font-heading text-[11px] font-semibold leading-none tracking-[.1em] text-neutral-700">
              {d.drag_plate}
            </span>
          </div>
          <div className="mt-3.5 grid grid-cols-4 gap-1.5 text-center">
            <div>
              <div className="font-heading text-[26px] font-semibold leading-none">{Math.round(621 * p)}</div>
              <div className="mt-[5px] font-heading text-[11px] font-semibold leading-none tracking-[.1em] text-neutral-700">
                KCAL
              </div>
            </div>
            <div>
              <div className="font-heading text-[26px] font-semibold leading-none">{Math.round(58 * p)}g</div>
              <div className="mt-[5px] font-heading text-[11px] font-semibold leading-none tracking-[.1em] text-neutral-700">
                {d.protein}
              </div>
            </div>
            <div>
              <div className="font-heading text-[26px] font-semibold leading-none">{Math.round(64 * p)}g</div>
              <div className="mt-[5px] font-heading text-[11px] font-semibold leading-none tracking-[.1em] text-neutral-700">
                {d.carbs}
              </div>
            </div>
            <div>
              <div className="font-heading text-[26px] font-semibold leading-none">{Math.round(14 * p)}g</div>
              <div className="mt-[5px] font-heading text-[11px] font-semibold leading-none tracking-[.1em] text-neutral-700">
                {d.fat}
              </div>
            </div>
          </div>
        </Blueprint>

        <div>
          {d.cap_items.map(([name, qty, kcal]) => (
            <div key={name} className="flex items-baseline gap-2.5 border-b border-ink/8 py-2.5">
              <span className="flex-1 text-[13px]">{name}</span>
              <span className="text-[12px] text-neutral-700">{qty}</span>
              <span className="font-heading text-[14px] font-semibold leading-none">
                {Math.round(Number(kcal) * p)}
              </span>
            </div>
          ))}
        </div>

        <RigTap
          onClick={() => go("meals")}
          className="flex min-h-[60px] w-full items-center justify-center bg-accent font-heading text-[19px] font-semibold leading-none tracking-[.12em] text-paper"
        >
          {d.add_lunch}
        </RigTap>
      </div>
    </div>
  );
}
