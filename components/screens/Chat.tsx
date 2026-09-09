"use client";

import { useEffect, useRef } from "react";
import { useBruno } from "@/lib/BrunoContext";
import { RigTap } from "@/components/ui/RigTap";

export function Chat() {
  const { s, d, setDraft, send } = useBruno();
  const msgs = s.msgs ?? d.msgs.map(([dir, text]) => ({ dir, text }));
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [msgs.length]);

  return (
    <div className="flex h-full flex-col">
      <div className="px-4 pb-2 pt-3.5">
        <div className="font-heading text-[26px] font-semibold leading-none">{d.chat_h}</div>
        <div className="mt-[3px] text-[11px] text-neutral-700">{d.chat_sub}</div>
      </div>
      <div className="flex flex-1 flex-col gap-[9px] overflow-auto px-4 py-2.5">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.dir === "out" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[78%] border px-3 py-2.5 text-[13.5px] leading-[1.45] ${
                m.dir === "out" ? "border-accent bg-accent text-paper" : "border-ink/16 bg-transparent text-ink"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="flex gap-2 border-t border-ink/16 px-3.5 pb-4 pt-2.5">
        <input
          value={s.draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
          placeholder={d.msg_ph}
          className="min-h-[44px] flex-1 border border-ink/16 bg-surface px-2.5 text-base text-ink outline-none focus-visible:border-accent"
        />
        <RigTap
          onClick={send}
          className="flex min-w-[64px] items-center justify-center bg-accent font-heading text-[14px] font-semibold leading-none tracking-[.1em] text-paper"
        >
          {d.send}
        </RigTap>
      </div>
    </div>
  );
}
