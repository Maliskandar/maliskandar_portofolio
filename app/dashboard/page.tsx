import Link from "next/link";
import { FiArrowLeft, FiGithub } from "react-icons/fi";
import { getGitHubStats } from "@/lib/github";
import { getWakaStats } from "@/lib/wakatime";
import GitHubPanel from "@/components/dashboard/GitHubPanel";
import WakaTimePanel from "@/components/dashboard/WakaTimePanel";

export const revalidate = 1800;

export const metadata = {
  title: "Live Dashboard",
  description:
    "Real‑time dashboard GitHub activity and coding time tracked via WakaTime.",
  openGraph: {
    title: "Live Dashboard Muhammad Akmal Iskandar",
    description:
      "Real‑time dashboard GitHub activity and coding time tracked via WakaTime.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Live Dashboard Muhammad Akmal Iskandar",
    description:
      "Real‑time dashboard GitHub activity and coding time tracked via WakaTime.",
  },
};

export default async function DashboardPage() {
  const [github, waka] = await Promise.all([
    getGitHubStats(),
    getWakaStats(),
  ]);

  const updatedTime = new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const topLang = waka.languages[0]?.name;
  const totalHours = Math.round(waka.totalSeconds / 3600);

  return (
    <main className="min-h-screen bg-dark text-white font-sans selection:bg-primary/30 selection:text-white">
      {/* Top nav — slim, no flashy badges */}
      <div className="w-full bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group text-sm"
          >
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            <span>Home</span>
          </Link>
          <div className="hidden md:block text-[11px] text-gray-600 font-mono tabular-nums">
            updated {updatedTime}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 space-y-24">
        {/* Editorial header */}
        <header className="relative">
          <div className="pointer-events-none absolute -top-20 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[140px]" />
          <div className="relative">
            <div className="text-xs text-gray-500 mb-6 tracking-wide">
              <span className="text-primary font-mono">●</span> 2 sources · refreshed hourly
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.95] mb-8">
              Numbers behind <br className="hidden md:block" />
              the work.
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl leading-relaxed">
              I figured if I&apos;m going to claim &quot;full stack&quot; on the homepage, I might as well
              show the receipts. {totalHours > 0 && topLang ? (
                <>This week I logged{" "}
                  <span className="text-white font-medium">{totalHours} hrs</span> at the editor,
                  mostly in <span className="text-white font-medium">{topLang}</span>.</>
              ) : (
                <>Pulled live from GitHub and WakaTime no smoke, no mirrors.</>
              )}
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href={`https://github.com/${github.profile.login}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black text-sm font-semibold hover:bg-gray-200 transition-colors"
              >
                <FiGithub /> @{github.profile.login}
              </a>
              <a
                href="#coding-time"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-transparent text-gray-400 text-sm hover:bg-white/5 hover:text-white transition-colors"
              >
                ↓ Skip to coding time
              </a>
            </div>
          </div>
        </header>

        <div id="github"><GitHubPanel data={github} /></div>
        <div id="coding-time"><WakaTimePanel data={waka} /></div>

        <footer className="pt-10 border-t border-white/5 text-xs text-gray-600 font-mono flex flex-wrap items-center justify-between gap-2">
          <span>github · wakatime</span>
          <span>{updatedTime} · cached 1h</span>
        </footer>
      </div>
    </main>
  );
}
