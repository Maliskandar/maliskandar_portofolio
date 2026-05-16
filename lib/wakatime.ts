const WAKATIME_API_KEY = process.env.WAKATIME_API_KEY;
const WAKATIME_USERNAME = process.env.WAKATIME_USERNAME || "current";

export type WakaItem = {
  name: string;
  total_seconds: number;
  percent: number;
  text: string;
};

export type WakaStats = {
  range: string;
  totalSeconds: number;
  totalText: string;
  dailyAverageSeconds: number;
  dailyAverageText: string;
  bestDay: { date: string; text: string; total_seconds: number } | null;
  languages: WakaItem[];
  editors: WakaItem[];
  projects: WakaItem[];
  operatingSystems: WakaItem[];
  fetchedAt: string;
  source: "live" | "fallback";
};

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h === 0) return `${m} min`;
  return `${h} hr ${m} min`;
}

export async function getWakaStats(): Promise<WakaStats> {
  if (!WAKATIME_API_KEY) return fallback();
  try {
    const auth = Buffer.from(WAKATIME_API_KEY).toString("base64");
    const res = await fetch(
      `https://wakatime.com/api/v1/users/${WAKATIME_USERNAME}/stats/last_7_days`,
      {
        headers: { Authorization: `Basic ${auth}` },
        next: { revalidate: 1800 },
      }
    );
    if (!res.ok) throw new Error(`waka ${res.status}`);
    const json = (await res.json()) as { data: Record<string, unknown> };
    const d = json.data as {
      range: string;
      total_seconds: number;
      human_readable_total: string;
      daily_average: number;
      human_readable_daily_average: string;
      best_day: { date: string; text: string; total_seconds: number } | null;
      languages: WakaItem[];
      editors: WakaItem[];
      projects: WakaItem[];
      operating_systems: WakaItem[];
    };
    return {
      range: d.range,
      totalSeconds: d.total_seconds,
      totalText: d.human_readable_total,
      dailyAverageSeconds: d.daily_average,
      dailyAverageText: d.human_readable_daily_average,
      bestDay: d.best_day,
      languages: (d.languages || []).slice(0, 6),
      editors: (d.editors || []).slice(0, 4),
      projects: (d.projects || []).slice(0, 5),
      operatingSystems: (d.operating_systems || []).slice(0, 3),
      fetchedAt: new Date().toISOString(),
      source: "live",
    };
  } catch (err) {
    console.error("[wakatime] falling back:", err);
    return fallback();
  }
}

function fallback(): WakaStats {
  const sample: WakaItem[] = [
    { name: "PHP", total_seconds: 0, percent: 0, text: "" },
    { name: "TypeScript", total_seconds: 0, percent: 0, text: "" },
    { name: "Blade", total_seconds: 0, percent: 0, text: "" },
  ];
  return {
    range: "last_7_days",
    totalSeconds: 0,
    totalText: "Not connected",
    dailyAverageSeconds: 0,
    dailyAverageText: "—",
    bestDay: null,
    languages: sample,
    editors: [],
    projects: [],
    operatingSystems: [],
    fetchedAt: new Date().toISOString(),
    source: "fallback",
  };
}

export { formatDuration };
