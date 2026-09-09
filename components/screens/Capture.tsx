"use client";

import { useEffect, useRef, useState } from "react";
import { useBruno } from "@/lib/BrunoContext";
import { Blueprint } from "@/components/ui/Blueprint";
import { RigTap } from "@/components/ui/RigTap";

interface Food {
  id: string;
  nameIt: string;
  nameEn: string;
  kcal100: number;
  protein100: number;
  carbs100: number;
  fat100: number;
}

interface Item {
  foodId: string;
  name: string;
  grams: number;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

const SLOTS_IT = ["COLAZIONE", "SPUNTINO", "PRANZO", "CENA"];
const SLOTS_EN = ["BREAKFAST", "SNACK", "LUNCH", "DINNER"];

function defaultSlotIndex() {
  const h = new Date().getHours();
  if (h < 10) return 0;
  if (h < 12) return 1;
  if (h < 17) return 2;
  return 3;
}

function macrosFor(food: Food, grams: number) {
  const f = grams / 100;
  return {
    kcal: Math.round(food.kcal100 * f),
    protein: Math.round(food.protein100 * f),
    carbs: Math.round(food.carbs100 * f),
    fat: Math.round(food.fat100 * f),
  };
}

export function Capture() {
  const { s, d, go, refreshMeals } = useBruno();
  const it = s.lang === "it";

  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Food[]>([]);
  const [activeFood, setActiveFood] = useState<Food | null>(null);
  const [grams, setGrams] = useState(100);
  const [items, setItems] = useState<Item[]>([]);
  const [slotIndex, setSlotIndex] = useState(defaultSlotIndex());
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<{ x: number; value: number } | null>(null);

  useEffect(() => {
    const handle = setTimeout(async () => {
      const res = await fetch(`/api/foods?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.foods);
      }
    }, 250);
    return () => clearTimeout(handle);
  }, [query]);

  async function onPickPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    setUploading(false);
    if (res.ok) {
      const data = await res.json();
      setPhotoUrl(data.url);
    } else {
      setPhotoError(it ? "Foto non salvata — puoi comunque registrare il pasto." : "Photo wasn't saved — you can still log the meal.");
    }
  }

  function addItem() {
    if (!activeFood) return;
    const m = macrosFor(activeFood, grams);
    setItems((prev) => [
      ...prev,
      { foodId: activeFood.id, name: it ? activeFood.nameIt : activeFood.nameEn, grams, ...m },
    ]);
    setActiveFood(null);
    setQuery("");
    setResults([]);
    setGrams(100);
  }

  function removeItem(i: number) {
    setItems((prev) => prev.filter((_, j) => j !== i));
  }

  const totals = items.reduce(
    (acc, it) => ({
      kcal: acc.kcal + it.kcal,
      protein: acc.protein + it.protein,
      carbs: acc.carbs + it.carbs,
      fat: acc.fat + it.fat,
    }),
    { kcal: 0, protein: 0, carbs: 0, fat: 0 }
  );

  async function submit() {
    if (items.length === 0) return;
    setSubmitting(true);
    const res = await fetch("/api/meals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slot: (it ? SLOTS_IT : SLOTS_EN)[slotIndex],
        photoUrl: photoUrl ?? undefined,
        items: items.map((i) => ({ foodId: i.foodId, grams: i.grams })),
      }),
    });
    setSubmitting(false);
    if (res.ok) {
      await refreshMeals();
      go("meals");
    }
  }

  function onDragDown(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { x: e.clientX, value: grams };
  }
  function onDragMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragRef.current) return;
    const steps = Math.round((e.clientX - dragRef.current.x) / 4);
    const g = Math.min(400, Math.max(20, dragRef.current.value + steps * 5));
    setGrams(g);
  }
  function onDragUp() {
    dragRef.current = null;
  }

  return (
    <div className="flex flex-col">
      <label
        className="duotone relative flex h-[220px] cursor-pointer items-center justify-center"
        style={{
          background: preview
            ? undefined
            : "repeating-linear-gradient(45deg, var(--color-neutral-300) 0 6px, var(--color-neutral-200) 6px 12px)",
        }}
      >
        <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onPickPhoto} />
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="text-center text-[11px] leading-[1.5] text-neutral-700" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>
            [ {d.cam} ]
            <br />
            {it ? "tocca per scattare o caricare" : "tap to take or upload a photo"}
          </span>
        )}
        <RigTap
          onClick={(e) => {
            e.preventDefault();
            go("meals");
          }}
          className="absolute left-3 top-3 bg-paper px-2.5 py-[7px] font-heading text-[11px] font-semibold leading-none tracking-[.1em]"
        >
          {d.cancel}
        </RigTap>
        {uploading && (
          <div className="absolute bottom-3 right-3 bg-accent-900 px-2.5 py-1.5 font-heading text-[10px] font-semibold leading-none tracking-[.1em] text-paper">
            {it ? "CARICAMENTO…" : "UPLOADING…"}
          </div>
        )}
      </label>

      <div className="flex flex-col gap-3 px-4 pb-[26px] pt-3.5">
        {photoError && <div className="text-[12px] text-accent-700">{photoError}</div>}
        <div className="flex border border-ink/16">
          {(it ? SLOTS_IT : SLOTS_EN).map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => setSlotIndex(i)}
              className={`rig-tap flex-1 py-2 font-heading text-[11px] font-semibold leading-none tracking-[.06em] ${
                i ? "border-l border-ink/16" : ""
              } ${slotIndex === i ? "bg-accent text-paper" : "bg-transparent text-ink"}`}
            >
              {label}
            </button>
          ))}
        </div>

        <Blueprint className="p-3.5">
          <div className="font-heading text-[10px] font-semibold leading-none tracking-[.14em] text-accent-700">
            {it ? "CERCA ALIMENTO" : "SEARCH FOOD"}
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={it ? "es. pollo, riso, banana…" : "e.g. chicken, rice, banana…"}
            className="mt-2 min-h-[44px] w-full border border-ink/16 bg-surface px-2.5 text-base text-ink outline-none focus-visible:border-accent"
          />
          {results.length > 0 && !activeFood && (
            <div className="mt-2 max-h-[220px] overflow-y-auto">
              {results.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    setActiveFood(f);
                    setGrams(100);
                  }}
                  className="rig-tap flex w-full items-center justify-between border-b border-ink/8 py-2.5 text-left"
                >
                  <span className="text-[13px]">{it ? f.nameIt : f.nameEn}</span>
                  <span className="text-[11px] text-neutral-700">{f.kcal100} kcal/100g</span>
                </button>
              ))}
            </div>
          )}

          {activeFood && (
            <div className="mt-3 border-t border-ink/8 pt-3">
              <div className="flex items-baseline justify-between">
                <span className="text-[14px] font-semibold">{it ? activeFood.nameIt : activeFood.nameEn}</span>
                <span className="font-heading text-[20px] font-semibold leading-none">{grams}g</span>
              </div>
              <div
                onPointerDown={onDragDown}
                onPointerMove={onDragMove}
                onPointerUp={onDragUp}
                onPointerCancel={onDragUp}
                className="relative mt-2 flex h-[44px] cursor-ew-resize items-center overflow-hidden border border-ink/16"
                style={{ touchAction: "none" }}
              >
                <div
                  className="absolute bottom-0 left-0 top-0 bg-accent opacity-[.18]"
                  style={{ width: `${Math.min(100, (grams / 400) * 100)}%` }}
                />
                <span className="relative pl-3 font-heading text-[11px] font-semibold leading-none tracking-[.1em] text-neutral-700">
                  {it ? "TRASCINA PER LA QUANTITÀ" : "DRAG TO SET THE AMOUNT"}
                </span>
              </div>
              <div className="mt-2 flex gap-2">
                <RigTap
                  onClick={() => setActiveFood(null)}
                  className="flex-1 border border-ink/16 py-2.5 font-heading text-[13px] font-semibold leading-none tracking-[.06em]"
                >
                  {d.cancel.replace("← ", "")}
                </RigTap>
                <RigTap
                  onClick={addItem}
                  className="flex-1 bg-accent py-2.5 font-heading text-[13px] font-semibold leading-none tracking-[.06em] text-paper"
                >
                  {it ? "AGGIUNGI" : "ADD"}
                </RigTap>
              </div>
            </div>
          )}
        </Blueprint>

        {items.length > 0 && (
          <Blueprint className="p-3.5">
            <div className="flex items-baseline justify-between">
              <div className="font-heading text-[10px] font-semibold leading-none tracking-[.14em] text-accent-700">
                {it ? "TOTALE" : "TOTAL"}
              </div>
              <div className="font-heading text-[24px] font-semibold leading-none">{totals.kcal} kcal</div>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-1.5 text-center">
              <div>
                <div className="font-heading text-[18px] font-semibold leading-none">{totals.protein}g</div>
                <div className="mt-1 text-[10px] text-neutral-700">{d.protein}</div>
              </div>
              <div>
                <div className="font-heading text-[18px] font-semibold leading-none">{totals.carbs}g</div>
                <div className="mt-1 text-[10px] text-neutral-700">{d.carbs}</div>
              </div>
              <div>
                <div className="font-heading text-[18px] font-semibold leading-none">{totals.fat}g</div>
                <div className="mt-1 text-[10px] text-neutral-700">{d.fat}</div>
              </div>
            </div>
            <div className="mt-2">
              {items.map((item, i) => (
                <div key={i} className="flex items-baseline gap-2.5 border-b border-ink/8 py-2">
                  <span className="flex-1 text-[13px]">{item.name}</span>
                  <span className="text-[12px] text-neutral-700">{item.grams}g</span>
                  <span className="font-heading text-[13px] font-semibold leading-none">{item.kcal}</span>
                  <button
                    type="button"
                    onClick={() => removeItem(i)}
                    className="rig-tap flex h-8 w-8 items-center justify-center text-[15px] text-neutral-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </Blueprint>
        )}

        <RigTap
          onClick={submit}
          disabled={items.length === 0 || submitting}
          className="flex min-h-[60px] w-full items-center justify-center bg-accent font-heading text-[19px] font-semibold leading-none tracking-[.12em] text-paper disabled:opacity-40"
        >
          {submitting ? "…" : it ? "REGISTRA IL PASTO" : "LOG THE MEAL"}
        </RigTap>
      </div>
    </div>
  );
}
