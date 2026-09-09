"use client";

import { useBruno } from "@/lib/BrunoContext";
import { RigTap } from "@/components/ui/RigTap";
import { WEEK_REVIEW_MARKS } from "@/lib/constants";

export function Review() {
  const { s, d, go } = useBruno();
  const it = s.lang === "it";
  const client = s.clients?.find((c) => c.id === s.selectedClientId) ?? null;

  if (!client) {
    return (
      <div className="flex flex-col gap-3 px-4 pt-4">
        <div className="font-heading text-[30px] font-semibold leading-none">{d.review_kicker}</div>
        <p className="text-[13px] text-neutral-700">
          {it ? "Scegli un cliente dalla lista." : "Pick a client from the list."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3.5 px-4 pb-[22px] pt-4">
      <div>
        <div className="font-heading text-[10px] font-semibold leading-none tracking-[.14em] text-accent-700">
          {d.review_kicker}
        </div>
        <div className="mt-[5px] font-heading text-[30px] font-semibold leading-none">{client.name}</div>
        <div className="mt-[3px] text-[12px] text-neutral-700">
          {client.streak} {it ? "giorni di serie" : "day streak"}
        </div>
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

      <p className="text-[12px] text-neutral-700">
        {it
          ? "Sedute, proteine e volume dettagliati arrivano quando avrai più storico con questo cliente."
          : "Detailed sessions, protein and volume stats show up once there's more history with this client."}
      </p>

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
