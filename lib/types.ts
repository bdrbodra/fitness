export type Lang = "it" | "en";
export type Role = "user" | "trainer";

export type View =
  | "today"
  | "momentum"
  | "plan"
  | "session"
  | "meals"
  | "capture"
  | "progress"
  | "chat"
  | "profile"
  | "onboard"
  | "clients"
  | "build"
  | "review";

export interface LoggedSet {
  n: string;
  label: string;
  note: string;
}

export interface ChatMessage {
  dir: "in" | "out";
  text: string;
}

export interface PersistedState {
  lang: Lang | null;
  role: Role | null;
  view: View | null;
  habits: boolean[];
  mood: number;
  freeze: boolean;
}
