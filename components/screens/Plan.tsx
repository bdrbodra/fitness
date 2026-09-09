"use client";

import { useState } from "react";
import { useBruno } from "@/lib/BrunoContext";
import { Blueprint } from "@/components/ui/Blueprint";
import { RigTap } from "@/components/ui/RigTap";
import { ExerciseIcon } from "@/components/ui/ExerciseIcon";
import { WEEK_TODAY_MARKS } from "@/lib/constants";

interface Row {
  name: string;
  scheme: string;
  restSeconds: number;
}

function formatRest(seconds: number) {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s === 0 ? `${m} min` : `${m}:${String(s).padStart(2, "0")}`;
}

export function Plan() {
  const { s, d, go, refreshBootstrap, profile } = useBruno();
  const it = s.lang === "it";
  const locked = s.plan?.managedBy === "TRAINER";
  const canEdit = !locked;

  const [editing, setEditing] = useState(false);
  const [dayLabel, setDayLabel] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [newName, setNewName] = useState("");
  const [newScheme, setNewScheme] = useState("");
  const [newRest, setNewRest] = useState(90);
  const [saving, setSaving] = useState(false);

  function startEditing() {
    setDayLabel(s.plan?.dayLabel ?? (it ? "LA MIA SCHEDA" : "MY PLAN"));
    setRows(s.plan?.exercises.map((ex) => ({ name: ex.name, scheme: ex.scheme, restSeconds: ex.restSeconds })) ?? []);
    setEditing(true);
  }

  function removeRow(i: number) {
    setRows((prev) => prev.filter((_, j) => j !== i));
  }
  function addRow() {
    if (!newName.trim() || !newScheme.trim()) return;
    setRows((prev) => [...prev, { name: newName.trim(), scheme: newScheme.trim(), restSeconds: newRest }]);
    setNewName("");
    setNewScheme("");
    setNewRest(90);
  }

  async function save() {
    setSaving(true);
    const res = await fetch("/api/plan", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dayLabel, exercises: rows }),
    });
    setSaving(false);
    if (res.ok) {
      await refreshBootstrap();
      setEditing(false);
    }
  }

  if (editing) {
    return (
      <div className="flex flex-col gap-3.5 px-4 pb-[22px] pt-4">
        <div className="font-heading text-[30px] font-semibold leading-none">{d.plan_h}</div>
        <Blueprint className="p-3.5">
          <input
            value={dayLabel}
            onChange={(e) => setDayLabel(e.target.value)}
            className="w-full border-none bg-transparent font-heading text-[10px] font-semibold leading-none tracking-[.14em] text-accent-700 outline-none"
          />
          <div className="mt-2">
            {rows.map((r, i) => (
              <div key={i} className="flex items-center gap-2.5 border-b border-ink/8 py-2.5">
                <ExerciseIcon name={r.name} className="flex-none text-accent-700" />
                <span className="w-3.5 font-heading text-[11px] font-semibold leading-none text-neutral-700">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-[13px]">{r.name}</span>
                <span className="font-heading text-[14px] font-semibold leading-none tracking-[.04em]">
                  {r.scheme}
                </span>
                <span className="text-[11px] text-neutral-700">{formatRest(r.restSeconds)}</span>
                <button
                  type="button"
                  onClick={() => removeRow(i)}
                  className="rig-tap flex h-11 w-11 flex-none items-center justify-center border border-ink/16 font-heading text-[18px] font-semibold leading-none text-neutral-700"
                >
                  ×
                </button>
              </div>
            ))}
            {rows.length === 0 && (
              <p className="py-2.5 text-[13px] text-neutral-700">
                {it ? "Aggiungi il tuo primo esercizio." : "Add your first exercise."}
              </p>
            )}
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
              className="min-h-[44px] w-16 border border-ink/16 bg-surface px-2.5 text-[13px] text-ink outline-none focus-visible:border-accent"
            />
          </div>
          <div className="mt-2 flex items-center gap-2">
            <label className="text-[12px] text-ink/70">{it ? "Recupero" : "Rest"}</label>
            <input
              type="number"
              min={0}
              step={15}
              value={newRest}
              onChange={(e) => setNewRest(Math.max(0, Number(e.target.value) || 0))}
              className="min-h-[40px] w-20 border border-ink/16 bg-surface px-2.5 text-[13px] text-ink outline-none focus-visible:border-accent"
            />
            <span className="text-[12px] text-neutral-700">{it ? "secondi" : "seconds"}</span>
          </div>
          <RigTap
            onClick={addRow}
            className="mt-2 flex min-h-[46px] w-full items-center justify-center border border-dashed border-ink/30 font-heading text-[14px] font-semibold leading-none tracking-[.1em] text-accent-700"
          >
            {d.add_exercise}
          </RigTap>
        </Blueprint>
        <div className="flex gap-2">
          <RigTap
            onClick={() => setEditing(false)}
            className="flex min-h-[52px] flex-1 items-center justify-center border border-ink/16 font-heading text-[15px] font-semibold leading-none tracking-[.1em]"
          >
            {it ? "ANNULLA" : "CANCEL"}
          </RigTap>
          <RigTap
            onClick={save}
            disabled={saving || rows.length === 0}
            className="flex min-h-[52px] flex-1 items-center justify-center bg-accent font-heading text-[15px] font-semibold leading-none tracking-[.1em] text-paper disabled:opacity-40"
          >
            {saving ? "…" : it ? "SALVA" : "SAVE"}
          </RigTap>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3.5 px-4 pb-[22px] pt-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="font-heading text-[30px] font-semibold leading-none">{d.plan_h}</div>
          <div className="mt-1 text-[12px] text-neutral-700">
            {locked
              ? it
                ? `Gestita dal tuo trainer${profile?.trainerName ? ` (${profile.trainerName})` : ""} — non modificabile.`
                : `Managed by your trainer${profile?.trainerName ? ` (${profile.trainerName})` : ""} — read-only.`
              : it
                ? "Scheda personale — puoi modificarla quando vuoi."
                : "Your own plan — edit it whenever you like."}
          </div>
        </div>
        {canEdit && (
          <RigTap
            onClick={startEditing}
            className="border border-ink/16 px-3 py-2 font-heading text-[11px] font-semibold leading-none tracking-[.08em] text-accent-700"
          >
            {s.plan ? (it ? "MODIFICA" : "EDIT") : it ? "CREA" : "CREATE"}
          </RigTap>
        )}
      </div>

      <div className="grid grid-cols-7 gap-[5px]">
        {d.week.map((day, i) => {
          const active = i === 2;
          return (
            <div
              key={day}
              className={`border py-2 text-center text-[11px] ${
                active ? "border-accent bg-accent text-paper" : "border-ink/16 bg-transparent text-ink"
              }`}
            >
              <div className="font-heading text-[10px] font-semibold leading-none tracking-[.04em]">{day}</div>
              <div className="mt-[5px] font-heading text-[15px] font-semibold leading-none">
                {WEEK_TODAY_MARKS[i]}
              </div>
            </div>
          );
        })}
      </div>

      <Blueprint className="p-3.5">
        <div className="font-heading text-[10px] font-semibold leading-none tracking-[.14em] text-accent-700">
          {s.plan ? s.plan.dayLabel : d.day_push}
        </div>
        {s.plan && s.plan.exercises.length > 0 ? (
          <div className="mt-2">
            {s.plan.exercises.map((ex, i) => (
              <div key={ex.id} className="flex items-center gap-2.5 border-b border-ink/8 py-2.5">
                <ExerciseIcon name={ex.name} className="flex-none text-accent-700" />
                <span className="w-3.5 font-heading text-[11px] font-semibold leading-none text-neutral-700">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-[13px]">{ex.name}</span>
                <span className="font-heading text-[14px] font-semibold leading-none tracking-[.04em]">
                  {ex.scheme}
                </span>
                <span className="w-12 text-right text-[11px] text-neutral-700">{formatRest(ex.restSeconds)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-[13px] text-neutral-700">
            {it
              ? "Non hai ancora una scheda — creane una tu, o aspetta che te la assegni il trainer."
              : "You don't have a plan yet — create one yourself, or wait for your trainer to assign it."}
          </p>
        )}
        <RigTap
          onClick={() => go("session")}
          disabled={!s.plan || s.plan.exercises.length === 0}
          className="mt-3.5 flex min-h-[52px] w-full items-center justify-center bg-accent font-heading text-[16px] font-semibold leading-none tracking-[.12em] text-paper disabled:opacity-40"
        >
          {d.start_this}
        </RigTap>
      </Blueprint>
    </div>
  );
}
