import type { Lang } from "./types";

export interface Dict {
  lang_next: string;
  role_user: string;
  role_trainer: string;
  me: string;

  today_date: string;
  today_date_short: string;
  today_h: string;
  streak: string;
  sess_kicker: string;
  sess_name: string;
  sess_meta: string;
  start: string;
  fuel: string;
  kcal_line: string;
  kcal_left: string;
  protein: string;
  carbs: string;
  fat: string;
  snap: string;
  coach_kicker: string;
  coach_note: string;
  reply: string;

  plan_h: string;
  plan_meta: string;
  day_push: string;
  start_this: string;

  end: string;
  ex_of: string;
  bench: string;
  bench_meta: string;
  set_word: string;
  drag_hint: string;
  reps: string;
  log_btn: string;
  rest: string;
  skip: string;
  logged: string;

  meals_h: string;
  snap_flow: string;

  cam: string;
  cam_sub: string;
  cancel: string;
  items_found: string;
  cap_title: string;
  portion: string;
  drag_plate: string;
  add_lunch: string;

  progress_h: string;
  volume: string;
  bodyweight: string;
  weeks: string;
  adherence: string;
  sessions: string;
  prs: string;
  prs_list: [string, string, string][];

  chat_h: string;
  chat_sub: string;
  msg_ph: string;
  send: string;

  profile_h: string;
  profile_meta: string;
  replay_onboard: string;

  step2: string;
  onboard_h: string;
  onboard_sub: string;
  invite: string;
  onboard_cta: string;

  clients_h: string;
  clients_meta: string;
  need_review: string;

  build_h: string;
  build_meta: string;
  add_exercise: string;
  assign: string;

  review_kicker: string;
  review_meta: string;
  sessions_short: string;
  volume_short: string;
  flags: string;
  send_note: string;
  edit_plan: string;

  alt_kicker: string;
  alt_hint: string;
  alt_flash: string;

  tabs_user: string[];
  tabs_trainer: string[];
  week: string[];

  plan_ex: [string, string][];
  meals: [string, string, string, string][];
  cap_items: [string, string, string][];
  settings: [string, string][];
  goals_list: string[];
  clients: [string, string, string, string][];
  build_days: string[];
  build_day_label: string;
  build_rows: [string, string][];
  new_ex: string[];
  flags_list: [string, string][];
  msgs: ["in" | "out", string][];
  sent: string;

  mom_h: string;
  streak_card: string;
  streak_sub: string;
  freeze: string;
  freeze_on: string;
  habits: string;
  habits_sub: string;
  habit_list: [string, string][];
  challenge: string;
  challenge_name: string;
  board: [string, string, string][];
  badges: string;
  badge_list: string[];
  locked: string;
  mood_q: string;
  moods: string[];
  mood_hints: string[];
  comeback: string;
  comeback_sub: string;
  comeback_cta: string;
  nudge: string;
  nudge_sub: string;
}

export const DICT: Record<Lang, Dict> = {
  it: {
    lang_next: "EN", role_user: "UTENTE", role_trainer: "TRAINER", me: "IO",
    today_date: "LUN 07 SET · SETTIMANA 6", today_date_short: "LUN 07 SET", today_h: "SOTTO AL BILANCIERE", streak: "SERIE DI GIORNI",
    sess_kicker: "ALLENAMENTO DI OGGI", sess_name: "PUSH — GIORNO 3", sess_meta: "6 esercizi · 24 serie · ~52 min · assegnato da Dana R.",
    start: "INIZIA LA SESSIONE", fuel: "ALIMENTAZIONE", kcal_line: "2.140 / 2.600 kcal", kcal_left: "di 2.600 kcal · 460 rimanenti",
    protein: "PROTEINE", carbs: "CARBOIDRATI", fat: "GRASSI", snap: "+ FOTOGRAFA UN PASTO",
    coach_kicker: "DAL TUO COACH", coach_note: "La panca la settimana scorsa era pesante: resta a 72,5 kg e cerca le ripetizioni. Proteine entro le 20.", reply: "RISPONDI A DANA →",
    plan_h: "LA TUA SCHEDA", plan_meta: "Blocco ipertrofia 2 di 3 · scritto da Dana R.", day_push: "MERCOLEDÌ · PUSH", start_this: "INIZIA QUESTA SESSIONE",
    end: "← CHIUDI", ex_of: "ESERCIZIO 1 DI 6", bench: "PANCA PIANA BILANCIERE", bench_meta: "Obiettivo 5 × 5 · scorsa settimana 5 × 5 @ 70 kg",
    set_word: "SERIE", drag_hint: "trascina il righello per il carico", reps: "RIPETIZIONI", log_btn: "REGISTRA LA SERIE",
    rest: "RECUPERO", skip: "SALTA →", logged: "REGISTRATE",
    meals_h: "DIARIO PASTI", snap_flow: "FOTO · REGISTRA · FATTO",
    cam: "inquadratura", cam_sub: "qui va la foto del pasto", cancel: "← ANNULLA", items_found: "3 ALIMENTI RICONOSCIUTI",
    cap_title: "POLLO, RISO, VERDURE", portion: "PORZIONE", drag_plate: "TRASCINA PER LA PORZIONE", add_lunch: "AGGIUNGI AL PRANZO",
    progress_h: "PROGRESSI", volume: "VOLUME SETTIMANALE · TONNELLATE", bodyweight: "PESO CORPOREO", weeks: "settimane", adherence: "ADERENZA", sessions: "sessioni", prs: "RECORD PERSONALI",
    chat_h: "DANA R.", chat_sub: "La tua coach · risponde entro 2 ore", msg_ph: "Scrivi a Dana…", send: "INVIA",
    profile_h: "PROFILO", profile_meta: "Membro dal 2024 · Palestra Ferro, Milano", replay_onboard: "RIVEDI L’INTRODUZIONE",
    step2: "PASSO 2 DI 3", onboard_h: "QUAL È L’OBIETTIVO?", onboard_sub: "Scegli quello che conta adesso. La tua coach userà questo per costruire il primo blocco.", invite: "CODICE DEL TRAINER", onboard_cta: "AVANTI",
    clients_h: "CLIENTI", clients_meta: "12 attivi · 2 in pausa", need_review: "DA RIVEDERE",
    build_h: "COSTRUISCI LA SCHEDA", build_meta: "Blocco 3 · 4 sedute a settimana", add_exercise: "+ AGGIUNGI ESERCIZIO", assign: "ASSEGNA A MARCO",
    review_kicker: "SETTIMANA DEL CLIENTE", review_meta: "Settimana 6 · 01–07 set", sessions_short: "SEDUTE", volume_short: "VOLUME", flags: "DA GUARDARE", send_note: "MANDA UNA NOTA", edit_plan: "MODIFICA SCHEDA",
    alt_kicker: "VARIANTE 1B · CONTA A POLLICE", alt_hint: "TOCCA = +1 RIP · TIENI PREMUTO = REGISTRA", alt_flash: "SERIE REGISTRATA",
    tabs_user: ["OGGI", "SCHEDA", "PASTI", "SPINTA", "DATI", "COACH"], tabs_trainer: ["CLIENTI", "SCHEDE", "REVISIONE", "CHAT", "IO"],
    week: ["LUN", "MAR", "MER", "GIO", "VEN", "SAB", "DOM"],
    plan_ex: [["Panca piana bilanciere", "5 × 5"], ["Military press", "4 × 8"], ["Croci ai cavi", "3 × 12"], ["Dip alle parallele", "3 × 10"], ["Alzate laterali", "3 × 15"], ["Push-down tricipiti", "3 × 12"]],
    meals: [["COLAZIONE", "Yogurt greco, avena, mirtilli", "P 38 · C 62 · G 12", "520"], ["SPUNTINO", "Shake proteico, banana", "P 30 · C 34 · G 4", "300"], ["PRANZO", "Pollo, riso basmati, broccoli", "P 52 · C 78 · G 16", "720"], ["CENA", "Salmone, patate, insalata", "P 28 · C 36 · G 30", "600"]],
    cap_items: [["Petto di pollo grigliato", "180 g", "298"], ["Riso basmati cotto", "210 g", "272"], ["Broccoli al vapore", "150 g", "51"]],
    prs_list: [["Panca piana", "82,5 kg", "+2,5"], ["Squat bilanciere", "120 kg", "+5,0"], ["Stacco da terra", "150 kg", "+5,0"], ["Military press", "52,5 kg", "="]],
    settings: [["Unità di misura", "KG · CM"], ["Obiettivo calorico", "2.600 KCAL"], ["Trainer", "DANA R."], ["Promemoria allenamento", "18:30"], ["Dati condivisi con la coach", "ATTIVI"]],
    goals_list: ["Massa muscolare", "Ricomposizione", "Forza massimale", "Ritorno dall’infortunio", "Prima gara"],
    clients: [["Marco Belli", "Push/Pull · 4×/sett", "86%", "OK"], ["Giulia Rossi", "Full body · 3×/sett", "92%", "OK"], ["Luca Ferrari", "Forza · 4×/sett", "58%", "DA VEDERE"], ["Sara Conti", "Ricomp · 5×/sett", "74%", "PASTI"], ["Ahmed Nouri", "Ipertrofia · 4×/sett", "95%", "OK"], ["Elena Moretti", "Riabilitazione · 2×/sett", "61%", "DA VEDERE"]],
    build_days: ["GIO 1", "GIO 2", "GIO 3", "GIO 4"], build_day_label: "GIORNO 1 · PUSH",
    build_rows: [["Panca piana bilanciere", "5 × 5"], ["Military press manubri", "4 × 8"], ["Croci ai cavi", "3 × 12"]],
    new_ex: ["Pullover ai cavi", "Spinte in inclinata", "Alzate frontali"],
    flags_list: [["Panca: ripetizioni scese nella terza serie, due sedute di fila", "CARICO"], ["Proteine sotto obiettivo il sabato e la domenica", "PASTI"], ["Recuperi allungati a 4 min sulle serie finali", "RITMO"]],
    msgs: [["in", "Come è andata la panca oggi?"], ["out", "5×5 pieno a 72,5. Ultima serie tirata ma buona."], ["in", "Perfetto. Settimana prossima 75 kg, stesso schema."], ["out", "Ricevuto 💪"], ["in", "E ricorda le proteine la sera."]],
    sent: "Messaggio inviato.",
    mom_h: "SPINTA", streak_card: "SERIE DI GIORNI", streak_sub: "Il tuo record: 21 giorni · 4 settimane senza saltare",
    freeze: "USA UN SALVAGENTE · 2 RIMASTI", freeze_on: "SALVAGENTE ATTIVO — SERIE PROTETTA FINO A DOMANI",
    habits: "ABITUDINI DI OGGI", habits_sub: "Tocca per spuntare. Tre su quattro basta per tenere la serie.",
    habit_list: [["Allenamento", "1 seduta"], ["Proteine", "180 g"], ["Passi", "9.000"], ["Sonno", "7 h"]],
    challenge: "SFIDA DELLA SETTIMANA", challenge_name: "PALESTRA FERRO · 5 SEDUTE IN 7 GIORNI",
    board: [["1", "Giulia R.", "5"], ["2", "Ahmed N.", "5"], ["3", "Marco B. — tu", "4"], ["4", "Sara C.", "3"]],
    badges: "TRAGUARDI", badge_list: ["10 SEDUTE", "PRIMI 100 KG", "7 GIORNI DI FILA", "PROTEINE ×30", "30 SEDUTE", "PRIMI 150 KG"],
    locked: "DA SBLOCCARE", mood_q: "COME TI SENTI OGGI?", moods: ["CARICO", "NORMALE", "A TERRA"],
    mood_hints: ["Schema pieno: 5 × 5 a 72,5 kg.", "Schema normale, recuperi a 90 secondi.", "Dana taglia il volume del 30%: 3 × 5 e tecnica."],
    comeback: "SALTATO UN GIORNO?", comeback_sub: "Recuperi con una seduta express da 15 minuti. La serie non si spezza.", comeback_cta: "SEDUTA EXPRESS 15 MIN",
    nudge: "DUE SEDUTE ALLA SETTIMANA PIENA", nudge_sub: "Chiudi mercoledì e venerdì e la settimana è perfetta."
  },
  en: {
    lang_next: "IT", role_user: "USER", role_trainer: "TRAINER", me: "ME",
    today_date: "MON 07 SEP · WEEK 6", today_date_short: "MON 07 SEP", today_h: "TIME TO WORK", streak: "DAY STREAK",
    sess_kicker: "TODAY'S SESSION", sess_name: "PUSH — DAY 3", sess_meta: "6 exercises · 24 sets · ~52 min · assigned by Dana R.",
    start: "START SESSION", fuel: "FUEL", kcal_line: "2,140 / 2,600 kcal", kcal_left: "of 2,600 kcal · 460 left",
    protein: "PROTEIN", carbs: "CARBS", fat: "FAT", snap: "+ SNAP A MEAL",
    coach_kicker: "FROM YOUR COACH", coach_note: "Bench felt heavy last week — hold 72.5 kg and chase the reps. Get protein in before 8pm.", reply: "REPLY TO DANA →",
    plan_h: "YOUR PLAN", plan_meta: "Hypertrophy block 2 of 3 · written by Dana R.", day_push: "WEDNESDAY · PUSH", start_this: "START THIS SESSION",
    end: "← CLOSE", ex_of: "EXERCISE 1 OF 6", bench: "BARBELL BENCH PRESS", bench_meta: "Target 5 × 5 · last week 5 × 5 @ 70 kg",
    set_word: "SET", drag_hint: "drag the ruler to set the load", reps: "REPS", log_btn: "LOG THE SET",
    rest: "REST", skip: "SKIP →", logged: "LOGGED",
    meals_h: "FUEL LOG", snap_flow: "SNAP · LOG · DONE",
    cam: "camera frame", cam_sub: "meal photo goes here", cancel: "← CANCEL", items_found: "3 ITEMS RECOGNISED",
    cap_title: "CHICKEN, RICE, GREENS", portion: "PORTION", drag_plate: "DRAG TO SIZE THE PLATE", add_lunch: "ADD TO LUNCH",
    progress_h: "PROGRESS", volume: "WEEKLY VOLUME · TONNES", bodyweight: "BODYWEIGHT", weeks: "weeks", adherence: "ADHERENCE", sessions: "sessions", prs: "PERSONAL RECORDS",
    chat_h: "DANA R.", chat_sub: "Your coach · replies within 2 hours", msg_ph: "Message Dana…", send: "SEND",
    profile_h: "PROFILE", profile_meta: "Member since 2024 · Palestra Ferro, Milan", replay_onboard: "REPLAY ONBOARDING",
    step2: "STEP 2 OF 3", onboard_h: "WHAT'S THE GOAL?", onboard_sub: "Pick what matters right now. Your coach builds the first block around it.", invite: "TRAINER CODE", onboard_cta: "CONTINUE",
    clients_h: "CLIENTS", clients_meta: "12 active · 2 paused", need_review: "NEED REVIEW",
    build_h: "BUILD A PLAN", build_meta: "Block 3 · 4 sessions a week", add_exercise: "+ ADD EXERCISE", assign: "ASSIGN TO MARCO",
    review_kicker: "CLIENT WEEK", review_meta: "Week 6 · 01–07 Sep", sessions_short: "SESSIONS", volume_short: "VOLUME", flags: "WORTH A LOOK", send_note: "SEND A NOTE", edit_plan: "EDIT PLAN",
    alt_kicker: "VARIANT 1B · THUMB COUNTER", alt_hint: "TAP = +1 REP · HOLD = LOG SET", alt_flash: "SET LOGGED",
    tabs_user: ["TODAY", "PLAN", "MEALS", "DRIVE", "STATS", "COACH"], tabs_trainer: ["CLIENTS", "PLANS", "REVIEW", "CHAT", "ME"],
    week: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
    plan_ex: [["Barbell bench press", "5 × 5"], ["Overhead press", "4 × 8"], ["Cable fly", "3 × 12"], ["Parallel bar dip", "3 × 10"], ["Lateral raise", "3 × 15"], ["Triceps push-down", "3 × 12"]],
    meals: [["BREAKFAST", "Greek yoghurt, oats, blueberries", "P 38 · C 62 · F 12", "520"], ["SNACK", "Protein shake, banana", "P 30 · C 34 · F 4", "300"], ["LUNCH", "Chicken, basmati rice, broccoli", "P 52 · C 78 · F 16", "720"], ["DINNER", "Salmon, potatoes, salad", "P 28 · C 36 · F 30", "600"]],
    cap_items: [["Grilled chicken breast", "180 g", "298"], ["Cooked basmati rice", "210 g", "272"], ["Steamed broccoli", "150 g", "51"]],
    prs_list: [["Bench press", "82.5 kg", "+2.5"], ["Back squat", "120 kg", "+5.0"], ["Deadlift", "150 kg", "+5.0"], ["Overhead press", "52.5 kg", "="]],
    settings: [["Units", "KG · CM"], ["Calorie target", "2,600 KCAL"], ["Trainer", "DANA R."], ["Workout reminder", "18:30"], ["Data shared with coach", "ON"]],
    goals_list: ["Build muscle", "Recomposition", "Max strength", "Return from injury", "First competition"],
    clients: [["Marco Belli", "Push/Pull · 4×/wk", "86%", "OK"], ["Giulia Rossi", "Full body · 3×/wk", "92%", "OK"], ["Luca Ferrari", "Strength · 4×/wk", "58%", "REVIEW"], ["Sara Conti", "Recomp · 5×/wk", "74%", "MEALS"], ["Ahmed Nouri", "Hypertrophy · 4×/wk", "95%", "OK"], ["Elena Moretti", "Rehab · 2×/wk", "61%", "REVIEW"]],
    build_days: ["DAY 1", "DAY 2", "DAY 3", "DAY 4"], build_day_label: "DAY 1 · PUSH",
    build_rows: [["Barbell bench press", "5 × 5"], ["Dumbbell overhead press", "4 × 8"], ["Cable fly", "3 × 12"]],
    new_ex: ["Cable pullover", "Incline press", "Front raise"],
    flags_list: [["Bench: reps dropped on the third set, two sessions running", "LOAD"], ["Protein under target on Saturday and Sunday", "MEALS"], ["Rests stretched to 4 min on the last sets", "PACE"]],
    msgs: [["in", "How did bench go today?"], ["out", "Full 5×5 at 72.5. Last set was a grind but clean."], ["in", "Good. Next week 75 kg, same scheme."], ["out", "Got it 💪"], ["in", "And keep protein up in the evening."]],
    sent: "Message sent.",
    mom_h: "MOMENTUM", streak_card: "DAY STREAK", streak_sub: "Your record: 21 days · 4 weeks without a miss",
    freeze: "USE A STREAK SAVER · 2 LEFT", freeze_on: "SAVER ACTIVE — STREAK HELD UNTIL TOMORROW",
    habits: "TODAY'S HABITS", habits_sub: "Tap to tick. Three out of four keeps the streak alive.",
    habit_list: [["Training", "1 session"], ["Protein", "180 g"], ["Steps", "9,000"], ["Sleep", "7 h"]],
    challenge: "THIS WEEK’S CHALLENGE", challenge_name: "PALESTRA FERRO · 5 SESSIONS IN 7 DAYS",
    board: [["1", "Giulia R.", "5"], ["2", "Ahmed N.", "5"], ["3", "Marco B. — you", "4"], ["4", "Sara C.", "3"]],
    badges: "MILESTONES", badge_list: ["10 SESSIONS", "FIRST 100 KG", "7 DAYS RUNNING", "PROTEIN ×30", "30 SESSIONS", "FIRST 150 KG"],
    locked: "LOCKED", mood_q: "HOW DO YOU FEEL TODAY?", moods: ["FIRED UP", "NORMAL", "WRECKED"],
    mood_hints: ["Full scheme: 5 × 5 at 72.5 kg.", "Normal scheme, 90-second rests.", "Dana cuts volume 30%: 3 × 5 and clean technique."],
    comeback: "MISSED A DAY?", comeback_sub: "Take the 15-minute express session. The streak stays intact.", comeback_cta: "15-MIN EXPRESS SESSION",
    nudge: "TWO SESSIONS FROM A FULL WEEK", nudge_sub: "Close Wednesday and Friday and the week is perfect."
  }
};
