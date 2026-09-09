const WGER_BASE = "https://wger.de/api/v2";
const LANG_IDS = { it: 13, en: 2 } as const;

interface WgerTranslation {
  id: number;
  name: string;
  exercise: number;
  description: string;
}

interface WgerImage {
  image: string;
  thumbnails?: { small?: string; medium?: string };
  is_main: boolean;
  license_author?: string;
}

interface WgerExerciseInfo {
  id: number;
  category?: { name: string };
  images: WgerImage[];
}

export interface ExerciseVisual {
  name: string;
  imageUrl: string;
  thumbnailUrl: string;
  category: string | null;
  author: string | null;
  sourceUrl: string;
}

async function fetchJson<T>(url: string, timeoutMs = 6000): Promise<T | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function pickBestTranslation(query: string, results: WgerTranslation[]): WgerTranslation | null {
  if (results.length === 0) return null;
  const q = query.trim().toLowerCase();
  const exact = results.find((r) => r.name.trim().toLowerCase() === q);
  if (exact) return exact;
  const nameMatch = results.find((r) => r.name.toLowerCase().includes(q) || q.includes(r.name.toLowerCase()));
  return nameMatch ?? results[0];
}

async function searchTranslation(query: string, langId: number): Promise<WgerTranslation | null> {
  const url = `${WGER_BASE}/exercise-translation/?language=${langId}&search=${encodeURIComponent(
    query
  )}&limit=8&format=json`;
  const data = await fetchJson<{ results: WgerTranslation[] }>(url);
  if (!data?.results) return null;
  return pickBestTranslation(query, data.results);
}

/**
 * Looks up a matching exercise on wger.de's open, CC-BY-SA-licensed exercise
 * database and returns its illustration, if one exists. Searches the
 * requested language first, then falls back to English (wger's catalog is
 * far more complete there) before giving up.
 */
export async function findExerciseVisual(name: string, lang: "it" | "en"): Promise<ExerciseVisual | null> {
  const translation =
    (await searchTranslation(name, LANG_IDS[lang])) ??
    (lang !== "en" ? await searchTranslation(name, LANG_IDS.en) : null);
  if (!translation) return null;

  const info = await fetchJson<WgerExerciseInfo>(`${WGER_BASE}/exerciseinfo/${translation.exercise}/?format=json`);
  const image = info?.images.find((img) => img.is_main) ?? info?.images[0];
  if (!image) return null;

  return {
    name: translation.name,
    imageUrl: image.image,
    thumbnailUrl: image.thumbnails?.medium ?? image.thumbnails?.small ?? image.image,
    category: info?.category?.name ?? null,
    author: image.license_author || null,
    sourceUrl: `https://wger.de/en/exercise/${translation.exercise}/view/`,
  };
}
