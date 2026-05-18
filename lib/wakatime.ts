const WAKATIME_API_KEY = process.env.WAKATIME_API_KEY;
const WAKATIME_USERNAME = process.env.WAKATIME_USERNAME || "current";

export type WakaItem = {
  name: string;
  total_seconds: number;
  percent: number;
  text: string;
};

export type WakaDaySummary = {
  date: string; // YYYY-MM-DD
  dayOfWeek: number; // 0 = Sun
  total_seconds: number;
  text: string;
};

export type WakaStats = {
  range: string;
  totalSeconds: number;
  totalText: string;
  dailyAverageSeconds: number;
  dailyAverageText: string;
  bestDay: { date: string; text: string; total_seconds: number } | null;
  today: { total_seconds: number; text: string } | null;
  languages: WakaItem[];
  editors: WakaItem[];
  projects: WakaItem[];
  operatingSystems: WakaItem[];
  categories: WakaItem[];
  machines: WakaItem[];
  dailySummaries: WakaDaySummary[];
  weekdayDistribution: { day: string; total_seconds: number; text: string }[];
  fetchedAt: string;
  source: "live" | "fallback";
};

function formatDuration(seconds: number): string {
  if (seconds === 0) return "0 mins";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h === 0) return `${m} min${m === 1 ? "" : "s"}`;
  return `${h} hr${h === 1 ? "" : "s"} ${m} min${m === 1 ? "" : "s"}`;
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function authHeader() {
  return { Authorization: `Basic ${Buffer.from(WAKATIME_API_KEY!).toString("base64")}` };
}

async function fetchStats() {
  const res = await fetch(
    `https://wakatime.com/api/v1/users/${WAKATIME_USERNAME}/stats/last_7_days`,
    { headers: authHeader(), next: { revalidate: 1800 } }
  );
  if (!res.ok) throw new Error(`waka stats ${res.status}`);
  const json = (await res.json()) as { data: Record<string, unknown> };
  return json.data as {
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
    categories: WakaItem[];
    machines: WakaItem[];
  };
}

async function fetchSummaries() {
  const res = await fetch(
    `https://wakatime.com/api/v1/users/${WAKATIME_USERNAME}/summaries?range=last_7_days`,
    { headers: authHeader(), next: { revalidate: 1800 } }
  );
  if (!res.ok) throw new Error(`waka summaries ${res.status}`);
  const json = (await res.json()) as {
    data: {
      range: { date: string };
      grand_total: { total_seconds: number; text: string };
    }[];
  };
  return json.data;
}

export async function getWakaStats(): Promise<WakaStats> {
  if (!WAKATIME_API_KEY) return fallback();
  try {
    const [stats, summaries] = await Promise.all([fetchStats(), fetchSummaries()]);

    const dailySummaries: WakaDaySummary[] = summaries.map((d) => {
      const date = new Date(d.range.date + "T00:00:00");
      return {
        date: d.range.date,
        dayOfWeek: date.getUTCDay(),
        total_seconds: d.grand_total.total_seconds,
        text: d.grand_total.text,
      };
    });

    // Today = the last summary if its date == today
    const todayIso = new Date().toISOString().slice(0, 10);
    const todaySummary = dailySummaries.find((d) => d.date === todayIso) ?? null;

    // Aggregate by day-of-week
    const dowTotals = new Array(7).fill(0);
    dailySummaries.forEach((d) => {
      dowTotals[d.dayOfWeek] += d.total_seconds;
    });
    const weekdayDistribution = dowTotals.map((sec, i) => ({
      day: DAY_NAMES[i],
      total_seconds: sec,
      text: formatDuration(sec),
    }));

    return {
      range: stats.range,
      totalSeconds: stats.total_seconds,
      totalText: stats.human_readable_total,
      dailyAverageSeconds: stats.daily_average,
      dailyAverageText: stats.human_readable_daily_average,
      bestDay: stats.best_day,
      today: todaySummary
        ? { total_seconds: todaySummary.total_seconds, text: todaySummary.text }
        : null,
      languages: (stats.languages || []).slice(0, 8),
      editors: (stats.editors || []).slice(0, 5),
      projects: (stats.projects || []).slice(0, 6),
      operatingSystems: (stats.operating_systems || []).slice(0, 3),
      categories: (stats.categories || []).slice(0, 5),
      machines: (stats.machines || []).slice(0, 3),
      dailySummaries,
      weekdayDistribution,
      fetchedAt: new Date().toISOString(),
      source: "live",
    };
  } catch (err) {
    console.error("[wakatime] falling back:", err);
    return fallback();
  }
}

function fallback(): WakaStats {
  return {
    range: "last_7_days",
    totalSeconds: 0,
    totalText: "Not connected",
    dailyAverageSeconds: 0,
    dailyAverageText: "—",
    bestDay: null,
    today: null,
    languages: [],
    editors: [],
    projects: [],
    operatingSystems: [],
    categories: [],
    machines: [],
    dailySummaries: [],
    weekdayDistribution: DAY_NAMES.map((day) => ({ day, total_seconds: 0, text: "0 mins" })),
    fetchedAt: new Date().toISOString(),
    source: "fallback",
  };
}

export { formatDuration };
