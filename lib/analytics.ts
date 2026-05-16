import { promises as fs } from "fs";
import path from "path";

const STORE_PATH = path.join(process.cwd(), "data", "analytics.json");

export type AnalyticsEntry = {
  path: string;
  views: number;
  lastVisit: string;
};

export type AnalyticsSnapshot = {
  totalViews: number;
  uniquePaths: number;
  topPages: AnalyticsEntry[];
  recentDays: { date: string; views: number }[];
  startedAt: string;
  source: "live" | "fallback";
};

type Store = {
  startedAt: string;
  pages: Record<string, { views: number; lastVisit: string }>;
  daily: Record<string, number>;
};

async function readStore(): Promise<Store> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf-8");
    return JSON.parse(raw) as Store;
  } catch {
    return {
      startedAt: new Date().toISOString(),
      pages: {},
      daily: {},
    };
  }
}

async function writeStore(store: Store) {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf-8");
}

export async function trackVisit(pagePath: string) {
  const store = await readStore();
  const clean = pagePath.split("?")[0] || "/";
  const today = new Date().toISOString().slice(0, 10);
  const entry = store.pages[clean] || { views: 0, lastVisit: new Date().toISOString() };
  entry.views += 1;
  entry.lastVisit = new Date().toISOString();
  store.pages[clean] = entry;
  store.daily[today] = (store.daily[today] || 0) + 1;
  await writeStore(store);
  return entry;
}

export async function getAnalytics(): Promise<AnalyticsSnapshot> {
  const store = await readStore();
  const pages = Object.entries(store.pages).map(([p, v]) => ({
    path: p,
    views: v.views,
    lastVisit: v.lastVisit,
  }));
  const totalViews = pages.reduce((s, p) => s + p.views, 0);
  const topPages = [...pages].sort((a, b) => b.views - a.views).slice(0, 6);

  const days: { date: string; views: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({ date: key, views: store.daily[key] || 0 });
  }

  return {
    totalViews,
    uniquePaths: pages.length,
    topPages,
    recentDays: days,
    startedAt: store.startedAt,
    source: totalViews > 0 ? "live" : "fallback",
  };
}
