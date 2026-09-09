"use client";

import { useEffect, useState } from "react";
import { useBruno } from "@/lib/BrunoContext";
import { Blueprint } from "@/components/ui/Blueprint";
import { RigTap } from "@/components/ui/RigTap";

interface Row {
  name: string;
  scheme: string;
}

export function BuildPlan() {
  const { s, d, go } = useBruno();
  const it = s.lang === "it";
  const client = s.clients?.find((c) => c.id === s.selectedClientId) ?? s.clients?.[0] ?? null;

  const [dayLabel, setDayLabel] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newName, setNewName] = useState("");
  const [newScheme, setNewScheme] = useState("");

  // Loads (or clears) the selected client's plan whenever the selection
  // changes — there's no earlier point to fetch this from.
  useEffect(() => {
    if (!client) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/plan?clientId=${client.id}`)
      .then((r) => r.json())
      .then((data) => {
        setDayLabel(data.plan?.dayLabel ?? (it ? "GIORNO 1 · PUSH" : "DAY 1 · PUSH"));
        setRows(data.plan?.exercises.map((e: Row) => ({ name: e.name, scheme: e.scheme })) ?? []);
        setLoading(false);
      });
  }, [client, it]);

  function removeRow(i: number) {
    setRows((prev) => prev.filter((_, j) => j !== i));
  }
  function addRow() {
    if (!newName.trim() || !newScheme.trim()) return;
    setRows((prev) => [...prev, { name: newName.trim(), scheme: newScheme.trim() }]);
    setNewName("");
    setNewScheme("");
  }

  async function save() {
    if (!client) return;
    setSaving(true);
    await fetch("/api/plan", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: client.id, dayLabel, exercises: rows }),
    });
    setSaving(false);
    go("clients");
  }

  if (!client) {
    return (
      <div className="flex flex-col gap-3 px-4 pt-4">
        <div className="font-heading text-[30px] font-semibold leading-none">{d.build_h}</div>
        <p className="text-[13px] text-neutral-700">
          {it ? "Scegli prima un cliente dalla lista." : "Pick a client from the list first."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 px-4 pb-[22px] pt-4">
      <div>
        <div className="font-heading text-[30px] font-semibold leading-none">{d.build_h}</div>
        <div className="mt-[3px] text-[12px] text-neutral-700">{client.name}</div>
      </div>

      {loading ? (
        <p className="text-[13px] text-neutral-700">…</p>
      ) : (
        <Blueprint className="p-[13px]">
          <input
            value={dayLabel}
            onChange={(e) => setDayLabel(e.target.value)}
            className="w-full border-none bg-transparent font-heading text-[10px] font-semibold leading-none tracking-[.14em] text-accent-700 outline-none"
          />
          <div className="mt-2">
            {rows.map((r, i) => (
              <div key={i} className="flex items-center gap-2.5 border-b border-ink/8 py-2.5">
                <span className="w-3.5 font-heading text-[11px] font-semibold leading-none text-neutral-700">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-[13px]">{r.name}</span>
                <span className="font-heading text-[14px] font-semibold leading-none tracking-[.04em]">
                  {r.scheme}
                </span>
                <button
                  type="button"
                  onClick={() => removeRow(i)}
                  className="rig-tap flex h-11 w-11 flex-none items-center justify-center border border-ink/16 font-heading text-[18px] font-semibold leading-none text-neutral-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={it ? "esercizio" : "exercise"}
              className="min-h-[44px] flex-1 border border-ink/16 bg-surface px-2.5 text-[13px] text-ink outline-none focus-visible:border-accent"
            />
            <input
              value={newScheme}
              onChange={(e) => setNewScheme(e.target.value)}
              placeholder="3 × 12"
              className="min-h-[44px] w-20 border border-ink/16 bg-surface px-2.5 text-[13px] text-ink outline-none focus-visible:border-accent"
            />
          </div>
          <RigTap
            onClick={addRow}
            className="mt-2 flex min-h-[46px] w-full items-center justify-center border border-dashed border-ink/30 font-heading text-[14px] font-semibold leading-none tracking-[.1em] text-accent-700"
          >
            {d.add_exercise}
          </RigTap>
        </Blueprint>
      )}

      <RigTap
        onClick={save}
        disabled={saving || loading}
        className="flex min-h-[56px] w-full items-center justify-center bg-accent font-heading text-[18px] font-semibold leading-none tracking-[.12em] text-paper disabled:opacity-40"
      >
        {saving ? "…" : `${it ? "ASSEGNA A" : "ASSIGN TO"} ${client.name.split(" ")[0].toUpperCase()}`}
      </RigTap>
    </div>
  );
}
