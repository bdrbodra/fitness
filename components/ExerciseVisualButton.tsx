"use client";

import { useState } from "react";
import { RigTap } from "@/components/ui/RigTap";

interface Visual {
  name: string;
  imageUrl: string;
  thumbnailUrl: string;
  category: string | null;
  author: string | null;
  sourceUrl: string;
}

export function ExerciseVisualButton({
  exerciseName,
  lang,
  className = "",
}: {
  exerciseName: string;
  lang: "it" | "en";
  className?: string;
}) {
  const it = lang === "it";
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visual, setVisual] = useState<Visual | null>(null);
  const [fetched, setFetched] = useState(false);

  async function openModal() {
    setOpen(true);
    if (fetched) return;
    setLoading(true);
    const res = await fetch(`/api/exercise-visual?name=${encodeURIComponent(exerciseName)}&lang=${lang}`);
    if (res.ok) {
      const data = await res.json();
      setVisual(data.visual);
    }
    setFetched(true);
    setLoading(false);
  }

  return (
    <>
      <RigTap
        onClick={openModal}
        className={`flex items-center gap-1.5 border border-ink/16 px-2.5 py-1.5 font-heading text-[11px] font-semibold leading-none tracking-[.06em] text-accent-700 ${className}`}
      >
        {it ? "VEDI ESECUZIONE" : "SEE EXECUTION"}
      </RigTap>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-5"
          onClick={() => setOpen(false)}
        >
          <div
            className="blueprint relative w-full max-w-[360px] border border-ink/16 bg-paper p-3.5"
            onClick={(e) => e.stopPropagation()}
          >
            <i className="corner tl" />
            <i className="corner tr" />
            <i className="corner bl" />
            <i className="corner br" />

            <div className="flex items-center justify-between">
              <div className="font-heading text-[10px] font-semibold leading-none tracking-[.14em] text-accent-700">
                {it ? "ESECUZIONE" : "EXECUTION"}
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rig-tap flex h-8 w-8 items-center justify-center text-[16px] text-neutral-700"
              >
                ×
              </button>
            </div>

            {loading && (
              <div className="flex h-[220px] items-center justify-center text-[13px] text-neutral-700">…</div>
            )}

            {!loading && visual && (
              <div className="mt-2.5">
                <div className="duotone border border-ink/16">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={visual.thumbnailUrl} alt={visual.name} className="w-full object-cover" />
                </div>
                <div className="mt-2 font-heading text-[16px] font-semibold leading-[1.1]">{visual.name}</div>
                {visual.category && <div className="text-[12px] text-neutral-700">{visual.category}</div>}
                <div className="mt-2 text-[10.5px] leading-[1.4] text-neutral-700">
                  {it ? "Immagine da" : "Image from"}{" "}
                  <a href={visual.sourceUrl} target="_blank" rel="noreferrer" className="text-accent-700 underline">
                    wger.de
                  </a>
                  {visual.author ? ` · ${visual.author}` : ""} ·{" "}
                  <a
                    href="https://creativecommons.org/licenses/by-sa/4.0/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-accent-700 underline"
                  >
                    CC BY-SA 4.0
                  </a>
                </div>
              </div>
            )}

            {!loading && !visual && (
              <p className="mt-2.5 py-4 text-center text-[13px] text-neutral-700">
                {it
                  ? "Nessuna immagine trovata per questo esercizio."
                  : "No illustration found for this exercise."}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
