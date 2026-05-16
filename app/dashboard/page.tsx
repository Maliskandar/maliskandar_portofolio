import Link from "next/link";
import { FiArrowLeft, FiGithub } from "react-icons/fi";
import { getGitHubStats } from "@/lib/github";
import { getWakaStats } from "@/lib/wakatime";
import { getAnalytics } from "@/lib/analytics";
import GitHubPanel from "@/components/dashboard/GitHubPanel";
import WakaTimePanel from "@/components/dashboard/WakaTimePanel";
import AnalyticsPanel from "@/components/dashboard/AnalyticsPanel";
import PageTracker from "@/components/dashboard/PageTracker";

export const revalidate = 1800;

export const metadata = {
  title: "Dashboard | Muhammad Akmal Iskandar",
  description: "Live analytics dashboard — GitHub activity, coding time, and website stats.",
};

export default async function DashboardPage() {
  const [github, waka, analytics] = await Promise.all([
    getGitHubStats(),
    getWakaStats(),
    getAnalytics(),
  ]);

  const updated = new Date().toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <main className="min-h-screen bg-dark text-white font-sans selection:bg-primary/30 selection:text-white">
      <PageTracker />

      {/* Sticky top nav */}
      <div className="w-full bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>
          <div className="hidden md:flex items-center gap-2 text-[11px] text-gray-500 font-mono">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            LIVE · updated {updated}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20 space-y-20">
        {/* Header */}
        <header className="relative">
          <div className="pointer-events-none absolute -top-10 left-0 w-72 h-72 bg-primary/10 rounded-full blur-[120px]" />
          <div className="pointer-events-none absolute top-20 right-0 w-72 h-72 bg-violet-500/10 rounded-full blur-[120px]" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-[2px] bg-primary rounded-full" />
              <span className="font-mono text-primary text-sm tracking-widest uppercase">/dashboard</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.05] mb-6">
              Live <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">Analytics</span>.
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl leading-relaxed">
              A real-time look at my coding activity, open-source contributions, and how this portfolio is performing.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={`https://github.com/${github.profile.login}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black text-sm font-semibold hover:bg-gray-200 transition-colors"
              >
                <FiGithub /> github.com/{github.profile.login}
              </a>
              <a
                href="#coding-time"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm hover:bg-white/10 transition-colors"
              >
                Jump to coding time ↓
              </a>
            </div>
          </div>
        </header>

        <div id="github"><GitHubPanel data={github} /></div>
        <div id="coding-time"><WakaTimePanel data={waka} /></div>
        <div id="site-analytics"><AnalyticsPanel data={analytics} /></div>

        <footer className="pt-10 border-t border-white/5 text-center text-xs text-gray-500 font-mono">
          GitHub data revalidates every 1h · WakaTime every 30m · Pageviews tracked on this site.
        </footer>
      </div>
    </main>
  );
}
