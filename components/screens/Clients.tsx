"use client";

import { useBruno } from "@/lib/BrunoContext";
import { RigTap } from "@/components/ui/RigTap";

export function Clients() {
  const { s, d, openClient, profile } = useBruno();
  const it = s.lang === "it";
  const clients = s.clients ?? [];

  return (
    <div className="flex flex-col gap-3 px-4 pb-[22px] pt-4">
      <div className="flex items-end justify-between">
        <div>
          <div className="font-heading text-[30px] font-semibold leading-none">{d.clients_h}</div>
          <div className="mt-[3px] text-[12px] text-neutral-700">
            {clients.length} {it ? "attivi" : "active"}
          </div>
        </div>
      </div>

      {clients.length === 0 && (
        <div className="border border-ink/16 p-4 text-[13px] text-neutral-700">
          {it
            ? `Nessun cliente collegato ancora. Condividi il tuo codice trainer (${profile?.trainerCode ?? "…"}) perché possano collegarsi.`
            : `No clients linked yet. Share your trainer code (${profile?.trainerCode ?? "…"}) so they can link up.`}
        </div>
      )}

      {clients.map((c) => (
        <RigTap
          key={c.id}
          onClick={() => openClient(c.id)}
          className="flex items-center gap-3 border border-ink/16 px-3.5 py-3 text-left"
        >
          <div className="flex h-[38px] w-[38px] flex-none items-center justify-center border border-ink/16 bg-accent font-heading text-[15px] font-semibold text-paper">
            {c.name.trim().charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-heading text-[17px] font-semibold leading-none">{c.name}</div>
          </div>
          <div className="text-right">
            <div className="font-heading text-[17px] font-semibold leading-none">{c.streak}</div>
            <div className="mt-1 font-heading text-[11px] font-semibold leading-none tracking-[.1em] text-neutral-700">
              {it ? "GIORNI" : "DAYS"}
            </div>
          </div>
        </RigTap>
      ))}
    </div>
  );
}
