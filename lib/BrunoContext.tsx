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
import { useSession, signOut } from "next-auth/react";
import { DICT, type Dict } from "./i18n";
import { STEP, WMAX, WMIN } from "./constants";
import type { Lang, LoggedSet, Role, View } from "./types";

interface DragRef {
  x: number;
  value: number;
  width?: number;
}

export interface PlanData {
  id: string;
  dayLabel: string;
  managedBy: "USER" | "TRAINER";
  exercises: { id: string; name: string; scheme: string; restSeconds: number }[];
}

export interface MealItemData {
  id: string;
  name: string;
  grams: number;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealData {
  id: string;
  slot: string;
  photoUrl: string | null;
  macros: { kcal: number; protein: number; carbs: number; fat: number };
  items: MealItemData[];
}

export interface ClientSummary {
  id: string;
  name: string;
  streak: number;
}

export interface ProfileData {
  id: string;
  name: string;
  email: string;
  role: "USER" | "TRAINER";
  lang: Lang;
  goal: string | null;
  trainerCode: string | null;
  trainerId: string | null;
  trainerName: string | null;
}

interface CoreState {
  view: View;
  lang: Lang;
  weight: number;
  reps: number;
  rest: number;
  logged: LoggedSet[];
  habits: boolean[];
  mood: number;
  freeze: boolean;
  streak: number;
  plan: PlanData | null;
  meals: MealData[];
  clients: ClientSummary[] | null;
  selectedClientId: string | null;
  lastCoachMessage: { text: string; createdAt: string } | null;
}

interface BrunoContextValue {
  loading: boolean;
  profile: ProfileData | null;
  s: CoreState & { role: Role };
  d: Dict;
  brand: string;
  brandInitial: string;
  fmt: (weight: number) => string;
  go: (view: View) => void;
  toggleLang: () => void;
  logout: () => void;
  logSet: () => Promise<void>;
  skipRest: () => void;
  repsUp: () => void;
  repsDown: () => void;
  dialDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  dialMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  dragUp: () => void;
  toggleHabit: (i: number) => void;
  setMood: (i: number) => void;
  useFreeze: () => void;
  openClient: (id: string) => void;
  refreshMeals: () => Promise<void>;
  refreshBootstrap: () => Promise<void>;
  saveProfile: (input: { goal?: string; trainerCode?: string }) => Promise<{ ok: boolean; error?: string }>;
}

const BrunoContext = createContext<BrunoContextValue | null>(null);

function toRow(lang: Lang, n: number, set: { weightKg: number; reps: number; rpe: string }): LoggedSet {
  const w = Number.isInteger(set.weightKg) ? String(set.weightKg) : set.weightKg.toFixed(1);
  return {
    n: DICT[lang].set_word + " " + n,
    label: (lang === "it" ? w.replace(".", ",") : w) + " kg × " + set.reps,
    note: set.rpe,
  };
}

export function BrunoProvider({
  children,
  brandName = "Bruno",
}: {
  children: ReactNode;
  brandName?: string;
}) {
  const { status } = useSession();
  const [lang, setLang] = useState<Lang>("it");
  const [view, setView] = useState<View>("today");
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [weight, setWeight] = useState(60);
  const [reps, setReps] = useState(5);
  const [rest, setRest] = useState(0);
  const [logged, setLogged] = useState<LoggedSet[]>([]);
  const [habits, setHabits] = useState<boolean[]>([false, false, false, false]);
  const [mood, setMoodState] = useState(1);
  const [freeze, setFreeze] = useState(false);
  const [streak, setStreak] = useState(0);
  const [plan, setPlan] = useState<PlanData | null>(null);
  const [meals, setMeals] = useState<MealData[]>([]);
  const [clients, setClients] = useState<ClientSummary[] | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [lastCoachMessage, setLastCoachMessage] = useState<{ text: string; createdAt: string } | null>(null);

  const restTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const drag = useRef<DragRef | null>(null);
  const viewInitialized = useRef(false);

  const refreshBootstrap = useCallback(async () => {
    const res = await fetch("/api/bootstrap");
    if (!res.ok) return;
    const data = await res.json();
    setProfile(data.user);
    setLang(data.user.lang);
    setHabits(data.dailyLog.habits);
    setMoodState(typeof data.dailyLog.mood === "number" ? data.dailyLog.mood : 1);
    setFreeze(!!data.dailyLog.freeze);
    setStreak(data.streak);
    setPlan(data.plan);
    setMeals(data.meals);
    setClients(data.clients);
    setLastCoachMessage(data.lastCoachMessage);
    setLogged(
      data.session
        ? data.session.sets.map((set: { weightKg: number; reps: number; rpe: string }, i: number) =>
            toRow(data.user.lang, i + 1, set)
          )
        : []
    );
    if (!viewInitialized.current) {
      viewInitialized.current = true;
      setView(data.user.role === "TRAINER" ? "clients" : "today");
    }
  }, []);

  useEffect(() => {
    if (status !== "authenticated") return;
    // Kicks off the initial data load once the session is confirmed — there's
    // no earlier point to fetch from without an authenticated request.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshBootstrap().finally(() => setLoading(false));
  }, [status, refreshBootstrap]);

  useEffect(() => {
    return () => {
      if (restTimer.current) clearInterval(restTimer.current);
    };
  }, []);

  const d = DICT[lang];

  const fmt = useCallback(
    (w: number) => {
      const base = Number.isInteger(w) ? String(w) : w.toFixed(1);
      return (lang === "it" ? base.replace(".", ",") : base) + " kg";
    },
    [lang]
  );

  const go = useCallback((v: View) => setView(v), []);
  const toggleLang = useCallback(() => setLang((p) => (p === "it" ? "en" : "it")), []);
  const logout = useCallback(() => signOut({ callbackUrl: "/login" }), []);

  const logSet = useCallback(async () => {
    const exerciseIndex = plan ? Math.min(plan.exercises.length - 1, Math.floor(logged.length / 5)) : -1;
    const currentExercise = exerciseIndex >= 0 ? plan?.exercises[exerciseIndex] : undefined;
    const exerciseName = currentExercise?.name ?? "Esercizio";
    const restSeconds = currentExercise?.restSeconds ?? 90;
    const rpe = logged.length > 2 ? "RPE 8" : "RPE 7";
    const res = await fetch("/api/sets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ exercise: exerciseName, weightKg: weight, reps, rpe }),
    });
    if (res.ok) {
      const { set } = await res.json();
      setLogged((prev) => [...prev, toRow(lang, prev.length + 1, set)]);
      setRest(restSeconds);
      if (restTimer.current) clearInterval(restTimer.current);
      restTimer.current = setInterval(() => {
        setRest((r) => {
          if (r <= 1) {
            if (restTimer.current) clearInterval(restTimer.current);
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    }
  }, [plan, logged.length, weight, reps, lang]);

  const skipRest = useCallback(() => {
    if (restTimer.current) clearInterval(restTimer.current);
    setRest(0);
  }, []);

  const repsUp = useCallback(() => setReps((r) => Math.min(30, r + 1)), []);
  const repsDown = useCallback(() => setReps((r) => Math.max(1, r - 1)), []);

  const dialDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, value: weight };
  }, [weight]);
  const dialMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const steps = Math.round((drag.current.x - e.clientX) / 13);
    const w = Math.min(WMAX, Math.max(WMIN, drag.current.value + steps * STEP));
    setWeight((prev) => (prev === w ? prev : w));
  }, []);
  const dragUp = useCallback(() => {
    drag.current = null;
  }, []);

  const persistHabits = useCallback(
    async (next: { habits?: boolean[]; mood?: number; freeze?: boolean }) => {
      const res = await fetch("/api/habits", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      if (res.ok) {
        const data = await res.json();
        setStreak(data.streak);
      }
    },
    []
  );

  const toggleHabit = useCallback(
    (i: number) => {
      setHabits((prev) => {
        const next = prev.map((v, j) => (j === i ? !v : v));
        persistHabits({ habits: next });
        return next;
      });
    },
    [persistHabits]
  );
  const setMood = useCallback(
    (i: number) => {
      setMoodState(i);
      persistHabits({ mood: i });
    },
    [persistHabits]
  );
  const useFreeze = useCallback(() => {
    setFreeze(true);
    persistHabits({ freeze: true });
  }, [persistHabits]);

  const openClient = useCallback((id: string) => {
    setSelectedClientId(id);
    setView("review");
  }, []);

  const refreshMeals = useCallback(async () => {
    const res = await fetch("/api/meals");
    if (res.ok) {
      const data = await res.json();
      setMeals(data.meals);
    }
  }, []);

  const saveProfile = useCallback(async (input: { goal?: string; trainerCode?: string }) => {
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      return { ok: false, error: typeof data?.error === "string" ? data.error : "Errore." };
    }
    await refreshBootstrap();
    return { ok: true };
  }, [refreshBootstrap]);

  const role: Role = profile?.role === "TRAINER" ? "trainer" : "user";

  const value = useMemo<BrunoContextValue>(
    () => ({
      loading,
      profile,
      s: {
        view,
        lang,
        weight,
        reps,
        rest,
        logged,
        habits,
        mood,
        freeze,
        streak,
        plan,
        meals,
        clients,
        selectedClientId,
        lastCoachMessage,
        role,
      },
      d,
      brand: brandName.toUpperCase(),
      brandInitial: brandName.trim().charAt(0).toUpperCase(),
      fmt,
      go,
      toggleLang,
      logout,
      logSet,
      skipRest,
      repsUp,
      repsDown,
      dialDown,
      dialMove,
      dragUp,
      toggleHabit,
      setMood,
      useFreeze,
      openClient,
      refreshMeals,
      refreshBootstrap,
      saveProfile,
    }),
    [
      loading,
      profile,
      view,
      lang,
      weight,
      reps,
      rest,
      logged,
      habits,
      mood,
      freeze,
      streak,
      plan,
      meals,
      clients,
      selectedClientId,
      lastCoachMessage,
      role,
      d,
      brandName,
      fmt,
      go,
      toggleLang,
      logout,
      logSet,
      skipRest,
      repsUp,
      repsDown,
      dialDown,
      dialMove,
      dragUp,
      toggleHabit,
      setMood,
      useFreeze,
      openClient,
      refreshMeals,
      refreshBootstrap,
      saveProfile,
    ]
  );

  return <BrunoContext.Provider value={value}>{children}</BrunoContext.Provider>;
}

export function useBruno() {
  const ctx = useContext(BrunoContext);
  if (!ctx) throw new Error("useBruno must be used within a BrunoProvider");
  return ctx;
}
