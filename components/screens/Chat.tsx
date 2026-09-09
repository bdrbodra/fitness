"use client";

import { useEffect, useRef, useState } from "react";
import { useBruno } from "@/lib/BrunoContext";
import { RigTap } from "@/components/ui/RigTap";

interface Message {
  id: string;
  dir: "in" | "out";
  text: string;
  createdAt: string;
}

export function Chat() {
  const { s, d } = useBruno();
  const it = s.lang === "it";
  const [messages, setMessages] = useState<Message[]>([]);
  const [counterpart, setCounterpart] = useState<{ id: string; name: string } | null>(null);
  const [draft, setDraft] = useState("");
  const [loaded, setLoaded] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const clientId = s.role === "trainer" ? s.selectedClientId : null;

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const qs = clientId ? `?clientId=${clientId}` : "";
      const res = await fetch(`/api/chat${qs}`);
      if (!res.ok || cancelled) return;
      const data = await res.json();
      setMessages(data.messages);
      setCounterpart(data.counterpart);
      setLoaded(true);
    }
    load();
    const interval = setInterval(load, 4000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [clientId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  async function send() {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, clientId: clientId ?? undefined }),
    });
    if (res.ok) {
      const data = await res.json();
      setMessages((prev) => [...prev, data.message]);
    }
  }

  if (!loaded) {
    return <div className="flex h-full items-center justify-center text-[13px] text-neutral-700">…</div>;
  }

  if (!counterpart) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
        <div className="font-heading text-[20px] font-semibold leading-none">
          {s.role === "trainer"
            ? it
              ? "Scegli un cliente dalla lista per scrivergli."
              : "Pick a client from the list to message them."
            : it
              ? "Non sei ancora collegato a un trainer."
              : "You're not linked to a trainer yet."}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="px-4 pb-2 pt-3.5">
        <div className="font-heading text-[26px] font-semibold leading-none">{counterpart.name.toUpperCase()}</div>
        <div className="mt-[3px] text-[11px] text-neutral-700">
          {s.role === "trainer" ? (it ? "Il tuo cliente" : "Your client") : it ? "Il tuo trainer" : "Your trainer"}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-[9px] overflow-auto px-4 py-2.5">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.dir === "out" ? "justify-end" : "justify-start"}`}>
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
          value={draft}
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
