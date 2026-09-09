"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { DICT, type Dict } from "./i18n";
import { STORAGE_KEY, STEP, WMAX, WMIN } from "./constants";
import type {
  ChatMessage,
  Lang,
  LoggedSet,
  PersistedState,
  Role,
  View,
} from "./types";

interface DragRef {
  x: number;
  value: number;
  width?: number;
}

interface BrunoState {
  lang: Lang;
  role: Role;
  view: View;
  weight: number;
  reps: number;
  logged: LoggedSet[];
  rest: number;
  portion: number;
  draft: string;
  extra: number[];
  removed: number[];
  msgs: ChatMessage[] | null;
  goal: number;
  invite: string;
  buildDay: number;
  habits: boolean[];
  mood: number;
  freeze: boolean;
}

const defaultState = (brandLang: Lang, brandRole: Role): BrunoState => ({
  lang: brandLang,
  role: brandRole,
  view: brandRole === "trainer" ? "clients" : "today",
  weight: 72.5,
  reps: 5,
  logged: [],
  rest: 0,
  portion: 1,
  draft: "",
  extra: [],
  removed: [],
  msgs: null,
  goal: 0,
  invite: "DANA-4417",
  buildDay: 0,
  habits: [true, false, false, false],
  mood: 1,
  freeze: false,
});

interface BrunoContextValue {
  s: BrunoState;
  d: Dict;
  brand: string;
  brandInitial: string;
  fmt: (weight: number) => string;
  go: (view: View) => void;
  setUser: () => void;
  setTrainer: () => void;
  toggleLang: () => void;
  logSet: () => void;
  skipRest: () => void;
  repsUp: () => void;
  repsDown: () => void;
  dialDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  dialMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  portionDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  portionMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  dragUp: () => void;
  setDraft: (v: string) => void;
  send: () => void;
  toggleHabit: (i: number) => void;
  setMood: (i: number) => void;
  useFreeze: () => void;
  setGoal: (i: number) => void;
  setInvite: (v: string) => void;
  setBuildDay: (i: number) => void;
  addExercise: () => void;
  removeBuildRow: (i: number) => void;
}

const BrunoContext = createContext<BrunoContextValue | null>(null);

export function BrunoProvider({
  children,
  brandName = "Bruno",
  startLang = "it",
  startRole = "user",
}: {
  children: ReactNode;
  brandName?: string;
  startLang?: Lang;
  startRole?: Role;
}) {
  const [s, setS] = useState<BrunoState>(() =>
    defaultState(startLang, startRole)
  );
  const [hydrated, setHydrated] = useState(false);
  const restTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const drag = useRef<DragRef | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const p = JSON.parse(raw) as Partial<PersistedState>;
        // One-time hydration of persisted client state after mount — localStorage
        // isn't available during server rendering, so this can't run any earlier
        // without causing a hydration mismatch.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setS((prev) => ({
          ...prev,
          lang: p.lang ?? prev.lang,
          role: p.role ?? prev.role,
          view: p.view ?? prev.view,
          habits: p.habits ?? prev.habits,
          mood: typeof p.mood === "number" ? p.mood : prev.mood,
          freeze: !!p.freeze,
        }));
      }
    } catch {
      // localStorage unavailable — continue with in-memory defaults.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      const payload: PersistedState = {
        lang: s.lang,
        role: s.role,
        view: s.view,
        habits: s.habits,
        mood: s.mood,
        freeze: s.freeze,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore write failures (private mode, quota, etc).
    }
  }, [hydrated, s.lang, s.role, s.view, s.habits, s.mood, s.freeze]);

  useEffect(() => {
    return () => {
      if (restTimer.current) clearInterval(restTimer.current);
    };
  }, []);

  const d = DICT[s.lang];

  const fmt = useCallback(
    (weight: number) => {
      const base = Number.isInteger(weight) ? String(weight) : weight.toFixed(1);
      return (s.lang === "it" ? base.replace(".", ",") : base) + " kg";
    },
    [s.lang]
  );

  const go = useCallback((view: View) => setS((p) => ({ ...p, view })), []);

  const setUser = useCallback(
    () => setS((p) => ({ ...p, role: "user", view: "today" })),
    []
  );
  const setTrainer = useCallback(
    () => setS((p) => ({ ...p, role: "trainer", view: "clients" })),
    []
  );
  const toggleLang = useCallback(
    () =>
      setS((p) => ({
        ...p,
        lang: p.lang === "it" ? "en" : "it",
        msgs: null,
        logged: [],
      })),
    []
  );

  const logSet = useCallback(() => {
    setS((p) => {
      const n = p.logged.length + 1;
      const row: LoggedSet = {
        n: DICT[p.lang].set_word + " " + n,
        label:
          (p.lang === "it"
            ? (Number.isInteger(p.weight) ? String(p.weight) : p.weight.toFixed(1)).replace(".", ",")
            : Number.isInteger(p.weight) ? String(p.weight) : p.weight.toFixed(1)) +
          " kg × " +
          p.reps,
        note: n > 2 ? "RPE 8" : "RPE 7",
      };
      return { ...p, logged: [...p.logged, row], rest: 90 };
    });
    if (restTimer.current) clearInterval(restTimer.current);
    restTimer.current = setInterval(() => {
      setS((p) => {
        if (p.rest <= 1) {
          if (restTimer.current) clearInterval(restTimer.current);
          return { ...p, rest: 0 };
        }
        return { ...p, rest: p.rest - 1 };
      });
    }, 1000);
  }, []);

  const skipRest = useCallback(() => {
    if (restTimer.current) clearInterval(restTimer.current);
    setS((p) => ({ ...p, rest: 0 }));
  }, []);

  const repsUp = useCallback(
    () => setS((p) => ({ ...p, reps: Math.min(30, p.reps + 1) })),
    []
  );
  const repsDown = useCallback(
    () => setS((p) => ({ ...p, reps: Math.max(1, p.reps - 1) })),
    []
  );

  const dialDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setS((p) => {
      drag.current = { x: e.clientX, value: p.weight };
      return p;
    });
  }, []);
  const dialMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const steps = Math.round((drag.current.x - e.clientX) / 13);
    const w = Math.min(WMAX, Math.max(WMIN, drag.current.value + steps * STEP));
    setS((p) => (p.weight === w ? p : { ...p, weight: w }));
  }, []);

  const portionDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const width = e.currentTarget.offsetWidth;
    setS((p) => {
      drag.current = { x: e.clientX, value: p.portion, width };
      return p;
    });
  }, []);
  const portionMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current || !drag.current.width) return;
    const dx = ((e.clientX - drag.current.x) / drag.current.width) * 2;
    const p2 = Math.min(2, Math.max(0.25, Math.round((drag.current.value + dx) * 4) / 4));
    setS((p) => (p.portion === p2 ? p : { ...p, portion: p2 }));
  }, []);

  const dragUp = useCallback(() => {
    drag.current = null;
  }, []);

  const setDraft = useCallback(
    (v: string) => setS((p) => ({ ...p, draft: v })),
    []
  );
  const send = useCallback(() => {
    setS((p) => {
      const txt = p.draft.trim();
      if (!txt) return p;
      const base: ChatMessage[] =
        p.msgs ?? DICT[p.lang].msgs.map(([dir, text]) => ({ dir, text }));
      return { ...p, msgs: [...base, { dir: "out", text: txt }], draft: "" };
    });
  }, []);

  const toggleHabit = useCallback(
    (i: number) =>
      setS((p) => ({
        ...p,
        habits: p.habits.map((v, j) => (j === i ? !v : v)),
      })),
    []
  );
  const setMood = useCallback(
    (i: number) => setS((p) => ({ ...p, mood: i })),
    []
  );
  const useFreeze = useCallback(
    () => setS((p) => ({ ...p, freeze: true })),
    []
  );

  const setGoal = useCallback(
    (i: number) => setS((p) => ({ ...p, goal: i })),
    []
  );
  const setInvite = useCallback(
    (v: string) => setS((p) => ({ ...p, invite: v })),
    []
  );
  const setBuildDay = useCallback(
    (i: number) => setS((p) => ({ ...p, buildDay: i })),
    []
  );
  const addExercise = useCallback(
    () => setS((p) => ({ ...p, extra: [...p.extra, p.extra.length] })),
    []
  );
  const removeBuildRow = useCallback(
    (i: number) => setS((p) => ({ ...p, removed: [...p.removed, i] })),
    []
  );

  const value = useMemo<BrunoContextValue>(
    () => ({
      s,
      d,
      brand: brandName.toUpperCase(),
      brandInitial: brandName.trim().charAt(0).toUpperCase(),
      fmt,
      go,
      setUser,
      setTrainer,
      toggleLang,
      logSet,
      skipRest,
      repsUp,
      repsDown,
      dialDown,
      dialMove,
      portionDown,
      portionMove,
      dragUp,
      setDraft,
      send,
      toggleHabit,
      setMood,
      useFreeze,
      setGoal,
      setInvite,
      setBuildDay,
      addExercise,
      removeBuildRow,
    }),
    [
      s,
      d,
      brandName,
      fmt,
      go,
      setUser,
      setTrainer,
      toggleLang,
      logSet,
      skipRest,
      repsUp,
      repsDown,
      dialDown,
      dialMove,
      portionDown,
      portionMove,
      dragUp,
      setDraft,
      send,
      toggleHabit,
      setMood,
      useFreeze,
      setGoal,
      setInvite,
      setBuildDay,
      addExercise,
      removeBuildRow,
    ]
  );

  return (
    <BrunoContext.Provider value={value}>{children}</BrunoContext.Provider>
  );
}

export function useBruno() {
  const ctx = useContext(BrunoContext);
  if (!ctx) throw new Error("useBruno must be used within a BrunoProvider");
  return ctx;
}
